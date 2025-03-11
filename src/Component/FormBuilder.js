import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Divider, 
  FormControlLabel, 
  Switch, 
  IconButton, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Tooltip, 
  Card, 
  CardContent, 
  Grid, 
  Chip
} from '@mui/material';
import { 
  DragDropContext, 
  Droppable, 
  Draggable 
} from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DateRangeIcon from '@mui/icons-material/DateRange';
import NumbersIcon from '@mui/icons-material/Numbers';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import DownloadIcon from '@mui/icons-material/Download';

const FormBuilder = () => {
  const [sections, setSections] = useState([
    {
      id: 'section-1',
      title: 'Cover Details',
      canAddMultiple: false,
      fields: [
        { 
          id: 'field-1',
          name: 'plan_type', 
          label: 'Plan Type', 
          required: true,
          type: 'text'
        },
        { 
          id: 'field-2',
          name: 'itenary', 
          label: 'Itenary', 
          required: false,
          type: 'text'
        },
        { 
          id: 'field-3',
          name: 'commision_percentage', 
          label: 'Commission Percentage', 
          required: false,
          type: 'number'
        },
        { 
          id: 'field-4',
          name: 'premium_due', 
          label: 'Premium Due', 
          required: false,
          type: 'number'
        }
      ]
    }
  ]);
  
  const [activeSectionId, setActiveSectionId] = useState('section-1');
  const [showJson, setShowJson] = useState(false);
  const nextFieldId = useRef(5); // Start from 5 since we already have 4 fields
  const nextSectionId = useRef(2); // Start from 2 since we already have 1 section
  
  // Find the active section for editing
  const activeSection = sections.find(section => section.id === activeSectionId);
  
  // Handle drag and drop operations
  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    
    // Dropped outside the list
    if (!destination) {
      return;
    }
    
    // Reordering sections
    if (type === 'section') {
      const newSections = [...sections];
      const [removed] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, removed);
      setSections(newSections);
      return;
    }
    
    // Reordering fields within a section
    if (type === 'field') {
      // Create updated sections array
      const newSections = sections.map(section => {
        if (section.id === activeSectionId) {
          const newFields = [...section.fields];
          const [removed] = newFields.splice(source.index, 1);
          newFields.splice(destination.index, 0, removed);
          return { ...section, fields: newFields };
        }
        return section;
      });
      
      setSections(newSections);
    }
  };
  
  // Add a new section
  const addSection = () => {
    const newSection = {
      id: `section-${nextSectionId.current}`,
      title: `New Section ${nextSectionId.current}`,
      canAddMultiple: false,
      fields: []
    };
    
    nextSectionId.current += 1;
    setSections([...sections, newSection]);
    setActiveSectionId(newSection.id);
  };
  
  // Delete a section
  const deleteSection = (sectionId) => {
    const newSections = sections.filter(section => section.id !== sectionId);
    setSections(newSections);
    
    // If we deleted the active section, select the first remaining section
    if (activeSectionId === sectionId && newSections.length > 0) {
      setActiveSectionId(newSections[0].id);
    } else if (newSections.length === 0) {
      // If no sections left, reset active section
      setActiveSectionId('');
    }
  };
  
  // Update a section's properties
  const updateSection = (sectionId, property, value) => {
    const newSections = sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, [property]: value };
      }
      return section;
    });
    setSections(newSections);
  };
  
  // Add a new field to the active section
  const addField = (type) => {
    if (!activeSectionId) return;
    
    const newField = {
      id: `field-${nextFieldId.current}`,
      name: `field_${nextFieldId.current}`,
      label: `Field ${nextFieldId.current}`,
      required: false,
      type: type
    };
    
    // Add options array if it's a dropdown type
    if (type === 'dropdown') {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }
    
    nextFieldId.current += 1;
    
    const newSections = sections.map(section => {
      if (section.id === activeSectionId) {
        return {
          ...section,
          fields: [...section.fields, newField]
        };
      }
      return section;
    });
    
    setSections(newSections);
  };
  
  // Delete a field from the active section
  const deleteField = (fieldId) => {
    const newSections = sections.map(section => {
      if (section.id === activeSectionId) {
        return {
          ...section,
          fields: section.fields.filter(field => field.id !== fieldId)
        };
      }
      return section;
    });
    
    setSections(newSections);
  };
  
  // Update a field's properties
  const updateField = (fieldId, property, value) => {
    const newSections = sections.map(section => {
      if (section.id === activeSectionId) {
        return {
          ...section,
          fields: section.fields.map(field => {
            if (field.id === fieldId) {
              if (property === 'options') {
                // Handle dropdown options as an array
                return { ...field, [property]: value.split(',').map(opt => opt.trim()) };
              }
              return { ...field, [property]: value };
            }
            return field;
          })
        };
      }
      return section;
    });
    
    setSections(newSections);
  };
  
  // Generate the JSON output
  const generateJson = () => {
    const formData = {};
    
    sections.forEach(section => {
      formData[section.title] = {
        canAddMultiple: section.canAddMultiple,
        fields: section.fields.map(field => {
          // Create a clean field object without the id
          const cleanField = {
            name: field.name,
            label: field.label,
            required: field.required,
          };
          
          // Only add type if it's not the default 'text'
          if (field.type !== 'text') {
            cleanField.type = field.type;
          }
          
          // Add options for dropdown
          if (field.type === 'dropdown' && field.options) {
            cleanField.options = field.options;
          }
          
          return cleanField;
        })
      };
    });
    
    return JSON.stringify(formData, null, 2);
  };

  // Download JSON
  const downloadJson = () => {
    const json = generateJson();
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = 'form-definition.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Copy JSON to clipboard
  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(generateJson());
    alert('JSON copied to clipboard');
  };
  
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      {/* Left sidebar - Field types */}
      <Box sx={{ 
        width: 250, 
        backgroundColor: '#f5f5f5', 
        borderRight: '1px solid #ddd',
        height: '100%',
        overflow: 'auto',
        p: 2
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Form Elements</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<TextFieldsIcon />}
            onClick={() => addField('text')}
            fullWidth
          >
            Text Field
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<NumbersIcon />}
            onClick={() => addField('number')}
            fullWidth
          >
            Number
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DateRangeIcon />}
            onClick={() => addField('date')}
            fullWidth
          >
            Date
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<CheckBoxIcon />}
            onClick={() => addField('checkbox')}
            fullWidth
          >
            Checkbox
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ArrowDropDownIcon />}
            onClick={() => addField('dropdown')}
            fullWidth
          >
            Dropdown
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" sx={{ mb: 2 }}>Sections</Typography>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections" type="section">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ mb: 2 }}
              >
                {sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ 
                          p: 1, 
                          mb: 1, 
                          display: 'flex', 
                          alignItems: 'center',
                          backgroundColor: activeSectionId === section.id ? '#e3f2fd' : 'white'
                        }}
                      >
                        <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                          <DragIndicatorIcon />
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            cursor: 'pointer',
                            flexGrow: 1,
                            fontWeight: activeSectionId === section.id ? 'bold' : 'normal'
                          }}
                          onClick={() => setActiveSectionId(section.id)}
                        >
                          {section.title}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => deleteSection(section.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={addSection}
          fullWidth
        >
          Add Section
        </Button>
        
        <Divider sx={{ my: 2 }} />
        
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CodeIcon />}
          onClick={() => setShowJson(!showJson)}
          fullWidth
          sx={{ mb: 1 }}
        >
          {showJson ? 'Hide JSON' : 'Show JSON'}
        </Button>
        
        <Button
          variant="contained"
          color="success"
          startIcon={<ContentCopyIcon />}
          onClick={copyJsonToClipboard}
          fullWidth
          sx={{ mb: 1 }}
        >
          Copy JSON
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={downloadJson}
          fullWidth
        >
          Download JSON
        </Button>
      </Box>
      
      {/* Center - Form builder */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        backgroundColor: '#fafafa',
        height: '100%',
        overflow: 'auto'
      }}>
        {activeSectionId ? (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5">Configure Section</Typography>
              <Paper sx={{ p: 2, mt: 2 }}>
                <TextField
                  label="Section Title"
                  fullWidth
                  value={activeSection.title}
                  onChange={(e) => updateSection(activeSectionId, 'title', e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={activeSection.canAddMultiple}
                      onChange={(e) => updateSection(activeSectionId, 'canAddMultiple', e.target.checked)}
                    />
                  }
                  label="Allow Multiple Entries"
                />
              </Paper>
            </Box>
            
            <Typography variant="h5" sx={{ mb: 2 }}>Fields</Typography>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="fields" type="field">
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {activeSection.fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{ p: 2, mb: 2 }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                                <DragIndicatorIcon />
                              </Box>
                              
                              {/* Field type indicator */}
                              <Tooltip title={field.type}>
                                <Box sx={{ mr: 1 }}>
                                  {field.type === 'text' && <TextFieldsIcon />}
                                  {field.type === 'number' && <NumbersIcon />}
                                  {field.type === 'date' && <DateRangeIcon />}
                                  {field.type === 'checkbox' && <CheckBoxIcon />}
                                  {field.type === 'dropdown' && <ArrowDropDownIcon />}
                                </Box>
                              </Tooltip>
                              
                              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                {field.label}
                              </Typography>
                              
                              <IconButton 
                                size="small" 
                                onClick={() => deleteField(field.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                            
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label="Field Name"
                                  fullWidth
                                  size="small"
                                  value={field.name}
                                  onChange={(e) => updateField(field.id, 'name', e.target.value)}
                                  helperText="Used as key in JSON (no spaces)"
                                />
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  label="Display Label"
                                  fullWidth
                                  size="small"
                                  value={field.label}
                                  onChange={(e) => updateField(field.id, 'label', e.target.value)}
                                  helperText="Shown to users in the form"
                                />
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                  <InputLabel>Field Type</InputLabel>
                                  <Select
                                    value={field.type}
                                    onChange={(e) => updateField(field.id, 'type', e.target.value)}
                                    label="Field Type"
                                  >
                                    <MenuItem value="text">Text</MenuItem>
                                    <MenuItem value="number">Number</MenuItem>
                                    <MenuItem value="date">Date</MenuItem>
                                    <MenuItem value="checkbox">Checkbox</MenuItem>
                                    <MenuItem value="dropdown">Dropdown</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={field.required}
                                      onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                                    />
                                  }
                                  label="Required field"
                                />
                              </Grid>
                              
                              {field.type === 'dropdown' && (
                                <Grid item xs={12}>
                                  <TextField
                                    label="Dropdown Options"
                                    fullWidth
                                    size="small"
                                    value={field.options ? field.options.join(', ') : ''}
                                    onChange={(e) => updateField(field.id, 'options', e.target.value)}
                                    helperText="Comma-separated list of options"
                                  />
                                </Grid>
                              )}
                            </Grid>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
            
            {activeSection.fields.length === 0 && (
              <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0f0f0' }}>
                <Typography variant="body1" color="textSecondary">
                  Drag form elements from the left panel to add them here
                </Typography>
              </Paper>
            )}
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6" color="textSecondary">
              Select a section or create a new one
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* JSON preview panel (show when toggle is on) */}
      {showJson && (
        <Box sx={{ 
          width: 400, 
          borderLeft: '1px solid #ddd', 
          p: 2,
          height: '100%',
          overflow: 'auto',
          backgroundColor: '#263238',
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#e0e0e0' }}>JSON Output</Typography>
          <pre style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
            {generateJson()}
          </pre>
        </Box>
      )}
    </Box>
  );
};

export default FormBuilder;
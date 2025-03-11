import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  useMediaQuery,
  useTheme,
  ListItemIcon,
  Tooltip,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuIcon from "@mui/icons-material/Menu";
import PolicyIcon from "@mui/icons-material/Policy";
import PersonIcon from "@mui/icons-material/Person";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import SecurityIcon from "@mui/icons-material/Security";
import DescriptionIcon from "@mui/icons-material/Description";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Divider from "@mui/material/Divider";

// Map of section names to their icons
const sectionIcons = {
  Policy: <PolicyIcon />,
  "Policy Header": <PersonIcon />,
  "PDPA Consent": <PrivacyTipIcon />,
  "Insured Details": <SecurityIcon />,
  "Cover Details": <DescriptionIcon />,
};

const SidebarForm = ({ formFields }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const sections = Object.keys(formFields);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [completedSections, setCompletedSections] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [isMinimized, setIsMinimized] = useState(false);

  // State to track multiple entries for each section
  const [multipleEntries, setMultipleEntries] = useState({});
  const [activeEntryIndices, setActiveEntryIndices] = useState({});

  // Initialize multiple entries state for sections that can have multiple entries
  React.useEffect(() => {
    const initialMultipleEntries = {};
    const initialActiveIndices = {};

    sections.forEach((section) => {
      if (formFields[section].canAddMultiple) {
        initialMultipleEntries[section] = [{ id: 0, data: {} }];
        initialActiveIndices[section] = 0;
      }
    });

    setMultipleEntries(initialMultipleEntries);
    setActiveEntryIndices(initialActiveIndices);
  }, []);

  const selectedSection = sections[activeStep];
  const canAddMultiple = formFields[selectedSection]?.canAddMultiple || false;
  const currentEntries = multipleEntries[selectedSection] || [
    { id: 0, data: {} },
  ];
  const activeEntryIndex = activeEntryIndices[selectedSection] || 0;

  const handleInputChange = (event, entryIndex = null) => {
    console.log(event);
    const { name, value, type, checked } = event.target;
    const inputValue = type === "checkbox" ? checked : value;

    // If the section can have multiple entries and an index is provided
    if (canAddMultiple && entryIndex !== null) {
      setMultipleEntries((prev) => {
        const newEntries = { ...prev };
        if (!newEntries[selectedSection]) {
          newEntries[selectedSection] = [{ id: 0, data: {} }];
        }

        const updatedSectionEntries = [...newEntries[selectedSection]];
        updatedSectionEntries[entryIndex] = {
          ...updatedSectionEntries[entryIndex],
          data: {
            ...updatedSectionEntries[entryIndex].data,
            [name]: inputValue, // Handles dropdown selections as well
          },
        };

        return { ...newEntries, [selectedSection]: updatedSectionEntries };
      });
    } else {
      // Normal form data handling for other sections
      setFormData((prev) => ({
        ...prev,
        [name]: inputValue, // Handles text inputs, checkboxes, and dropdown selections
      }));
    }
  };

  const handleNext = () => {
    setCompletedSections({
      ...completedSections,
      [activeStep]: true,
    });

    if (activeStep < sections.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSectionSelect = (index) => {
    setActiveStep(index);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const isStepComplete = (step) => {
    return Boolean(completedSections[step]);
  };

  const isFormSectionValid = () => {
    const section = selectedSection;
    const currentFields = formFields[section].fields;

    if (canAddMultiple) {
      // Make sure at least the first entry is filled out with required fields
      const requiredFieldNames = currentFields
        .filter((field) => field.required)
        .map((field) => field.name);

      return (
        currentEntries.length > 0 &&
        requiredFieldNames.every(
          (fieldName) =>
            currentEntries[activeEntryIndex]?.data[fieldName] !== undefined &&
            currentEntries[activeEntryIndex]?.data[fieldName] !== ""
        )
      );
    }

    // Regular validation for sections without multiple entries
    return currentFields.every((field) => {
      if (!field.required) return true;
      return formData[field.name] !== undefined && formData[field.name] !== "";
    });
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const addNewEntry = () => {
    setMultipleEntries((prev) => {
      const currentSectionEntries = prev[selectedSection] || [];
      const newId =
        currentSectionEntries.length > 0
          ? Math.max(...currentSectionEntries.map((item) => item.id)) + 1
          : 0;

      return {
        ...prev,
        [selectedSection]: [...currentSectionEntries, { id: newId, data: {} }],
      };
    });

    setActiveEntryIndices((prev) => ({
      ...prev,
      [selectedSection]: (multipleEntries[selectedSection] || []).length,
    }));
  };

  const removeEntry = (indexToRemove) => {
    if (
      !multipleEntries[selectedSection] ||
      multipleEntries[selectedSection].length <= 1
    ) {
      // Don't remove the last one, just clear it
      setMultipleEntries((prev) => ({
        ...prev,
        [selectedSection]: [{ id: 0, data: {} }],
      }));

      setActiveEntryIndices((prev) => ({
        ...prev,
        [selectedSection]: 0,
      }));

      return;
    }

    setMultipleEntries((prev) => {
      const newEntries = prev[selectedSection].filter(
        (_, index) => index !== indexToRemove
      );
      return { ...prev, [selectedSection]: newEntries };
    });

    // Adjust active index if needed
    setActiveEntryIndices((prev) => {
      const currentActiveIndex = prev[selectedSection];
      let newActiveIndex = currentActiveIndex;

      if (currentActiveIndex >= multipleEntries[selectedSection].length - 1) {
        newActiveIndex = multipleEntries[selectedSection].length - 2; // Length will be one less after removal
      } else if (currentActiveIndex === indexToRemove) {
        newActiveIndex = Math.max(0, currentActiveIndex - 1);
      }

      return { ...prev, [selectedSection]: newActiveIndex };
    });
  };

  const selectEntry = (index) => {
    setActiveEntryIndices((prev) => ({
      ...prev,
      [selectedSection]: index,
    }));
  };

  // Calculate the number of columns based on screen size and number of fields
  const getGridColumns = () => {
    const fieldsCount = formFields[selectedSection].fields.length;
    if (isSmallScreen) return 1;
    if (fieldsCount > 10) return 3;
    return 2;
  };

  // Dynamic drawer width based on state
  const drawerWidth = isMinimized ? 60 : isMobile ? 200 : 220;

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar - Minimizable */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#1a237e",
            color: "white",
            borderRight: "none",
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Box
          sx={{
            py: 1,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#0d1442",
            color: "white",
            height: 48,
          }}
        >
          {!isMinimized && (
            <Typography variant="subtitle1">Insurance Policy</Typography>
          )}
          {!isMobile && (
            <IconButton
              color="inherit"
              onClick={toggleMinimize}
              size="small"
              sx={{ ml: isMinimized ? "auto" : 0 }}
            >
              {isMinimized ? (
                <ArrowForwardIosIcon fontSize="small" />
              ) : (
                <ArrowBackIosIcon fontSize="small" />
              )}
            </IconButton>
          )}
        </Box>
        <List dense>
          {sections.map((section, index) => (
            <Tooltip
              title={isMinimized ? section : ""}
              placement="right"
              arrow
              key={section}
            >
              <ListItem
                button
                onClick={() => handleSectionSelect(index)}
                selected={activeStep === index}
                sx={{
                  py: 1,
                  color: "white",
                  backgroundColor:
                    activeStep === index
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                  borderLeft:
                    activeStep === index
                      ? "3px solid #4fc3f7"
                      : "3px solid transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                  justifyContent: isMinimized ? "center" : "flex-start",
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: isMinimized ? 0 : 40, color: "white" }}
                >
                  {sectionIcons[section]}
                </ListItemIcon>

                {!isMinimized && (
                  <ListItemText
                    primary={section}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontSize: "0.85rem",
                      noWrap: true,
                    }}
                  />
                )}

                {!isMinimized && isStepComplete(index) && (
                  <CheckCircleIcon
                    sx={{ color: "#4fc3f7", ml: 1 }}
                    fontSize="small"
                  />
                )}
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Top Bar - Reduced height */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: "#283593",
            height: 48,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar variant="dense" sx={{ minHeight: 48 }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleDrawer}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              Policy Issuance - {selectedSection}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Stepper - Reduced padding */}
        <Box sx={{ py: 1, px: 2, backgroundColor: "#fff" }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel={!isSmallScreen}
            sx={{
              "& .MuiStepLabel-label": {
                fontSize: "0.8rem",
              },
            }}
          >
            {sections.map((label, index) => (
              <Step key={label} completed={isStepComplete(index)}>
                <StepLabel>
                  {isSmallScreen ? (index === activeStep ? label : "") : label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Form Container */}
        <Box
          sx={{
            p: { xs: 1, sm: 2 },
            flexGrow: 1,
            backgroundColor: "#f5f5f5",
            overflow: "auto",
            height: "calc(100vh - 96px)", // Adjusted for smaller header and stepper
          }}
        >
          <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" color="primary">
                {selectedSection}
              </Typography>

              {/* Add button only if section can have multiple entries */}
              {canAddMultiple && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={addNewEntry}
                  size="small"
                >
                  Add {selectedSection}
                </Button>
              )}
            </Box>

            {/* Tabs for multiple entries if applicable */}
            {canAddMultiple && currentEntries.length > 0 && (
              <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {currentEntries.map((entry, index) => (
                  <Box
                    key={entry.id}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Button
                      variant={
                        activeEntryIndex === index ? "contained" : "outlined"
                      }
                      color="primary"
                      size="small"
                      onClick={() => selectEntry(index)}
                      sx={{ borderRadius: "4px 0 0 4px" }}
                    >
                      {selectedSection} {index + 1}
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeEntry(index)}
                      sx={{
                        borderRadius: "0 4px 4px 0",
                        border: "1px solid",
                        borderColor:
                          activeEntryIndex === index
                            ? "primary.main"
                            : "rgba(0, 0, 0, 0.23)",
                        borderLeft: "none",
                        height: "31px",
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
                gap: 2,
              }}
            >
              {canAddMultiple
                ? // Render form fields for sections with multiple entries
                  formFields[selectedSection].fields.map((field) =>
                    field.type === "dropdown" ? (
                      <Select
                        key={field.name}
                        fullWidth
                        size="small"
                        margin="dense"
                        displayEmpty
                        value={
                          currentEntries[activeEntryIndex]?.data[field.name] ||
                          ""
                        }
                        onChange={(e) => handleInputChange(e, activeEntryIndex)}
                      >
                        <MenuItem value="" disabled>
                          {field.label}
                        </MenuItem>
                        {field.options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : field.type === "checkbox" ? (
                      <FormControlLabel
                        key={field.name}
                        control={
                          <Checkbox
                            checked={
                              currentEntries[activeEntryIndex]?.data[
                                field.name
                              ] || false
                            }
                            onChange={(e) =>
                              handleInputChange(e, activeEntryIndex)
                            }
                            name={field.name}
                          />
                        }
                        label={field.label}
                      />
                    ) : (
                      <TextField
                        key={field.name}
                        fullWidth
                        size="small"
                        margin="dense"
                        label={field.label}
                        name={field.name}
                        required={field.required}
                        onChange={(e) => handleInputChange(e, activeEntryIndex)}
                        type={field.type || "text"}
                        value={
                          currentEntries[activeEntryIndex]?.data[field.name] ||
                          ""
                        }
                        InputLabelProps={
                          field.type === "date" ? { shrink: true } : undefined
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: "#283593",
                            },
                          },
                        }}
                      />
                    )
                  )
                : // Render regular form fields for sections without multiple entries
                  formFields[selectedSection].fields.map((field) =>
                    field.type === "dropdown" ? (
                      <Select
                        key={field.name}
                        fullWidth
                        size="small"
                        margin="dense"
                        displayEmpty
                        value={formData[field.name] || ""}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="" disabled>
                          {field.label}
                        </MenuItem>
                        {field.options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : field.type === "checkbox" ? (
                      <FormControlLabel
                        key={field.name}
                        control={
                          <Checkbox
                            checked={formData[field.name] || false}
                            onChange={handleInputChange}
                            name={field.name}
                          />
                        }
                        label={field.label}
                      />
                    ) : (
                      <TextField
                        key={field.name}
                        fullWidth
                        size="small"
                        margin="dense"
                        label={field.label}
                        name={field.name}
                        required={field.required}
                        onChange={handleInputChange}
                        type={field.type || "text"}
                        value={formData[field.name] || ""}
                        InputLabelProps={
                          field.type === "date" ? { shrink: true } : undefined
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: "#283593",
                            },
                          },
                        }}
                      />
                    )
                  )}
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
                disabled={activeStep === 0}
                size="small"
              >
                Back
              </Button>

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  sx={{ mr: 1 }}
                  size="small"
                >
                  Save
                </Button>

                {activeStep === sections.length - 1 ? (
                  <Button
                    variant="contained"
                    color="success"
                    disabled={!isFormSectionValid()}
                    size="small"
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    endIcon={<ChevronRightIcon />}
                    disabled={!isFormSectionValid()}
                    size="small"
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarForm;

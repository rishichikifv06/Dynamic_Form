import logo from "./logo.svg";
import "./App.css";
import DynamicForm from "./Component/DynamicForm";
// Modified formFields to include canAddMultiple property for each section

const formFields = {
  Policy: {
    canAddMultiple: false,
    fields: [
      { name: "policy_number", label: "Policy Number", required: true,index:1 },
      { name: "product_code", label: "Policy Type", required: true },
      {
        name: "business_source_code",
        label: "Business Source",
        required: true,
        API:"https://us-east1.cloudfunctions.net/BelongsTemplate"
      },
      {
        name: "commencement_date",
        label: "Commencement Date",
        required: true,
        type: "date",
      },
      {
        name: "expiry_date",
        label: "Expiry Date",
        required: true,
        type: "date",
      },
      
      { name: "agent_code", label: "Agent Code", required: false },
      { name: "acceptance_code", label: "Acceptance Code", required: false },
      { name: "acceptance_time", label: "Acceptance Time", required: false },
      {
        name: "payment_transaction_reference",
        label: "Payment Transaction Reference",
        required: false,
      },
      { name: "memo_text", label: "Memo Text", required: false },
      { name: "clauses", label: "Clauses", required: false },
      {
        name: "account_handler_reference",
        label: "Account Handler Reference",
        required: false,
      },
      {
        name: "membership_reference",
        label: "Membership Reference",
        required: false,
      },
    ],
  },
  "Policy Header": {
    canAddMultiple: false,
    fields: [
      { name: "reference_number", label: "Insured Reference", required: true },
      { name: "title", label: "Title", required: false },
      { name: "first_name", label: "First Name", required: true },
      { name: "name1", label: "Name 1", required: false },
      { name: "name2", label: "Name 2", required: false },
      { name: "name3", label: "Name 3", required: false },
      { name: "gender", label: "Gender", required: false },
      { name: "address1", label: "Address 1", required: false },
      { name: "address2", label: "Address 2", required: false },
      { name: "address3", label: "Address 3", required: false },
      { name: "country", label: "Country", required: true },
      { name: "postcode", label: "Postcode", required: false },
      {
        name: "date_of_birth",
        label: "Date of Birth",
        required: false,
        type: "date",
      },
      { name: "occupation", label: "Occupation", required: false },
      { name: "home_phone", label: "Home Phone", required: false },
      { name: "office_phone", label: "Office Phone", required: false },
      { name: "mobile_phone", label: "Mobile Phone", required: false },
      { name: "identity_number", label: "Identity Number", required: false },
      { name: "email", label: "Email", required: false },
    ],
  },
  "PDPA Consent": {
    canAddMultiple: false,
    fields: [
      {
        name: "submit_date",
        label: "Submit Date",
        required: false,
        type: "date",
      },
      { name: "submit_time", label: "Submit Time", required: false },
      {
        name: "consent_given",
        label: "Consent Given",
        required: true,
        type: "checkbox",
      },
      {
        name: "marketing_consent",
        label: "Marketing Consent",
        required: false,
        type: "checkbox",
      },
      {
        name: "do_not_call",
        label: "Do Not Call",
        required: false,
        type: "checkbox",
      },
      {
        name: "do_not_sms",
        label: "Do Not SMS",
        required: false,
        type: "checkbox",
      },
      { name: "comments", label: "Comments", required: false },
    ],
  },

  "Insured Details": {
    canAddMultiple: true,
    fields: [
      { name: "name", label: "Insured Name", required: true },
      { name: "id_type", label: "ID Type", required: true },
      { name: "id_number", label: "ID Number", required: true },
      {
        name: "date_of_birth",
        label: "Date of Birth",
        required: true,
        type: "date",
        API:"Countr API"
      },
      {
        name: "c_name",
        label: "c Name",
        required: false,
        type: "dropdown",
        options: ["Husband", "Wife", "Children", "Father", "Mother"],
        
      },
      {
        name: "c_dob",
        label: "c Date of Birth",
        required: false,
        type: "date"                 
      },
      { name: "no_of_children", label: "Number of Children", required: false },
    ],
  },
  "Cover Details": {
    canAddMultiple: false,
    fields: [
      { name: "plan_type", label: "Plan Type", required: true },
      { name: "region", label: "Region", required: true },
      {
        name: "sum_insured",
        label: "Sum Insured",
        required: true,
        type: "number",
      },
      { name: "premium", label: "Premium", required: true, type: "number" },
      {
        name: "plan_text_reference",
        label: "Plan Text Reference",
        required: false,
      },
      { name: "cover_type", label: "Cover Type", required: false },
      { name: "itenary", label: "Itenary", required: false },
      {
        name: "commision_percentage",
        label: "Commission Percentage",
        required: false,
        type: "number",
      },
      {
        name: "commision_amount",
        label: "Commission Amount",
        required: false,
        type: "number",
      },
      {
        name: "discount_percentage",
        label: "Discount Percentage",
        required: false,
        type: "number",
      },
      {
        name: "discount_amount",
        label: "Discount Amount",
        required: false,
        type: "number",
      },
      {
        name: "premium_due",
        label: "Premium Due",
        required: false,
        type: "number",
      },
    ],
  },
};

function App() {
  console.log(formFields);
  return (
    <div className="App">
      {formFields && <DynamicForm formFields={formFields} />}
    </div>
  );
}

export default App;

// English string bundle for the PDF spec sheet.
// Single language by design — keeps the PDF crisp & maintenance-light.

export interface Strings {
  title: string;
  subtitle: string;
  contact: string;
  phoneL: string;
  emailL: string;
  whatsappL: string;
  webL: string;
  disclaimer: string;
  generated: string;
  ref: string;
  category: string;
  brand: string;
  model: string;
  capacity: string;
  origin: string;
  year: string;
  fuel: string;
  fleet: string;
  operator: string;
  operatorVal: string;
  inspection: string;
  inspectionVal: string;
  assetId: string;
  unitSuffix: string;
  specsHeading: string;
  highlightsHeading: string;
  hAvailability: string;
  hAvailabilityV: string;
  hMobilisation: string;
  hMobilisationV: string;
  hCompliance: string;
  hComplianceV: string;
  realPhoto: string;
  realPhotoCaption: string;
}

export const STRINGS_EN: Strings = {
  title: "Equipment Specification Sheet",
  subtitle: "Heavy Equipment Rental · Bangladesh",
  contact: "Contact ATDB Trade International",
  phoneL: "Phone",
  emailL: "Email",
  whatsappL: "WhatsApp",
  webL: "Web",
  disclaimer:
    "Specifications are indicative and may vary by unit. Inspection-certified, operator included, mobilisation on request.",
  generated: "Generated",
  ref: "Ref",
  category: "Category",
  brand: "Brand",
  model: "Model",
  capacity: "Capacity",
  origin: "Country of Origin",
  year: "Year of Manufacture",
  fuel: "Fuel",
  fleet: "Units in Fleet",
  operator: "Operator",
  operatorVal: "Certified operator included",
  inspection: "Inspection",
  inspectionVal: "City Inspection Services CIS/077/2018",
  assetId: "Asset ID",
  unitSuffix: "unit(s)",
  specsHeading: "Specifications",
  highlightsHeading: "Service Highlights",
  hAvailability: "Availability",
  hAvailabilityV: "Ready for site mobilisation",
  hMobilisation: "Coverage",
  hMobilisationV: "Nationwide deployment, 24/7 support",
  hCompliance: "Compliance",
  hComplianceV: "CIS-inspected · operator certified",
  realPhoto: "Current Condition Photo",
  realPhotoCaption: "Actual photograph of the unit on hand.",
};

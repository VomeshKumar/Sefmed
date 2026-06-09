import type { FieldMetadata, ReportModule, SavedReport } from "../types";
export * from "./prepackagedReports";

export const MODULE_CATALOGS: Record<ReportModule, FieldMetadata[]> = {
  employees: [
    { fieldName: "name", label: "Name", dataType: "string" },
    { fieldName: "code", label: "Employee Code", dataType: "string" },
    { fieldName: "email", label: "Email", dataType: "string" },
    { fieldName: "phone", label: "Phone", dataType: "string" },
    { fieldName: "designationId", label: "Designation ID", dataType: "string" },
    {
      fieldName: "status",
      label: "Status",
      dataType: "select",
      selectOptions: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    { fieldName: "joiningDate", label: "Joining Date", dataType: "date" },
  ],
  doctors: [
    { fieldName: "name", label: "Doctor Name", dataType: "string" },
    { fieldName: "code", label: "MCI Code", dataType: "string" },
    { fieldName: "specialty", label: "Specialty", dataType: "string" },
    {
      fieldName: "class",
      label: "Classification",
      dataType: "select",
      selectOptions: [
        { label: "Class A", value: "A" },
        { label: "Class B", value: "B" },
        { label: "Class C", value: "C" },
      ],
    },
    { fieldName: "territoryId", label: "Territory ID", dataType: "string" },
  ],
  visits: [
    { fieldName: "visitDate", label: "Visit Date", dataType: "date" },
    {
      fieldName: "visitorType",
      label: "Visitor Type",
      dataType: "select",
      selectOptions: [
        { label: "Doctor", value: "doctor" },
        { label: "Firm", value: "firm" },
      ],
    },
    {
      fieldName: "status",
      label: "Workflow Status",
      dataType: "select",
      selectOptions: [
        { label: "Planned", value: "planned" },
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
        { label: "Pending Approval", value: "pending_approval" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
        { label: "Rescheduled", value: "rescheduled" },
        { label: "Skipped", value: "skipped" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      fieldName: "geoVerificationStatus",
      label: "Geo Verified",
      dataType: "select",
      selectOptions: [
        { label: "Verified", value: "Verified" },
        { label: "Unverified", value: "Unverified" },
        { label: "Outside Radius", value: "Outside Radius" },
      ],
    },
    { fieldName: "remarks", label: "Remarks/Notes", dataType: "string" },
  ],
  leaves: [
    { fieldName: "startDate", label: "Start Date", dataType: "date" },
    { fieldName: "endDate", label: "End Date", dataType: "date" },
    { fieldName: "leaveTypeId", label: "Leave Type ID", dataType: "string" },
    {
      fieldName: "status",
      label: "Status",
      dataType: "select",
      selectOptions: [
        { label: "Draft", value: "draft" },
        { label: "Pending Approval", value: "pending_approval" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    { fieldName: "totalDays", label: "Total Days", dataType: "number" },
  ],
  expenses: [
    { fieldName: "expenseCode", label: "Expense Code", dataType: "string" },
    { fieldName: "month", label: "Claim Month (YYYY-MM)", dataType: "string" },
    {
      fieldName: "status",
      label: "Claim Status",
      dataType: "select",
      selectOptions: [
        { label: "Draft", value: "draft" },
        { label: "Submitted", value: "submitted" },
        { label: "Approved", value: "approved" },
        { label: "Partially Approved", value: "partially_approved" },
        { label: "Returned", value: "returned" },
        { label: "Rejected", value: "rejected" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    { fieldName: "totalAmount", label: "Total Claimed Amount", dataType: "number" },
    { fieldName: "approvedAmount", label: "Approved Amount", dataType: "number" },
  ],
  orders: [
    { fieldName: "orderNumber", label: "Order Number", dataType: "string" },
    { fieldName: "orderDate", label: "Order Date", dataType: "date" },
    {
      fieldName: "status",
      label: "Order Status",
      dataType: "select",
      selectOptions: [
        { label: "Draft", value: "draft" },
        { label: "Submitted", value: "submitted" },
        { label: "Pending Approval", value: "pending_approval" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
        { label: "Dispatched", value: "dispatched" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    { fieldName: "netAmount", label: "Net Amount", dataType: "number" },
    { fieldName: "isCreditLimitExceeded", label: "Credit Limit Exceeded", dataType: "boolean" },
  ],
  targets: [
    { fieldName: "month", label: "Target Month (YYYY-MM)", dataType: "string" },
    { fieldName: "targetAmount", label: "Allocated Target", dataType: "number" },
    { fieldName: "achievedPrimaryAmount", label: "Primary Achieved", dataType: "number" },
    { fieldName: "achievedSecondaryAmount", label: "Secondary Achieved", dataType: "number" },
  ],
  stockists: [
    { fieldName: "name", label: "Stockist Name", dataType: "string" },
    { fieldName: "code", label: "Stockist Code", dataType: "string" },
    {
      fieldName: "type",
      label: "Classification Type",
      dataType: "select",
      selectOptions: [
        { label: "Super Stockist", value: "super_stockist" },
        { label: "Stockist", value: "stockist" },
        { label: "Sub Stockist", value: "sub_stockist" },
      ],
    },
    { fieldName: "creditLimit", label: "Credit Limit", dataType: "number" },
    { fieldName: "outstandingAmount", label: "Outstanding Balance", dataType: "number" },
  ],
  secondary_sales: [
    { fieldName: "month", label: "Reporting Month (YYYY-MM)", dataType: "string" },
    { fieldName: "statementDate", label: "Statement Date", dataType: "date" },
    { fieldName: "totalValue", label: "Total PTR Value", dataType: "number" },
    { fieldName: "hasReconciliationWarnings", label: "Has Discrepancy", dataType: "boolean" },
  ],
};

export const mockSavedReports: SavedReport[] = [
  {
    id: "rep-001",
    name: "Closed Visits Geo Summary",
    createdBy: "emp-004",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reportDefinition: {
      id: "def-001",
      name: "Closed Visits Geo Summary",
      description: "Lists all completed/closed visits with geolocation verification status.",
      module: "visits",
      columns: [
        { fieldName: "visitDate", label: "Visit Date", dataType: "date", isVisible: true, sequenceOrder: 0 },
        { fieldName: "visitorType", label: "Visitor Type", dataType: "select", isVisible: true, sequenceOrder: 1 },
        { fieldName: "status", label: "Workflow Status", dataType: "select", isVisible: true, sequenceOrder: 2 },
        { fieldName: "geoVerificationStatus", label: "Geo Verified", dataType: "select", isVisible: true, sequenceOrder: 3 },
        { fieldName: "remarks", label: "Remarks/Notes", dataType: "string", isVisible: true, sequenceOrder: 4 },
      ],
      filters: [
        { fieldName: "status", operator: "equals", value: "closed" },
      ],
      sorts: [
        { fieldName: "visitDate", direction: "desc" },
      ],
      sharingScope: "shared",
      createdByEmployeeId: "emp-004",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: "rep-002",
    name: "High Outstanding Stockists",
    createdBy: "emp-004",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reportDefinition: {
      id: "def-002",
      name: "High Outstanding Stockists",
      description: "Identifies stockists with outstanding balance exceeding 2,00,000 INR.",
      module: "stockists",
      columns: [
        { fieldName: "name", label: "Stockist Name", dataType: "string", isVisible: true, sequenceOrder: 0 },
        { fieldName: "code", label: "Stockist Code", dataType: "string", isVisible: true, sequenceOrder: 1 },
        { fieldName: "type", label: "Classification Type", dataType: "select", isVisible: true, sequenceOrder: 2 },
        { fieldName: "creditLimit", label: "Credit Limit", dataType: "number", isVisible: true, sequenceOrder: 3 },
        { fieldName: "outstandingAmount", label: "Outstanding Balance", dataType: "number", isVisible: true, sequenceOrder: 4 },
      ],
      filters: [
        { fieldName: "outstandingAmount", operator: "gt", value: "200000" },
      ],
      sorts: [
        { fieldName: "outstandingAmount", direction: "desc" },
      ],
      sharingScope: "private",
      createdByEmployeeId: "emp-004",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
];

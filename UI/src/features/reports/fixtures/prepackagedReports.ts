import type { ReportModule, ReportFilter } from "../types";

export interface PrepackagedReport {
  id: string;
  title: string;
  description: string;
  module: ReportModule;
  filters?: ReportFilter[];
}

export interface PrepackagedCategory {
  title: string;
  key: string;
  reports: PrepackagedReport[];
}

export const PREPACKAGED_REPORTS: PrepackagedCategory[] = [
  {
    title: "Work Reports",
    key: "work",
    reports: [
      {
        id: "work-01",
        title: "Call Report",
        description: "Report showing doctor's closed, skipped and open calls by a particular employee during a period.",
        module: "visits",
      },
      {
        id: "work-02",
        title: "Hospital Call Report",
        description: "Report showing OT and purchase with POB call completed by particular employee during a period.",
        module: "visits",
        filters: [{ fieldName: "remarks", operator: "contains", value: "hospital" }],
      },
      {
        id: "work-03",
        title: "POB Report",
        description: "Report gives the information of the product order booking against the doctor's.",
        module: "orders",
      },
      {
        id: "work-04",
        title: "Call Report With POB",
        description: "Report gives the information of the product order booking with closed, skipped and open calls by a particular employee during a period.",
        module: "visits",
      },
      {
        id: "work-05",
        title: "Objective Wise Call Report",
        description: "Report showing call average, total calls, leaves, working days on the basis of call objectives.",
        module: "visits",
      },
      {
        id: "work-06",
        title: "Daily Call Report",
        description: "Report showing doctor's closed, skipped and open calls by a particular employee during a period.",
        module: "visits",
      },
      {
        id: "work-07",
        title: "Doctor Coverage Report",
        description: "Report showing month wise history of calls done by particular employee for all or assigned doctor's.",
        module: "visits",
      },
      {
        id: "work-08",
        title: "Discrepancy Report",
        description: "Report showing discrepancy in check in & check out location from where call was completed.",
        module: "visits",
        filters: [{ fieldName: "geoVerificationStatus", operator: "equals", value: "Outside Radius" }],
      },
      {
        id: "work-09",
        title: "Visit Report",
        description: "This report is based on the closed calls. 2 reports will be generated, one for visits less than the particular number and one for visits greater than the particular number.",
        module: "visits",
        filters: [{ fieldName: "status", operator: "equals", value: "closed" }],
      },
      {
        id: "work-10",
        title: "Doctors Attended & Missed Report",
        description: "This report is based on the doctor's status. 2 reports will be generated, one for doctor's attended, one for doctor's missed.",
        module: "visits",
      },
      {
        id: "work-11",
        title: "Firm Visit Report",
        description: "Report showing firm's closed, skipped and open calls by a particular employee during a period.",
        module: "visits",
        filters: [{ fieldName: "visitorType", operator: "equals", value: "firm" }],
      },
      {
        id: "work-12",
        title: "DCR Report",
        description: "Report showing doctor & chemist visit details of employee during a period.",
        module: "visits",
      },
      {
        id: "work-13",
        title: "MCL Report",
        description: "Report showing compliance of representative (visits to employees) for all assigned doctors.",
        module: "visits",
      },
      {
        id: "work-14",
        title: "Sample Distribution Report",
        description: "A report showing sample distribution by employee to the doctors during a period.",
        module: "employees",
      },
      {
        id: "work-15",
        title: "Gift Distribution Report",
        description: "A report showing information of the number of gifts distributed by employee to the doctor during a period.",
        module: "employees",
      },
      {
        id: "work-16",
        title: "Consolidated Employee Wise Report",
        description: "Report showing of employee type report and with area mapping details.",
        module: "employees",
      },
      {
        id: "work-17",
        title: "Last Work Report",
        description: "Report showing last working details of employee during a period.",
        module: "employees",
      },
      {
        id: "work-18",
        title: "Activity Report",
        description: "A report showing the information of the employee, such as total working days, joint working value, retail orders & brand presentation.",
        module: "employees",
      },
      {
        id: "work-19",
        title: "Presentation Report",
        description: "A report showing the presentation history of e-detailing/presentation against doctors during a period.",
        module: "doctors",
      },
      {
        id: "work-20",
        title: "Payment Collection Report",
        description: "A report showing the information of how much amount given and collect against the doctors and firms.",
        module: "expenses",
      },
      {
        id: "work-21",
        title: "Sample Promoted Report",
        description: "Report showing details of samples promoted by employee.",
        module: "employees",
      },
      {
        id: "work-22",
        title: "Sales Trend Report",
        description: "A report showing the information about the product, and how much substitution is ordered against doctors during a period.",
        module: "orders",
      },
      {
        id: "work-23",
        title: "Date Wise Call Activity Report",
        description: "A report showing the working information of the employee during a specific period.",
        module: "visits",
      },
      {
        id: "work-24",
        title: "Call Average Report",
        description: "A report showing the information of the call average of the employee during a month.",
        module: "visits",
      },
      {
        id: "work-25",
        title: "ROI Report",
        description: "A report showing the information about the product, and how much substitution is ordered against doctors during a period.",
        module: "orders",
      },
      {
        id: "work-26",
        title: "Sample Distribution Report With Opening And Closing Quantity",
        description: "This report gives the details of sample distributed by employee to the doctor with Opening & Closing Quantity.",
        module: "employees",
      },
      {
        id: "work-27",
        title: "Doctor Wise ROI Report",
        description: "This report gives the information of product business details by employee against doctor.",
        module: "doctors",
      },
    ],
  },
  {
    title: "Productivity & Business Reports",
    key: "productivity",
    reports: [
      {
        id: "prod-01",
        title: "Monthly Cycle Summary Report",
        description: "This report gives the information of monthly cycle summary against the client.",
        module: "visits",
      },
      {
        id: "prod-02",
        title: "Employee Month & Productivity Report",
        description: "Report showing the working details of the employee in a month.",
        module: "employees",
      },
      {
        id: "prod-03",
        title: "Employee and Manager Monthly Coverage Report",
        description: "Report showing month wise visits of employee.",
        module: "visits",
      },
      {
        id: "prod-04",
        title: "Product Exposure Report",
        description: "Report showing product analysis.",
        module: "orders",
      },
      {
        id: "prod-05",
        title: "Key performance indicator Report",
        description: "Report showing customer visit frequency, brand exposure and customer coverage details.",
        module: "visits",
      },
      {
        id: "prod-06",
        title: "Target Report",
        description: "Report showing month and year wise target by employee.",
        module: "targets",
      },
      {
        id: "prod-07",
        title: "Stockist Monthly Report",
        description: "Report of opening stock daily of particular stockist.",
        module: "stockists",
      },
      {
        id: "prod-08",
        title: "RCPA Report",
        description: "Report of showing client product exposure.",
        module: "orders",
      },
      {
        id: "prod-09",
        title: "Firm Order Report",
        description: "Report showing of primary ordered chemist.",
        module: "orders",
      },
      {
        id: "prod-10",
        title: "Doctor Business Report",
        description: "Report showing of secondary ordered chemist.",
        module: "secondary_sales",
      },
      {
        id: "prod-11",
        title: "Doctor Business Planning/Achievement Report",
        description: "Report showing month wise target vs achievement comparison by manager.",
        module: "targets",
      },
      {
        id: "prod-12",
        title: "Chemist Business Achievement Report",
        description: "Report showing each question was answered correctly by how many employees.",
        module: "orders",
      },
      {
        id: "prod-13",
        title: "All India Daily Call Report",
        description: "Report showing all call records and details of employee on monthly basis.",
        module: "visits",
      },
      {
        id: "prod-14",
        title: "Category wise Monthly Cycle Report",
        description: "Report showing all call records and details of employee on month and category basis.",
        module: "visits",
      },
      {
        id: "prod-15",
        title: "Doctor Investment Report",
        description: "Report showing all call records and details investment, pob, business of doctors.",
        module: "doctors",
      },
      {
        id: "prod-16",
        title: "Product And Category Wise Sales Report",
        description: "Report of showing product wise records and details on monthly basis.",
        module: "orders",
      },
      {
        id: "prod-17",
        title: "Bifurcated Report",
        description: "Report of showing all call records and details of employee on monthly basis.",
        module: "visits",
      },
      {
        id: "prod-18",
        title: "Category Wise Call Average Report",
        description: "Report of showing product wise records and details on monthly basis.",
        module: "visits",
      },
      {
        id: "prod-19",
        title: "City Wise Secondary Sales Report",
        description: "Report of showing product wise records and details on monthly basis.",
        module: "secondary_sales",
      },
      {
        id: "prod-20",
        title: "Category Wise Call Activity Report",
        description: "Report of showing product wise records and details on monthly basis.",
        module: "visits",
      },
      {
        id: "prod-21",
        title: "Referral Report",
        description: "Report of showing call records and details on referral basis.",
        module: "visits",
      },
      {
        id: "prod-22",
        title: "Plan & Deviation Report",
        description: "Report showing tour plan records and details of selected month & year basis.",
        module: "visits",
      },
      {
        id: "prod-23",
        title: "Area Wise Sales Report",
        description: "Report of showing sales records and details on selected month & year basis.",
        module: "orders",
      },
      {
        id: "prod-24",
        title: "Hospital Sales Report",
        description: "This report gives the detail of sales on monthly basis.",
        module: "orders",
      },
      {
        id: "prod-25",
        title: "Party / Chemist Wise Sales Report",
        description: "This report gives the detail of party / chemist sales summary on a monthly basis.",
        module: "orders",
      },
      {
        id: "prod-26",
        title: "Consolidation Report (Month Wise)",
        description: "Report showing details of employee summary on a monthly basis.",
        module: "employees",
      },
      {
        id: "prod-27",
        title: "Sample Collection Report",
        description: "Report showing details of sample pick-up & drop by employee.",
        module: "employees",
      },
      {
        id: "prod-28",
        title: "Sponsor Report",
        description: "Report showing product list which has been prescribed by doctor with sponsor name on monthly basis.",
        module: "orders",
      },
      {
        id: "prod-29",
        title: "Doctor Investment And POB Report",
        description: "This report shows doctor wise investment and pob.",
        module: "doctors",
      },
    ],
  },
  {
    title: "Logs, Attendance & Quiz Reports",
    key: "attendance",
    reports: [
      {
        id: "logs-01",
        title: "Track Report",
        description: "Report showing point by point location of an employee during workhours, for a specific period.",
        module: "employees",
      },
      {
        id: "logs-02",
        title: "Last Sync Location Tracker",
        description: "Report showing live tracking detail of employees.",
        module: "employees",
      },
      {
        id: "logs-03",
        title: "Doctor Birthday Or Anniversary",
        description: "Report showing Doctor birthday and anniversary.",
        module: "doctors",
      },
      {
        id: "logs-04",
        title: "Doctor Address Not Found Report",
        description: "Report showing Doctor address not found.",
        module: "doctors",
      },
      {
        id: "logs-05",
        title: "Top 10 Visited Address",
        description: "Report showing Which doctors' address the employee has visited the most.",
        module: "visits",
      },
      {
        id: "logs-06",
        title: "Employee Daily Performance Report",
        description: "This report shows the daily attendance details and call details of employees for a selected date.",
        module: "employees",
      },
      {
        id: "logs-07",
        title: "Closed Visit Wise Attendance Report",
        description: "Report showing closed visit wise attendance of employee.",
        module: "visits",
        filters: [{ fieldName: "status", operator: "equals", value: "closed" }],
      },
      {
        id: "logs-08",
        title: "Month Wise Attendance Report",
        description: "Report showing month wise attendance of employee.",
        module: "employees",
      },
      {
        id: "logs-09",
        title: "Quiz Report",
        description: "Report showing performance of employee in quiz program.",
        module: "employees",
      },
      {
        id: "logs-10",
        title: "Question Report",
        description: "Report showing each question was answered correctly by how many employees.",
        module: "employees",
      },
      {
        id: "logs-11",
        title: "Daily Summary Report",
        description: "This agent gives the list of the daily summary reports of the client on monthly basis.",
        module: "employees",
      },
      {
        id: "logs-12",
        title: "Attendance and Leave Report",
        description: "A report showing the status of leaves of the employees and also showing the leaves details for a selected period.",
        module: "leaves",
      },
      {
        id: "logs-13",
        title: "Hospital Wise Referral Report",
        description: "Report showing call records and details on referral basis.",
        module: "visits",
      },
      {
        id: "logs-14",
        title: "Employee Attendance Report",
        description: "Report showing details of employee attendance data.",
        module: "employees",
      },
    ],
  },
  {
    title: "Expense, Leave & Tour Plan Reports",
    key: "expense_leave",
    reports: [
      {
        id: "exp-01",
        title: "Expense Report",
        description: "A report showing the information of the total and approved amount of the employee during a month.",
        module: "expenses",
      },
      {
        id: "exp-02",
        title: "Employee Expense Report",
        description: "A report showing the information about expense of employee of every month. (For e.g., DA + TA + Other).",
        module: "expenses",
      },
      {
        id: "exp-03",
        title: "Consolidated Expense Report(Overview)",
        description: "A report showing the information about the approved expense of the employee along with the working & leave information.",
        module: "expenses",
        filters: [{ fieldName: "status", operator: "equals", value: "approved" }],
      },
      {
        id: "exp-04",
        title: "Expense Credit/Submitted Reports",
        description: "A report showing expense of employees with status of approved, submitted & drafted.",
        module: "expenses",
      },
      {
        id: "exp-05",
        title: "Leave Report",
        description: "A report showing the leaves status of the particular employees during a specific period.",
        module: "leaves",
      },
      {
        id: "exp-06",
        title: "Deviation Report",
        description: "A report showing the information of the members of working days and number of days he/she has declared their tourplan.",
        module: "visits",
      },
      {
        id: "exp-07",
        title: "Tour Plan Status Report",
        description: "A report showing tour plan status (e.g. approved, submitted) of employee during month.",
        module: "visits",
      },
      {
        id: "exp-08",
        title: "Expense Statement/Monthly Tour Plan Report",
        description: "A report showing the information of the approved expense of the employee with designation & location type.",
        module: "expenses",
      },
      {
        id: "exp-09",
        title: "Designation Wise Expense Summary Report",
        description: "A report showing the information of the approved expense of the employee with designation & location type.",
        module: "expenses",
      },
      {
        id: "exp-10",
        title: "Month Wise Expense Report",
        description: "Report showing month wise approved expense of the employee.",
        module: "expenses",
      },
      {
        id: "exp-11",
        title: "Monthly Expense Summary Report",
        description: "Report showing the month wise approved expense of the employee.",
        module: "expenses",
      },
      {
        id: "exp-12",
        title: "Tourplan VS Actual Work Report",
        description: "Report showing tourplan and diameter wise visit and pob.",
        module: "visits",
      },
    ],
  },
];

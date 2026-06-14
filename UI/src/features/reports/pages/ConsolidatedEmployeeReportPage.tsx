import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Info, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ConsolidatedRecord {
  sNo: number;
  date: string;
  employeeName: string;
  employeeCode: string;
  state: string;
  headQuarter: string;
  designation: string;
  division: string;
  leave: string;
  dayPlanDate: string;
  dayPlanTime: string;
  dayPlanLatLong: string;
  workingWith: string;
  workingArea: string;
  workingAreaType: string;
  submitAreaLatLong: string;
  submitTime: string;
  firstCall: string;
  lastCall: string;
  workingHours: string;
  drFirstCall: string;
  drLastCall: string;
  firmFirstCall: string;
  firmLastCall: string;
  stopWorkRemark: string;
  totalDrVisit: number;
  totalFirmVisit: number;
  callObjective: string;
  doctorProductiveCall: number;
  firmProductiveCall: number;
  totalProductiveCall: number;
  drPob: number;
  drPobUnit: number;
  firmPob: number;
  firmPobUnit: number;
  totalPob: number;
  totalPobUnit: number;
  stockistVisit: number;
}

const AVAILABLE_ZONES = ["Chhattisgarh", "Maharashtra", "Madhya Pradesh", "Gujarat"];
const AVAILABLE_DESIGNATIONS = [
  "All Designation",
  "Area General Manager (AGM)",
  "NATIONAL SALES MANAGER (NSM)",
  "Sr. Regional Sales Manager (Sr. RSM)",
  "Regional Sales Manager (RSM)",
  "DM",
  "Sr. Area Sales Manager (Sr. ASM)",
  "Area Sales Manager (ASM)",
  "Medical Representative (MR)",
];
const AVAILABLE_EMPLOYEES = ["All Employee", "RINKU KAPIL", "Amarjeet Singh", "BALRAM PATEL"];

const MOCK_CONSOLIDATED_DATA: ConsolidatedRecord[] = [
  {
    sNo: 1,
    date: "08-06-2026",
    employeeName: "RINKU KAPIL",
    employeeCode: "TEQEMP0001",
    state: "CHHATTISGARH",
    headQuarter: "Raipur",
    designation: "AGM",
    division: "DERMA",
    leave: "-",
    dayPlanDate: "-",
    dayPlanTime: "-",
    dayPlanLatLong: "0,0",
    workingWith: "-",
    workingArea: "-",
    workingAreaType: "-",
    submitAreaLatLong: "0,0",
    submitTime: "-",
    firstCall: "-",
    lastCall: "-",
    workingHours: "-",
    drFirstCall: "-",
    drLastCall: "-",
    firmFirstCall: "-",
    firmLastCall: "-",
    stopWorkRemark: "-",
    totalDrVisit: 0,
    totalFirmVisit: 0,
    callObjective: "-",
    doctorProductiveCall: 0,
    firmProductiveCall: 0,
    totalProductiveCall: 0,
    drPob: 0,
    drPobUnit: 0,
    firmPob: 0,
    firmPobUnit: 0,
    totalPob: 0,
    totalPobUnit: 0,
    stockistVisit: 0,
  },
  {
    sNo: 2,
    date: "07-06-2026",
    employeeName: "RINKU KAPIL",
    employeeCode: "TEQEMP0001",
    state: "CHHATTISGARH",
    headQuarter: "Raipur",
    designation: "AGM",
    division: "DERMA",
    leave: "-",
    dayPlanDate: "-",
    dayPlanTime: "-",
    dayPlanLatLong: "0,0",
    workingWith: "-",
    workingArea: "-",
    workingAreaType: "-",
    submitAreaLatLong: "0,0",
    submitTime: "-",
    firstCall: "-",
    lastCall: "-",
    workingHours: "-",
    drFirstCall: "-",
    drLastCall: "-",
    firmFirstCall: "-",
    firmLastCall: "-",
    stopWorkRemark: "-",
    totalDrVisit: 0,
    totalFirmVisit: 0,
    callObjective: "-",
    doctorProductiveCall: 0,
    firmProductiveCall: 0,
    totalProductiveCall: 0,
    drPob: 0,
    drPobUnit: 0,
    firmPob: 0,
    firmPobUnit: 0,
    totalPob: 0,
    totalPobUnit: 0,
    stockistVisit: 0,
  },
  {
    sNo: 3,
    date: "06-06-2026",
    employeeName: "RINKU KAPIL",
    employeeCode: "TEQEMP0001",
    state: "CHHATTISGARH",
    headQuarter: "Raipur",
    designation: "AGM",
    division: "DERMA",
    leave: "-",
    dayPlanDate: "-",
    dayPlanTime: "-",
    dayPlanLatLong: "0,0",
    workingWith: "-",
    workingArea: "-",
    workingAreaType: "-",
    submitAreaLatLong: "0,0",
    submitTime: "-",
    firstCall: "-",
    lastCall: "-",
    workingHours: "-",
    drFirstCall: "-",
    drLastCall: "-",
    firmFirstCall: "-",
    firmLastCall: "-",
    stopWorkRemark: "-",
    totalDrVisit: 0,
    totalFirmVisit: 0,
    callObjective: "-",
    doctorProductiveCall: 0,
    firmProductiveCall: 0,
    totalProductiveCall: 0,
    drPob: 0,
    drPobUnit: 0,
    firmPob: 0,
    firmPobUnit: 0,
    totalPob: 0,
    totalPobUnit: 0,
    stockistVisit: 0,
  },
  {
    sNo: 4,
    date: "05-06-2026",
    employeeName: "RINKU KAPIL",
    employeeCode: "TEQEMP0001",
    state: "CHHATTISGARH",
    headQuarter: "Raipur",
    designation: "AGM",
    division: "DERMA",
    leave: "-",
    dayPlanDate: "-",
    dayPlanTime: "-",
    dayPlanLatLong: "0,0",
    workingWith: "-",
    workingArea: "-",
    workingAreaType: "-",
    submitAreaLatLong: "0,0",
    submitTime: "-",
    firstCall: "-",
    lastCall: "-",
    workingHours: "-",
    drFirstCall: "-",
    drLastCall: "-",
    firmFirstCall: "-",
    firmLastCall: "-",
    stopWorkRemark: "-",
    totalDrVisit: 0,
    totalFirmVisit: 0,
    callObjective: "-",
    doctorProductiveCall: 0,
    firmProductiveCall: 0,
    totalProductiveCall: 0,
    drPob: 0,
    drPobUnit: 0,
    firmPob: 0,
    firmPobUnit: 0,
    totalPob: 0,
    totalPobUnit: 0,
    stockistVisit: 0,
  },
  {
    sNo: 5,
    date: "04-06-2026",
    employeeName: "RINKU KAPIL",
    employeeCode: "TEQEMP0001",
    state: "CHHATTISGARH",
    headQuarter: "Raipur",
    designation: "AGM",
    division: "DERMA",
    leave: "-",
    dayPlanDate: "-",
    dayPlanTime: "-",
    dayPlanLatLong: "0,0",
    workingWith: "-",
    workingArea: "-",
    workingAreaType: "-",
    submitAreaLatLong: "0,0",
    submitTime: "-",
    firstCall: "-",
    lastCall: "-",
    workingHours: "-",
    drFirstCall: "-",
    drLastCall: "-",
    firmFirstCall: "-",
    firmLastCall: "-",
    stopWorkRemark: "-",
    totalDrVisit: 0,
    totalFirmVisit: 0,
    callObjective: "-",
    doctorProductiveCall: 0,
    firmProductiveCall: 0,
    totalProductiveCall: 0,
    drPob: 0,
    drPobUnit: 0,
    firmPob: 0,
    firmPobUnit: 0,
    totalPob: 0,
    totalPobUnit: 0,
    stockistVisit: 0,
  },
  {
    sNo: 6,
    date: "03-06-2026",
    employeeName: "RINKU KAPIL",
    employeeCode: "TEQEMP0001",
    state: "CHHATTISGARH",
    headQuarter: "Raipur",
    designation: "AGM",
    division: "DERMA",
    leave: "-",
    dayPlanDate: "-",
    dayPlanTime: "-",
    dayPlanLatLong: "0,0",
    workingWith: "-",
    workingArea: "-",
    workingAreaType: "-",
    submitAreaLatLong: "0,0",
    submitTime: "-",
    firstCall: "-",
    lastCall: "-",
    workingHours: "-",
    drFirstCall: "-",
    drLastCall: "-",
    firmFirstCall: "-",
    firmLastCall: "-",
    stopWorkRemark: "-",
    totalDrVisit: 0,
    totalFirmVisit: 0,
    callObjective: "-",
    doctorProductiveCall: 0,
    firmProductiveCall: 0,
    totalProductiveCall: 0,
    drPob: 0,
    drPobUnit: 0,
    firmPob: 0,
    firmPobUnit: 0,
    totalPob: 0,
    totalPobUnit: 0,
    stockistVisit: 0,
  },
];

export function ConsolidatedEmployeeReportPage() {
  const [zone, setZone] = React.useState("All Zone");
  const [designation, setDesignation] = React.useState("All Designation");
  const [employee, setEmployee] = React.useState("All Employee");

  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");

  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reportRows, setReportRows] = React.useState<ConsolidatedRecord[]>([]);

  const handleApplyFilters = () => {
    // If Chhattisgarh or RINKU KAPIL is selected, return the Chhattisgarh AGM mock records
    let filtered = MOCK_CONSOLIDATED_DATA;

    if (zone !== "All Zone" && zone !== "Chhattisgarh") {
      filtered = [];
    } else if (employee !== "All Employee" && employee !== "RINKU KAPIL") {
      filtered = [];
    }

    // Adjust S.No dynamically
    const adjusted = filtered.map((row, idx) => ({
      ...row,
      sNo: idx + 1,
    }));

    setReportRows(adjusted);
    setHasGenerated(true);
    toast.success("Consolidated Employee Wise Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate the report first before exporting!");
      return;
    }

    const headers = [
      "Serial No.",
      "Date",
      "Employee Name",
      "Employee Code",
      "State",
      "Head Quarter",
      "Designation",
      "Division",
      "Leave",
      "Day Plan Date",
      "Day Plan Time",
      "Day Plan LatLong",
      "Working With",
      "Working Area",
      "Working Area Type",
      "Submit Area Lat Long",
      "Submit Time",
      "First Call",
      "Last Call",
      "Working Hours",
      "Dr.First Call",
      "Dr.Last Call",
      "Firm First Call",
      "Firm Last Call",
      "Stop Work Remark",
      "Total Dr. Visit",
      "Total Firm Visit",
      "Call Objective",
      "Doctor Productive Call",
      "Firm Productive Call",
      "Total Productive Call",
      "Dr.POB",
      "Dr. POB Unit",
      "Firm POB",
      "Firm POB Unit",
      "Total POB",
      "Total POB Unit",
      "Stockist/Distributor Visit",
    ];

    const rows = reportRows.map((r) => [
      r.sNo,
      `"${r.date}"`,
      `"${r.employeeName}"`,
      `"${r.employeeCode}"`,
      `"${r.state}"`,
      `"${r.headQuarter}"`,
      `"${r.designation}"`,
      `"${r.division}"`,
      `"${r.leave}"`,
      `"${r.dayPlanDate}"`,
      `"${r.dayPlanTime}"`,
      `"${r.dayPlanLatLong}"`,
      `"${r.workingWith}"`,
      `"${r.workingArea}"`,
      `"${r.workingAreaType}"`,
      `"${r.submitAreaLatLong}"`,
      `"${r.submitTime}"`,
      `"${r.firstCall}"`,
      `"${r.lastCall}"`,
      `"${r.workingHours}"`,
      `"${r.drFirstCall}"`,
      `"${r.drLastCall}"`,
      `"${r.firmFirstCall}"`,
      `"${r.firmLastCall}"`,
      `"${r.stopWorkRemark}"`,
      r.totalDrVisit,
      r.totalFirmVisit,
      `"${r.callObjective}"`,
      r.doctorProductiveCall,
      r.firmProductiveCall,
      r.totalProductiveCall,
      r.drPob,
      r.drPobUnit,
      r.firmPob,
      r.firmPobUnit,
      r.totalPob,
      r.totalPobUnit,
      r.stockistVisit,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Consolidated_Employee_Report_${fromDate || "all"}_to_${toDate || "all"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  return (
    <div className="flex flex-col space-y-5 p-6 animate-fade-in bg-slate-50/50 min-h-screen">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4 bg-white p-4 rounded-xl shadow-xs border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/reports" className="hover:text-[#008272] flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Reports Hub
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-1.5 justify-between w-full">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
              Consolidated Employee Wise Report
              <span title="Report showing daily activities and consolidated statistics of employees during a period.">
                <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
              </span>
            </h1>
          </div>
        </div>
        <div className="text-xs font-bold text-red-650 md:text-right">
          Note : The first and last call times are updated to two days prior to the current date.
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Zone */}
          <div className="w-full sm:w-48">
            <UiSelect value={zone} onValueChange={setZone}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Zone">All Zone</SelectItem>
                {AVAILABLE_ZONES.map((z) => (
                  <SelectItem key={z} value={z}>
                    {z}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Designation */}
          <div className="w-full sm:w-56">
            <UiSelect value={designation} onValueChange={setDesignation}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Designation" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_DESIGNATIONS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Employee */}
          <div className="w-full sm:w-56">
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Employee" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_EMPLOYEES.map((emp) => (
                  <SelectItem key={emp} value={emp}>
                    {emp}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* From Date */}
          <div className="w-full sm:w-36">
            <input
              type={startFocused || fromDate ? "date" : "text"}
              placeholder="From Date"
              onFocus={() => setStartFocused(true)}
              onBlur={() => setStartFocused(false)}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
            />
          </div>

          {/* To Date */}
          <div className="w-full sm:w-36">
            <input
              type={endFocused || toDate ? "date" : "text"}
              placeholder="To Date"
              onFocus={() => setEndFocused(true)}
              onBlur={() => setEndFocused(false)}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleApplyFilters}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-5 font-bold text-xs gap-1 shadow-xs active:scale-95 transition-transform"
            >
              Go
            </Button>
            <Button
              onClick={handleExportCSV}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-5 font-bold text-xs gap-1 shadow-xs active:scale-95 transition-transform"
            >
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid Render or Parameter Selection Empty State */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select parameters to generate report.
        </div>
      ) : (
        /* Horizontally Scrollable 39-Column Grid Container */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
            <span>Consolidated Employee Wise Log Summary ({reportRows.length} records)</span>
            <span className="text-slate-400">Scroll horizontally to view all fields</span>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[3400px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-16 min-w-[64px]">Serial No.</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-28 min-w-[112px]">Date</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-44 min-w-[176px]">Employee Name</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-36 min-w-[144px]">Employee Code</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-36 min-w-[144px]">State</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-32 min-w-[128px]">Head Quarter</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-28 min-w-[112px]">Designation</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-28 min-w-[112px]">Division</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-20 min-w-[80px]">Leave</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-28 min-w-[112px]">Day Plan Date</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-28 min-w-[112px]">Day Plan Time</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-36 min-w-[144px]">Day Plan LatLong</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-36 min-w-[144px]">Working With</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-32 min-w-[128px]">Working Area</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-32 min-w-[128px]">Working Area Type</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-36 min-w-[144px]">Submit Area Lat Long</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-28 min-w-[112px]">Submit Time</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">First Call</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">Last Call</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-28 min-w-[112px]">Working Hours</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-28 min-w-[112px]">Dr.First Call</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-28 min-w-[112px]">Dr.Last Call</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-28 min-w-[112px]">Firm First Call</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-28 min-w-[112px]">Firm Last Call</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-44 min-w-[176px]">Stop Work Remark</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">Tracks</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">Total Dr. Visit</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">Total Firm Visit</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-28 min-w-[112px]">Call Objective</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-36 min-w-[144px]">Doctor Productive Call</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-32 min-w-[128px]">Firm Productive Call</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-32 min-w-[128px]">Total Productive Call</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">Dr.POB</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">Dr. POB Unit</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">Firm POB</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">Firm POB Unit</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">Total POB</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">Total POB Unit</th>
                  <th className="p-3 border-b border-slate-200 text-center w-36 min-w-[144px]">Stockist/Distributor Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reportRows.length === 0 ? (
                  <tr>
                    <td colSpan={39} className="p-10 text-center text-slate-400 font-semibold">No Records Found</td>
                  </tr>
                ) : (
                  reportRows.map((row) => (
                    <tr key={row.date} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 border-r border-b border-slate-200 text-center font-semibold text-slate-500">{row.sNo}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-600 font-medium whitespace-pre-line">{row.date}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800 whitespace-pre-line">{row.employeeName}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-500">{row.employeeCode}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-600 font-medium">{row.state}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.headQuarter}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-500 font-bold">{row.designation}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-500">{row.division}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.leave}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.dayPlanDate}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.dayPlanTime}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.dayPlanLatLong}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.workingWith}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.workingArea}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.workingAreaType}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.submitAreaLatLong}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.submitTime}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.firstCall}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.lastCall}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.workingHours}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.drFirstCall}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.drLastCall}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.firmFirstCall}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-550">{row.firmLastCall}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.stopWorkRemark}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center font-bold">
                        <button
                          onClick={() => toast.info(`Viewing track details for date ${row.date.replace(/\n/g, " ")}`)}
                          className="text-blue-500 hover:underline hover:text-blue-600 active:scale-95 transition-transform"
                        >
                          Show Track
                        </button>
                      </td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-700">{row.totalDrVisit}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-700">{row.totalFirmVisit}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.callObjective}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-700">{row.doctorProductiveCall}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-700">{row.firmProductiveCall}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-700">{row.totalProductiveCall}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-700">{row.drPob}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-700">{row.drPobUnit}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-700">{row.firmPob}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-700">{row.firmPobUnit}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-700">{row.totalPob}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-700">{row.totalPobUnit}</td>
                      <td className="p-3 border-b border-slate-200 text-center text-slate-700">{row.stockistVisit}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Info, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CallAverageRecord {
  srNo: number;
  employeeName: string;
  drInMcl: number;
  reportingTo: string;
  dateOfJoining: string;
  tourPlanSubmitted: number;
  fieldWorkingDays: number;
  leave: number;
  drSpeciality: string;
  doctorMet: number;
  doctorCallAverage: number;
  uniqueDrMet: number;
  uniqueDrCallAverage: number;
  
  // Firm Met Details
  chemistMet: number;
  firmMet: number;
  stockistMet: number;
  
  // Firm Call Average Details
  chemistCallAverage: number;
  firmCallAverage: number;
  stockistCallAverage: number;
  
  // Unique Firm Met Details
  uniqueChemistMet: number;
  uniqueFirmMet: number;
  uniqueStockistMet: number;
  
  // Unique Firm Call Average Details
  uniqueChemistCallAverage: number;
  uniqueFirmCallAverage: number;
  uniqueStockistCallAverage: number;
  
  // Productive Call Average Details
  productiveChemistMet: number;
  productiveDoctorAverage: number;
  productiveFirmAverage: number;

  isActive: boolean;
}

const ZONES = ["Chhattisgarh", "Bhopal", "Raipur", "Durg", "Jabalpur", "Bhubaneswar", "Balaghat", "Bilaspur"];
const DIVISIONS = ["DERMA", "GYN"];
const EMPLOYEES = ["Ajeet kumar Sahu", "Amarjeet Singh", "Balram Patel"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

const MOCK_RECORDS: CallAverageRecord[] = [
  {
    srNo: 1,
    employeeName: "Ajeet kumar Sahu",
    drInMcl: 108,
    reportingTo: "",
    dateOfJoining: "",
    tourPlanSubmitted: 0,
    fieldWorkingDays: 0,
    leave: 0,
    drSpeciality: "DERMA",
    doctorMet: 0,
    doctorCallAverage: 0,
    uniqueDrMet: 0,
    uniqueDrCallAverage: 0,
    chemistMet: 0,
    firmMet: 0,
    stockistMet: 0,
    chemistCallAverage: 0,
    firmCallAverage: 0,
    stockistCallAverage: 0,
    uniqueChemistMet: 0,
    uniqueFirmMet: 0,
    uniqueStockistMet: 0,
    uniqueChemistCallAverage: 0,
    uniqueFirmCallAverage: 0,
    uniqueStockistCallAverage: 0,
    productiveChemistMet: 0,
    productiveDoctorAverage: 0,
    productiveFirmAverage: 0,
    isActive: false,
  },
  {
    srNo: 2,
    employeeName: "Amarjeet Singh",
    drInMcl: 154,
    reportingTo: "RINKU KAPIL",
    dateOfJoining: "01-Jan-2022",
    tourPlanSubmitted: 10,
    fieldWorkingDays: 8,
    leave: 0,
    drSpeciality: "DERMA",
    doctorMet: 59,
    doctorCallAverage: 7.4,
    uniqueDrMet: 42,
    uniqueDrCallAverage: 5.3,
    chemistMet: 15,
    firmMet: 10,
    stockistMet: 2,
    chemistCallAverage: 1.9,
    firmCallAverage: 1.25,
    stockistCallAverage: 0.25,
    uniqueChemistMet: 12,
    uniqueFirmMet: 8,
    uniqueStockistMet: 2,
    uniqueChemistCallAverage: 1.5,
    uniqueFirmCallAverage: 1.0,
    uniqueStockistCallAverage: 0.25,
    productiveChemistMet: 12,
    productiveDoctorAverage: 5.3,
    productiveFirmAverage: 1.0,
    isActive: true,
  },
  {
    srNo: 3,
    employeeName: "Balram Patel",
    drInMcl: 120,
    reportingTo: "RINKU KAPIL",
    dateOfJoining: "15-Mar-2021",
    tourPlanSubmitted: 12,
    fieldWorkingDays: 9,
    leave: 1,
    drSpeciality: "GYN",
    doctorMet: 68,
    doctorCallAverage: 7.6,
    uniqueDrMet: 45,
    uniqueDrCallAverage: 5.0,
    chemistMet: 18,
    firmMet: 12,
    stockistMet: 4,
    chemistCallAverage: 2.0,
    firmCallAverage: 1.33,
    stockistCallAverage: 0.44,
    uniqueChemistMet: 15,
    uniqueFirmMet: 10,
    uniqueStockistMet: 4,
    uniqueChemistCallAverage: 1.67,
    uniqueFirmCallAverage: 1.11,
    uniqueStockistCallAverage: 0.44,
    productiveChemistMet: 15,
    productiveDoctorAverage: 5.0,
    productiveFirmAverage: 1.11,
    isActive: true,
  }
];

export function CallAverageReportPage() {
  const [showSpeciality, setShowSpeciality] = React.useState(false);
  const [showInactive, setShowInactive] = React.useState(false);
  const [withWorkAgenda, setWithWorkAgenda] = React.useState(true);
  const [showFromToDate, setShowFromToDate] = React.useState(false);

  const [zone, setZone] = React.useState<string>("");
  const [division, setDivision] = React.useState<string>("");
  const [employee, setEmployee] = React.useState<string>("");
  const [month, setMonth] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");
  const [fromDate, setFromDate] = React.useState<string>("2026-06-02");
  const [toDate, setToDate] = React.useState<string>("2026-06-09");

  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reportRows, setReportRows] = React.useState<CallAverageRecord[]>([]);

  const handleGenerate = () => {
    if (!zone) {
      toast.error("Please select a Zone!");
      return;
    }
    if (!division) {
      toast.error("Please select a Division!");
      return;
    }
    if (!employee) {
      toast.error("Please select an Employee!");
      return;
    }

    if (showFromToDate) {
      if (!fromDate || !toDate) {
        toast.error("Please select both From Date and To Date!");
        return;
      }
      if (new Date(fromDate) > new Date(toDate)) {
        toast.error("From Date cannot be after To Date!");
        return;
      }
    } else {
      if (!month) {
        toast.error("Please select a Month!");
        return;
      }
      if (!year) {
        toast.error("Please select a Year!");
        return;
      }
    }

    // Filter mock data based on checkboxes & select Employee
    let filtered = MOCK_RECORDS;
    
    // Filter inactive details
    if (!showInactive) {
      filtered = filtered.filter(r => r.isActive);
    }

    // Filter by specific employee
    if (employee !== "All Employee") {
      filtered = filtered.filter(r => r.employeeName === employee);
    }

    // Map correct S.No.
    filtered = filtered.map((r, idx) => ({
      ...r,
      srNo: idx + 1
    }));

    setReportRows(filtered);
    setHasGenerated(true);
    toast.success("Call Average Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated || reportRows.length === 0) {
      toast.error("No generated data to export!");
      return;
    }

    // Level 1 headers
    const level1 = [
      "Sr.No.", "Name Of Employee", "Dr In MCL", "Reporting To", "Date of Joining", "Tour Plan Submitted", "Field Working days", "Leave"
    ];
    if (showSpeciality) {
      level1.push("Dr.Speciality");
    }
    level1.push(
      "Doctor Met", "Doctor Call Average", "Unique Dr Met", "Unique Dr Call Average",
      "Firm Met Details (Chemist)", "Firm Met Details (Firm)", "Firm Met Details (Stockist)",
      "Firm Call Average Details (Chemist)", "Firm Call Average Details (Firm)", "Firm Call Average Details (Stockist)",
      "Unique Firm Met Details (Chemist)", "Unique Firm Met Details (Firm)", "Unique Firm Met Details (Stockist)",
      "Unique Firm Call Average Details (Chemist)", "Unique Firm Call Average Details (Firm)", "Unique Firm Call Average Details (Stockist)",
      "Productive Call Average Details (Chemist)", "Productive Call Average Details (Doctor)", "Productive Call Average Details (Firm)"
    );

    const csvRows = [level1.join(",")];

    reportRows.forEach((r) => {
      const row = [
        r.srNo,
        `"${r.employeeName}"`,
        r.drInMcl,
        `"${r.reportingTo}"`,
        `"${r.dateOfJoining}"`,
        r.tourPlanSubmitted,
        r.fieldWorkingDays,
        r.leave
      ];
      if (showSpeciality) {
        row.push(`"${r.drSpeciality}"`);
      }
      row.push(
        r.doctorMet, r.doctorCallAverage, r.uniqueDrMet, r.uniqueDrCallAverage,
        r.chemistMet, r.firmMet, r.stockistMet,
        r.chemistCallAverage, r.firmCallAverage, r.stockistCallAverage,
        r.uniqueChemistMet, r.uniqueFirmMet, r.uniqueStockistMet,
        r.uniqueChemistCallAverage, r.uniqueFirmCallAverage, r.uniqueStockistCallAverage,
        r.productiveChemistMet, r.productiveDoctorAverage, r.productiveFirmAverage
      );
      csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Call_Average_Report_${showFromToDate ? fromDate + "_to_" + toDate : month + "_" + year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  return (
    <div className="flex flex-col space-y-5 p-6 bg-slate-50/50 min-h-screen animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4 bg-white p-4 rounded-xl shadow-xs border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/reports" className="hover:text-[#008272] flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Reports Hub
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
              Call Average Report
              <span title="Report showing monthly doctor, chemist, stockist call average, unique visits and productive averages.">
                <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Checkboxes Row */}
      <div className="flex flex-wrap items-center gap-5 bg-white border rounded-xl border-slate-100 p-4 shadow-xs text-xs font-semibold text-slate-700 select-none">
        <label className="flex items-center gap-2 cursor-pointer hover:text-[#008272] transition-colors">
          <input
            type="checkbox"
            checked={showSpeciality}
            onChange={(e) => setShowSpeciality(e.target.checked)}
            className="rounded border-slate-300 text-[#008272] focus:ring-[#008272] h-4 w-4 accent-[#008272]"
          />
          Show Doctor's Speciality
        </label>

        <label className="flex items-center gap-2 cursor-pointer hover:text-[#008272] transition-colors">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="rounded border-slate-300 text-[#008272] focus:ring-[#008272] h-4 w-4 accent-[#008272]"
          />
          Show Inactive Details
        </label>

        <label className="flex items-center gap-2 cursor-pointer hover:text-[#008272] transition-colors">
          <input
            type="checkbox"
            checked={withWorkAgenda}
            onChange={(e) => setWithWorkAgenda(e.target.checked)}
            className="rounded border-slate-300 text-[#008272] focus:ring-[#008272] h-4 w-4 accent-[#008272]"
          />
          Call Average With Work Agenda
        </label>

        <label className="flex items-center gap-2 cursor-pointer hover:text-[#008272] transition-colors">
          <input
            type="checkbox"
            checked={showFromToDate}
            onChange={(e) => setShowFromToDate(e.target.checked)}
            className="rounded border-slate-300 text-[#008272] focus:ring-[#008272] h-4 w-4 accent-[#008272]"
          />
          Show From And To Date
        </label>
      </div>

      {/* Filters Console block */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Zone */}
          <div className="w-full sm:w-44">
            <UiSelect value={zone} onValueChange={setZone}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="All Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Zone">All Zone</SelectItem>
                {ZONES.map((z) => (
                  <SelectItem key={z} value={z}>
                    {z}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Division */}
          <div className="w-full sm:w-44">
            <UiSelect value={division} onValueChange={setDivision}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="All Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Division">All Division</SelectItem>
                {DIVISIONS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Employee */}
          <div className="w-full sm:w-44">
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="All Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Employee">All Employee</SelectItem>
                {EMPLOYEES.map((emp) => (
                  <SelectItem key={emp} value={emp}>
                    {emp}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Dynamic Time Fields */}
          {showFromToDate ? (
            <>
              {/* From Date */}
              <div className="w-full sm:w-40">
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full h-9 text-xs bg-white border-slate-200"
                  placeholder="From Date"
                />
              </div>

              {/* To Date */}
              <div className="w-full sm:w-40">
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full h-9 text-xs bg-white border-slate-200"
                  placeholder="To Date"
                />
              </div>
            </>
          ) : (
            <>
              {/* Select Month */}
              <div className="w-full sm:w-44">
                <UiSelect value={month} onValueChange={setMonth}>
                  <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
              </div>

              {/* Select Year */}
              <div className="w-full sm:w-44">
                <UiSelect value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs rounded shadow-xs active:scale-95 transition-transform"
            >
              Go
            </Button>
            <Button
              onClick={handleExportCSV}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs rounded flex items-center gap-1.5 shadow-xs active:scale-95 transition-transform"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* Data Grid render or Empty State */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select parameters to generate report.
        </div>
      ) : (
        /* Double-Level Spreadsheet Grid Table Layout matching Snapshot 2/3 */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[2200px]">
              <thead className="bg-slate-50 select-none z-10 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                {/* Level 1 Headers */}
                <tr>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-16">Sr.No.</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-left pl-4 w-44">Name Of Employee</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-24">Dr In MCL</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-left pl-4 w-36">Reporting To</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-36">Date of Joining</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-36">Tour Plan Submitted</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-36">Field Working days</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-20">Leave</th>
                  
                  {showSpeciality && (
                    <th rowSpan={2} className="p-3 border-r border-slate-200 text-left pl-4 w-32">Dr.Speciality</th>
                  )}

                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-28">Doctor Met</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-28">Doctor Call Average</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-28">Unique Dr Met</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-28">Unique Dr Call Average</th>

                  <th colSpan={3} className="p-3.5 border-r border-slate-200 text-center font-bold">Firm Met Details</th>
                  <th colSpan={3} className="p-3.5 border-r border-slate-200 text-center font-bold">Firm Call Average Details</th>
                  <th colSpan={3} className="p-3.5 border-r border-slate-200 text-center font-bold">Unique Firm Met Details</th>
                  <th colSpan={3} className="p-3.5 border-r border-slate-200 text-center font-bold">Unique Firm Call Average Details</th>
                  <th colSpan={3} className="p-3 border-slate-200 text-center font-bold">Productive Call Average Details</th>
                </tr>

                {/* Level 2 Sub-Headers */}
                <tr className="border-t border-slate-200 bg-slate-50/50">
                  {/* Firm Met Details */}
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Chemist Met</th>
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Firm Met</th>
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Stockist Met</th>

                  {/* Firm Call Average Details */}
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Chemist Met</th>
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Firm Call Average</th>
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Stockist Call Average</th>

                  {/* Unique Firm Met Details */}
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Chemist Met</th>
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Unique Firm Met</th>
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Unique Stockist Met</th>

                  {/* Unique Firm Call Average Details */}
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Chemist Call Average</th>
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Unique Firm Call Average</th>
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Unique Stockist Call Average</th>

                  {/* Productive Call Average Details */}
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Unique Chemist Met</th>
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Doctor Average</th>
                  <th className="p-2 border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Firm Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reportRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={showSpeciality ? 29 : 28}
                      className="p-6 text-center text-slate-400 font-semibold italic border-b border-slate-200"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  reportRows.map((row) => (
                    <tr key={row.employeeName} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 border-r border-b border-slate-200 text-slate-500 font-semibold text-center">{row.srNo}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.employeeName}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-700">{row.drInMcl}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600 font-semibold">{row.reportingTo || "-"}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.dateOfJoining || "-"}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-700">{row.tourPlanSubmitted}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-700">{row.fieldWorkingDays}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-700">{row.leave}</td>
                      
                      {showSpeciality && (
                        <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600 font-semibold">{row.drSpeciality}</td>
                      )}

                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-700">{row.doctorMet}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-slate-800">{row.doctorCallAverage}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-700">{row.uniqueDrMet}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-slate-800">{row.uniqueDrCallAverage}</td>

                      {/* Firm Met Details */}
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.chemistMet}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.firmMet}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.stockistMet}</td>

                      {/* Firm Call Average Details */}
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.chemistMet}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-slate-800">{row.firmCallAverage}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-slate-800">{row.stockistCallAverage}</td>

                      {/* Unique Firm Met Details */}
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.uniqueChemistMet}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.uniqueFirmMet}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.uniqueStockistMet}</td>

                      {/* Unique Firm Call Average Details */}
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-slate-800">{row.uniqueChemistCallAverage}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-slate-800">{row.uniqueFirmCallAverage}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-slate-800">{row.uniqueStockistCallAverage}</td>

                      {/* Productive Call Average Details */}
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.productiveChemistMet}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-slate-800">{row.productiveDoctorAverage}</td>
                      <td className="p-3.5 border-b border-slate-200 text-center font-bold text-slate-800">{row.productiveFirmAverage}</td>
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

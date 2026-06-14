import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Info,
  ArrowLeft,
  X,
  FileSpreadsheet,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ChemistVisitRow {
  srNo: number;
  date: string;
  firmId: string;
  firmName: string;
  city: string;
  firmType: string;
  employeeCode: string;
  employeeName: string;
  hq: string;
  contactNumber: string;
  workingWith: string;
  firmAddress: string;
  checkIn: string;
  checkOut: string;
  checkInAddress: string;
  checkOutAddress: string;
  remark: string;
  attachment: string;
  status: string;
  followUpDate: string;
}

const MOCK_CHEMIST_VISITS: ChemistVisitRow[] = [
  {
    srNo: 1,
    date: "11/06/2026",
    firmId: "FM-4412",
    firmName: "Teqmed Pharma LLP",
    city: "Raipur",
    firmType: "Chemist",
    employeeCode: "EMP-0092",
    employeeName: "Amarjeet Singh",
    hq: "Raipur",
    contactNumber: "9876543210",
    workingWith: "Yugal Kishor Sahu",
    firmAddress: "Ring Road, Raipur, Chhattisgarh 492001",
    checkIn: "10:30 AM",
    checkOut: "10:55 AM",
    checkInAddress: "Ring Road Square, Raipur",
    checkOutAddress: "Ring Road Square, Raipur",
    remark: "Stock order collected successfully",
    attachment: "Invoice.pdf",
    status: "Closed",
    followUpDate: "18/06/2026"
  },
  {
    srNo: 2,
    date: "11/06/2026",
    firmId: "FM-9012",
    firmName: "Kailash Chemists",
    city: "Bhilai",
    firmType: "Stockist",
    employeeCode: "EMP-0092",
    employeeName: "Amarjeet Singh",
    hq: "Raipur",
    contactNumber: "9123456789",
    workingWith: "-",
    firmAddress: "Sector 2, Bhilai, Chhattisgarh 490001",
    checkIn: "01:15 PM",
    checkOut: "01:40 PM",
    checkInAddress: "Sector 5 Market, Bhilai",
    checkOutAddress: "Sector 5 Market, Bhilai",
    remark: "POB booking complete",
    attachment: "NA",
    status: "Closed",
    followUpDate: "25/06/2026"
  }
];

const AVAILABLE_ZONES = ["Chhattisgarh", "Maharashtra", "Madhya Pradesh", "Gujarat"];

// Professional SVG illustration of shrugging character and monitor, matching the screenshot
const NoRecordFoundIllustration = () => (
  <div className="flex flex-col items-center justify-center py-10 px-4 animate-fade-in bg-white border border-slate-100 rounded-xl shadow-xs">
    <svg className="w-96 h-72 text-slate-300" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Desk surface */}
      <path d="M50 320 L550 320" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
      
      {/* Desk items/drawings */}
      <circle cx="150" cy="320" r="12" fill="#E2E8F0" />
      
      {/* PC Monitor */}
      <rect x="360" y="220" width="160" height="90" rx="8" fill="#94A3B8" />
      <rect x="370" y="228" width="140" height="74" rx="4" fill="#F1F5F9" />
      {/* Code lines on screen */}
      <line x1="380" y1="240" x2="440" y2="240" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      <line x1="380" y1="250" x2="420" y2="250" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      <line x1="380" y1="260" x2="480" y2="260" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      <line x1="380" y1="270" x2="450" y2="270" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      <line x1="380" y1="280" x2="410" y2="280" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />

      {/* Monitor base stand */}
      <path d="M430 310 L430 320" stroke="#64748B" strokeWidth="12" strokeLinecap="round" />
      <path d="M410 320 L470 320" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />

      {/* Character body */}
      {/* Legs */}
      <rect x="270" y="295" width="22" height="75" rx="6" fill="#F59E0B" />
      <rect x="305" y="295" width="22" height="75" rx="6" fill="#F59E0B" />
      
      {/* Chair */}
      <path d="M260 270 L340 270" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
      <path d="M300 270 L300 325" stroke="#475569" strokeWidth="14" />
      
      {/* Torso */}
      <rect x="255" y="200" width="85" height="100" rx="20" fill="#334155" />

      {/* Shirt Collar / Neck */}
      <path d="M285 200 L310 200 L297.5 210 Z" fill="#F1F5F9" />

      {/* Shrugging Arms */}
      {/* Left arm */}
      <path d="M255 215 C220 215 200 240 180 230" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
      <circle cx="180" cy="230" r="10" fill="#F87171" />

      {/* Right arm */}
      <path d="M340 215 C375 215 395 240 415 230" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
      <circle cx="415" cy="230" r="10" fill="#F87171" />

      {/* Head */}
      <rect x="278" y="145" width="39" height="50" rx="19" fill="#F87171" />
      <rect x="275" y="140" width="45" height="24" rx="8" fill="#1E293B" /> {/* Hair */}

      {/* Floating Elements (question mark, cross) */}
      <circle cx="120" cy="140" r="20" fill="#E2E8F0" />
      <path d="M112 132 L128 148 M128 132 L112 148" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />

      {/* Speech Bubble: "No Record! Found" */}
      <path d="M330 130 C330 80 470 80 470 130 C470 150 450 160 410 160 L395 185 L390 160 C330 160 330 140 330 130 Z" fill="white" stroke="#38BDF8" strokeWidth="3" />
      <text x="345" y="125" fill="#0F172A" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">No Record !</text>
      <text x="368" y="148" fill="#0F172A" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">Found</text>

      {/* Document icon floating */}
      <rect x="470" y="270" width="30" height="40" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
      <line x1="478" y1="280" x2="492" y2="280" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="478" y1="290" x2="492" y2="290" stroke="#CBD5E1" strokeWidth="2" />
    </svg>
  </div>
);

export function ChemistVisitReportPage() {
  // Filters State
  const [selectedZones, setSelectedZones] = React.useState<string[]>([]);
  const [employee, setEmployee] = React.useState("All Employee");
  const [firm, setFirm] = React.useState("All Firm");
  const [status, setStatus] = React.useState("All Status");
  const [startDate, setStartDate] = React.useState("2026-06-11");
  const [endDate, setEndDate] = React.useState("2026-06-11");

  // Focus tracking for clean date placeholders
  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  // Zone Tags Controls
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const [zoneSearch, setZoneSearch] = React.useState("");
  const zoneRef = React.useRef<HTMLDivElement>(null);

  // Grid Controls
  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reports, setReports] = React.useState<ChemistVisitRow[]>([]);

  // Click outside to close zone dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (zoneRef.current && !zoneRef.current.contains(event.target as Node)) {
        setIsZoneOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleApplyFilters = () => {
    // Determine if we show mock records or No Record Found
    // If the user chooses "Amarjeet Singh", return records. Otherwise, return empty to show the illustration.
    let filtered: ChemistVisitRow[] = [];

    if (employee === "Amarjeet Singh" || employee === "All Employee") {
      filtered = MOCK_CHEMIST_VISITS;
    }

    // Apply secondary filters
    if (firm !== "All Firm") {
      filtered = filtered.filter((r) => r.firmName === firm);
    }
    if (status !== "All Status") {
      filtered = filtered.filter((r) => r.status === status);
    }

    setReports(filtered);
    setHasGenerated(true);
    toast.success("Report search completed!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate the report first before exporting!");
      return;
    }

    if (reports.length === 0) {
      toast.error("No records found to export!");
      return;
    }

    const headers = [
      "Sr.no.",
      "Date",
      "Firm id",
      "Firm Name",
      "City",
      "Firm Type",
      "Employee Code",
      "Employee Name",
      "HQ",
      "Contact Number",
      "Working With",
      "Firm Address",
      "Check In",
      "Check Out",
      "Check In Address",
      "Check Out Address",
      "Remark",
      "Attachment",
      "Status",
      "Follow-Up Date"
    ];

    const rows = reports.map((r) => [
      r.srNo,
      r.date,
      r.firmId,
      `"${r.firmName}"`,
      `"${r.city}"`,
      `"${r.firmType}"`,
      r.employeeCode,
      `"${r.employeeName}"`,
      `"${r.hq}"`,
      r.contactNumber,
      `"${r.workingWith}"`,
      `"${r.firmAddress}"`,
      r.checkIn,
      r.checkOut,
      `"${r.checkInAddress}"`,
      `"${r.checkOutAddress}"`,
      `"${r.remark}"`,
      `"${r.attachment}"`,
      `"${r.status}"`,
      r.followUpDate
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Firm_Visit_Report_${startDate}_to_${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  const removeZoneTag = (z: string) => {
    setSelectedZones((prev) => prev.filter((item) => item !== z));
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
          <div className="flex items-center gap-2 mt-1.5">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
              Firm Visit Report
              <span title="Report showing firm's closed, skipped and open calls by a particular employee during a period.">
                <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        {/* Row 1 Primary Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Zone Tag Input */}
          <div className="w-full sm:w-48 relative" ref={zoneRef}>
            <div
              className="flex items-center flex-wrap gap-1 p-1 border rounded-lg border-slate-200 bg-slate-50 min-h-[36px] max-h-[72px] overflow-y-auto cursor-text text-xs"
              onClick={() => setIsZoneOpen(true)}
            >
              {selectedZones.length === 0 && (
                <span className="text-slate-400 pl-1.5 py-0.5">Select Zone</span>
              )}
              {selectedZones.map((z) => (
                <span
                  key={z}
                  className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[11px] px-1.5 py-0.5 rounded text-slate-700 font-medium"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeZoneTag(z);
                    }}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                  {z}
                </span>
              ))}
              <input
                type="text"
                value={zoneSearch}
                onChange={(e) => {
                  setZoneSearch(e.target.value);
                  setIsZoneOpen(true);
                }}
                onFocus={() => setIsZoneOpen(true)}
                className="bg-transparent border-none outline-none text-xs flex-1 ml-1 min-w-[50px] h-5"
              />
            </div>
            {isZoneOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50 text-xs py-1">
                {AVAILABLE_ZONES.filter(
                  (z) =>
                    z.toLowerCase().includes(zoneSearch.toLowerCase()) &&
                    !selectedZones.includes(z)
                ).map((z) => (
                  <button
                    key={z}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedZones([...selectedZones, z]);
                      setZoneSearch("");
                      setIsZoneOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    {z}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* All Employee */}
          <div className="w-full sm:w-48">
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Employee">All Employee</SelectItem>
                <SelectItem value="Amarjeet Singh">Amarjeet Singh</SelectItem>
                <SelectItem value="AAKIB KHAN">AAKIB KHAN</SelectItem>
                <SelectItem value="BALRAM PATEL">BALRAM PATEL</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* All Firm */}
          <div className="w-full sm:w-48">
            <UiSelect value={firm} onValueChange={setFirm}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Firm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Firm">All Firm</SelectItem>
                <SelectItem value="Teqmed Pharma LLP">Teqmed Pharma LLP</SelectItem>
                <SelectItem value="Kailash Chemists">Kailash Chemists</SelectItem>
                <SelectItem value="Durga Medicos">Durga Medicos</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* All Status */}
          <div className="w-full sm:w-40">
            <UiSelect value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Skipped">Skipped</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* From Date */}
          <div className="w-full sm:w-36">
            <input
              type={startFocused || startDate ? "date" : "text"}
              placeholder="From Date"
              onFocus={() => setStartFocused(true)}
              onBlur={() => setStartFocused(false)}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
            />
          </div>

          {/* To Date */}
          <div className="w-full sm:w-36">
            <input
              type={endFocused || endDate ? "date" : "text"}
              placeholder="To Date"
              onFocus={() => setEndFocused(true)}
              onBlur={() => setEndFocused(false)}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
            />
          </div>
        </div>

        {/* Row 2 Buttons */}
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

      {/* Main Grid Render or Parameter Selection Empty State */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select the parameters to generate report.
        </div>
      ) : reports.length === 0 ? (
        /* Empty State Illustration when search result is empty */
        <NoRecordFoundIllustration />
      ) : (
        /* Horizontally Scrollable Grid Container */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
            <span>Firm Visit Log Summary ({reports.length} records)</span>
            <span className="text-slate-400">Scroll horizontally to view all fields</span>
          </div>

          {/* Scrollable table container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[2400px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3.5 w-24 border-r border-b border-slate-200 text-center">
                    Sr.no.
                  </th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-center">
                    Date
                  </th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-center">
                    Firm id
                  </th>
                  <th className="p-3.5 w-48 border-r border-b border-slate-200 text-left pl-4">
                    Firm Name
                  </th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-left pl-4">
                    City
                  </th>
                  <th className="p-3.5 w-36 border-r border-b border-slate-200 text-left pl-4">
                    Firm Type
                  </th>
                  <th className="p-3.5 w-36 border-r border-b border-slate-200 text-center">
                    Employee Code
                  </th>
                  <th className="p-3.5 w-48 border-r border-b border-slate-200 text-left pl-4">
                    Employee Name
                  </th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-left pl-4">
                    HQ
                  </th>
                  <th className="p-3.5 w-36 border-r border-b border-slate-200 text-center">
                    Contact Number
                  </th>
                  <th className="p-3.5 w-44 border-r border-b border-slate-200 text-left pl-4">
                    Working With
                  </th>
                  <th className="p-3.5 w-64 border-r border-b border-slate-200 text-left pl-4">
                    Firm Address
                  </th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-center">
                    Check In
                  </th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-center">
                    Check Out
                  </th>
                  <th className="p-3.5 w-64 border-r border-b border-slate-200 text-left pl-4">
                    Check In Address
                  </th>
                  <th className="p-3.5 w-64 border-r border-b border-slate-200 text-left pl-4">
                    Check Out Address
                  </th>
                  <th className="p-3.5 w-64 border-r border-b border-slate-200 text-left pl-4">
                    Remark
                  </th>
                  <th className="p-3.5 w-36 border-r border-b border-slate-200 text-center">
                    Attachment
                  </th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-center">
                    Status
                  </th>
                  <th className="p-3.5 w-36 border-b border-slate-200 text-center">
                    Follow-Up Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reports.map((row) => (
                  <tr
                    key={row.srNo}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-3.5 border-r border-b border-slate-200 text-center font-semibold text-slate-500">
                      {row.srNo}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600">
                      {row.date}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-500 font-semibold">
                      {row.firmId}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">
                      {row.firmName}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600 font-medium">
                      {row.city}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 font-semibold uppercase">
                      {row.firmType}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-center font-medium">
                      {row.employeeCode}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">
                      {row.employeeName}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600">
                      {row.hq}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-500 font-medium">
                      {row.contactNumber}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600">
                      {row.workingWith}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 truncate max-w-xs" title={row.firmAddress}>
                      {row.firmAddress}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-center font-medium">
                      {row.checkIn}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-center font-medium">
                      {row.checkOut}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 truncate max-w-xs" title={row.checkInAddress}>
                      {row.checkInAddress}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 truncate max-w-xs" title={row.checkOutAddress}>
                      {row.checkOutAddress}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600">
                      {row.remark}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-500">
                      {row.attachment}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-emerald-600">
                      {row.status}
                    </td>
                    <td className="p-3.5 border-b border-slate-200 text-center text-slate-500">
                      {row.followUpDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

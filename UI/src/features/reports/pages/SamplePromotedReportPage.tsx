import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SamplePromotedRecord {
  sNo: number;
  name: string;
  quantity: number;
}

const MANAGERS = ["RINKU KAPIL", "AVINASH VERMA"];
const EMPLOYEES = ["Akash Sen", "Amarjeet Singh", "BALRAM PATEL"];

const MOCK_PRODUCT_DATA: Record<string, SamplePromotedRecord[]> = {
  "Akash Sen": [
    { sNo: 1, name: "CLINSA N GEL", quantity: 45 },
    { sNo: 2, name: "Lam kid", quantity: 25 },
    { sNo: 3, name: "Kozan", quantity: 15 },
  ],
  "BALRAM PATEL": [
    { sNo: 1, name: "Lam kid", quantity: 30 },
    { sNo: 2, name: "UV SERA", quantity: 20 },
  ],
};

const MOCK_DOCTOR_DATA: Record<string, SamplePromotedRecord[]> = {
  "Akash Sen": [
    { sNo: 1, name: "Dr. SUNIL NEMA", quantity: 30 },
    { sNo: 2, name: "Dr. ANKIT GUPTA", quantity: 40 },
    { sNo: 3, name: "DR KAMALPREET KAUR", quantity: 15 },
  ],
  "BALRAM PATEL": [
    { sNo: 1, name: "DR KAMALPREET KAUR", quantity: 25 },
    { sNo: 2, name: "Dr. A.K. JAIN", quantity: 25 },
  ],
};

// SVG illustration of shrugging character and monitor, matching the screenshot
const NoRecordFoundIllustration = () => (
  <div className="flex flex-col items-center justify-center py-10 px-4 animate-fade-in bg-white border-t border-slate-200">
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
      <path d="M255 215 C220 215 200 240 180 230" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
      <circle cx="180" cy="230" r="10" fill="#F87171" />

      <path d="M340 215 C375 215 395 240 415 230" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
      <circle cx="415" cy="230" r="10" fill="#F87171" />

      {/* Head */}
      <rect x="278" y="145" width="39" height="50" rx="19" fill="#F87171" />
      <rect x="275" y="140" width="45" height="24" rx="8" fill="#1E293B" />

      {/* Floating Elements */}
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

export function SamplePromotedReportPage() {
  const [filterType, setFilterType] = React.useState<string>("");
  const [targetName, setTargetName] = React.useState<string>("");
  const [reportType, setReportType] = React.useState<string>("");

  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");

  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reportRows, setReportRows] = React.useState<SamplePromotedRecord[]>([]);

  // When filterType changes, reset name dropdown selection
  React.useEffect(() => {
    setTargetName("");
  }, [filterType]);

  const handleApplyFilters = () => {
    if (filterType && filterType !== "Select" && !targetName) {
      toast.error("Please select a manager/employee name!");
      return;
    }
    if (!reportType || reportType === "Select") {
      toast.error("Please select a report type (Product/Doctor wise)!");
      return;
    }
    if (!fromDate || !toDate) {
      toast.error("Please select both From Date and To Date to generate report!");
      return;
    }

    // Filter Logic
    let data: SamplePromotedRecord[] = [];
    if (filterType === "Employee wise" && targetName) {
      if (reportType === "Product wise") {
        data = MOCK_PRODUCT_DATA[targetName] || [];
      } else if (reportType === "Doctor wise") {
        data = MOCK_DOCTOR_DATA[targetName] || [];
      }
    } else {
      // Default empty for manager wise (like RINKU KAPIL in Snapshot 2) or others
      data = [];
    }

    setReportRows(data);
    setHasGenerated(true);
    toast.success("Sample Promoted Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate the report first before exporting!");
      return;
    }

    const nameHeader = reportType === "Doctor wise" ? "Doctor Name" : "Product Name";
    const headers = ["S.NO.", nameHeader, "Total Quantity"];

    const rows = reportRows.map((r) => [r.sNo, `"${r.name}"`, r.quantity]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sample_Promoted_Report_${fromDate || "all"}_to_${toDate || "all"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  const getTargetOptions = () => {
    if (filterType === "Manager wise") return MANAGERS;
    if (filterType === "Employee wise") return EMPLOYEES;
    return [];
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
              Sample Promoted Report
              <span title="Report showing details of sample products promoted against doctors and products.">
                <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* 1st Dropdown (Select Type) */}
          <div className="w-full sm:w-48">
            <UiSelect value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select">Select</SelectItem>
                <SelectItem value="Manager wise">Manager Wise</SelectItem>
                <SelectItem value="Employee wise">Employee wise</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* 2nd Dropdown (Conditional - shown if Manager wise or Employee wise selected) */}
          {filterType && filterType !== "Select" && (
            <div className="w-full sm:w-48 animate-fade-in">
              <UiSelect value={targetName} onValueChange={setTargetName}>
                <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                  <SelectValue placeholder="Select Name" />
                </SelectTrigger>
                <SelectContent>
                  {getTargetOptions().map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </UiSelect>
            </div>
          )}

          {/* 3rd Dropdown (Report Type) */}
          <div className="w-full sm:w-48">
            <UiSelect value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select">Select</SelectItem>
                <SelectItem value="Product wise">Product Wise</SelectItem>
                <SelectItem value="Doctor wise">Doctor Wise</SelectItem>
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

          {/* Action Go Button */}
          <Button
            onClick={handleApplyFilters}
            className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs shadow-xs active:scale-95 transition-transform"
          >
            Go
          </Button>

          {/* Action Export Button */}
          <Button
            onClick={handleExportCSV}
            className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs gap-1 shadow-xs active:scale-95 transition-transform"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
            </svg>
            Export
          </Button>
        </div>
      </div>

      {/* Main Grid Render or Parameter Selection Empty State */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select the parameters to generate report.
        </div>
      ) : reportRows.length === 0 ? (
        /* Empty State with Table Headers and Speech Bubble Illustration */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="overflow-x-auto overflow-y-auto scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[800px]">
              <thead className="bg-slate-50 border-b border-slate-200 select-none text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3 border-r border-slate-200 text-center w-20">S.NO.</th>
                  <th className="p-3 border-r border-slate-200 text-left pl-4 w-2/3">
                    {reportType === "Doctor wise" ? "Doctor Name" : "Product Name"}
                  </th>
                  <th className="p-3 text-center w-40">Total Quantity</th>
                </tr>
              </thead>
            </table>
            <NoRecordFoundIllustration />
          </div>
        </div>
      ) : (
        /* Populated Grid Table */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between select-none">
            <span>Sample Promoted Summary ({reportRows.length} records)</span>
            <span>Promotional material and product detailing statistics</span>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3.5 border-r border-b border-slate-200 text-center w-20">S.NO.</th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-2/3">
                    {reportType === "Doctor wise" ? "Doctor Name" : "Product Name"}
                  </th>
                  <th className="p-3.5 border-b border-slate-200 text-center w-40">Total Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reportRows.map((row) => (
                  <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-500 font-semibold">{row.sNo}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.name}</td>
                    <td className="p-3.5 border-b border-slate-200 text-center font-bold text-[#008272]">{row.quantity}</td>
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

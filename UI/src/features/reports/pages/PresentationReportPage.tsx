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

export interface PresentationRecord {
  sNo: number;
  doctorName: string;
  date: string;
  presentation: string;
}

const MOCK_PRESENTATION_DATA: Record<string, PresentationRecord[]> = {
  "Akash Sen": [
    {
      sNo: 1,
      doctorName: "Dr. SUNIL NEMA",
      date: "11/06/2026",
      presentation: "Lam kid & Kozan PDF detailing (3 mins)",
    },
    {
      sNo: 2,
      doctorName: "Dr. ANKIT GUPTA",
      date: "11/06/2026",
      presentation: "CLINSA N GEL presentation (5 mins)",
    },
  ],
  "BALRAM PATEL": [
    {
      sNo: 1,
      doctorName: "DR KAMALPREET KAUR",
      date: "10/06/2026",
      presentation: "UV SERA Video demo (4 mins)",
    },
    {
      sNo: 2,
      doctorName: "Dr. A.K. JAIN",
      date: "09/06/2026",
      presentation: "Neroteq Max slides (6 mins)",
    },
  ],
};

const EMPLOYEES = ["AAKIB KHAN", "Akash Sen", "Amarjeet Singh", "BALRAM PATEL"];

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

export function PresentationReportPage() {
  const [employee, setEmployee] = React.useState<string>("");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");

  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reportRows, setReportRows] = React.useState<PresentationRecord[]>([]);

  const handleApplyFilters = () => {
    if (!employee) {
      toast.error("Please select an employee first!");
      return;
    }
    if (!fromDate || !toDate) {
      toast.error("Please select both From Date and To Date to generate report!");
      return;
    }

    // Load mock data if it exists for the employee, else set empty list for empty state
    const data = MOCK_PRESENTATION_DATA[employee] || [];
    setReportRows(data);
    setHasGenerated(true);
    toast.success("Presentation Report generated successfully!");
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
              Presentation Report
              <span title="A report showing presentation details of employees against doctors during a period.">
                <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Employee Dropdown */}
          <div className="w-full sm:w-64">
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEES.map((emp) => (
                  <SelectItem key={emp} value={emp}>
                    {emp}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* From Date */}
          <div className="w-full sm:w-44">
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
          <div className="w-full sm:w-44">
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

          {/* Action GO Button */}
          <Button
            onClick={handleApplyFilters}
            className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-5 font-bold text-xs shadow-xs active:scale-95 transition-transform"
          >
            GO
          </Button>
        </div>
      </div>

      {/* Main Grid Render or Parameter Selection Empty State */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select parameters to generate report.
        </div>
      ) : reportRows.length === 0 ? (
        /* Empty State with Table Headers and Speech Bubble Illustration (Snapshot 2) */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="overflow-x-auto overflow-y-auto scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[800px]">
              <thead className="bg-slate-50 border-b border-slate-200 select-none text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3 border-r border-slate-200 text-left pl-4 w-1/3">DOCTOR</th>
                  <th className="p-3 border-r border-slate-200 text-center w-1/4">DATE</th>
                  <th className="p-3 text-left pl-4">Presentation</th>
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
            <span>Presentation Log Summary ({reportRows.length} records)</span>
            <span className="text-slate-400">Representative detailing materials presented</span>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-1/3">DOCTOR</th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-center w-1/4">DATE</th>
                  <th className="p-3.5 border-b border-slate-200 text-left pl-4">Presentation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reportRows.map((row) => (
                  <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">
                      {row.doctorName}
                    </td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600">
                      {row.date}
                    </td>
                    <td className="p-3.5 border-b border-slate-200 text-left pl-4 text-slate-700 font-medium">
                      {row.presentation}
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

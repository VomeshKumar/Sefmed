import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Info, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface SampleRecord {
  sNo: number;
  employeeName: string;
  doctorName: string;
  date: string;
  samples: { [product: string]: number };
}

const AVAILABLE_EMPLOYEES = ["AAKIB KHAN", "Amarjeet Singh", "BALRAM PATEL", "RINKU KAPIL"];

const PRODUCT_COLUMNS = [
  "CLINSA N GEL", "Kozan", "Lam kid", "LS 1", "LZQ", "Neroteq Max", "Q-Itra 100", 
  "Q-Itra 200(NEW)", "Qlob", "Qlob C", "Stop X", "T Lob", "Teq Dx", "TEQ GLOW FM", 
  "TEQ GLOW FW", "Teqcit 5", "Teqcit 10", "Teqmite 50", "Teqsone", "Tresta 10", 
  "Tresta 20", "UV SERA", "Hair Eva", "QBILL", "TRANZAC", "QPENZ", "HS6", 
  "BENMELO", "CLINSA A", "HYZA-10", "HYZA-25", "JORTA-6", "JORTA-12", "QBILL-M"
];

const MOCK_SAMPLE_DATA: SampleRecord[] = [
  {
    sNo: 1,
    employeeName: "Amarjeet Singh",
    doctorName: "SUNIL NEMA",
    date: "11/06/2026",
    samples: {
      "CLINSA N GEL": 5,
      "Lam kid": 10,
      "Q-Itra 100": 3,
      "TEQ GLOW FW": 8,
      "Tresta 10": 2,
    },
  },
  {
    sNo: 2,
    employeeName: "Amarjeet Singh",
    doctorName: "ANKIT GUPTA",
    date: "11/06/2026",
    samples: {
      "Kozan": 4,
      "LS 1": 6,
      "Qlob C": 12,
      "Teq Dx": 5,
      "Tresta 20": 4,
    },
  },
  {
    sNo: 3,
    employeeName: "BALRAM PATEL",
    doctorName: "DR KAMALPREET KAUR",
    date: "10/06/2026",
    samples: {
      "CLINSA N GEL": 10,
      "Kozan": 2,
      "LZQ": 8,
      "Stop X": 5,
      "UV SERA": 6,
    },
  },
  {
    sNo: 4,
    employeeName: "BALRAM PATEL",
    doctorName: "BALRAM PATEL",
    date: "09/06/2026",
    samples: {
      "Neroteq Max": 4,
      "Q-Itra 200(NEW)": 15,
      "Qlob": 10,
      "TEQ GLOW FM": 5,
      "QBILL-M": 3,
    },
  },
];

// SVG illustration of shrugging character and monitor, matching the screenshot
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

export function SampleDistributionReportPage() {
  const [selectedEmployees, setSelectedEmployees] = React.useState<string[]>([]);
  const [employeeSearch, setEmployeeSearch] = React.useState("");
  const [isEmployeeOpen, setIsEmployeeOpen] = React.useState(false);
  const employeeRef = React.useRef<HTMLDivElement>(null);

  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");

  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reportRows, setReportRows] = React.useState<SampleRecord[]>([]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (employeeRef.current && !employeeRef.current.contains(event.target as Node)) {
        setIsEmployeeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleApplyFilters = () => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee to generate report.");
      return;
    }

    // Filter mock data by selected employees
    // If selecting AAKIB KHAN, it yields 0 records to match Snapshot 2 ("No Record! Found")
    const filtered = MOCK_SAMPLE_DATA.filter((row) =>
      selectedEmployees.some((emp) => emp.toLowerCase() === row.employeeName.toLowerCase())
    );

    // Adjust S.No dynamically
    const adjusted = filtered.map((row, idx) => ({
      ...row,
      sNo: idx + 1,
    }));

    setReportRows(adjusted);
    setHasGenerated(true);
    toast.success("Sample Distribution Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate the report first before exporting!");
      return;
    }

    const headers = ["S.No.", "Employee Name", "Doctor Name", "Date", ...PRODUCT_COLUMNS];

    const rows = reportRows.map((r) => [
      r.sNo,
      `"${r.employeeName}"`,
      `"${r.doctorName}"`,
      `"${r.date}"`,
      ...PRODUCT_COLUMNS.map((p) => r.samples[p] || ""),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sample_Distribution_Report_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  const removeEmployeeTag = (emp: string) => {
    setSelectedEmployees((prev) => prev.filter((item) => item !== emp));
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
              Sample Distribution Report
              <span title="A report showing sample distribution by employee to the doctors during a period.">
                <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Employee Tag Input */}
          <div className="w-full sm:w-64 relative" ref={employeeRef}>
            <div
              className="flex items-center flex-wrap gap-1 p-1 border rounded-lg border-slate-200 bg-slate-50 min-h-[36px] max-h-[72px] overflow-y-auto cursor-text text-xs"
              onClick={() => setIsEmployeeOpen(true)}
            >
              {selectedEmployees.length === 0 && (
                <span className="text-slate-400 pl-1.5 py-0.5">Select Employee</span>
              )}
              {selectedEmployees.map((emp) => (
                <span
                  key={emp}
                  className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[11px] px-1.5 py-0.5 rounded text-slate-700 font-medium"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEmployeeTag(emp);
                    }}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                  {emp}
                </span>
              ))}
              <input
                type="text"
                value={employeeSearch}
                onChange={(e) => {
                  setEmployeeSearch(e.target.value);
                  setIsEmployeeOpen(true);
                }}
                onFocus={() => setIsEmployeeOpen(true)}
                className="bg-transparent border-none outline-none text-xs flex-1 ml-1 min-w-[50px] h-5"
              />
            </div>
            {isEmployeeOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50 text-xs py-1">
                {AVAILABLE_EMPLOYEES.filter(
                  (emp) =>
                    emp.toLowerCase().includes(employeeSearch.toLowerCase()) &&
                    !selectedEmployees.includes(emp)
                ).map((emp) => (
                  <button
                    key={emp}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedEmployees([...selectedEmployees, emp]);
                      setEmployeeSearch("");
                      setIsEmployeeOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    {emp}
                  </button>
                ))}
              </div>
            )}
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
          Please select the parameters to generate report.
        </div>
      ) : reportRows.length === 0 ? (
        /* Empty state: No Record! Found illustration */
        <div className="animate-fade-in space-y-4">
          {/* We show the scrollable grid with headers containing the illustration inside its body as shown in Snapshot 2 */}
          <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1">
            <div className="overflow-x-auto overflow-y-auto scrollbar-thin">
              <table className="w-full text-center border-collapse min-w-[2800px]">
                <thead className="bg-slate-50 border-b border-slate-200 select-none text-xs font-bold text-slate-600 uppercase">
                  <tr>
                    <th className="p-3 border-r border-b border-slate-200 text-center w-20 min-w-[80px]">S.No.</th>
                    <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-44 min-w-[176px]">Employee Name</th>
                    <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-48 min-w-[192px]">Doctor Name</th>
                    <th className="p-3 border-r border-b border-slate-200 text-center w-32 min-w-[128px]">Date</th>
                    {PRODUCT_COLUMNS.map((p) => (
                      <th key={p} className="p-3 border-r border-b border-slate-200 text-center font-bold text-slate-600 normal-case min-w-[110px] text-[11px]">
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
              <NoRecordFoundIllustration />
            </div>
          </div>
        </div>
      ) : (
        /* Horizontally Scrollable Data Table */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
            <span>Sample Distribution Log Summary ({reportRows.length} records)</span>
            <span className="text-slate-400">Scroll horizontally to view all fields</span>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[2800px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-20 min-w-[80px]">S.No.</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-44 min-w-[176px]">Employee Name</th>
                  <th className="p-3 border-r border-b border-slate-200 text-left pl-4 w-48 min-w-[192px]">Doctor Name</th>
                  <th className="p-3 border-r border-b border-slate-200 text-center w-32 min-w-[128px]">Date</th>
                  {PRODUCT_COLUMNS.map((p) => (
                    <th key={p} className="p-3 border-r border-b border-slate-200 text-center font-bold text-slate-600 normal-case min-w-[110px] text-[11px]">
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reportRows.map((row) => (
                  <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 border-r border-b border-slate-200 text-center font-semibold text-slate-500">{row.sNo}</td>
                    <td className="p-3 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.employeeName}</td>
                    <td className="p-3 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.doctorName}</td>
                    <td className="p-3 border-r border-b border-slate-200 text-center text-slate-600">{row.date}</td>
                    {PRODUCT_COLUMNS.map((p) => {
                      const qty = row.samples[p];
                      return (
                        <td key={p} className="p-3 border-r border-b border-slate-200 text-center font-medium text-slate-700">
                          {qty !== undefined ? qty : "-"}
                        </td>
                      );
                    })}
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

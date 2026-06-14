import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Info, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SampleQtyDetails {
  opening: number;
  distributed: number;
  closing: number;
}

export interface SampleReportRecord {
  sNo: number;
  employeeName: string;
  doctorName: string;
  date: string;
  samples: { [product: string]: SampleQtyDetails };
}

const ZONES = [
  "Bihar",
  "Chhattisgarh",
  "Jharkhand",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Uttarpradesh"
];

const STATUS_OPTIONS = ["Active", "Inactive"];

const ACTIVE_EMPLOYEES = ["RINKU KAPIL", "Amarjeet Singh", "BALRAM PATEL", "AJAY TIWARI", "GAGAN KAPIL"];
const INACTIVE_EMPLOYEES = ["Ajeet kumar Sahu", "Akash Sen", "VINOD SHARMA"];

const PRODUCT_COLUMNS = [
  "CLINSA N GEL", "Kozan", "Lam kid", "LS 1", "LZQ", "Neroteq Max", "Q-Itra 100", 
  "Q-Itra 200(NEW)", "Qlob", "Qlob C", "Stop X", "T Lob", "Teq Dx", "TEQ GLOW FM", 
  "TEQ GLOW FW", "Teqcit 5", "Teqcit 10", "Teqmite 50", "Teqsone", "Tresta 10", 
  "Tresta 20", "UV SERA", "Hair Eva", "QBILL", "TRANZAC", "QPENZ", "HS6", 
  "BENMELO", "CLINSA A", "HYZA-10", "HYZA-25", "JORTA-6", "JORTA-12", "QBIL-M"
];

// Mock data for Amarjeet Singh
const MOCK_ACTIVE_RECORDS: SampleReportRecord[] = [
  {
    sNo: 1,
    employeeName: "Amarjeet Singh",
    doctorName: "DR. SUNIL NEMA",
    date: "05/06/2026",
    samples: {
      "CLINSA N GEL": { opening: 20, distributed: 5, closing: 15 },
      "Lam kid": { opening: 10, distributed: 2, closing: 8 },
      "LS 1": { opening: 8, distributed: 1, closing: 7 }
    }
  },
  {
    sNo: 2,
    employeeName: "Amarjeet Singh",
    doctorName: "DR. ANKIT GUPTA",
    date: "08/06/2026",
    samples: {
      "Kozan": { opening: 12, distributed: 4, closing: 8 },
      "LZQ": { opening: 15, distributed: 3, closing: 12 },
      "Neroteq Max": { opening: 6, distributed: 2, closing: 4 }
    }
  },
  {
    sNo: 3,
    employeeName: "Amarjeet Singh",
    doctorName: "DR. KAMALPREET KAUR",
    date: "11/06/2026",
    samples: {
      "Q-Itra 100": { opening: 25, distributed: 5, closing: 20 },
      "TEQ GLOW FM": { opening: 18, distributed: 6, closing: 12 },
      "Teqsone": { opening: 14, distributed: 4, closing: 10 }
    }
  }
];

const NoRecordFoundIllustration = () => (
  <div className="flex flex-col items-center justify-center py-10 px-4 bg-white border border-slate-100 rounded-xl shadow-xs">
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

export function SampleDistributionWithOpeningAndClosingQtyPage() {
  const [zone, setZone] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [employee, setEmployee] = React.useState<string>("");
  const [fromDate, setFromDate] = React.useState<string>("");
  const [toDate, setToDate] = React.useState<string>("");
  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reportRows, setReportRows] = React.useState<SampleReportRecord[]>([]);

  // Dynamically filter employee list based on active/inactive status selection
  const filteredEmployees = React.useMemo(() => {
    if (status === "Active") {
      return ACTIVE_EMPLOYEES;
    }
    if (status === "Inactive") {
      return INACTIVE_EMPLOYEES;
    }
    return [...ACTIVE_EMPLOYEES, ...INACTIVE_EMPLOYEES];
  }, [status]);

  // Reset employee when status changes
  React.useEffect(() => {
    setEmployee("");
  }, [status]);

  const handleGenerate = () => {
    if (!zone) {
      toast.error("Please select a Zone!");
      return;
    }
    if (!status) {
      toast.error("Please select a Status!");
      return;
    }
    if (!employee || employee === "none") {
      toast.error("Please select an Employee!");
      return;
    }
    if (!fromDate) {
      toast.error("Please select From Date!");
      return;
    }
    if (!toDate) {
      toast.error("Please select To Date!");
      return;
    }

    // Load active records only for Amarjeet Singh, others show empty table with illustration
    if (employee === "Amarjeet Singh") {
      // format dates nicely to display in the mock records
      const formattedDate = (dStr: string) => {
        try {
          const parts = dStr.split("-");
          if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
        } catch {}
        return dStr;
      };
      setReportRows(MOCK_ACTIVE_RECORDS.map((r) => ({
        ...r,
        date: formattedDate(fromDate)
      })));
    } else {
      setReportRows([]);
    }

    setHasGenerated(true);
    toast.success("Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate report first!");
      return;
    }

    const headers = ["S.No.", "Employee Name", "Doctor Name", "Date"];
    PRODUCT_COLUMNS.forEach((p) => {
      headers.push(`${p} (Op)`, `${p} (Dist)`, `${p} (Cl)`);
    });

    const csvRows = [headers.join(",")];

    if (reportRows.length === 0) {
      csvRows.push("No Record Found.");
    } else {
      reportRows.forEach((r) => {
        const row = [r.sNo, `"${r.employeeName}"`, `"${r.doctorName}"`, `"${r.date}"`];
        PRODUCT_COLUMNS.forEach((p) => {
          const details = r.samples[p];
          if (details) {
            row.push(details.opening, details.distributed, details.closing);
          } else {
            row.push("", "", "");
          }
        });
        csvRows.push(row.join(","));
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sample_Distribution_Opening_Closing_Report_${fromDate}_to_${toDate}.csv`);
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
              Sample Distribution Report With Opening And Closing Quantity
              <span title="Report showing product sample opening stock, distributed quantities, and closing balances.">
                <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
              </span>
            </h1>
          </div>
        </div>
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

          {/* Select Status */}
          <div className="w-full sm:w-44">
            <UiSelect value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                {STATUS_OPTIONS.map((st) => (
                  <SelectItem key={st} value={st}>
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Employee */}
          <div className="w-full sm:w-44">
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select Employee</SelectItem>
                {filteredEmployees.map((emp) => (
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
              <Download className="h-3.5 w-3.5" /> Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid Render or Placeholder selection */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select the parameters to generate report.
        </div>
      ) : (
        /* Horizontally scrollable spreadsheet layout */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[3600px]">
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
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reportRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4 + PRODUCT_COLUMNS.length}
                      className="p-0 border-b border-slate-200"
                    >
                      <div className="sticky left-0 w-full max-w-[85vw] md:max-w-[calc(100vw-280px)] flex justify-center py-4 bg-white">
                        <NoRecordFoundIllustration />
                      </div>
                    </td>
                  </tr>
                ) : (
                  reportRows.map((row) => (
                    <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 border-r border-b border-slate-200 text-slate-500 font-semibold text-center">{row.sNo}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.employeeName}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.doctorName}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-semibold">{row.date}</td>
                      
                      {PRODUCT_COLUMNS.map((p) => {
                        const qty = row.samples[p];
                        if (!qty) {
                          return (
                            <td key={p} className="p-3.5 border-r border-b border-slate-200 text-center font-medium text-slate-400">
                              -
                            </td>
                          );
                        }
                        return (
                          <td key={p} className="p-3.5 border-r border-b border-slate-200 text-center">
                            <div className="flex flex-col text-[10px] space-y-0.5 text-left border p-1.5 rounded bg-slate-50 border-slate-200 min-w-[85px] shadow-2xs">
                              <div className="flex justify-between text-slate-500 font-medium">
                                <span>Op:</span>
                                <span className="font-bold text-slate-700">{qty.opening}</span>
                              </div>
                              <div className="flex justify-between text-slate-500 font-medium">
                                <span>Dist:</span>
                                <span className="font-bold text-[#008272]">{qty.distributed}</span>
                              </div>
                              <div className="flex justify-between text-slate-500 font-medium border-t pt-0.5 mt-0.5 border-slate-200">
                                <span>Cl:</span>
                                <span className="font-bold text-slate-700">{qty.closing}</span>
                              </div>
                            </div>
                          </td>
                        );
                      })}
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

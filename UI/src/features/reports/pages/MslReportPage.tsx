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

export interface MonthlyRecord {
  visit: number;
  pob: number;
}

export interface MslRow {
  sNo: number;
  drCode: string;
  doctorName: string;
  drCategory: string;
  drSpeciality: string;
  businessSlab: string;
  employeeName: string;
  employeeDesignation: string;
  zone: string;
  monthlyData: { [month: string]: MonthlyRecord };
}

const AVAILABLE_ZONES = ["Chhattisgarh", "Maharashtra", "Madhya Pradesh", "Gujarat", "Delhi"];
const AVAILABLE_YEARS = ["2026", "2025", "2024"];

const MOCK_MSL_DATA: MslRow[] = [
  {
    sNo: 1,
    drCode: "DR-001",
    doctorName: "BALRAM PATEL",
    drCategory: "A",
    drSpeciality: "GP",
    businessSlab: "Super Core",
    employeeName: "Akash Sen",
    employeeDesignation: "MR",
    zone: "Chhattisgarh",
    monthlyData: {
      Jan: { visit: 3, pob: 0 },
      Feb: { visit: 2, pob: 0 },
      Mar: { visit: 4, pob: 500 },
      Apr: { visit: 3, pob: 0 },
      May: { visit: 3, pob: 200 },
      Jun: { visit: 2, pob: 0 },
      Jul: { visit: 3, pob: 100 },
      Aug: { visit: 2, pob: 0 },
      Sep: { visit: 3, pob: 0 },
      Oct: { visit: 4, pob: 300 },
      Nov: { visit: 3, pob: 0 },
      Dec: { visit: 2, pob: 0 },
    },
  },
  {
    sNo: 2,
    drCode: "DR-002",
    doctorName: "SUNIL NEMA",
    drCategory: "A+",
    drSpeciality: "ENTSP",
    businessSlab: "Core",
    employeeName: "Akash Sen",
    employeeDesignation: "MR",
    zone: "Chhattisgarh",
    monthlyData: {
      Jan: { visit: 2, pob: 1000 },
      Feb: { visit: 1, pob: 0 },
      Mar: { visit: 3, pob: 1200 },
      Apr: { visit: 2, pob: 500 },
      May: { visit: 2, pob: 0 },
      Jun: { visit: 3, pob: 800 },
      Jul: { visit: 1, pob: 0 },
      Aug: { visit: 2, pob: 300 },
      Sep: { visit: 2, pob: 0 },
      Oct: { visit: 3, pob: 600 },
      Nov: { visit: 2, pob: 0 },
      Dec: { visit: 3, pob: 1500 },
    },
  },
  {
    sNo: 3,
    drCode: "DR-003",
    doctorName: "ANKIT GUPTA",
    drCategory: "B",
    drSpeciality: "DERMA",
    businessSlab: "Important",
    employeeName: "Akash Sen",
    employeeDesignation: "MR",
    zone: "Chhattisgarh",
    monthlyData: {
      Jan: { visit: 1, pob: 0 },
      Feb: { visit: 2, pob: 400 },
      Mar: { visit: 1, pob: 0 },
      Apr: { visit: 2, pob: 300 },
      May: { visit: 1, pob: 0 },
      Jun: { visit: 2, pob: 500 },
      Jul: { visit: 1, pob: 0 },
      Aug: { visit: 1, pob: 200 },
      Sep: { visit: 2, pob: 0 },
      Oct: { visit: 2, pob: 400 },
      Nov: { visit: 1, pob: 0 },
      Dec: { visit: 2, pob: 800 },
    },
  },
  {
    sNo: 4,
    drCode: "DR-004",
    doctorName: "DR KAMALPREET KAUR",
    drCategory: "C",
    drSpeciality: "DERMA",
    businessSlab: "MVC",
    employeeName: "Akash Sen",
    employeeDesignation: "MR",
    zone: "Chhattisgarh",
    monthlyData: {
      Jan: { visit: 2, pob: 300 },
      Feb: { visit: 2, pob: 0 },
      Mar: { visit: 1, pob: 100 },
      Apr: { visit: 3, pob: 0 },
      May: { visit: 2, pob: 400 },
      Jun: { visit: 1, pob: 0 },
      Jul: { visit: 2, pob: 200 },
      Aug: { visit: 3, pob: 0 },
      Sep: { visit: 1, pob: 0 },
      Oct: { visit: 2, pob: 300 },
      Nov: { visit: 2, pob: 0 },
      Dec: { visit: 1, pob: 100 },
    },
  },
  {
    sNo: 5,
    drCode: "DR-005",
    doctorName: "RAJESH SHARMA",
    drCategory: "A",
    drSpeciality: "CARDIO",
    businessSlab: "Super Core",
    employeeName: "Vipul Jain",
    employeeDesignation: "ASM",
    zone: "Maharashtra",
    monthlyData: {
      Jan: { visit: 4, pob: 1500 },
      Feb: { visit: 3, pob: 2000 },
      Mar: { visit: 4, pob: 1800 },
      Apr: { visit: 2, pob: 0 },
      May: { visit: 3, pob: 1000 },
      Jun: { visit: 3, pob: 1200 },
      Jul: { visit: 4, pob: 500 },
      Aug: { visit: 2, pob: 0 },
      Sep: { visit: 3, pob: 800 },
      Oct: { visit: 4, pob: 1500 },
      Nov: { visit: 3, pob: 0 },
      Dec: { visit: 4, pob: 2200 },
    },
  },
  {
    sNo: 6,
    drCode: "DR-006",
    doctorName: "SURESH VERMA",
    drCategory: "B",
    drSpeciality: "PEDIA",
    businessSlab: "Important",
    employeeName: "Vipul Jain",
    employeeDesignation: "ASM",
    zone: "Maharashtra",
    monthlyData: {
      Jan: { visit: 2, pob: 0 },
      Feb: { visit: 1, pob: 500 },
      Mar: { visit: 2, pob: 300 },
      Apr: { visit: 2, pob: 0 },
      May: { visit: 1, pob: 200 },
      Jun: { visit: 2, pob: 0 },
      Jul: { visit: 2, pob: 600 },
      Aug: { visit: 1, pob: 0 },
      Sep: { visit: 2, pob: 400 },
      Oct: { visit: 2, pob: 0 },
      Nov: { visit: 1, pob: 100 },
      Dec: { visit: 2, pob: 300 },
    },
  },
  {
    sNo: 7,
    drCode: "DR-007",
    doctorName: "AMIT PATEL",
    drCategory: "A",
    drSpeciality: "GP",
    businessSlab: "Core",
    employeeName: "Nilesh Gohil",
    employeeDesignation: "MR",
    zone: "Gujarat",
    monthlyData: {
      Jan: { visit: 3, pob: 800 },
      Feb: { visit: 2, pob: 600 },
      Mar: { visit: 3, pob: 1000 },
      Apr: { visit: 3, pob: 400 },
      May: { visit: 2, pob: 500 },
      Jun: { visit: 3, pob: 1200 },
      Jul: { visit: 2, pob: 300 },
      Aug: { visit: 3, pob: 900 },
      Sep: { visit: 2, pob: 0 },
      Oct: { visit: 3, pob: 1500 },
      Nov: { visit: 2, pob: 400 },
      Dec: { visit: 3, pob: 1100 },
    },
  },
];

const MONTHS_KEYS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MslReportPage() {
  const [selectedZones, setSelectedZones] = React.useState<string[]>([]);
  const [selectedYear, setSelectedYear] = React.useState("2026");
  const [zoneSearch, setZoneSearch] = React.useState("");
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const zoneRef = React.useRef<HTMLDivElement>(null);

  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reportRows, setReportRows] = React.useState<MslRow[]>([]);

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
    if (selectedZones.length === 0) {
      toast.error("Please select at least one zone to generate report.");
      return;
    }

    // Filter mock data by selected zones
    const filtered = MOCK_MSL_DATA.filter((row) =>
      selectedZones.some((zone) => zone.toLowerCase() === row.zone.toLowerCase())
    );

    // Adjust S.No. dynamically based on filtered result
    const adjusted = filtered.map((row, idx) => ({
      ...row,
      sNo: idx + 1,
    }));

    setReportRows(adjusted);
    setHasGenerated(true);
    toast.success("MSL Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate the report first before exporting!");
      return;
    }

    const headers = [
      "S.No",
      "Dr.Code",
      "Doctor Name",
      "Dr.Category",
      "Dr.Speciality",
      "Business Slab",
      "Employee Name",
      "Employee Designation",
      "Zone",
      ...MONTHS_KEYS.flatMap((m) => [`${m}-${selectedYear} Visit`, `${m}-${selectedYear} POB`]),
    ];

    const rows = reportRows.map((r) => [
      r.sNo,
      `"${r.drCode}"`,
      `"${r.doctorName}"`,
      `"${r.drCategory}"`,
      `"${r.drSpeciality}"`,
      `"${r.businessSlab}"`,
      `"${r.employeeName}"`,
      `"${r.employeeDesignation}"`,
      `"${r.zone}"`,
      ...MONTHS_KEYS.flatMap((m) => {
        const val = r.monthlyData[m] || { visit: 0, pob: 0 };
        return [val.visit, val.pob];
      }),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MSL_Report_${selectedYear}_${selectedZones.join("_")}.csv`);
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
              MSL Report
              <span title="Report showing compliance of representative (visits to employees) for all assigned doctors.">
                <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Zone Tag Input */}
          <div className="w-full sm:w-64 relative" ref={zoneRef}>
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

          {/* Select Year */}
          <div className="w-full sm:w-32">
            <UiSelect value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
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
          Please select the zone to generate report.
        </div>
      ) : (
        /* Horizontally Scrollable 33-Column Grid Container */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
            <span>MSL Report Log Summary ({reportRows.length} records)</span>
            <span className="text-slate-400">Scroll horizontally to view all fields</span>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[2200px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                {/* Row 1 Headers */}
                <tr>
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 text-center w-16 min-w-[64px]">S.No</th>
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 text-center w-24 min-w-[96px]">Dr.Code</th>
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 text-left pl-4 w-48 min-w-[192px]">Doctor Name</th>
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 text-center w-28 min-w-[112px]">Dr.Category</th>
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 text-left pl-4 w-32 min-w-[128px]">Dr.Speciality</th>
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 text-left pl-4 w-32 min-w-[128px]">Business Slab</th>
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 text-left pl-4 w-44 min-w-[176px]">Employee Name</th>
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 text-left pl-4 w-44 min-w-[176px]">Employee Designation</th>
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 text-center w-32 min-w-[128px]">Zone</th>
                  {MONTHS_KEYS.map((m) => (
                    <th key={m} colSpan={2} className="p-2 border-r border-b border-slate-200 text-center">
                      {m}-{selectedYear}
                    </th>
                  ))}
                </tr>
                {/* Row 2 Headers */}
                <tr>
                  {MONTHS_KEYS.map((m) => (
                    <React.Fragment key={`${m}-sub`}>
                      <th className="p-2 border-r border-b border-slate-200 text-center w-16 min-w-[64px] font-semibold text-slate-500 lowercase bg-slate-100/50">Visit</th>
                      <th className="p-2 border-r border-b border-slate-200 text-center w-16 min-w-[64px] font-semibold text-slate-500 lowercase bg-slate-100/50">POB</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reportRows.length === 0 ? (
                  <tr>
                    <td colSpan={33} className="p-10 text-center text-slate-400 font-semibold">No Records Found</td>
                  </tr>
                ) : (
                  reportRows.map((row) => (
                    <tr key={row.drCode} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 border-r border-b border-slate-200 text-center font-semibold text-slate-500">{row.sNo}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center font-semibold text-slate-600">{row.drCode}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.doctorName}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.drCategory}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-500 uppercase">{row.drSpeciality}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.businessSlab}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-700">{row.employeeName}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 text-slate-500">{row.employeeDesignation}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-center text-slate-600">{row.zone}</td>
                      {MONTHS_KEYS.map((m) => {
                        const cell = row.monthlyData[m] || { visit: 0, pob: 0 };
                        return (
                          <React.Fragment key={`${row.drCode}-${m}`}>
                            <td className="p-2 border-r border-b border-slate-200 text-center font-medium text-slate-800 bg-slate-50/20">{cell.visit}</td>
                            <td className="p-2 border-r border-b border-slate-200 text-center font-medium text-slate-800 bg-slate-50/20">{cell.pob}</td>
                          </React.Fragment>
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

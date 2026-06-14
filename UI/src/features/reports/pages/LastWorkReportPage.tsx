import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Info, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface LastWorkRecord {
  sNo: number;
  hq: string;
  name: string;
  designation: string;
  lastWorkDate: string;
  placeOfWork: string;
  leaveDate: string;
  other: string;
  workedWith: string;
  callsCount: number;
  zone: string;
}

const AVAILABLE_ZONES = ["Bhopal", "Raipur", "Durg", "Jabalpur", "Bhubaneswar", "Balaghat", "Bilaspur"];

const MOCK_LAST_WORK_DATA: LastWorkRecord[] = [
  {
    sNo: 1,
    hq: "Bhopal",
    name: "Aashish Malviya",
    designation: "MR",
    lastWorkDate: "12 Jun 2026",
    placeOfWork: "Bhopal",
    leaveDate: "---",
    other: "HQ",
    workedWith: "-",
    callsCount: 90,
    zone: "Bhopal",
  },
  {
    sNo: 2,
    hq: "Raipur",
    name: "Akash Sen",
    designation: "MR",
    lastWorkDate: "12 Jun 2026",
    placeOfWork: "Bhatgaon",
    leaveDate: "---",
    other: "Out-station",
    workedWith: "RITESH KUMAR SINHA",
    callsCount: 83,
    zone: "Raipur",
  },
  {
    sNo: 3,
    hq: "Durg",
    name: "Amarjeet Singh",
    designation: "MR",
    lastWorkDate: "11 Jun 2026",
    placeOfWork: "ARJUNDA",
    leaveDate: "---",
    other: "Ex-station",
    workedWith: "-",
    callsCount: 68,
    zone: "Durg",
  },
  {
    sNo: 4,
    hq: "Jabalpur",
    name: "Aniket patel",
    designation: "ASM",
    lastWorkDate: "12 Jun 2026",
    placeOfWork: "Jabalpur",
    leaveDate: "---",
    other: "HQ",
    workedWith: "-",
    callsCount: 66,
    zone: "Jabalpur",
  },
  {
    sNo: 5,
    hq: "Bhubaneswar",
    name: "Anil Kumar Acharya",
    designation: "MR",
    lastWorkDate: "12 Jun 2026",
    placeOfWork: "Bhubaneswar",
    leaveDate: "---",
    other: "HQ",
    workedWith: "-",
    callsCount: 77,
    zone: "Bhubaneswar",
  },
  {
    sNo: 6,
    hq: "Balaghat",
    name: "ANUJ PATEL",
    designation: "MR",
    lastWorkDate: "12 Jun 2026",
    placeOfWork: "Chhindwara",
    leaveDate: "---",
    other: "Out-station",
    workedWith: "NITIN SHUKLA",
    callsCount: 9,
    zone: "Balaghat",
  },
  {
    sNo: 7,
    hq: "Bilaspur",
    name: "AVINASH VERMA",
    designation: "RSM",
    lastWorkDate: "12 Jun 2026",
    placeOfWork: "Durg,Bhilai",
    leaveDate: "---",
    other: "Ex-station",
    workedWith: "-",
    callsCount: 56,
    zone: "Bilaspur",
  },
  {
    sNo: 8,
    hq: "Bilaspur",
    name: "BALRAM PATEL",
    designation: "MR",
    lastWorkDate: "12 Jun 2026",
    placeOfWork: "Champa",
    leaveDate: "---",
    other: "Ex-station",
    workedWith: "-",
    callsCount: 80,
    zone: "Bilaspur",
  },
];

export function LastWorkReportPage() {
  const [selectedZones, setSelectedZones] = React.useState<string[]>([]);
  const [zoneSearch, setZoneSearch] = React.useState("");
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const zoneRef = React.useRef<HTMLDivElement>(null);

  const [reportRows, setReportRows] = React.useState<LastWorkRecord[]>(MOCK_LAST_WORK_DATA);

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
    // Filter mock data by selected zones if any are selected
    if (selectedZones.length === 0) {
      setReportRows(MOCK_LAST_WORK_DATA);
      toast.success("Loaded all zone records!");
      return;
    }

    const filtered = MOCK_LAST_WORK_DATA.filter((row) =>
      selectedZones.some((zone) => zone.toLowerCase() === row.zone.toLowerCase())
    );

    // Adjust S.No dynamically
    const adjusted = filtered.map((row, idx) => ({
      ...row,
      sNo: idx + 1,
    }));

    setReportRows(adjusted);
    toast.success("Filters applied successfully!");
  };

  const handleExportCSV = () => {
    const headers = [
      "HQ",
      "NAME",
      "DESIGNATION",
      "LAST WORK DATE",
      "PLACE OF WORK",
      "LEAVE DATE",
      "OTHER",
      "WORKED WITH",
      "NO.OF CALLS (till date)",
    ];

    const rows = reportRows.map((r) => [
      `"${r.hq}"`,
      `"${r.name}"`,
      `"${r.designation}"`,
      `"${r.lastWorkDate}"`,
      `"${r.placeOfWork}"`,
      `"${r.leaveDate}"`,
      `"${r.other}"`,
      `"${r.workedWith}"`,
      r.callsCount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Last_Work_Report_${selectedZones.join("_") || "all"}.csv`);
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
              Last Work Report
              <span title="Report showing details of employees' last work days and call summaries.">
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
                <span className="text-slate-400 pl-1.5 py-0.5">Select All Zones</span>
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

      {/* Main Grid Render */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
        <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
          <span>Last Work Log Summary ({reportRows.length} records)</span>
          <span className="text-slate-400">Scroll horizontally to view all fields</span>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-center border-collapse min-w-[1200px]">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
              <tr>
                <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-32">HQ</th>
                <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-44">NAME</th>
                <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-28">DESIGNATION</th>
                <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-36">LAST WORK DATE</th>
                <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-48">PLACE OF WORK</th>
                <th className="p-3.5 border-r border-b border-slate-200 text-center w-28">LEAVE DATE</th>
                <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-32">OTHER</th>
                <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-44">WORKED WITH</th>
                <th className="p-3.5 border-b border-slate-200 text-left pl-4 w-40">NO.OF CALLS (till date)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {reportRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-slate-400 font-semibold">No Records Found</td>
                </tr>
              ) : (
                reportRows.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.hq}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.name}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-500">{row.designation}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.lastWorkDate}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-700 font-medium">{row.placeOfWork}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-400">{row.leaveDate}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.other}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 font-semibold">{row.workedWith}</td>
                    <td className="p-3.5 border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.callsCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Info, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface ActivityRecord {
  sNo: number;
  repName: string;
  designation: string;
  ho: string;
  totalDays: number;
  sundayHolidays: number;
  transitDays: number;
  leaves: number;
  leavesWithoutReason: number;
  workingDays: number;
  workAgenda: number;
  totalDoctorCalls: number;
  doctorCallAverage: number;
  doctorMissed: number;
  totalFirmCalls: number;
  firmCallAverage: number;
  firmMissed: number;
  zone: string;
  isActive: boolean;
}

const AVAILABLE_ZONES = ["Bhopal", "Raipur", "Durg", "Jabalpur", "Bhubaneswar", "Balaghat", "Bilaspur"];

const MOCK_ACTIVITY_DATA: ActivityRecord[] = [
  {
    sNo: 1,
    repName: "Akash Sen",
    designation: "MR",
    ho: "Raipur",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 0,
    leavesWithoutReason: 0,
    workingDays: 2,
    workAgenda: 0,
    totalDoctorCalls: 19,
    doctorCallAverage: 9.5,
    doctorMissed: 106,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 3,
    zone: "Raipur",
    isActive: true,
  },
  {
    sNo: 2,
    repName: "Amarjeet Singh",
    designation: "MR",
    ho: "Durg",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 0,
    leavesWithoutReason: 0,
    workingDays: 2,
    workAgenda: 0,
    totalDoctorCalls: 17,
    doctorCallAverage: 8.5,
    doctorMissed: 118,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 5,
    zone: "Durg",
    isActive: true,
  },
  {
    sNo: 3,
    repName: "AVINASH VERMA",
    designation: "RSM",
    ho: "Bilaspur",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 0,
    leavesWithoutReason: 0,
    workingDays: 2,
    workAgenda: 0,
    totalDoctorCalls: 7,
    doctorCallAverage: 3.5,
    doctorMissed: 0,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 6,
    zone: "Bilaspur",
    isActive: true,
  },
  {
    sNo: 4,
    repName: "BALRAM PATEL",
    designation: "MR",
    ho: "Bilaspur",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 0,
    leavesWithoutReason: 0,
    workingDays: 2,
    workAgenda: 0,
    totalDoctorCalls: 18,
    doctorCallAverage: 9,
    doctorMissed: 126,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 2,
    zone: "Bilaspur",
    isActive: true,
  },
  {
    sNo: 5,
    repName: "CHANDRAMANI PATEL",
    designation: "Sr. RSM",
    ho: "Raipur",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 0,
    leavesWithoutReason: 0,
    workingDays: 2,
    workAgenda: 0,
    totalDoctorCalls: 1,
    doctorCallAverage: 0.5,
    doctorMissed: 0,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 3,
    zone: "Raipur",
    isActive: true,
  },
  {
    sNo: 6,
    repName: "DIWAKAR SAHU",
    designation: "MR",
    ho: "Raipur",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 0,
    leavesWithoutReason: 0,
    workingDays: 2,
    workAgenda: 0,
    totalDoctorCalls: 0,
    doctorCallAverage: 0,
    doctorMissed: 80,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 0,
    zone: "Raipur",
    isActive: true,
  },
  {
    sNo: 7,
    repName: "GAGAN KAPIL",
    designation: "NSM",
    ho: "Raipur",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 2,
    leavesWithoutReason: 0,
    workingDays: 0,
    workAgenda: 0,
    totalDoctorCalls: 0,
    doctorCallAverage: 0,
    doctorMissed: 0,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 0,
    zone: "Raipur",
    isActive: false, // Inactive because workingDays = 0 and totalDoctorCalls = 0
  },
  {
    sNo: 8,
    repName: "HIMANSHU DEWANGAN",
    designation: "MR",
    ho: "Raipur",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 0,
    leavesWithoutReason: 0,
    workingDays: 2,
    workAgenda: 0,
    totalDoctorCalls: 0,
    doctorCallAverage: 0,
    doctorMissed: 81,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 0,
    zone: "Raipur",
    isActive: true,
  },
  {
    sNo: 9,
    repName: "Karan Choudhary",
    designation: "MR",
    ho: "Raipur",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 0,
    leavesWithoutReason: 0,
    workingDays: 2,
    workAgenda: 0,
    totalDoctorCalls: 23,
    doctorCallAverage: 11.5,
    doctorMissed: 129,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 12,
    zone: "Raipur",
    isActive: true,
  },
  {
    sNo: 10,
    repName: "RINKU KAPIL",
    designation: "AGM",
    ho: "Raipur",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 2,
    leavesWithoutReason: 0,
    workingDays: 0,
    workAgenda: 0,
    totalDoctorCalls: 0,
    doctorCallAverage: 0,
    doctorMissed: 0,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 0,
    zone: "Raipur",
    isActive: false, // Inactive
  },
  {
    sNo: 11,
    repName: "RITESH KUMAR SINHA",
    designation: "MR",
    ho: "Raipur",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 0,
    leavesWithoutReason: 0,
    workingDays: 2,
    workAgenda: 0,
    totalDoctorCalls: 12,
    doctorCallAverage: 6,
    doctorMissed: 124,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 0,
    zone: "Raipur",
    isActive: true,
  },
  {
    sNo: 12,
    repName: "Saurabh Patel",
    designation: "MR",
    ho: "Bilaspur",
    totalDays: 2,
    sundayHolidays: 0,
    transitDays: 0,
    leaves: 0,
    leavesWithoutReason: 0,
    workingDays: 2,
    workAgenda: 0,
    totalDoctorCalls: 18,
    doctorCallAverage: 9,
    doctorMissed: 135,
    totalFirmCalls: 0,
    firmCallAverage: 0,
    firmMissed: 3,
    zone: "Bilaspur",
    isActive: true,
  },
];

export function ActivityReportPage() {
  const [selectedZones, setSelectedZones] = React.useState<string[]>([]);
  const [zoneSearch, setZoneSearch] = React.useState("");
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const zoneRef = React.useRef<HTMLDivElement>(null);

  // Default date states are empty strings to show placeholders
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  // Toggle checkboxes
  const [showInactive, setShowInactive] = React.useState(true);
  const [showDoctorCalls, setShowDoctorCalls] = React.useState(true);
  const [showFirmCalls, setShowFirmCalls] = React.useState(true);

  // Table rows visibility
  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reportRows, setReportRows] = React.useState<ActivityRecord[]>([]);

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
    // Check if dates are selected
    if (!fromDate || !toDate) {
      toast.error("Please select both From Date and To Date to generate report!");
      return;
    }

    // Filter by zones if any are selected
    let filtered = MOCK_ACTIVITY_DATA;
    if (selectedZones.length > 0) {
      filtered = MOCK_ACTIVITY_DATA.filter((row) =>
        selectedZones.some((zone) => zone.toLowerCase() === row.zone.toLowerCase())
      );
    }

    // Filter by inactive if showInactive is false
    if (!showInactive) {
      filtered = filtered.filter((row) => row.isActive);
    }

    // Adjust S.No dynamically
    const adjusted = filtered.map((row, idx) => ({
      ...row,
      sNo: idx + 1,
    }));

    setReportRows(adjusted);
    setHasGenerated(true);
    toast.success("Activity Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate the report first before exporting!");
      return;
    }

    // Prepare headers based on what columns are active
    const headers: string[] = ["S.NO.", "NAME OF REPRESENTATIVE", "Designation", "HO", "TOTAL DAYS IN THIS PERIOD", "SUNDAY/HOLIDAYS", "TRANSIT DAY", "LEAVES", "LEAVES WITHOUT REASON", "WORKING DAYS", "Work Agenda"];
    
    if (showDoctorCalls) {
      headers.push("TOTAL DOCTOR CALLS", "DOCTOR CALL AVERAGE", "DOCTOR MISSED");
    }
    if (showFirmCalls) {
      headers.push("TOTAL FIRM CALLS", "FIRM CALL AVERAGE", "FIRM MISSED");
    }

    const rows = reportRows.map((r) => {
      const rowData: any[] = [
        r.sNo,
        `"${r.repName}"`,
        `"${r.designation}"`,
        `"${r.ho}"`,
        r.totalDays,
        r.sundayHolidays,
        r.transitDays,
        r.leaves,
        r.leavesWithoutReason,
        r.workingDays,
        r.workAgenda,
      ];

      if (showDoctorCalls) {
        rowData.push(r.totalDoctorCalls, r.doctorCallAverage, r.doctorMissed);
      }
      if (showFirmCalls) {
        rowData.push(r.totalFirmCalls, r.firmCallAverage, r.firmMissed);
      }
      return rowData;
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Activity_Report_${fromDate || "all"}_to_${toDate || "all"}.csv`);
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
      {/* Breadcrumb & Title Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4 bg-white p-4 rounded-xl shadow-xs border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link to="/reports" className="hover:text-[#008272] flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Reports Hub
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                Activity Report
                <span title="Report showing details of representative activities including working days, calls, and averages.">
                  <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
                </span>
              </h1>
            </div>
          </div>

          {/* Toggle Checkboxes Row */}
          <div className="flex flex-wrap items-center gap-4 mt-3 md:mt-0 text-xs font-semibold text-slate-700 select-none">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#008272] transition-colors">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-slate-300 text-[#008272] focus:ring-[#008272] h-4 w-4 accent-[#008272]"
              />
              Show Inactive Details
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#008272] transition-colors">
              <input
                type="checkbox"
                checked={showDoctorCalls}
                onChange={(e) => setShowDoctorCalls(e.target.checked)}
                className="rounded border-slate-300 text-[#008272] focus:ring-[#008272] h-4 w-4 accent-[#008272]"
              />
              Show Doctor Calls Details
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#008272] transition-colors">
              <input
                type="checkbox"
                checked={showFirmCalls}
                onChange={(e) => setShowFirmCalls(e.target.checked)}
                className="rounded border-slate-300 text-[#008272] focus:ring-[#008272] h-4 w-4 accent-[#008272]"
              />
              Show Firm Calls Details
            </label>
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
                <span className="text-slate-400 pl-1.5 py-0.5 select-none">select Zone</span>
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

          {/* From Date */}
          <div className="w-full sm:w-36">
            <input
              type={startFocused || fromDate ? "date" : "text"}
              placeholder="From Date"
              onFocus={() => setStartFocused(true)}
              onBlur={() => setStartFocused(false)}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-750 focus:outline-none focus:border-[#008272]"
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
              className="w-full px-3 h-9 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-755 focus:outline-none focus:border-[#008272]"
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
      ) : (
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between select-none">
            <span>Activity Log Summary ({reportRows.length} records)</span>
            <span className="text-slate-400">Scroll horizontally to view all fields</span>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[1400px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-[11px] font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3.5 border-r border-b border-slate-200 w-16">S.NO.</th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-44">NAME OF REPRESENTATIVE</th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-24">Designation</th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-28">HO</th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-32">TOTAL DAYS IN THIS PERIOD</th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-28">SUNDAY/HOLIDAYS</th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-28">TRANSIT DAY</th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-24">LEAVES</th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-32">LEAVES WITHOUT REASON</th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-28">WORKING DAYS</th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-28">Work Agenda</th>

                  {showDoctorCalls && (
                    <>
                      <th className="p-3.5 border-r border-b border-slate-200 w-32">TOTAL DOCTOR CALLS</th>
                      <th className="p-3.5 border-r border-b border-slate-200 w-32">DOCTOR CALL AVERAGE</th>
                      <th className="p-3.5 border-r border-b border-slate-200 w-32">DOCTOR MISSED</th>
                    </>
                  )}

                  {showFirmCalls && (
                    <>
                      <th className="p-3.5 border-r border-b border-slate-200 w-32">TOTAL FIRM CALLS</th>
                      <th className="p-3.5 border-r border-b border-slate-200 w-32">FIRM CALL AVERAGE</th>
                      <th className={`p-3.5 border-b border-slate-200 w-32`}>FIRM MISSED</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reportRows.length === 0 ? (
                  <tr>
                    <td colSpan={17} className="p-10 text-center text-slate-400 font-semibold">No Records Found</td>
                  </tr>
                ) : (
                  reportRows.map((row) => (
                    <tr key={row.repName} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 border-r border-b border-slate-200 text-slate-500 font-semibold">{row.sNo}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.repName}</td>
                      <td className="p-3 border-r border-b border-slate-200 font-semibold text-slate-500">{row.designation}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-slate-600 font-medium">{row.ho}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-slate-700">{row.totalDays}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-slate-500">{row.sundayHolidays}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-slate-500">{row.transitDays}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-slate-600 font-semibold">{row.leaves}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-slate-500">{row.leavesWithoutReason}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-slate-700 font-bold">{row.workingDays}</td>
                      <td className="p-3 border-r border-b border-slate-200 text-slate-500">{row.workAgenda}</td>

                      {showDoctorCalls && (
                        <>
                          <td className="p-3 border-r border-b border-slate-200 font-bold text-slate-800">{row.totalDoctorCalls}</td>
                          <td className="p-3 border-r border-b border-slate-200 font-semibold text-slate-600">{row.doctorCallAverage}</td>
                          <td className="p-3 border-r border-b border-slate-200 text-slate-500">{row.doctorMissed}</td>
                        </>
                      )}

                      {showFirmCalls && (
                        <>
                          <td className="p-3 border-r border-b border-slate-200 font-bold text-slate-800">{row.totalFirmCalls}</td>
                          <td className="p-3 border-r border-b border-slate-200 font-semibold text-slate-600">{row.firmCallAverage}</td>
                          <td className="p-3 border-b border-slate-200 text-slate-500">{row.firmMissed}</td>
                        </>
                      )}
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

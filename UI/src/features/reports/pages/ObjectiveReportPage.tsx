import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Info,
  ChevronRight,
  FileSpreadsheet,
  ArrowLeft,
  X,
  Calendar,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ObjectiveReportRow {
  sNo: number;
  hq: string;
  representativeName: string;
  state: string;
  totalDays: number;
  sundayHolidays: number;
  transitDays: number;
  leaves: number;
  thankYouCalls: number;
  businessCalls: number;
}

const MOCK_OBJECTIVE_REPORTS: ObjectiveReportRow[] = [
  {
    sNo: 1,
    hq: "Raipur",
    representativeName: "Akash Sen",
    state: "CHHATTISGARH",
    totalDays: 9,
    sundayHolidays: 1,
    transitDays: 0,
    leaves: 0,
    thankYouCalls: 0,
    businessCalls: 42,
  },
  {
    sNo: 2,
    hq: "Durg",
    representativeName: "Amarjeet Singh",
    state: "CHHATTISGARH",
    totalDays: 9,
    sundayHolidays: 1,
    transitDays: 0,
    leaves: 0,
    thankYouCalls: 0,
    businessCalls: 49,
  },
  {
    sNo: 3,
    hq: "Bilaspur",
    representativeName: "AVINASH VERMA",
    state: "CHHATTISGARH",
    totalDays: 9,
    sundayHolidays: 1,
    transitDays: 0,
    leaves: 0,
    thankYouCalls: 0,
    businessCalls: 45,
  },
  {
    sNo: 4,
    hq: "Bilaspur",
    representativeName: "BALRAM PATEL",
    state: "CHHATTISGARH",
    totalDays: 9,
    sundayHolidays: 1,
    transitDays: 0,
    leaves: 0,
    thankYouCalls: 1,
    businessCalls: 59,
  },
  {
    sNo: 5,
    hq: "Raipur",
    representativeName: "CHANDRAMANI PATEL",
    state: "CHHATTISGARH",
    totalDays: 9,
    sundayHolidays: 1,
    transitDays: 0,
    leaves: 0,
    thankYouCalls: 0,
    businessCalls: 34,
  },
  {
    sNo: 6,
    hq: "Raipur",
    representativeName: "DIWAKAR SAHU",
    state: "CHHATTISGARH",
    totalDays: 9,
    sundayHolidays: 1,
    transitDays: 0,
    leaves: 0,
    thankYouCalls: 0,
    businessCalls: 25,
  },
  {
    sNo: 7,
    hq: "Raipur",
    representativeName: "GAGAN KAPIL",
    state: "CHHATTISGARH",
    totalDays: 9,
    sundayHolidays: 1,
    transitDays: 0,
    leaves: 0,
    thankYouCalls: 0,
    businessCalls: 0,
  },
  {
    sNo: 8,
    hq: "Raipur",
    representativeName: "HIMANSHU DEWANGAN",
    state: "CHHATTISGARH",
    totalDays: 9,
    sundayHolidays: 1,
    transitDays: 0,
    leaves: 0,
    thankYouCalls: 0,
    businessCalls: 21,
  },
  {
    sNo: 9,
    hq: "Raipur",
    representativeName: "Karan Choudhary",
    state: "CHHATTISGARH",
    totalDays: 9,
    sundayHolidays: 1,
    transitDays: 0,
    leaves: 0,
    thankYouCalls: 0,
    businessCalls: 51,
  }
];

const AVAILABLE_ZONES = ["Chhattisgarh", "Maharashtra", "Madhya Pradesh", "Gujarat"];

export function ObjectiveReportPage() {
  // Filters State
  const [division, setDivision] = React.useState("Select Division");
  const [selectedZones, setSelectedZones] = React.useState<string[]>(["Chhattisgarh"]);
  const [selectType, setSelectType] = React.useState("Select Type"); // Manager Wise, Employee Wise
  const [employee, setEmployee] = React.useState("All Employee");
  const [manager, setManager] = React.useState("All Manager");
  const [startDate, setStartDate] = React.useState("2026-06-02");
  const [endDate, setEndDate] = React.useState("2026-06-10");
  const [excludeReminder, setExcludeReminder] = React.useState(false);

  // Focus tracking for clean placeholders in dates
  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  // Zone multi-select dropdown states
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const [zoneSearch, setZoneSearch] = React.useState("");
  const zoneDropdownRef = React.useRef<HTMLDivElement>(null);
  const zoneInputRef = React.useRef<HTMLInputElement>(null);

  // Generate control
  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reports, setReports] = React.useState<ObjectiveReportRow[]>(MOCK_OBJECTIVE_REPORTS);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (zoneDropdownRef.current && !zoneDropdownRef.current.contains(event.target as Node)) {
        setIsZoneOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredZones = AVAILABLE_ZONES.filter(
    (z) =>
      z.toLowerCase().includes(zoneSearch.toLowerCase()) &&
      !selectedZones.includes(z)
  );

  const handleApplyFilters = () => {
    // Return all or filtered reports
    let filtered = MOCK_OBJECTIVE_REPORTS;

    // Filter by representative name if employee wise and specific employee is selected
    if (selectType === "Employee Wise" && employee !== "All Employee") {
      filtered = filtered.filter((r) =>
        r.representativeName.toLowerCase() === employee.toLowerCase()
      );
    }

    setReports(filtered);
    setHasGenerated(true);
    toast.success("Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate the report first before exporting!");
      return;
    }

    const headers = [
      "S.NO.",
      "HQ",
      "NAME OF REPRESENTATIVE",
      "STATE",
      "TOTAL DAYS IN THIS PERIOD",
      "SUNDAY/HOLIDAYS",
      "TRANSIT DAY",
      "LEAVES",
      "WORKING DAYS",
      "THANK YOU CALL",
      "BUSINESS CALL",
      "TOTAL CALLS",
      "CALL AVERAGE",
      "BUSINESS CALL AVERAGE"
    ];

    const rows = reports.map((r) => {
      const workingDays = r.totalDays - r.sundayHolidays - r.transitDays - r.leaves;
      const totalCalls = r.thankYouCalls + r.businessCalls;
      
      const callAvg = workingDays > 0 
        ? ((excludeReminder ? r.businessCalls : totalCalls) / workingDays).toFixed(2)
        : "0.00";
      
      const bizAvg = workingDays > 0 
        ? (r.businessCalls / workingDays).toFixed(2) 
        : "0.00";

      return [
        r.sNo,
        r.hq,
        `"${r.representativeName}"`,
        r.state,
        r.totalDays,
        r.sundayHolidays,
        r.transitDays,
        r.leaves,
        workingDays,
        r.thankYouCalls,
        r.businessCalls,
        totalCalls,
        parseFloat(callAvg),
        parseFloat(bizAvg)
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Objective_Wise_Call_Report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  const removeZoneTag = (zoneToRemove: string) => {
    setSelectedZones((prev) => prev.filter((z) => z !== zoneToRemove));
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1.5">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
              Objective Wise Call Report
              <span title="Report showing representative call activity statistics segmented by call objectives.">
                <Info className="h-4.5 w-4.5 text-slate-400 cursor-help" />
              </span>
            </h1>

            {/* Checkbox with red notice info */}
            <div className="flex items-center space-x-2 bg-slate-50/80 px-3 py-1.5 rounded-lg border border-slate-100 text-xs">
              <Checkbox
                id="excludeReminder"
                checked={excludeReminder}
                onCheckedChange={(checked) => setExcludeReminder(!!checked)}
                className="data-[state=checked]:bg-[#008272] data-[state=checked]:border-[#008272] h-4 w-4"
              />
              <label
                htmlFor="excludeReminder"
                className="font-medium text-slate-600 cursor-pointer select-none"
              >
                Excluding Reminder Call In Average
                <span className="text-red-500 font-semibold ml-1.5">
                  (Please ignore if you don't use this objective)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        {/* Horizontal single row filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Division */}
          <div className="w-full sm:w-44">
            <UiSelect value={division} onValueChange={setDivision}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select Division">Select Division</SelectItem>
                <SelectItem value="DERMA">DERMA</SelectItem>
                <SelectItem value="GYNAE">GYNAE</SelectItem>
                <SelectItem value="PEDIA">PEDIA</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Zone Multi-Select console */}
          <div className="w-full sm:w-56 relative" ref={zoneDropdownRef}>
            <div
              className="flex items-center flex-wrap gap-1 p-1 border rounded-lg border-slate-200 bg-slate-50 min-h-[36px] max-h-[72px] overflow-y-auto cursor-text text-xs"
              onClick={() => {
                zoneInputRef.current?.focus();
                setIsZoneOpen(true);
              }}
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
                ref={zoneInputRef}
                type="text"
                placeholder=""
                value={zoneSearch}
                onChange={(e) => {
                  setZoneSearch(e.target.value);
                  setIsZoneOpen(true);
                }}
                onFocus={() => setIsZoneOpen(true)}
                className="bg-transparent border-none outline-none text-xs flex-1 ml-1 min-w-[50px] h-5"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (zoneSearch.trim()) {
                      const matched = AVAILABLE_ZONES.find(
                        (zone) => zone.toLowerCase() === zoneSearch.trim().toLowerCase()
                      );
                      const val = matched || zoneSearch.trim();
                      if (!selectedZones.includes(val)) {
                        setSelectedZones([...selectedZones, val]);
                      }
                      setZoneSearch("");
                      setIsZoneOpen(false);
                    }
                  } else if (e.key === "Backspace" && !zoneSearch && selectedZones.length > 0) {
                    setSelectedZones(selectedZones.slice(0, -1));
                  }
                }}
              />
            </div>

            {isZoneOpen && filteredZones.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50 text-xs py-1">
                {filteredZones.map((z) => (
                  <button
                    key={z}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedZones([...selectedZones, z]);
                      setZoneSearch("");
                      setIsZoneOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                  >
                    {z}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select Type */}
          <div className="w-full sm:w-44">
            <UiSelect value={selectType} onValueChange={(val) => {
              setSelectType(val);
              // reset specific dropdown selects when switching
              if (val !== "Employee Wise") setEmployee("All Employee");
              if (val !== "Manager Wise") setManager("All Manager");
            }}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select Type">Select Type</SelectItem>
                <SelectItem value="Manager Wise">Manager Wise</SelectItem>
                <SelectItem value="Employee Wise">Employee Wise</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Dynamic Dropdown for Employee Wise */}
          {selectType === "Employee Wise" && (
            <div className="w-full sm:w-44 animate-fade-in">
              <UiSelect value={employee} onValueChange={setEmployee}>
                <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="All Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Employee">All Employee</SelectItem>
                  <SelectItem value="Akash Sen">Akash Sen</SelectItem>
                  <SelectItem value="Amarjeet Singh">Amarjeet Singh</SelectItem>
                  <SelectItem value="AVINASH VERMA">AVINASH VERMA</SelectItem>
                  <SelectItem value="BALRAM PATEL">BALRAM PATEL</SelectItem>
                  <SelectItem value="CHANDRAMANI PATEL">CHANDRAMANI PATEL</SelectItem>
                  <SelectItem value="DIWAKAR SAHU">DIWAKAR SAHU</SelectItem>
                  <SelectItem value="GAGAN KAPIL">GAGAN KAPIL</SelectItem>
                  <SelectItem value="HIMANSHU DEWANGAN">HIMANSHU DEWANGAN</SelectItem>
                  <SelectItem value="Karan Choudhary">Karan Choudhary</SelectItem>
                </SelectContent>
              </UiSelect>
            </div>
          )}

          {/* Dynamic Dropdown for Manager Wise */}
          {selectType === "Manager Wise" && (
            <div className="w-full sm:w-44 animate-fade-in">
              <UiSelect value={manager} onValueChange={setManager}>
                <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                  <SelectValue placeholder="All Manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Manager">All Manager</SelectItem>
                  <SelectItem value="Yugal Kishor Sahu">Yugal Kishor Sahu</SelectItem>
                  <SelectItem value="Shubham Sharma">Shubham Sharma</SelectItem>
                </SelectContent>
              </UiSelect>
            </div>
          )}

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

          {/* Buttons in same line if space permits (Snapshot 1) */}
          <div className="flex gap-2 ml-auto sm:ml-0">
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
              <FileSpreadsheet className="h-4 w-4 mr-0.5" /> Excel
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
        /* Horizontally Scrollable Grid Container */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          {/* Info banner */}
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-[#008272]" />
              Objective Wise call activity summary ({reports.length} records)
            </span>
            <span className="text-slate-400">Scroll horizontally to view all fields</span>
          </div>

          {/* Scrollable table container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[1500px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr className="border-b border-slate-200">
                  <th className="p-3.5 w-16 border-r text-center">S.NO.</th>
                  <th className="p-3.5 w-28 border-r text-left pl-4">HQ</th>
                  <th className="p-3.5 w-56 border-r text-left pl-4">NAME OF REPRESENTATIVE</th>
                  <th className="p-3.5 w-36 border-r text-left pl-4">STATE</th>
                  <th className="p-3.5 w-32 border-r text-center">TOTAL DAYS IN THIS PERIOD</th>
                  <th className="p-3.5 w-32 border-r text-center">SUNDAY/HOLIDAYS</th>
                  <th className="p-3.5 w-24 border-r text-center">TRANSIT DAY</th>
                  <th className="p-3.5 w-24 border-r text-center">LEAVES</th>
                  <th className="p-3.5 w-28 border-r text-center">WORKING DAYS</th>
                  <th className="p-3.5 w-28 border-r text-center">THANK YOU CALL</th>
                  <th className="p-3.5 w-28 border-r text-center">BUSINESS CALL</th>
                  <th className="p-3.5 w-28 border-r text-center">TOTAL CALLS</th>
                  <th className="p-3.5 w-28 border-r text-center">CALL AVERAGE</th>
                  <th className="p-3.5 w-28 text-center">BUSINESS CALL AVERAGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="p-10 text-center text-slate-400 font-semibold">
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  reports.map((row, index) => {
                    const workingDays = row.totalDays - row.sundayHolidays - row.transitDays - row.leaves;
                    const totalCalls = row.thankYouCalls + row.businessCalls;
                    
                    const callAvg = workingDays > 0 
                      ? ((excludeReminder ? row.businessCalls : totalCalls) / workingDays).toFixed(2)
                      : "0.00";
                    
                    const bizAvg = workingDays > 0 
                      ? (row.businessCalls / workingDays).toFixed(2) 
                      : "0.00";

                    return (
                      <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3.5 font-semibold text-slate-500 border-r">{index + 1}</td>
                        <td className="p-3.5 border-r text-left pl-4 text-slate-600 font-medium">{row.hq}</td>
                        <td className="p-3.5 border-r text-left pl-4 font-bold text-slate-800">{row.representativeName}</td>
                        <td className="p-3.5 border-r text-left pl-4 text-slate-500 font-semibold uppercase">{row.state}</td>
                        <td className="p-3.5 border-r text-center font-semibold">{row.totalDays}</td>
                        <td className="p-3.5 border-r text-center text-slate-500">{row.sundayHolidays}</td>
                        <td className="p-3.5 border-r text-center text-slate-500">{row.transitDays}</td>
                        <td className="p-3.5 border-r text-center text-slate-500">{row.leaves}</td>
                        <td className="p-3.5 border-r text-center font-bold text-slate-800">{workingDays}</td>
                        <td className="p-3.5 border-r text-center font-medium text-slate-600">{row.thankYouCalls}</td>
                        <td className="p-3.5 border-r text-center font-semibold text-slate-800">{row.businessCalls}</td>
                        <td className="p-3.5 border-r text-center font-bold text-slate-900">{totalCalls}</td>
                        <td className="p-3.5 border-r text-center font-bold text-[#008272]">{parseFloat(callAvg)}</td>
                        <td className="p-3.5 text-center font-bold text-[#008272]">{parseFloat(bizAvg)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

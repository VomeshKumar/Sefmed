import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Info,
  FileSpreadsheet,
  ArrowLeft,
  X,
  Calendar,
  Briefcase
} from "lucide-react";
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

export interface VisitLessGreaterRow {
  name: string;
  speciality: string;
  divisionName: string;
  doctorType: string;
  doctorPriority: string;
  assignedTo: string;
  visitCount: number; // Used for dynamic filtering in tabs
}

const MOCK_VISIT_RECORDS: VisitLessGreaterRow[] = [
  // Visit < 2
  {
    name: "RAGHVENDRA VERMA",
    speciality: "CHEST",
    divisionName: "DERMA",
    doctorType: "Non Prescriber",
    doctorPriority: "",
    assignedTo: "Amarjeet Singh",
    visitCount: 1
  },
  {
    name: "TILESH KHUSRO",
    speciality: "CHEST",
    divisionName: "DERMA",
    doctorType: "Non Prescriber",
    doctorPriority: "",
    assignedTo: "Amarjeet Singh",
    visitCount: 1
  },
  {
    name: "DR SUGANDH GANDHI",
    speciality: "DERMA",
    divisionName: "DERMA",
    doctorType: "",
    doctorPriority: "",
    assignedTo: "Amarjeet Singh",
    visitCount: 1
  },
  {
    name: "DR YASHA UPENDRA",
    speciality: "DERMA",
    divisionName: "DERMA",
    doctorType: "Prescriber",
    doctorPriority: "",
    assignedTo: "Amarjeet Singh",
    visitCount: 1
  },
  {
    name: "DR BHARAT CHAWDA",
    speciality: "DERMA",
    divisionName: "DERMA",
    doctorType: "Prescriber",
    doctorPriority: "",
    assignedTo: "Amarjeet Singh",
    visitCount: 1
  },
  {
    name: "DR ALOK DIXIT",
    speciality: "DERMA",
    divisionName: "DERMA",
    doctorType: "Non Prescriber",
    doctorPriority: "",
    assignedTo: "Amarjeet Singh",
    visitCount: 1
  },
  {
    name: "DR VANITA METHI",
    speciality: "DERMA",
    divisionName: "DERMA",
    doctorType: "Prescriber",
    doctorPriority: "",
    assignedTo: "Amarjeet Singh",
    visitCount: 1
  },
  // Visit > 4
  {
    name: "DR ANIL RAJPUT",
    speciality: "GYNAE",
    divisionName: "DERMA",
    doctorType: "Prescriber",
    doctorPriority: "High",
    assignedTo: "Amarjeet Singh",
    visitCount: 5
  },
  {
    name: "DR MEENA VERMA",
    speciality: "PAED",
    divisionName: "DERMA",
    doctorType: "Prescriber",
    doctorPriority: "Medium",
    assignedTo: "Amarjeet Singh",
    visitCount: 6
  },
  {
    name: "DR SANJAY DEWAN",
    speciality: "CARDIO",
    divisionName: "DERMA",
    doctorType: "Non Prescriber",
    doctorPriority: "",
    assignedTo: "Amarjeet Singh",
    visitCount: 8
  },
  // Visit == 0
  {
    name: "DR RAJESH GUPTA",
    speciality: "ENT",
    divisionName: "DERMA",
    doctorType: "Non Prescriber",
    doctorPriority: "Low",
    assignedTo: "Amarjeet Singh",
    visitCount: 0
  },
  {
    name: "DR SUNITA KOCHAR",
    speciality: "DERMA",
    divisionName: "DERMA",
    doctorType: "Prescriber",
    doctorPriority: "High",
    assignedTo: "Amarjeet Singh",
    visitCount: 0
  },
  {
    name: "DR PRADEEP VERMA",
    speciality: "PHYSI",
    divisionName: "DERMA",
    doctorType: "Non Prescriber",
    doctorPriority: "",
    assignedTo: "Amarjeet Singh",
    visitCount: 0
  }
];

const AVAILABLE_ZONES = ["Chhattisgarh", "Maharashtra", "Madhya Pradesh", "Gujarat"];
const AVAILABLE_DESIGNATIONS = ["All", "Admin", "Manager", "Rep"];

export function VisitReportLessGreaterPage() {
  // Filters State
  const [selectedZones, setSelectedZones] = React.useState<string[]>([]);
  const [division, setDivision] = React.useState("Select Division");
  const [employee, setEmployee] = React.useState("All Employee");
  const [selectedDesignations, setSelectedDesignations] = React.useState<string[]>(["All"]);
  const [startDate, setStartDate] = React.useState("2026-06-02");
  const [endDate, setEndDate] = React.useState("2026-06-10");

  // Focus states for clean date pickers
  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  // Zone Tag dropdown controls
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const [zoneSearch, setZoneSearch] = React.useState("");
  const zoneRef = React.useRef<HTMLDivElement>(null);

  // Designation Tag dropdown controls
  const [isDesgOpen, setIsDesgOpen] = React.useState(false);
  const [desgSearch, setDesgSearch] = React.useState("");
  const desgRef = React.useRef<HTMLDivElement>(null);

  // Number Limits State
  const [lessThanVal, setLessThanVal] = React.useState("2");
  const [moreThanVal, setMoreThanVal] = React.useState("4");
  const [equalToVal, setEqualToVal] = React.useState("0");

  // Active Dynamic Tab
  const [activeSubTab, setActiveSubTab] = React.useState("less"); // less, more, equal

  // Generation Controls
  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reports, setReports] = React.useState<VisitLessGreaterRow[]>([]);

  // Click outside to close tag dropdowns
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (zoneRef.current && !zoneRef.current.contains(event.target as Node)) {
        setIsZoneOpen(false);
      }
      if (desgRef.current && !desgRef.current.contains(event.target as Node)) {
        setIsDesgOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleApplyFilters = () => {
    // Generate filtered data based on limits and filters
    let filtered = MOCK_VISIT_RECORDS;

    if (employee !== "All Employee") {
      filtered = filtered.filter((r) => r.assignedTo === employee);
    }
    if (division !== "Select Division") {
      filtered = filtered.filter((r) => r.divisionName === division);
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

    const currentTabRecords = getTabRecords();

    const headers = [
      "Name",
      "Speciality",
      "Division Name",
      "Doctor Type",
      "Doctor Priority",
      "Assigned to"
    ];

    const rows = currentTabRecords.map((r) => [
      `"${r.name}"`,
      `"${r.speciality}"`,
      `"${r.divisionName}"`,
      `"${r.doctorType}"`,
      `"${r.doctorPriority}"`,
      `"${r.assignedTo}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Visit_Report_${activeSubTab}_${startDate}_to_${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  const removeZoneTag = (z: string) => {
    setSelectedZones((prev) => prev.filter((item) => item !== z));
  };

  const removeDesgTag = (d: string) => {
    setSelectedDesignations((prev) => prev.filter((item) => item !== d));
  };

  // Resolve active tab records dynamically based on input values
  const getTabRecords = () => {
    const lessTh = parseInt(lessThanVal || "0");
    const moreTh = parseInt(moreThanVal || "0");
    const eq = parseInt(equalToVal || "0");

    if (activeSubTab === "less") {
      return reports.filter((r) => r.visitCount < lessTh);
    } else if (activeSubTab === "more") {
      return reports.filter((r) => r.visitCount > moreTh);
    } else {
      return reports.filter((r) => r.visitCount === eq);
    }
  };

  const currentRecords = getTabRecords();

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
              Visit Report
              <span title="Visit less/greater analysis report based on closed call parameters.">
                <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        {/* Row 1: Primary filter triggers */}
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

          {/* Select Division */}
          <div className="w-full sm:w-40">
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
                <SelectItem value="CHANDRAMANI PATEL">CHANDRAMANI PATEL</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Designation Tag Input (defaults to Tag "All") */}
          <div className="w-full sm:w-40 relative" ref={desgRef}>
            <div
              className="flex items-center flex-wrap gap-1 p-1 border rounded-lg border-slate-200 bg-slate-50 min-h-[36px] max-h-[72px] overflow-y-auto cursor-text text-xs"
              onClick={() => setIsDesgOpen(true)}
            >
              {selectedDesignations.length === 0 && (
                <span className="text-slate-400 pl-1.5 py-0.5">Select Designation</span>
              )}
              {selectedDesignations.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[11px] px-1.5 py-0.5 rounded text-slate-700 font-medium"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDesgTag(d);
                    }}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                  {d}
                </span>
              ))}
              <input
                type="text"
                value={desgSearch}
                onChange={(e) => {
                  setDesgSearch(e.target.value);
                  setIsDesgOpen(true);
                }}
                onFocus={() => setIsDesgOpen(true)}
                className="bg-transparent border-none outline-none text-xs flex-1 ml-1 min-w-[50px] h-5"
              />
            </div>
            {isDesgOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50 text-xs py-1">
                {AVAILABLE_DESIGNATIONS.filter(
                  (d) =>
                    d.toLowerCase().includes(desgSearch.toLowerCase()) &&
                    !selectedDesignations.includes(d)
                ).map((d) => (
                  <button
                    key={d}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedDesignations([...selectedDesignations, d]);
                      setDesgSearch("");
                      setIsDesgOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
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

        {/* Row 2: Action Buttons */}
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

        {/* Row 3: Limits Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">
              Visit less than (0-9)
            </label>
            <Input
              type="number"
              value={lessThanVal}
              onChange={(e) => setLessThanVal(e.target.value)}
              className="h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">
              Visit more than (0-9)
            </label>
            <Input
              type="number"
              value={moreThanVal}
              onChange={(e) => setMoreThanVal(e.target.value)}
              className="h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">
              Visit equal to (0-9)
            </label>
            <Input
              type="number"
              value={equalToVal}
              onChange={(e) => setEqualToVal(e.target.value)}
              className="h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
            />
          </div>
        </div>
      </div>

      {/* Main Grid Render or Parameter Selection Empty State */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select the parameters to generate report.
        </div>
      ) : (
        /* Dynamic Tab navigation & Spreadsheet table */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          {/* Dynamic Tabs list */}
          <div className="flex border-b bg-slate-50/50 p-2 gap-2">
            <button
              onClick={() => setActiveSubTab("less")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                activeSubTab === "less"
                  ? "bg-white text-[#008272] border-[#008272]/20 shadow-xs"
                  : "text-slate-500 border-transparent hover:bg-slate-100"
              }`}
            >
              Visit &lt; {lessThanVal || "0"}
            </button>
            <button
              onClick={() => setActiveSubTab("more")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                activeSubTab === "more"
                  ? "bg-white text-[#008272] border-[#008272]/20 shadow-xs"
                  : "text-slate-500 border-transparent hover:bg-slate-100"
              }`}
            >
              Visit &gt; {moreThanVal || "0"}
            </button>
            <button
              onClick={() => setActiveSubTab("equal")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                activeSubTab === "equal"
                  ? "bg-white text-[#008272] border-[#008272]/20 shadow-xs"
                  : "text-slate-500 border-transparent hover:bg-slate-100"
              }`}
            >
              Visit == {equalToVal || "0"}
            </button>
          </div>

          {/* Scrollable table container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-52">
                    Name
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-44">
                    Speciality
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-44">
                    Division Name
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-44">
                    Doctor Type
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-44">
                    Doctor Priority
                  </th>
                  <th className="p-3.5 border-b border-slate-200 text-left pl-4 w-52">
                    Assigned to
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {currentRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-slate-400 font-semibold"
                    >
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((row, idx) => (
                    <tr
                      key={`${row.name}-${idx}`}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">
                        {row.name}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600 font-medium">
                        {row.speciality}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 font-semibold">
                        {row.divisionName}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500">
                        {row.doctorType || "-"}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500">
                        {row.doctorPriority ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.doctorPriority === "High"
                                ? "bg-red-50 text-red-600 border border-red-200/50"
                                : row.doctorPriority === "Medium"
                                ? "bg-amber-50 text-amber-600 border border-amber-200/50"
                                : "bg-blue-50 text-blue-600 border border-blue-200/50"
                            }`}
                          >
                            {row.doctorPriority}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3.5 border-b border-slate-200 text-left pl-4 font-semibold text-slate-800">
                        {row.assignedTo}
                      </td>
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

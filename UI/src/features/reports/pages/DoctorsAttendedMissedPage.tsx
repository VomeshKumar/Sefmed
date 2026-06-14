import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Info,
  FileSpreadsheet,
  ArrowLeft,
  X,
  MapPin,
  Calendar,
  AlertCircle
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

export interface DoctorMissedRow {
  sNo: number;
  date: string;
  id: string;
  name: string;
  assignedTo: string;
  immediateManager: string;
  divisionName: string;
  speciality: string;
  category: string;
  type: string; // Prescriber, Non - Prescriber
  priority: string; // TTP, TTNP
  address: string;
  area: string;
  isAttended: boolean; // true for Attended, false for Missed
}

const MOCK_DOCTOR_RECORDS: DoctorMissedRow[] = [
  // Doctors Attended
  {
    sNo: 1,
    date: "02-06-2026",
    id: "361",
    name: "DR DIPAK SARKAR",
    assignedTo: "BALRAM PATEL",
    immediateManager: "AVINASH VERMA",
    divisionName: "DERMA",
    speciality: "DERMA",
    category: "A",
    type: "Prescriber",
    priority: "",
    address: "Parwati Bhawan, 465/38, Shivaji Marg, Tikrapara, Bilaspur, Chhattisgarh 495001, India",
    area: "Bilaspur",
    isAttended: true
  },
  {
    sNo: 2,
    date: "03-06-2026",
    id: "362",
    name: "DR KALPANA LUTHRA",
    assignedTo: "BALRAM PATEL",
    immediateManager: "AVINASH VERMA",
    divisionName: "DERMA",
    speciality: "DERMA",
    category: "A",
    type: "",
    priority: "",
    address: "SKIN SOLUTION NEHRU NAGER ROAD BILASPUR ,Bilaspur , CHHATTISGARH , INDIA",
    area: "NA",
    isAttended: true
  },
  {
    sNo: 3,
    date: "10-06-2026",
    id: "364",
    name: "DR ATUL MOHANKAR",
    assignedTo: "Akash Sen",
    immediateManager: "J. GOVIND RAO",
    divisionName: "DERMA",
    speciality: "DERMA",
    category: "A",
    type: "",
    priority: "",
    address: "CIMS ,Bilaspur , CHHATTISGARH , INDIA",
    area: "Raipur",
    isAttended: true
  },
  {
    sNo: 4,
    date: "05-06-2026",
    id: "365",
    name: "DR SANJAY PATEL",
    assignedTo: "Amarjeet Singh",
    immediateManager: "Yugal Kishor Sahu",
    divisionName: "DERMA",
    speciality: "CARDIO",
    category: "A+",
    type: "Prescriber",
    priority: "TTP",
    address: "Civil Lines, Raipur, Chhattisgarh 492001",
    area: "Raipur",
    isAttended: true
  },
  // Doctors Missed
  {
    sNo: 1,
    date: "04-06-2026",
    id: "370",
    name: "DR ASHOK MEHTA",
    assignedTo: "Amarjeet Singh",
    immediateManager: "Yugal Kishor Sahu",
    divisionName: "DERMA",
    speciality: "GYNAE",
    category: "B",
    type: "Non - Prescriber",
    priority: "TTNP",
    address: "Link Road, Bilaspur, Chhattisgarh 495001",
    area: "Bilaspur",
    isAttended: false
  },
  {
    sNo: 2,
    date: "08-06-2026",
    id: "372",
    name: "DR POOJA SHARMA",
    assignedTo: "BALRAM PATEL",
    immediateManager: "AVINASH VERMA",
    divisionName: "DERMA",
    speciality: "PEDIA",
    category: "C",
    type: "Prescriber",
    priority: "TTP",
    address: "Ring Road, Raipur, Chhattisgarh 492001",
    area: "Raipur",
    isAttended: false
  },
  {
    sNo: 3,
    date: "09-06-2026",
    id: "374",
    name: "DR ALOK SHAH",
    assignedTo: "Amarjeet Singh",
    immediateManager: "Yugal Kishor Sahu",
    divisionName: "DERMA",
    speciality: "ENT",
    category: "Core",
    type: "Non - Prescriber",
    priority: "TTNP",
    address: "Sector 5, Bhilai, Chhattisgarh 490006",
    area: "Bhilai",
    isAttended: false
  }
];

const AVAILABLE_ZONES = ["Chhattisgarh", "Maharashtra", "Madhya Pradesh", "Gujarat"];

const SPECIALITY_CHOICES = [
  "All Speciality",
  "NEO",
  "GYNAE",
  "PAED",
  "PG Neo",
  "IVF",
  "OTHERS",
  "GYNEC",
  "GP-NO",
  "PEDIA",
  "CONSU",
  "DERMA",
  "ENTSP",
  "GP-MB",
  "PHYSI",
  "CARDIO",
  "CHEST",
  "DENTI",
  "GENER",
  "GP-NON MBBS",
  "PG-DC",
  "ORTHO",
  "GP",
  "MD",
  "Cosmetologist",
  "Dermatologist",
  "General Practitioner",
  "Plastic Surgeon",
  "Trichologist",
  "MBBS GENERAL PRACTITIONER",
  "Cosmetic",
  "Medicine",
  "PEAD",
  "SKIN & VD",
  "PHYSICIAN",
  "PG",
  "DGO",
  "ENT",
  "Practicing Gynaecs",
  "OPTHAL",
  "Gynaecologist",
  "Clinical Dermatologist",
  "BAMS",
  "GP GYN"
];

export function DoctorsAttendedMissedPage() {
  // Primary Filters
  const [selectedZones, setSelectedZones] = React.useState<string[]>([]);
  const [division, setDivision] = React.useState("Select Division");
  const [selectType, setSelectType] = React.useState("Select Type"); // Employee Wise, Manager Wise
  const [employee, setEmployee] = React.useState("All Employee");
  const [manager, setManager] = React.useState("All Manager");
  const [startDate, setStartDate] = React.useState("2026-06-02");
  const [endDate, setEndDate] = React.useState("2026-06-10");
  const [speciality, setSpeciality] = React.useState("All Speciality");

  // Advanced Search
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [advType, setAdvType] = React.useState("Select Type");
  const [advPriority, setAdvPriority] = React.useState("Select Priority");
  const [advCategory, setAdvCategory] = React.useState("Select Category");

  // Focus tracking for clean date placeholders
  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  // Zone Tags Controls
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const [zoneSearch, setZoneSearch] = React.useState("");
  const zoneRef = React.useRef<HTMLDivElement>(null);

  // Grid Controls
  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"attended" | "missed">("attended");
  const [reports, setReports] = React.useState<DoctorMissedRow[]>([]);

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
    if (
      selectType === "Select Type" ||
      division === "Select Division"
    ) {
      toast.error("Please select all parameters to generate the report!");
      return;
    }

    let filtered = MOCK_DOCTOR_RECORDS;

    // Filter by employee selection
    if (selectType === "Employee Wise" && employee !== "All Employee") {
      filtered = filtered.filter((r) => r.assignedTo === employee);
    }
    // Filter by division selection
    if (division !== "Select Division") {
      filtered = filtered.filter((r) => r.divisionName === division);
    }
    // Filter by speciality
    if (speciality !== "All Speciality") {
      filtered = filtered.filter((r) => r.speciality === speciality);
    }

    // Advanced Filters
    if (showAdvanced) {
      if (advType !== "Select Type") {
        filtered = filtered.filter((r) => r.type === advType);
      }
      if (advPriority !== "Select Priority") {
        filtered = filtered.filter((r) => r.priority === advPriority);
      }
      if (advCategory !== "Select Category") {
        filtered = filtered.filter((r) => r.category === advCategory);
      }
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

    const currentTabRecords = reports.filter(
      (r) => r.isAttended === (activeTab === "attended")
    );

    const headers = [
      "S.No",
      "Date",
      "ID",
      "Name",
      "Assigned to",
      "Immediate Manager",
      "Division Name",
      "Speciality",
      "Category",
      "Type",
      "Priority",
      "Address",
      "Area"
    ];

    const rows = currentTabRecords.map((r, index) => [
      index + 1,
      r.date,
      r.id,
      `"${r.name}"`,
      `"${r.assignedTo}"`,
      `"${r.immediateManager}"`,
      `"${r.divisionName}"`,
      `"${r.speciality}"`,
      `"${r.category}"`,
      `"${r.type}"`,
      `"${r.priority}"`,
      `"${r.address}"`,
      `"${r.area}"`
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Doctors_${activeTab === "attended" ? "Attended" : "Missed"}_Report_${startDate}_to_${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  const removeZoneTag = (z: string) => {
    setSelectedZones((prev) => prev.filter((item) => item !== z));
  };

  // Filter grid records based on tab choice
  const displayedRecords = reports.filter(
    (r) => r.isAttended === (activeTab === "attended")
  );

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
              Doctors Attended/Doctors Missed
              <span title="Report showing summary of doctor call coverage and list of doctors missed during visits.">
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

          {/* Select Type */}
          <div className="w-full sm:w-44">
            <UiSelect value={selectType} onValueChange={(val) => {
              setSelectType(val);
              if (val !== "Employee Wise") setEmployee("All Employee");
              if (val !== "Manager Wise") setManager("All Manager");
            }}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select Type">Select Type</SelectItem>
                <SelectItem value="Employee Wise">Employee Wise</SelectItem>
                <SelectItem value="Manager Wise">Manager Wise</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Dynamic Dropdown for Employee Wise */}
          {selectType === "Employee Wise" && (
            <div className="w-full sm:w-48 animate-fade-in">
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
          )}

          {/* Dynamic Dropdown for Manager Wise */}
          {selectType === "Manager Wise" && (
            <div className="w-full sm:w-48 animate-fade-in">
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
        </div>

        {/* Row 2 Buttons & Specialty */}
        <div className="flex flex-wrap items-center gap-3 border-t pt-4">
          {/* Select Speciality */}
          <div className="w-full sm:w-56">
            <UiSelect value={speciality} onValueChange={setSpeciality}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Speciality" />
              </SelectTrigger>
              <SelectContent className="max-h-56 overflow-y-auto">
                {SPECIALITY_CHOICES.map((choice) => (
                  <SelectItem key={choice} value={choice}>
                    {choice}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Buttons */}
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

        {/* Advanced Search Collapsible trigger */}
        <div className="pt-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-bold text-[#008272] hover:underline flex items-center gap-1 focus:outline-none"
          >
            {showAdvanced ? "-Advanced Search" : "+Advanced Search"}
          </button>
        </div>

        {/* Advanced Search Panel content */}
        {showAdvanced && (
          <div className="bg-slate-100/80 border rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-slide-up">
            {/* Select Type */}
            <div className="flex flex-col space-y-1">
              <UiSelect value={advType} onValueChange={setAdvType}>
                <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select Type">Select Type</SelectItem>
                  <SelectItem value="Prescriber">Prescriber</SelectItem>
                  <SelectItem value="Non - Prescriber">Non - Prescriber</SelectItem>
                </SelectContent>
              </UiSelect>
            </div>

            {/* Select Priority */}
            <div className="flex flex-col space-y-1">
              <UiSelect value={advPriority} onValueChange={setAdvPriority}>
                <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select Priority">Select Priority</SelectItem>
                  <SelectItem value="TTP">TTP</SelectItem>
                  <SelectItem value="TTNP">TTNP</SelectItem>
                </SelectContent>
              </UiSelect>
            </div>

            {/* Select Category */}
            <div className="flex flex-col space-y-1">
              <UiSelect value={advCategory} onValueChange={setAdvCategory}>
                <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select Category">Select Category</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="Core">Core</SelectItem>
                  <SelectItem value="Important">Important</SelectItem>
                  <SelectItem value="MVC">MVC</SelectItem>
                  <SelectItem value="Super Core">Super Core</SelectItem>
                  <SelectItem value="Super important">Super important</SelectItem>
                </SelectContent>
              </UiSelect>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid Render or Parameter Selection Empty State */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select the parameters to generate report.
        </div>
      ) : (
        /* Sub-tab selection and Table */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          {/* Sub tabs list */}
          <div className="flex border-b bg-slate-50/50 p-2 gap-2">
            <button
              onClick={() => setActiveTab("attended")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                activeTab === "attended"
                  ? "bg-white text-[#008272] border-[#008272]/20 shadow-xs"
                  : "text-slate-500 border-transparent hover:bg-slate-100"
              }`}
            >
              Doctors Attended
            </button>
            <button
              onClick={() => setActiveTab("missed")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                activeTab === "missed"
                  ? "bg-white text-[#008272] border-[#008272]/20 shadow-xs"
                  : "text-slate-500 border-transparent hover:bg-slate-100"
              }`}
            >
              Doctors Missed
            </button>
          </div>

          {/* Scrollable table container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[1500px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3.5 border-r border-b border-slate-200 text-center w-16">
                    S.No
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-center w-28">
                    Date
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-center w-20">
                    ID
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-48">
                    Name
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-44">
                    Assigned to
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-48">
                    Immediate Manager
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-36">
                    Division Name
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-36">
                    Speciality
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-center w-24">
                    Category
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-36">
                    Type
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-center w-24">
                    Priority
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-80">
                    Address
                  </th>
                  <th className="p-3.5 border-b border-slate-200 text-left pl-4 w-36">
                    Area
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {displayedRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={13}
                      className="p-10 text-center text-slate-400 font-semibold"
                    >
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  displayedRecords.map((row, idx) => (
                    <tr
                      key={`${row.id}-${idx}`}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-semibold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600">
                        {row.date}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-semibold text-slate-500">
                        {row.id}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">
                        {row.name}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-semibold text-slate-700">
                        {row.assignedTo}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600">
                        {row.immediateManager}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 font-semibold uppercase">
                        {row.divisionName}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500">
                        {row.speciality}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-[#008272]">
                        {row.category}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600">
                        {row.type || "-"}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-medium">
                        {row.priority ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-200/50">
                            {row.priority}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 leading-relaxed max-w-xs truncate" title={row.address}>
                        {row.address}
                      </td>
                      <td className="p-3.5 border-b border-slate-200 text-left pl-4 font-medium">
                        {row.area}
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

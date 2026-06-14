import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Info,
  ChevronRight,
  FileSpreadsheet,
  ArrowLeft,
  X,
  Plus,
  Minus,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DoctorCoverageRow {
  sNo: string;
  status: string;
  doctorName: string;
  employeeAssigned: string;
  categoryName: string;
  speciality: string;
  qualification: string;
  city: string;
  doctorType: string;
  doctorPriority: string;
  total: number;
  visits: Record<number, number>; // day -> count
}

const MOCK_RECORDS: DoctorCoverageRow[] = [
  {
    sNo: "1",
    status: "Active",
    doctorName: "DR ANKIT GUPTA",
    employeeAssigned: "Amarjeet Singh",
    categoryName: "A",
    speciality: "NEO",
    qualification: "MD",
    city: "Bhilai",
    doctorType: "Prescriber",
    doctorPriority: "High",
    total: 2,
    visits: { 5: 1, 12: 1 }
  },
  {
    sNo: "2",
    status: "Active",
    doctorName: "DR SD MENON",
    employeeAssigned: "SOURABH BARMAN",
    categoryName: "A+",
    speciality: "GYNAE",
    qualification: "MBBS, DGO",
    city: "Jabalpur",
    doctorType: "Prescriber",
    doctorPriority: "Super Core",
    total: 1,
    visits: { 10: 1 }
  }
];

const AVAILABLE_ZONES = ["Chhattisgarh", "Maharashtra", "Madhya Pradesh", "Gujarat"];
const AVAILABLE_EMPLOYEES = ["Amarjeet Singh", "SOURABH BARMAN", "Aniket patel", "Akash Sen", "ANKIT GUPTA"];
const AVAILABLE_DOCTORS = ["ANKIT GUPTA", "DR SD MENON", "DR DOLLY CHOUDHARY", "DR VERSHA ARYA", "khyati gupta"];

const SPECIALITIES = [
  "NEO", "GYNAE", "PAED", "PG Neo", "IVF", "OTHERS", "GYNEC", "GP-NO", "PEDIA",
  "CONSU", "DERMA", "ENTSP", "GP-MB", "PHYSI", "CARDIO", "CHEST", "DENTI", "GENER",
  "GP-NON MBBS", "PG-DC", "ORTHO", "GP", "MD", "Cosmetologist", "Dermatologist",
  "General Practitioner", "Plastic Surgeon", "Trichologist", "MBBS GENERAL PRACTITIONER",
  "Cosmetic", "Medicine", "PEAD", "SKIN & VD", "PHYSICIAN", "PG", "DGO", "ENT",
  "Practicing Gynaecs", "OPTHAL", "Gynaecologist", "Clinical Dermatologist", "BAMS", "GP GYN"
];

const CATEGORIES = ["A", "A+", "B", "C", "Core", "Important", "MVC", "Super Core", "Super Important"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const YEARS = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

export function DoctorCoverageReportPage() {
  // Primary Filters
  const [showInactive, setShowInactive] = React.useState(false);
  const [selectedZones, setSelectedZones] = React.useState<string[]>(["Chhattisgarh"]);
  const [division, setDivision] = React.useState("DERMA");
  const [selectedEmployees, setSelectedEmployees] = React.useState<string[]>(["Amarjeet Singh"]);
  const [selectedDoctors, setSelectedDoctors] = React.useState<string[]>(["ANKIT GUPTA"]);
  const [month, setMonth] = React.useState("February");
  const [year, setYear] = React.useState("2026");

  // Advanced Search Toggle
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(true); // Default open to match Snapshot 1 and 2

  // Advanced Filters
  const [type, setType] = React.useState("Non Prescriber"); // Prescriber, Non Prescriber
  const [category, setCategory] = React.useState("A");
  const [selectedSpecialities, setSelectedSpecialities] = React.useState<string[]>(["NEO"]);
  const [visitGreater, setVisitGreater] = React.useState("");
  const [visitLess, setVisitLess] = React.useState("");

  // Search/Dropdown lists toggle states
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const [zoneSearch, setZoneSearch] = React.useState("");
  const [isEmployeeOpen, setIsEmployeeOpen] = React.useState(false);
  const [employeeSearch, setEmployeeSearch] = React.useState("");
  const [isDoctorOpen, setIsDoctorOpen] = React.useState(false);
  const [doctorSearch, setDoctorSearch] = React.useState("");
  const [isSpecialityOpen, setIsSpecialityOpen] = React.useState(false);
  const [specialitySearch, setSpecialitySearch] = React.useState("");

  const zoneRef = React.useRef<HTMLDivElement>(null);
  const empRef = React.useRef<HTMLDivElement>(null);
  const docRef = React.useRef<HTMLDivElement>(null);
  const specRef = React.useRef<HTMLDivElement>(null);

  // Generate control
  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reports, setReports] = React.useState<DoctorCoverageRow[]>(MOCK_RECORDS);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (zoneRef.current && !zoneRef.current.contains(event.target as Node)) setIsZoneOpen(false);
      if (empRef.current && !empRef.current.contains(event.target as Node)) setIsEmployeeOpen(false);
      if (docRef.current && !docRef.current.contains(event.target as Node)) setIsDoctorOpen(false);
      if (specRef.current && !specRef.current.contains(event.target as Node)) setIsSpecialityOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter lists based on input query
  const filteredZones = AVAILABLE_ZONES.filter(z => z.toLowerCase().includes(zoneSearch.toLowerCase()) && !selectedZones.includes(z));
  const filteredEmployees = AVAILABLE_EMPLOYEES.filter(e => e.toLowerCase().includes(employeeSearch.toLowerCase()) && !selectedEmployees.includes(e));
  const filteredDoctors = AVAILABLE_DOCTORS.filter(d => d.toLowerCase().includes(doctorSearch.toLowerCase()) && !selectedDoctors.includes(d));
  const filteredSpecs = SPECIALITIES.filter(s => s.toLowerCase().includes(specialitySearch.toLowerCase()) && !selectedSpecialities.includes(s));

  // Calendar Helpers
  const getDaysInMonth = (monthName: string, yearStr: number) => {
    const monthMap: Record<string, number> = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };
    const m = monthMap[monthName] ?? 0;
    return new Date(yearStr, m + 1, 0).getDate();
  };

  const getShortMonthName = (monthName: string) => {
    const shortMap: Record<string, string> = {
      January: "Jan", February: "Feb", March: "Mar", April: "Apr", May: "May", June: "Jun",
      July: "Jul", August: "Aug", September: "Sep", October: "Oct", November: "Nov", December: "Dec"
    };
    return shortMap[monthName] ?? "Jan";
  };

  const daysCount = getDaysInMonth(month, parseInt(year));
  const shortMonth = getShortMonthName(month);

  const handleApplyFilters = () => {
    let filtered = MOCK_RECORDS;

    if (type !== "Select type") {
      filtered = filtered.filter(r => r.doctorType.toLowerCase() === type.toLowerCase());
    }
    if (category !== "Select category") {
      filtered = filtered.filter(r => r.categoryName.toLowerCase() === category.toLowerCase());
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
      "S.No", "Status", "Doctor NAME", "EMPLOYEE ASSIGNED", "Category Name",
      "SPECIALITY", "QUALIFICATION", "CITY", "DOCTOR TYPE", "DOCTOR PRIORITY", "TOTAL"
    ];

    // Append day columns to CSV headers
    for (let i = 1; i <= daysCount; i++) {
      headers.push(`${i}'${shortMonth} ${year}`);
    }

    const rows = reports.map((r) => {
      const rowData = [
        r.sNo,
        r.status,
        `"${r.doctorName}"`,
        `"${r.employeeAssigned}"`,
        r.categoryName,
        r.speciality,
        r.qualification,
        r.city,
        r.doctorType,
        r.doctorPriority,
        r.total
      ];

      for (let i = 1; i <= daysCount; i++) {
        rowData.push(r.visits[i] || "");
      }
      return rowData;
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Doctor_Coverage_Report_${month}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1.5">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
              Doctor Coverage Report
              <span title="Report showing daily visit logs for assigned doctors across a specific month.">
                <Info className="h-4.5 w-4.5 text-slate-400 cursor-help" />
              </span>
            </h1>

            {/* Checkbox Inactive data */}
            <div className="flex items-center space-x-2 text-xs">
              <Checkbox
                id="showInactive"
                checked={showInactive}
                onCheckedChange={(checked) => setShowInactive(!!checked)}
                className="data-[state=checked]:bg-[#008272] data-[state=checked]:border-[#008272] h-4 w-4"
              />
              <label htmlFor="showInactive" className="font-semibold text-slate-600 cursor-pointer select-none">
                Show Inactive Data
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        {/* Row 1 - Primary Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Zone Multi-Select tag console */}
          <div className="w-full sm:w-44 relative" ref={zoneRef}>
            <div
              className="flex items-center flex-wrap gap-1 p-1 border rounded-lg border-slate-200 bg-slate-50 min-h-[36px] max-h-[72px] overflow-y-auto cursor-text text-xs"
              onClick={() => {
                setIsZoneOpen(true);
              }}
            >
              {selectedZones.length === 0 && (
                <span className="text-slate-400 pl-1.5 py-0.5">Select zone</span>
              )}
              {selectedZones.map((z) => (
                <span
                  key={z}
                  className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[10px] px-1.5 py-0.5 rounded text-slate-700 font-medium"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedZones(selectedZones.filter(val => val !== z));
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
                className="bg-transparent border-none outline-none text-xs flex-1 ml-1 min-w-[40px] h-5"
              />
            </div>
            {isZoneOpen && filteredZones.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50 text-xs py-1">
                {filteredZones.map((z) => (
                  <button
                    key={z}
                    onClick={() => {
                      setSelectedZones([...selectedZones, z]);
                      setZoneSearch("");
                      setIsZoneOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    {z}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Division */}
          <div className="w-full sm:w-36">
            <UiSelect value={division} onValueChange={setDivision}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Division">All Division</SelectItem>
                <SelectItem value="DERMA">DERMA</SelectItem>
                <SelectItem value="GYNAE">GYNAE</SelectItem>
                <SelectItem value="PEDIA">PEDIA</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Employee Multi-select tag console */}
          <div className="w-full sm:w-44 relative" ref={empRef}>
            <div
              className="flex items-center flex-wrap gap-1 p-1 border rounded-lg border-slate-200 bg-slate-50 min-h-[36px] max-h-[72px] overflow-y-auto cursor-text text-xs"
              onClick={() => {
                setIsEmployeeOpen(true);
              }}
            >
              {selectedEmployees.length === 0 && (
                <span className="text-slate-400 pl-1.5 py-0.5">Select employee</span>
              )}
              {selectedEmployees.map((emp) => (
                <span
                  key={emp}
                  className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[10px] px-1.5 py-0.5 rounded text-slate-700 font-medium"
                >
                  <button
                    onClick={(evt) => {
                      evt.stopPropagation();
                      setSelectedEmployees(selectedEmployees.filter(val => val !== emp));
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
                className="bg-transparent border-none outline-none text-xs flex-1 ml-1 min-w-[40px] h-5"
              />
            </div>
            {isEmployeeOpen && filteredEmployees.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50 text-xs py-1">
                {filteredEmployees.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setSelectedEmployees([...selectedEmployees, e]);
                      setEmployeeSearch("");
                      setIsEmployeeOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select Doctor Multi-select tag console */}
          <div className="w-full sm:w-44 relative" ref={docRef}>
            <div
              className="flex items-center flex-wrap gap-1 p-1 border rounded-lg border-slate-200 bg-slate-50 min-h-[36px] max-h-[72px] overflow-y-auto cursor-text text-xs"
              onClick={() => {
                setIsDoctorOpen(true);
              }}
            >
              {selectedDoctors.length === 0 && (
                <span className="text-slate-400 pl-1.5 py-0.5">Select doctor</span>
              )}
              {selectedDoctors.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[10px] px-1.5 py-0.5 rounded text-slate-700 font-medium"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDoctors(selectedDoctors.filter(val => val !== d));
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
                value={doctorSearch}
                onChange={(e) => {
                  setDoctorSearch(e.target.value);
                  setIsDoctorOpen(true);
                }}
                onFocus={() => setIsDoctorOpen(true)}
                className="bg-transparent border-none outline-none text-xs flex-1 ml-1 min-w-[40px] h-5"
              />
            </div>
            {isDoctorOpen && filteredDoctors.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50 text-xs py-1">
                {filteredDoctors.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDoctors([...selectedDoctors, d]);
                      setDoctorSearch("");
                      setIsDoctorOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Month */}
          <div className="w-full sm:w-36">
            <UiSelect value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Year */}
          <div className="w-full sm:w-28">
            <UiSelect value={year} onValueChange={setYear}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleApplyFilters}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-5 font-bold text-xs shadow-xs active:scale-95 transition-transform"
            >
              Go
            </Button>
            <Button
              onClick={handleExportCSV}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-5 font-bold text-xs gap-1 shadow-xs active:scale-95 transition-transform"
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </Button>
          </div>
        </div>

        {/* Collapsible Advanced Search Header */}
        <div className="pt-1 select-none">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="text-[#008272] hover:underline font-semibold text-xs flex items-center gap-1 active:scale-98 transition-transform"
          >
            {isAdvancedOpen ? (
              <>
                <Minus className="h-3.5 w-3.5 text-[#008272]" /> Advanced Search
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 text-[#008272]" /> Advanced Search
              </>
            )}
          </button>
        </div>

        {/* Row 2 - Collapsible Advanced Filters */}
        {isAdvancedOpen && (
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 animate-slide-down">
            {/* Select Type (Prescriber, Non Prescriber) */}
            <div className="w-full sm:w-40">
              <UiSelect value={type} onValueChange={setType}>
                <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select type">Select type</SelectItem>
                  <SelectItem value="Prescriber">Prescriber</SelectItem>
                  <SelectItem value="Non Prescriber">Non Prescriber</SelectItem>
                </SelectContent>
              </UiSelect>
            </div>

            {/* Select Category */}
            <div className="w-full sm:w-44">
              <UiSelect value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select category">Select category</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </UiSelect>
            </div>

            {/* Select Speciality Multi-select tag console */}
            <div className="w-full sm:w-56 relative" ref={specRef}>
              <div
                className="flex items-center flex-wrap gap-1 p-1 border rounded-lg border-slate-200 bg-white min-h-[36px] max-h-[72px] overflow-y-auto cursor-text text-xs"
                onClick={() => {
                  setIsSpecialityOpen(true);
                }}
              >
                {selectedSpecialities.length === 0 && (
                  <span className="text-slate-400 pl-1.5 py-0.5">Select speciality</span>
                )}
                {selectedSpecialities.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded text-slate-700 font-medium"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpecialities(selectedSpecialities.filter(val => val !== s));
                      }}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                    {s}
                  </span>
                ))}
                <input
                  type="text"
                  value={specialitySearch}
                  onChange={(e) => {
                    setSpecialitySearch(e.target.value);
                    setIsSpecialityOpen(true);
                  }}
                  onFocus={() => setIsSpecialityOpen(true)}
                  className="bg-transparent border-none outline-none text-xs flex-1 ml-1 min-w-[40px] h-5"
                />
              </div>
              {isSpecialityOpen && filteredSpecs.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50 text-xs py-1">
                  {filteredSpecs.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSpecialities([...selectedSpecialities, s]);
                        setSpecialitySearch("");
                        setIsSpecialityOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Visit Greater than */}
            <div className="w-full sm:w-36">
              <input
                type="number"
                placeholder="Visit greater than"
                value={visitGreater}
                onChange={(e) => setVisitGreater(e.target.value)}
                className="w-full px-3 h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
              />
            </div>

            {/* Visit Less than */}
            <div className="w-full sm:w-36">
              <input
                type="number"
                placeholder="Visit less than"
                value={visitLess}
                onChange={(e) => setVisitLess(e.target.value)}
                className="w-full px-3 h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
              />
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
        /* Horizontally Scrollable Grid Container */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          {/* Info banner */}
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-[#008272]" />
              Doctor coverage calendar logs summary ({reports.length} records)
            </span>
            <span className="text-slate-400">Scroll horizontally to view day columns</span>
          </div>

          {/* Scrollable table container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[2000px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 select-none z-10 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pl-5 w-16 text-center border-r">S.No</th>
                  <th className="p-3.5 w-24 border-r">Status</th>
                  <th className="p-3.5 w-44 border-r">Doctor NAME</th>
                  <th className="p-3.5 w-44 border-r">EMPLOYEE ASSIGNED</th>
                  <th className="p-3.5 w-28 border-r">Category Name</th>
                  <th className="p-3.5 w-28 border-r">SPECIALITY</th>
                  <th className="p-3.5 w-28 border-r">QUALIFICATION</th>
                  <th className="p-3.5 w-28 border-r">CITY</th>
                  <th className="p-3.5 w-28 border-r">DOCTOR TYPE</th>
                  <th className="p-3.5 w-28 border-r">DOCTOR PRIORITY</th>
                  <th className="p-3.5 w-20 text-center border-r font-bold text-slate-800">TOTAL</th>
                  {Array.from({ length: daysCount }).map((_, i) => (
                    <th key={i} className="p-3.5 w-24 border-r text-center">
                      {i + 1}'{shortMonth}
                      <br />
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 bg-white">
                {/* Blank Summary/Default Row matching Snapshot 2 */}
                <tr className="bg-slate-50/20 font-medium">
                  <td className="p-3.5 pl-5 border-r text-center"></td>
                  <td className="p-3.5 border-r"></td>
                  <td className="p-3.5 border-r"></td>
                  <td className="p-3.5 border-r"></td>
                  <td className="p-3.5 border-r"></td>
                  <td className="p-3.5 border-r"></td>
                  <td className="p-3.5 border-r"></td>
                  <td className="p-3.5 border-r"></td>
                  <td className="p-3.5 border-r"></td>
                  <td className="p-3.5 border-r"></td>
                  <td className="p-3.5 border-r text-center font-bold text-slate-800">0</td>
                  {Array.from({ length: daysCount }).map((_, i) => (
                    <td key={i} className="p-3.5 border-r text-center"></td>
                  ))}
                </tr>

                {/* Populated records */}
                {reports.map((row) => (
                  <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 pl-5 text-center font-semibold text-slate-500 border-r">{row.sNo}</td>
                    <td className="p-3.5 border-r">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3.5 border-r font-bold text-slate-800">{row.doctorName}</td>
                    <td className="p-3.5 border-r font-semibold text-slate-600">{row.employeeAssigned}</td>
                    <td className="p-3.5 border-r text-center font-bold text-slate-500">{row.categoryName}</td>
                    <td className="p-3.5 border-r font-semibold text-slate-500">{row.speciality}</td>
                    <td className="p-3.5 border-r font-medium text-slate-600">{row.qualification}</td>
                    <td className="p-3.5 border-r">{row.city}</td>
                    <td className="p-3.5 border-r">{row.doctorType}</td>
                    <td className="p-3.5 border-r font-semibold text-slate-500">{row.doctorPriority}</td>
                    <td className="p-3.5 border-r text-center font-bold text-[#008272]">{row.total}</td>
                    {Array.from({ length: daysCount }).map((_, i) => {
                      const day = i + 1;
                      const hasVisit = row.visits[day];
                      return (
                        <td key={i} className={`p-3.5 border-r text-center font-bold ${hasVisit ? "text-[#008272] bg-emerald-50/20" : ""}`}>
                          {hasVisit || ""}
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

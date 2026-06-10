import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Info,
  Calendar,
  Download,
  ChevronRight,
  Search,
  Filter,
  X,
  FileSpreadsheet,
  ArrowLeft
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

export interface CallReportRow {
  sNo: number;
  status: "Skipped" | "Closed" | "Open" | "Pending";
  createdDateTime: string;
  visitDate: string;
  startedAt: string;
  checkInTime: string;
  closeVisitTime: string;
  doctorId: string;
  doctorName: string;
  doctorContact: string;
  doctorPincode: string;
  hospitalName: string;
  type: string;
  category: string;
  employeeCode: string;
  employeeName: string;
  hq: string;
  contactNumber: string;
  speciality: string;
  city: string;
  state: string;
  prescribedProducts: { name: string; prescription: string }[] | "NA";
  promotedProducts: { name: string; qty: number }[] | "NA";
  top5Products: string;
  promotionalGifts: { name: string; qty: number }[] | "NA";
  postCallInfo: string;
  objectiveName: string;
  objectiveRemarks: string;
  reportedFrom: string;
  clinicHospitalAddress: string;
  closedFrom: string;
  reportingMode: "Manual" | "Automated";
  locationSource: "GPS" | "Network" | "NA";
  workingWith: string;
  deviation: string;
  visitSyncDatetime: string;
  meetChemist: "Yes" | "No" | "NA";
  chemistRemark: string;
  reason: string;
  businessSlab: string;
  prefDay: string;
  prefTime: string;
  attachment: string;
  closedFromLatLog: string;
  pob: "Yes" | "No";
  detailsOfPob: string;
  totalPobValue: string;
}

const MOCK_CALL_REPORTS: CallReportRow[] = [
  {
    sNo: 1,
    status: "Skipped",
    createdDateTime: "09-06-2026 01:34:51 pm",
    visitDate: "09-06-2026",
    startedAt: "8:47 AM",
    checkInTime: "-",
    closeVisitTime: "-",
    doctorId: "7127",
    doctorName: "DR AJAY KAWLE",
    doctorContact: "-",
    doctorPincode: "490020",
    hospitalName: "KAWLE CLINIC",
    type: "Non Prescriber",
    category: "NA",
    employeeCode: "TEQEMP0109",
    employeeName: "YUGAL KISHOR SAHU",
    hq: "Durg",
    contactNumber: "7067399836",
    speciality: "PEDIA",
    city: "Bhilai",
    state: "CHHATTISGARH",
    prescribedProducts: "NA",
    promotedProducts: "NA",
    top5Products: "NA",
    promotionalGifts: "NA",
    postCallInfo: "NA",
    objectiveName: "-",
    objectiveRemarks: "No Address Found",
    reportedFrom: "No Address Found",
    clinicHospitalAddress: "6888+2VW, Bhilai, Smriti Nagar, Chhattisgarh 490020, India",
    closedFrom: "No Address Found",
    reportingMode: "Manual",
    locationSource: "NA",
    workingWith: "-",
    deviation: "NA",
    visitSyncDatetime: "-",
    meetChemist: "NA",
    chemistRemark: "-",
    reason: "Busy",
    businessSlab: "0-5000",
    prefDay: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
    prefTime: "0:0 PM to 2:0 PM",
    attachment: "NA",
    closedFromLatLog: "-",
    pob: "No",
    detailsOfPob: "-",
    totalPobValue: "-"
  },
  {
    sNo: 2,
    status: "Closed",
    createdDateTime: "09-06-2026 09:55:09 am",
    visitDate: "09-06-2026",
    startedAt: "-",
    checkInTime: "09:57 AM",
    closeVisitTime: "09:57 AM",
    doctorId: "9559",
    doctorName: "VIMAL KHUNTE",
    doctorContact: "-",
    doctorPincode: "-",
    hospitalName: "-",
    type: "-",
    category: "NA",
    employeeCode: "TEQEMP0099",
    employeeName: "SHUBHAM SHARMA",
    hq: "Durg",
    contactNumber: "8962483024",
    speciality: "GYNAE",
    city: "Rajnandgaon",
    state: "CHHATTISGARH",
    prescribedProducts: [
      { name: "Teqmed Cold-X", prescription: "1 tab BD" },
      { name: "Teqpara 650", prescription: "1 tab TDS" }
    ],
    promotedProducts: [
      { name: "Teqmed Cold-X", qty: 10 },
      { name: "Teqpara 650", qty: 20 }
    ],
    top5Products: "NA",
    promotionalGifts: [
      { name: "Premium Pen", qty: 2 },
      { name: "Writing Pad", qty: 1 }
    ],
    postCallInfo: "NA",
    objectiveName: "Business Call",
    objectiveRemarks: "Objective Precall",
    reportedFrom: "32V6+JX3, Hari Om Nagar, Anupam Nagar, Rajnandgaon, Chhattisgarh 491441, India",
    clinicHospitalAddress: "32V6+JX3, Hari Om Nagar, Anupam Nagar, Rajnandgaon, Chhattisgarh 491441, India",
    closedFrom: "32V6+JX3, Hari Om Nagar, Anupam Nagar, Rajnandgaon, Chhattisgarh 491441, India",
    reportingMode: "Automated",
    locationSource: "GPS",
    workingWith: "-",
    deviation: "NA",
    visitSyncDatetime: "09-06-2026 09:57:26",
    meetChemist: "No",
    chemistRemark: "-",
    reason: "-",
    businessSlab: "0-5000",
    prefDay: "-",
    prefTime: "-",
    attachment: "NA",
    closedFromLatLog: "21.09411456,81.01242522",
    pob: "No",
    detailsOfPob: "-",
    totalPobValue: "-"
  },
  {
    sNo: 3,
    status: "Closed",
    createdDateTime: "09-06-2026 10:31:07 am",
    visitDate: "09-06-2026",
    startedAt: "-",
    checkInTime: "10:40 AM",
    closeVisitTime: "10:40 AM",
    doctorId: "9550",
    doctorName: "SURUCHI MISHRA",
    doctorContact: "-",
    doctorPincode: "-",
    hospitalName: "-",
    type: "-",
    category: "NA",
    employeeCode: "TEQEMP0099",
    employeeName: "SHUBHAM SHARMA",
    hq: "Durg",
    contactNumber: "8962483024",
    speciality: "GYNAE",
    city: "Rajnandgaon",
    state: "CHHATTISGARH",
    prescribedProducts: "NA",
    promotedProducts: [
      { name: "Teqmox-CV 625", qty: 15 }
    ],
    top5Products: "NA",
    promotionalGifts: "NA",
    postCallInfo: "NA",
    objectiveName: "Business Call",
    objectiveRemarks: "-",
    reportedFrom: "32RM+QX Rajnandgaon, Chhattisgarh, India",
    clinicHospitalAddress: "32RM+QX Rajnandgaon, Chhattisgarh, India",
    closedFrom: "32RM+QX Rajnandgaon, Chhattisgarh, India",
    reportingMode: "Automated",
    locationSource: "Network",
    workingWith: "-",
    deviation: "NA",
    visitSyncDatetime: "09-06-2026 10:40:33",
    meetChemist: "No",
    chemistRemark: "-",
    reason: "-",
    businessSlab: "0-5000",
    prefDay: "-",
    prefTime: "-",
    attachment: "NA",
    closedFromLatLog: "21.09113826,81.03544543",
    pob: "No",
    detailsOfPob: "-",
    totalPobValue: "-"
  }
];

const AVAILABLE_STATES = [
  "Chhattisgarh",
  "Maharashtra",
  "Madhya Pradesh",
  "Gujarat",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Bihar",
  "Rajasthan",
  "West Bengal",
  "Punjab",
  "Haryana"
];

export function DailyCallReportsPage() {
  // Filters State
  const [status, setStatus] = React.useState("All");
  const [selectedStates, setSelectedStates] = React.useState<string[]>(["Chhattisgarh"]);
  const [speciality, setSpeciality] = React.useState("DERMA");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [startDate, setStartDate] = React.useState("2026-06-09");
  const [endDate, setEndDate] = React.useState("2026-06-10");
  const [campaign, setCampaign] = React.useState("All Campaign");
  const [pobStatus, setPobStatus] = React.useState("All");
  const [category, setCategory] = React.useState("All Category");

  // State HQ Selection Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [stateSearch, setStateSearch] = React.useState("");
  const stateDropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredStates = AVAILABLE_STATES.filter(s =>
    s.toLowerCase().includes(stateSearch.toLowerCase()) &&
    !selectedStates.includes(s)
  );

  // Grid Data
  const [reports, setReports] = React.useState<CallReportRow[]>(MOCK_CALL_REPORTS);

  const handleApplyFilters = () => {
    let filtered = MOCK_CALL_REPORTS;

    // 1. Status Filter
    if (status !== "All") {
      filtered = filtered.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    // 2. Specialty Filter
    if (speciality !== "All") {
      filtered = filtered.filter((r) => r.speciality.toLowerCase() === speciality.toLowerCase());
    }

    // 3. Search Query (Doctor Name / Employee Name)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.doctorName.toLowerCase().includes(q) ||
          r.employeeName.toLowerCase().includes(q)
      );
    }

    setReports(filtered);
    toast.success("Filters applied successfully!");
  };

  const handleExportCSV = () => {
    // Generate clean CSV string
    const headers = [
      "S.No",
      "Status",
      "Created Date Time",
      "Visit Date",
      "Started At",
      "Check-In Time",
      "Close Visit Time",
      "Doctor Id",
      "Doctor Name",
      "Doctor Contact Number",
      "Doctor Pincode",
      "Hospital Name",
      "Type",
      "Category",
      "Employee Code",
      "Employee Name",
      "HQ",
      "Contact Number",
      "Speciality",
      "City",
      "State",
      "Objective Name",
      "Objective Remarks",
      "Reported From",
      "Clinic/Hospital Address",
      "Closed From",
      "Reporting Mode",
      "Location Source",
      "Visit Sync Datetime",
      "Meet Chemist",
      "Reason",
      "Business Slab",
      "POB(Yes/No)"
    ];

    const rows = reports.map((r) => [
      r.sNo,
      r.status,
      `"${r.createdDateTime}"`,
      r.visitDate,
      r.startedAt,
      r.checkInTime,
      r.closeVisitTime,
      r.doctorId,
      `"${r.doctorName}"`,
      r.doctorContact,
      r.doctorPincode,
      `"${r.hospitalName}"`,
      r.type,
      r.category,
      r.employeeCode,
      `"${r.employeeName}"`,
      r.hq,
      r.contactNumber,
      r.speciality,
      r.city,
      r.state,
      `"${r.objectiveName}"`,
      `"${r.objectiveRemarks}"`,
      `"${r.reportedFrom}"`,
      `"${r.clinicHospitalAddress}"`,
      `"${r.closedFrom}"`,
      r.reportingMode,
      r.locationSource,
      r.visitSyncDatetime,
      r.meetChemist,
      r.reason,
      r.businessSlab,
      r.pob
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sefmed_Call_Report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  const removeStateTag = (stateToRemove: string) => {
    setSelectedStates((prev) => prev.filter((s) => s !== stateToRemove));
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
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mt-1">
            Call Report
            <span title="Detailed logs of chemist and doctor calls logged by field reps.">
              <Info className="h-4.5 w-4.5 text-slate-400 cursor-help" />
            </span>
          </h1>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          {/* Status filter dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
            <UiSelect value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Skipped">Skipped</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* State Multi-select Simulation Container */}
          <div className="space-y-1 md:col-span-2 relative" ref={stateDropdownRef}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State HQ</label>
            <div
              className="flex items-center flex-wrap gap-1.5 p-1 border rounded-lg border-slate-200 bg-slate-50 min-h-[36px] max-h-[72px] overflow-y-auto cursor-text"
              onClick={() => {
                inputRef.current?.focus();
                setIsDropdownOpen(true);
              }}
            >
              {selectedStates.map((st) => (
                <span key={st} className="inline-flex items-center gap-1 bg-white border border-slate-200 text-xs px-2 py-0.5 rounded-md text-slate-700 font-medium">
                  {st}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStateTag(st);
                    }}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                ref={inputRef}
                type="text"
                placeholder={selectedStates.length === 0 ? "Select state..." : ""}
                value={stateSearch}
                onChange={(e) => {
                  setStateSearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="bg-transparent border-none outline-none text-xs flex-1 ml-1 min-w-[60px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (stateSearch.trim()) {
                      const matchedState = AVAILABLE_STATES.find(
                        s => s.toLowerCase() === stateSearch.trim().toLowerCase()
                      );
                      const val = matchedState || stateSearch.trim();
                      if (!selectedStates.includes(val)) {
                        setSelectedStates([...selectedStates, val]);
                      }
                      setStateSearch("");
                      setIsDropdownOpen(false);
                    }
                  } else if (e.key === "Backspace" && !stateSearch && selectedStates.length > 0) {
                    setSelectedStates(selectedStates.slice(0, -1));
                  }
                }}
              />
            </div>

            {/* State selection floating dropdown list */}
            {isDropdownOpen && filteredStates.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 text-xs py-1">
                {filteredStates.map((st) => (
                  <button
                    key={st}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedStates([...selectedStates, st]);
                      setStateSearch("");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specialty */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialty</label>
            <UiSelect value={speciality} onValueChange={setSpeciality}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="DERMA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Specialties</SelectItem>
                <SelectItem value="DERMA">DERMA</SelectItem>
                <SelectItem value="PEDIA">PEDIA</SelectItem>
                <SelectItem value="GYNAE">GYNAE</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Search text input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Doctor/Employee</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-8 pr-2 h-9 text-xs bg-slate-50 border rounded-lg border-slate-200"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-8 pr-2 h-9 text-xs bg-slate-50 border rounded-lg border-slate-200"
              />
            </div>
          </div>

          {/* Campaign */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campaign</label>
            <UiSelect value={campaign} onValueChange={setCampaign}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Campaign">All Campaign</SelectItem>
                <SelectItem value="Monsoon Blitz">Monsoon Blitz</SelectItem>
                <SelectItem value="Winter Special">Winter Special</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* POB Yes/No */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">POB (Yes/No)</label>
            <UiSelect value={pobStatus} onValueChange={setPobStatus}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
            <UiSelect value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Category">All Category</SelectItem>
                <SelectItem value="A">Class A</SelectItem>
                <SelectItem value="B">Class B</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>
        </div>

        {/* Filters Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button
            onClick={handleApplyFilters}
            className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-5 font-bold text-xs gap-1.5 shadow-xs active:scale-95 transition-transform"
          >
            Go <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleExportCSV}
            className="bg-[#107c41] hover:bg-[#0b592e] text-white h-9 px-5 font-bold text-xs gap-1.5 shadow-xs active:scale-95 transition-transform"
          >
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      {/* Horizontally Scrollable Grid Container */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1">
        {/* Info banner */}
        <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
          <span>Daily Call Logs Table ({reports.length} records)</span>
          <span className="text-slate-400">Scroll horizontally to view all parameters</span>
        </div>

        {/* Scrollable container */}
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[3200px]">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 select-none z-10">
              <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5 pl-5 w-16 text-center border-r">S.No</th>
                <th className="p-3.5 w-24 text-center border-r">Status</th>
                <th className="p-3.5 w-48 border-r">Created Date Time</th>
                <th className="p-3.5 w-32 border-r">Visit Date</th>
                <th className="p-3.5 w-28 border-r">Started At</th>
                <th className="p-3.5 w-32 border-r">Check-In Time</th>
                <th className="p-3.5 w-36 border-r">Close Visit Time</th>
                <th className="p-3.5 w-28 border-r">Doctor Id</th>
                <th className="p-3.5 w-44 border-r">Doctor Name</th>
                <th className="p-3.5 w-36 border-r">Doctor Contact Number</th>
                <th className="p-3.5 w-32 border-r">Doctor Pincode</th>
                <th className="p-3.5 w-44 border-r">Hospital Name</th>
                <th className="p-3.5 w-32 border-r">Type</th>
                <th className="p-3.5 w-24 border-r">Category</th>
                <th className="p-3.5 w-36 border-r">Employee Code</th>
                <th className="p-3.5 w-48 border-r">Employee Name</th>
                <th className="p-3.5 w-28 border-r">HQ</th>
                <th className="p-3.5 w-36 border-r">Contact Number</th>
                <th className="p-3.5 w-32 border-r">Speciality</th>
                <th className="p-3.5 w-32 border-r">City</th>
                <th className="p-3.5 w-36 border-r">State</th>
                <th className="p-3.5 w-60 border-r">Prescribed Products</th>
                <th className="p-3.5 w-60 border-r">Promoted Products</th>
                <th className="p-3.5 w-32 border-r">Top5 Products</th>
                <th className="p-3.5 w-60 border-r">Promotional Gifts</th>
                <th className="p-3.5 w-36 border-r">Post call information</th>
                <th className="p-3.5 w-36 border-r">Objective Name</th>
                <th className="p-3.5 w-56 border-r">Objective Remarks</th>
                <th className="p-3.5 w-60 border-r">Reported From</th>
                <th className="p-3.5 w-72 border-r">Clinic/Hospital Address</th>
                <th className="p-3.5 w-60 border-r">Closed From</th>
                <th className="p-3.5 w-36 border-r">Reporting Mode</th>
                <th className="p-3.5 w-32 border-r">Location Source</th>
                <th className="p-3.5 w-32 border-r">Working With</th>
                <th className="p-3.5 w-28 border-r">Deviation</th>
                <th className="p-3.5 w-44 border-r">Visit Sync Datetime</th>
                <th className="p-3.5 w-32 border-r">Meet Chemist</th>
                <th className="p-3.5 w-48 border-r">Chemist Remark</th>
                <th className="p-3.5 w-32 border-r">Reason</th>
                <th className="p-3.5 w-32 border-r">Business Slab</th>
                <th className="p-3.5 w-52 border-r">Pref Day</th>
                <th className="p-3.5 w-44 border-r">Pref Time</th>
                <th className="p-3.5 w-32 border-r">Attachment</th>
                <th className="p-3.5 w-48 border-r">Closed From Lat,Log</th>
                <th className="p-3.5 w-32 border-r">POB(Yes/No)</th>
                <th className="p-3.5 w-36 border-r">Details of POB</th>
                <th className="p-3.5 w-36">Total POB Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {reports.map((row) => (
                <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5 pl-5 text-center font-semibold text-slate-500 border-r">{row.sNo}</td>
                  <td className="p-3.5 text-center border-r">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === "Skipped"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium border-r">{row.createdDateTime}</td>
                  <td className="p-3.5 border-r">{row.visitDate}</td>
                  <td className="p-3.5 border-r">{row.startedAt}</td>
                  <td className="p-3.5 border-r">{row.checkInTime}</td>
                  <td className="p-3.5 border-r">{row.closeVisitTime}</td>
                  <td className="p-3.5 font-semibold text-slate-500 border-r">{row.doctorId}</td>
                  <td className="p-3.5 font-bold text-slate-900 border-r">{row.doctorName}</td>
                  <td className="p-3.5 border-r">{row.doctorContact}</td>
                  <td className="p-3.5 border-r">{row.doctorPincode}</td>
                  <td className="p-3.5 border-r">{row.hospitalName}</td>
                  <td className="p-3.5 border-r">{row.type}</td>
                  <td className="p-3.5 border-r">{row.category}</td>
                  <td className="p-3.5 font-semibold text-slate-500 border-r">{row.employeeCode}</td>
                  <td className="p-3.5 font-bold text-slate-900 border-r">{row.employeeName}</td>
                  <td className="p-3.5 border-r">{row.hq}</td>
                  <td className="p-3.5 border-r">{row.contactNumber}</td>
                  <td className="p-3.5 border-r">{row.speciality}</td>
                  <td className="p-3.5 border-r">{row.city}</td>
                  <td className="p-3.5 border-r">{row.state}</td>

                  {/* Prescribed Products Box Layout */}
                  <td className="p-2.5 border-r">
                    {Array.isArray(row.prescribedProducts) ? (
                      <div className="border border-slate-200 rounded-md overflow-hidden bg-white text-[10px] w-full">
                        <div className="flex bg-slate-50 font-bold border-b border-slate-200 px-2 py-1 select-none">
                          <span className="flex-1">Name</span>
                          <span className="w-20 text-right">Prescription</span>
                        </div>
                        {row.prescribedProducts.map((p, i) => (
                          <div key={i} className="flex px-2 py-1 border-b last:border-0 border-slate-100">
                            <span className="flex-1 truncate font-medium">{p.name}</span>
                            <span className="w-20 text-right text-slate-500 font-semibold">{p.prescription}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="px-2">{row.prescribedProducts}</span>
                    )}
                  </td>

                  {/* Promoted Products Box Layout */}
                  <td className="p-2.5 border-r">
                    {Array.isArray(row.promotedProducts) ? (
                      <div className="border border-slate-200 rounded-md overflow-hidden bg-white text-[10px] w-full">
                        <div className="flex bg-slate-50 font-bold border-b border-slate-200 px-2 py-1 select-none">
                          <span className="flex-1">Name</span>
                          <span className="w-12 text-right">Qty</span>
                        </div>
                        {row.promotedProducts.map((p, i) => (
                          <div key={i} className="flex px-2 py-1 border-b last:border-0 border-slate-100">
                            <span className="flex-1 truncate font-medium">{p.name}</span>
                            <span className="w-12 text-right text-slate-500 font-semibold">{p.qty}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="px-2">{row.promotedProducts}</span>
                    )}
                  </td>

                  <td className="p-3.5 border-r">{row.top5Products}</td>

                  {/* Promotional Gifts Box Layout */}
                  <td className="p-2.5 border-r">
                    {Array.isArray(row.promotionalGifts) ? (
                      <div className="border border-slate-200 rounded-md overflow-hidden bg-white text-[10px] w-full">
                        <div className="flex bg-slate-50 font-bold border-b border-slate-200 px-2 py-1 select-none">
                          <span className="flex-1">Name</span>
                          <span className="w-12 text-right">Qty</span>
                        </div>
                        {row.promotionalGifts.map((p, i) => (
                          <div key={i} className="flex px-2 py-1 border-b last:border-0 border-slate-100">
                            <span className="flex-1 truncate font-medium">{p.name}</span>
                            <span className="w-12 text-right text-slate-500 font-semibold">{p.qty}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="px-2">{row.promotionalGifts}</span>
                    )}
                  </td>

                  <td className="p-3.5 border-r">{row.postCallInfo}</td>
                  <td className="p-3.5 border-r">{row.objectiveName}</td>
                  <td className="p-3.5 border-r text-slate-500 font-medium">{row.objectiveRemarks}</td>
                  <td className="p-3.5 border-r text-slate-500 truncate max-w-[200px]" title={row.reportedFrom}>{row.reportedFrom}</td>
                  <td className="p-3.5 border-r text-slate-500 truncate max-w-[200px]" title={row.clinicHospitalAddress}>{row.clinicHospitalAddress}</td>
                  <td className="p-3.5 border-r text-slate-500 truncate max-w-[200px]" title={row.closedFrom}>{row.closedFrom}</td>
                  <td className="p-3.5 border-r">{row.reportingMode}</td>
                  <td className="p-3.5 border-r">{row.locationSource}</td>
                  <td className="p-3.5 border-r">{row.workingWith}</td>
                  <td className="p-3.5 border-r">{row.deviation}</td>
                  <td className="p-3.5 border-r text-slate-500">{row.visitSyncDatetime}</td>
                  <td className="p-3.5 border-r">{row.meetChemist}</td>
                  <td className="p-3.5 border-r">{row.chemistRemark}</td>
                  <td className="p-3.5 border-r">{row.reason}</td>
                  <td className="p-3.5 border-r">{row.businessSlab}</td>
                  <td className="p-3.5 border-r text-slate-500 truncate max-w-[180px]" title={row.prefDay}>{row.prefDay}</td>
                  <td className="p-3.5 border-r">{row.prefTime}</td>
                  <td className="p-3.5 border-r">{row.attachment}</td>
                  <td className="p-3.5 border-r font-mono text-[10px] text-slate-500">{row.closedFromLatLog}</td>
                  <td className="p-3.5 border-r">{row.pob}</td>
                  <td className="p-3.5 border-r">{row.detailsOfPob}</td>
                  <td className="p-3.5">{row.totalPobValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

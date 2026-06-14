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
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DailyCallReportRow {
  sNo: number;
  status: "Skipped" | "Closed" | "Open" | "Pending";
  visitDate: string;
  startedAt: string;
  checkInTime: string;
  closeVisitTime: string;
  doctorId: string;
  doctorName: string;
  doctorContactNumber: string;
  hospitalName: string;
  employeeName: string;
  speciality: string;
  designation: string;
  city: string;
  state: string;
  productUsing: string;
  productTargeted: string;
  samplePromotedAndRemark: string;
  promotionalGifts: string;
  postCallInformation: string;
  reportedFrom: string;
  clinicHospitalAddress: string;
  closedFrom: string;
  reportingMode: "Manual" | "Automated";
  locationSource: string;
  workingWith: string;
  deviation: string;
  visitSyncDatetime: string;
  pobYesNo: "Yes" | "No";
  detailsOfPob: string;
  totalPobValue: string;
}

const MOCK_DAILY_CALL_REPORTS: DailyCallReportRow[] = [
  {
    sNo: 1,
    status: "Skipped",
    visitDate: "10-06-2026",
    startedAt: "7:28 AM",
    checkInTime: "-",
    closeVisitTime: "-",
    doctorId: "9278",
    doctorName: "DR SD MENON",
    doctorContactNumber: "",
    hospitalName: "",
    employeeName: "SOURABH BARMAN",
    speciality: "GYNAE",
    designation: "MR",
    city: "Jabalpur",
    state: "MADHYA PRADESH",
    productUsing: "NA",
    productTargeted: "NA",
    samplePromotedAndRemark: "NA",
    promotionalGifts: "",
    postCallInformation: "NA",
    reportedFrom: "No Address Found",
    clinicHospitalAddress: "4VXM+MGC, Medical Garha, Jabalpur, Madhya Pradesh 482003, India",
    closedFrom: "No Address Found",
    reportingMode: "Manual",
    locationSource: "NA",
    workingWith: "",
    deviation: "",
    visitSyncDatetime: "NA",
    pobYesNo: "No",
    detailsOfPob: "-",
    totalPobValue: "-"
  },
  {
    sNo: 2,
    status: "Skipped",
    visitDate: "10-06-2026",
    startedAt: "-",
    checkInTime: "-",
    closeVisitTime: "-",
    doctorId: "9198",
    doctorName: "DR DOLLY CHOUDHARY",
    doctorContactNumber: "",
    hospitalName: "",
    employeeName: "Aniket patel",
    speciality: "GYNAE",
    designation: "ASM",
    city: "Mandla",
    state: "MADHYA PRADESH",
    productUsing: "NA",
    productTargeted: "NA",
    samplePromotedAndRemark: "NA",
    promotionalGifts: "",
    postCallInformation: "NA",
    reportedFrom: "J9P7+945, Katra, Gonjhi Ryt., Madhya Pradesh 481661, India",
    clinicHospitalAddress: "J9P7+945, Katra, Gonjhi Ryt., Madhya Pradesh 481661, India",
    closedFrom: "No Address Found",
    reportingMode: "Automated",
    locationSource: "Gps",
    workingWith: "",
    deviation: "",
    visitSyncDatetime: "NA",
    pobYesNo: "No",
    detailsOfPob: "-",
    totalPobValue: "-"
  },
  {
    sNo: 3,
    status: "Skipped",
    visitDate: "10-06-2026",
    startedAt: "-",
    checkInTime: "-",
    closeVisitTime: "-",
    doctorId: "9193",
    doctorName: "DR VERSHA ARYA",
    doctorContactNumber: "",
    hospitalName: "",
    employeeName: "Aniket patel",
    speciality: "GYNAE",
    designation: "ASM",
    city: "Mandla",
    state: "MADHYA PRADESH",
    productUsing: "NA",
    productTargeted: "NA",
    samplePromotedAndRemark: "NA",
    promotionalGifts: "",
    postCallInformation: "NA",
    reportedFrom: "No Address Found",
    clinicHospitalAddress: "J94C+P32, Binjhiya, Madhya Pradesh 481661, India",
    closedFrom: "No Address Found",
    reportingMode: "Manual",
    locationSource: "NA",
    workingWith: "",
    deviation: "",
    visitSyncDatetime: "NA",
    pobYesNo: "No",
    detailsOfPob: "-",
    totalPobValue: "-"
  },
  {
    sNo: 4,
    status: "Skipped",
    visitDate: "10-06-2026",
    startedAt: "-",
    checkInTime: "-",
    closeVisitTime: "-",
    doctorId: "10504",
    doctorName: "khyati gupta",
    doctorContactNumber: "",
    hospitalName: "omega Hyderabad hospital",
    employeeName: "SOURABH BARMAN",
    speciality: "Gynaecologist",
    designation: "MR",
    city: "Jabalpur",
    state: "MADHYA PRADESH",
    productUsing: "NA",
    productTargeted: "NA",
    samplePromotedAndRemark: "NA",
    promotionalGifts: "",
    postCallInformation: "NA",
    reportedFrom: "ground floor manish apartment 27 north civil line nagrath chowk, beside bajaj frontier, South Civil Lines, Jabalpur, Madhya Pradesh 482001, India",
    clinicHospitalAddress: "ground floor manish apartment 27 north civil line nagrath chowk, beside bajaj frontier, South Civil Lines, Jabalpur, Madhya Pradesh 482001, India",
    closedFrom: "No Address Found",
    reportingMode: "Automated",
    locationSource: "Gps",
    workingWith: "",
    deviation: "",
    visitSyncDatetime: "NA",
    pobYesNo: "No",
    detailsOfPob: "-",
    totalPobValue: "-"
  }
];

const AVAILABLE_ZONES = ["Chhattisgarh", "Maharashtra", "Madhya Pradesh", "Gujarat"];

export function DailyCallReportForLotusPage() {
  // Filters State
  const [division, setDivision] = React.useState("All");
  const [selectedZones, setSelectedZones] = React.useState<string[]>([]);
  const [employee, setEmployee] = React.useState("All Employee");
  const [startDate, setStartDate] = React.useState("2026-06-10");
  const [endDate, setEndDate] = React.useState("2026-06-11");
  const [clientType, setClientType] = React.useState("All");
  const [campaign, setCampaign] = React.useState("All Campaign");
  const [status, setStatus] = React.useState("All Status");
  const [designation, setDesignation] = React.useState("All Designation");

  // Focus tracking for dates
  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  // Zone multi-select states
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const [zoneSearch, setZoneSearch] = React.useState("");
  const zoneDropdownRef = React.useRef<HTMLDivElement>(null);
  const zoneInputRef = React.useRef<HTMLInputElement>(null);

  // Generate control
  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reports, setReports] = React.useState<DailyCallReportRow[]>(MOCK_DAILY_CALL_REPORTS);

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
    let filtered = MOCK_DAILY_CALL_REPORTS;

    if (employee !== "All Employee") {
      filtered = filtered.filter((r) => r.employeeName.toLowerCase().includes(employee.toLowerCase()));
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
      "S.No", "Status", "Visit Date", "Started At", "Check-In Time", "Close Visit Time",
      "Doctor Id", "Doctor Name", "Doctor Contact Number", "Hospital Name", "Employee Name",
      "Speciality", "Designation", "City", "State", "Product Using", "Product Targeted",
      "Sample Promoted And Remark", "Promotional Gifts", "Post call information", "Reported From",
      "Clinic/Hospital Address", "Closed From", "Reporting Mode", "Location Source", "Working With",
      "Deviation", "Visit_sync_datetime", "POB(Yes/No)", "Details of POB", "Total POB Value"
    ];

    const rows = reports.map((r) => [
      r.sNo,
      r.status,
      r.visitDate,
      r.startedAt,
      r.checkInTime,
      r.closeVisitTime,
      r.doctorId,
      `"${r.doctorName}"`,
      r.doctorContactNumber,
      `"${r.hospitalName}"`,
      `"${r.employeeName}"`,
      r.speciality,
      r.designation,
      r.city,
      r.state,
      r.productUsing,
      r.productTargeted,
      r.samplePromotedAndRemark,
      r.promotionalGifts,
      r.postCallInformation,
      `"${r.reportedFrom}"`,
      `"${r.clinicHospitalAddress}"`,
      `"${r.closedFrom}"`,
      r.reportingMode,
      r.locationSource,
      r.workingWith,
      r.deviation,
      r.visitSyncDatetime,
      r.pobYesNo,
      r.detailsOfPob,
      r.totalPobValue
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Daily_Call_Report_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  const removeZoneTag = (zoneToRemove: string) => {
    setSelectedZones((prev) => prev.filter((z) => z !== zoneToRemove));
  };

  const formatDateForTable = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return (
        <div className="leading-tight text-slate-500 font-medium">
          {parts[0]}-
          <br />
          {parts[1]}-
          <br />
          {parts[2]}
        </div>
      );
    }
    return dateStr;
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
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5 mt-1">
            Daily Call Report
            <span title="Report displaying detailed doctor/chemist visit logs completed by reps.">
              <Info className="h-4.5 w-4.5 text-slate-400 cursor-help" />
            </span>
          </h1>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        {/* Single row filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Division */}
          <div className="w-full sm:w-28">
            <UiSelect value={division} onValueChange={setDivision}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="DERMA">DERMA</SelectItem>
                <SelectItem value="GYNAE">GYNAE</SelectItem>
                <SelectItem value="PEDIA">PEDIA</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Zone Multi-Select */}
          <div className="w-full sm:w-40 relative" ref={zoneDropdownRef}>
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

          {/* Employee */}
          <div className="w-full sm:w-36">
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Employee">All Employee</SelectItem>
                <SelectItem value="SOURABH BARMAN">SOURABH BARMAN</SelectItem>
                <SelectItem value="Aniket patel">Aniket patel</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* From Date */}
          <div className="w-full sm:w-32">
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
          <div className="w-full sm:w-32">
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

          {/* Client Type */}
          <div className="w-full sm:w-28">
            <UiSelect value={clientType} onValueChange={setClientType}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Chemist">Chemist</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Campaign */}
          <div className="w-full sm:w-36">
            <UiSelect value={campaign} onValueChange={setCampaign}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Campaign">All Campaign</SelectItem>
                <SelectItem value="General Campaign">General Campaign</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Status */}
          <div className="w-full sm:w-32">
            <UiSelect value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Designation */}
          <div className="w-full sm:w-36">
            <UiSelect value={designation} onValueChange={setDesignation}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Designation">All Designation</SelectItem>
                <SelectItem value="MR">MR</SelectItem>
                <SelectItem value="ASM">ASM</SelectItem>
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
              className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-5 font-bold text-xs shadow-xs active:scale-95 transition-transform"
            >
              <FileSpreadsheet className="h-4 w-4" />
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
              Daily call log entries summary ({reports.length} records)
            </span>
            <span className="text-slate-400">Scroll horizontally to view all fields</span>
          </div>

          {/* Scrollable table container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[3400px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 select-none z-10 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5 pl-5 w-16 text-center border-r">S.No</th>
                  <th className="p-3.5 w-24 text-center border-r">Status</th>
                  <th className="p-3.5 w-28 border-r">Visit Date</th>
                  <th className="p-3.5 w-28 border-r">Started At</th>
                  <th className="p-3.5 w-28 border-r">Check-In Time</th>
                  <th className="p-3.5 w-28 border-r">Close Visit Time</th>
                  <th className="p-3.5 w-24 border-r">Doctor Id</th>
                  <th className="p-3.5 w-44 border-r">Doctor Name</th>
                  <th className="p-3.5 w-36 border-r text-center">
                    Doctor
                    <br />
                    Contact
                    <br />
                    Number
                  </th>
                  <th className="p-3.5 w-52 border-r">Hospital Name</th>
                  <th className="p-3.5 w-44 border-r">Employee Name</th>
                  <th className="p-3.5 w-28 border-r">Speciality</th>
                  <th className="p-3.5 w-28 border-r">Designation</th>
                  <th className="p-3.5 w-32 border-r">City</th>
                  <th className="p-3.5 w-36 border-r">State</th>
                  <th className="p-3.5 w-32 border-r">Product Using</th>
                  <th className="p-3.5 w-32 border-r">Product Targeted</th>
                  <th className="p-3.5 w-44 border-r">Sample Promoted And Remark</th>
                  <th className="p-3.5 w-36 border-r">Promotional Gifts</th>
                  <th className="p-3.5 w-40 border-r">Post call information</th>
                  <th className="p-3.5 w-56 border-r">Reported From</th>
                  <th className="p-3.5 w-60 border-r">Clinic/Hospital Address</th>
                  <th className="p-3.5 w-36 border-r">Closed From</th>
                  <th className="p-3.5 w-32 border-r">Reporting Mode</th>
                  <th className="p-3.5 w-32 border-r">Location Source</th>
                  <th className="p-3.5 w-32 border-r">Working With</th>
                  <th className="p-3.5 w-28 border-r">Deviation</th>
                  <th className="p-3.5 w-44 border-r">Visit_sync_datetime</th>
                  <th className="p-3.5 w-32 border-r">POB(Yes/No)</th>
                  <th className="p-3.5 w-32 border-r">Details of POB</th>
                  <th className="p-3.5">Total POB Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 bg-white">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={31} className="p-10 text-center text-slate-400 font-semibold">
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  reports.map((row) => (
                    <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 pl-5 text-center font-semibold text-slate-500 border-r">{row.sNo}</td>
                      <td className="p-3.5 text-center border-r">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white bg-rose-500 border border-rose-600`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3.5 border-r">{formatDateForTable(row.visitDate)}</td>
                      <td className="p-3.5 border-r font-medium">{row.startedAt}</td>
                      <td className="p-3.5 border-r">{row.checkInTime}</td>
                      <td className="p-3.5 border-r">{row.closeVisitTime}</td>
                      <td className="p-3.5 border-r font-semibold text-slate-500">{row.doctorId}</td>
                      <td className="p-3.5 border-r font-bold text-slate-800">{row.doctorName}</td>
                      <td className="p-3.5 border-r text-center">{row.doctorContactNumber || ""}</td>
                      <td className="p-3.5 border-r text-slate-600 font-medium">{row.hospitalName || ""}</td>
                      <td className="p-3.5 border-r font-bold text-slate-800">{row.employeeName}</td>
                      <td className="p-3.5 border-r">{row.speciality}</td>
                      <td className="p-3.5 border-r font-semibold text-slate-500">{row.designation}</td>
                      <td className="p-3.5 border-r">{row.city}</td>
                      <td className="p-3.5 border-r uppercase text-slate-500 font-bold">{row.state}</td>
                      <td className="p-3.5 border-r font-semibold text-slate-500">{row.productUsing}</td>
                      <td className="p-3.5 border-r font-semibold text-slate-500">{row.productTargeted}</td>
                      <td className="p-3.5 border-r font-medium text-slate-600">{row.samplePromotedAndRemark}</td>
                      <td className="p-3.5 border-r">{row.promotionalGifts || ""}</td>
                      <td className="p-3.5 border-r font-semibold text-slate-500">{row.postCallInformation}</td>
                      <td className="p-3.5 border-r text-slate-500 truncate max-w-[200px]" title={row.reportedFrom}>{row.reportedFrom}</td>
                      <td className="p-3.5 border-r text-slate-500 truncate max-w-[220px]" title={row.clinicHospitalAddress}>{row.clinicHospitalAddress}</td>
                      <td className="p-3.5 border-r text-slate-500">{row.closedFrom}</td>
                      <td className="p-3.5 border-r">{row.reportingMode}</td>
                      <td className="p-3.5 border-r text-slate-500 font-semibold">{row.locationSource}</td>
                      <td className="p-3.5 border-r">{row.workingWith || ""}</td>
                      <td className="p-3.5 border-r">{row.deviation || ""}</td>
                      <td className="p-3.5 border-r font-mono text-[10px] text-slate-500">{row.visitSyncDatetime}</td>
                      <td className="p-3.5 border-r font-semibold">{row.pobYesNo}</td>
                      <td className="p-3.5 border-r text-center font-medium text-slate-500">{row.detailsOfPob}</td>
                      <td className="p-3.5 font-bold text-slate-800">{row.totalPobValue}</td>
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

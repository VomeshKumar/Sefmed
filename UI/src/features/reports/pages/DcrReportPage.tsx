import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Info,
  ArrowLeft,
  X,
  FileSpreadsheet,
  Calendar,
  AlertCircle
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

export interface DoctorCallRow {
  sNo: number;
  status: string;
  visitDate: string;
  startedAt: string;
  checkInTime: string;
  checkOutTime: string;
  clientId: string;
  prescriberName: string;
  speciality: string;
  hospitalName: string;
  city: string;
  samplingDone: string;
  startedFrom: string;
  closeFrom: string;
  remarks: string;
}

export interface FirmCallRow {
  sNo: number;
  status: string;
  visitDate: string;
  startedAt: string;
  checkInTime: string;
  checkOutTime: string;
  firmId: string;
  firmName: string;
  city: string;
  address: string;
  checkInAddress: string;
  checkOutAddress: string;
  remarks: string;
}

const MOCK_DOCTOR_CALLS: DoctorCallRow[] = [
  {
    sNo: 1,
    status: "Closed",
    visitDate: "2026-06-02",
    startedAt: "09:14:01",
    checkInTime: "11:26:35",
    checkOutTime: "11:26:42",
    clientId: "7025",
    prescriberName: "SUNIL NEMA",
    speciality: "ENTSP",
    hospitalName: "",
    city: "Bhilai",
    samplingDone: "",
    startedFrom: "696H+98C, power house, Janjgiri, Chhattisgarh 490001, India",
    closeFrom: "696H+98C, power house, Janjgiri, Chhattisgarh 490001, India",
    remarks: ""
  },
  {
    sNo: 2,
    status: "Closed",
    visitDate: "2026-06-02",
    startedAt: "09:14:01",
    checkInTime: "12:09:24",
    checkOutTime: "12:09:39",
    clientId: "5045",
    prescriberName: "ANKIT GUPTA",
    speciality: "DERMA",
    hospitalName: "SHANKARACHARYA HOSPITAL",
    city: "Bhilai",
    samplingDone: "",
    startedFrom: "6894+Q9X, Shanti Nagar, Anustha Residency, Smriti Nagar, Durg, Chhattisgarh 490020, India",
    closeFrom: "6894+Q9X, Shanti Nagar, Anustha Residency, Smriti Nagar, Durg, Chhattisgarh 490020, India",
    remarks: ""
  },
  {
    sNo: 3,
    status: "Closed",
    visitDate: "2026-06-02",
    startedAt: "09:14:01",
    checkInTime: "12:27:28",
    checkOutTime: "12:27:35",
    clientId: "8186",
    prescriberName: "DR KAMALPREET KAUR",
    speciality: "DERMA",
    hospitalName: "ABHISHEK MEMORIAL HOSPITAL",
    city: "Bhilai",
    samplingDone: "",
    startedFrom: "6894+Q9X, Shanti Nagar, Anustha Residency, Smriti Nagar, Durg, Chhattisgarh 490020, India",
    closeFrom: "6894+Q9X, Shanti Nagar, Anustha Residency, Smriti Nagar, Durg, Chhattisgarh 490020, India",
    remarks: ""
  }
];

const MOCK_FIRM_CALLS: FirmCallRow[] = [
  {
    sNo: 1,
    status: "Closed",
    visitDate: "2026-06-02",
    startedAt: "10:15:00",
    checkInTime: "10:30:12",
    checkOutTime: "10:45:22",
    firmId: "FM-8812",
    firmName: "Teqmed Pharma LLP",
    city: "Raipur",
    address: "Ring Road, Raipur",
    checkInAddress: "Ring Road Square, Raipur",
    checkOutAddress: "Ring Road Square, Raipur",
    remarks: "Order collection"
  },
  {
    sNo: 2,
    status: "Closed",
    visitDate: "2026-06-03",
    startedAt: "11:00:00",
    checkInTime: "11:15:30",
    checkOutTime: "11:30:45",
    firmId: "FM-9012",
    firmName: "Kailash Chemists",
    city: "Bhilai",
    address: "Sector 2, Bhilai",
    checkInAddress: "Sector 5 Market, Bhilai",
    checkOutAddress: "Sector 5 Market, Bhilai",
    remarks: "POB collected"
  }
];

const AVAILABLE_ZONES = ["Chhattisgarh", "Maharashtra", "Madhya Pradesh", "Gujarat"];

export function DcrReportPage() {
  // Filters State
  const [selectedZones, setSelectedZones] = React.useState<string[]>([]);
  const [division, setDivision] = React.useState("Select Division");
  const [employee, setEmployee] = React.useState("All Employee");
  const [reportType, setReportType] = React.useState("Select Report Type");
  const [startDate, setStartDate] = React.useState("2026-06-02");
  const [endDate, setEndDate] = React.useState("2026-06-08");

  // Focus tracking for clean date pickers
  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  // Zone Tags Controls
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const [zoneSearch, setZoneSearch] = React.useState("");
  const zoneRef = React.useRef<HTMLDivElement>(null);

  // Grid Controls
  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [activeReportType, setActiveReportType] = React.useState("");
  const [doctorReports, setDoctorReports] = React.useState<DoctorCallRow[]>([]);
  const [firmReports, setFirmReports] = React.useState<FirmCallRow[]>([]);

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
      reportType === "Select Report Type" ||
      division === "Select Division"
    ) {
      toast.error("Please select all parameters to generate the report!");
      return;
    }

    if (reportType === "Doctor Call Report") {
      // Apply filters to doctor calls
      let filtered = MOCK_DOCTOR_CALLS;
      if (employee !== "All Employee") {
        // dynamic filter mock representation
      }
      setDoctorReports(filtered);
      setFirmReports([]);
    } else {
      // Apply filters to firm calls
      let filtered = MOCK_FIRM_CALLS;
      setFirmReports(filtered);
      setDoctorReports([]);
    }

    setActiveReportType(reportType);
    setHasGenerated(true);
    toast.success("Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate the report first before exporting!");
      return;
    }

    let headers: string[] = [];
    let rows: any[][] = [];

    if (activeReportType === "Doctor Call Report") {
      headers = [
        "S.No.",
        "Status",
        "Visti Date",
        "Started At",
        "Check In Time",
        "Check Out Time",
        "Client Id",
        "Name of the prescriber",
        "Speciality",
        "Center/Hospital Name",
        "City",
        "Sampling Done",
        "Started From",
        "Close From",
        "Remarks"
      ];
      rows = doctorReports.map((r) => [
        r.sNo,
        r.status,
        r.visitDate,
        r.startedAt,
        r.checkInTime,
        r.checkOutTime,
        r.clientId,
        `"${r.prescriberName}"`,
        `"${r.speciality}"`,
        `"${r.hospitalName}"`,
        `"${r.city}"`,
        `"${r.samplingDone}"`,
        `"${r.startedFrom}"`,
        `"${r.closeFrom}"`,
        `"${r.remarks}"`
      ]);
    } else {
      headers = [
        "S.No.",
        "Status",
        "Visit Date",
        "Started At",
        "Check In Time",
        "Check Out Time",
        "Firm Id",
        "Firm Name",
        "City",
        "Address",
        "Check In Address",
        "Check Out Address",
        "Remarks"
      ];
      rows = firmReports.map((r) => [
        r.sNo,
        r.status,
        r.visitDate,
        r.startedAt,
        r.checkInTime,
        r.checkOutTime,
        r.firmId,
        `"${r.firmName}"`,
        `"${r.city}"`,
        `"${r.address}"`,
        `"${r.checkInAddress}"`,
        `"${r.checkOutAddress}"`,
        `"${r.remarks}"`
      ]);
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `DCR_Report_${activeReportType.replace(/ /g, "_")}_${startDate}_to_${endDate}.csv`
    );
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
              DCR Report
              <span title="Report showing doctor & chemist visit details of employee during a period.">
                <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
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
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Report Type */}
          <div className="w-full sm:w-48">
            <UiSelect value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select Report Type">Select Report Type</SelectItem>
                <SelectItem value="Doctor Call Report">Doctor Call Report</SelectItem>
                <SelectItem value="Firm Call Report">Firm Call Report</SelectItem>
              </SelectContent>
            </UiSelect>
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

      {/* Main Grid Render or Parameter Selection Empty State */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select parameters to generate report.
        </div>
      ) : activeReportType === "Doctor Call Report" ? (
        /* Doctor Call Report Horizontally Scrollable Grid Container */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
            <span>Doctor Call DCR Log Summary ({doctorReports.length} records)</span>
            <span className="text-slate-400">Scroll horizontally to view all fields</span>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[2000px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3.5 w-24 border-r border-b border-slate-200 text-center">S.No.</th>
                  <th className="p-3.5 w-28 border-r border-b border-slate-200 text-center">Status</th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-center">Visti Date</th>
                  <th className="p-3.5 w-28 border-r border-b border-slate-200 text-center">Started At</th>
                  <th className="p-3.5 w-28 border-r border-b border-slate-200 text-center">Check In Time</th>
                  <th className="p-3.5 w-28 border-r border-b border-slate-200 text-center">Check Out Time</th>
                  <th className="p-3.5 w-24 border-r border-b border-slate-200 text-center">Client Id</th>
                  <th className="p-3.5 w-48 border-r border-b border-slate-200 text-left pl-4">Name of the prescriber</th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-left pl-4">Speciality</th>
                  <th className="p-3.5 w-56 border-r border-b border-slate-200 text-left pl-4">Center/Hospital Name</th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-left pl-4">City</th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-center">Sampling Done</th>
                  <th className="p-3.5 w-64 border-r border-b border-slate-200 text-left pl-4">Started From</th>
                  <th className="p-3.5 w-64 border-r border-b border-slate-200 text-left pl-4">Close From</th>
                  <th className="p-3.5 border-b border-slate-200 text-left pl-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {doctorReports.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="p-10 text-center text-slate-400 font-semibold">No Records Found</td>
                  </tr>
                ) : (
                  doctorReports.map((row) => (
                    <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-semibold text-slate-500">{row.sNo}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/50">{row.status}</span>
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.visitDate}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-500">{row.startedAt}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-medium text-slate-700">{row.checkInTime}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-medium text-slate-700">{row.checkOutTime}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-500 font-semibold">{row.clientId}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.prescriberName}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 uppercase">{row.speciality}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600 font-medium">{row.hospitalName || "-"}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.city}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-500">{row.samplingDone || "-"}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 truncate max-w-xs" title={row.startedFrom}>{row.startedFrom}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 truncate max-w-xs" title={row.closeFrom}>{row.closeFrom}</td>
                      <td className="p-3.5 border-b border-slate-200 text-left pl-4 text-slate-600">{row.remarks || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Firm Call Report Horizontally Scrollable Grid Container */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
            <span>Firm Call DCR Log Summary ({firmReports.length} records)</span>
            <span className="text-slate-400">Scroll horizontally to view all fields</span>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[1600px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3.5 w-24 border-r border-b border-slate-200 text-center">S.No.</th>
                  <th className="p-3.5 w-28 border-r border-b border-slate-200 text-center">Status</th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-center">Visit Date</th>
                  <th className="p-3.5 w-28 border-r border-b border-slate-200 text-center">Started At</th>
                  <th className="p-3.5 w-28 border-r border-b border-slate-200 text-center">Check In Time</th>
                  <th className="p-3.5 w-28 border-r border-b border-slate-200 text-center">Check Out Time</th>
                  <th className="p-3.5 w-28 border-r border-b border-slate-200 text-center">Firm Id</th>
                  <th className="p-3.5 w-48 border-r border-b border-slate-200 text-left pl-4">Firm Name</th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-left pl-4">City</th>
                  <th className="p-3.5 w-64 border-r border-b border-slate-200 text-left pl-4">Address</th>
                  <th className="p-3.5 w-64 border-r border-b border-slate-200 text-left pl-4">Check In Address</th>
                  <th className="p-3.5 w-64 border-r border-b border-slate-200 text-left pl-4">Check Out Address</th>
                  <th className="p-3.5 border-b border-slate-200 text-left pl-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {firmReports.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="p-10 text-center text-slate-400 font-semibold">No Records Found</td>
                  </tr>
                ) : (
                  firmReports.map((row) => (
                    <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-semibold text-slate-500">{row.sNo}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/50">{row.status}</span>
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">{row.visitDate}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-500">{row.startedAt}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-medium text-slate-700">{row.checkInTime}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-medium text-slate-700">{row.checkOutTime}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-500 font-semibold">{row.firmId}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.firmName}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.city}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 truncate max-w-xs" title={row.address}>{row.address}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 truncate max-w-xs" title={row.checkInAddress}>{row.checkInAddress}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 truncate max-w-xs" title={row.checkOutAddress}>{row.checkOutAddress}</td>
                      <td className="p-3.5 border-b border-slate-200 text-left pl-4 text-slate-600">{row.remarks || "-"}</td>
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

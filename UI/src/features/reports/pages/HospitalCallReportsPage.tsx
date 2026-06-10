import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Info,
  Calendar,
  ChevronRight,
  X,
  FileSpreadsheet,
  ArrowLeft,
  Search,
  Building2
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

export interface HospitalCallReportRow {
  sNo: number;
  status: "Skipped" | "Closed" | "Open" | "Pending";
  visitDate: string;
  checkInTime: string;
  closeVisitTime: string;
  hospitalId: string;
  hospitalName: string;
  employeeName: string;
  contactNumber: string;
  city: string;
  state: string;
  visitAddress: string;
  hospitalAddress: string;
  remark: string;
  orderYesNo: "Yes" | "No";
  detailsOfOrder: string;
  totalOrderValue: string;
  inchargeType: string;
  contactPerson: string;
  workingWith: string;
  attachment: string;
  closedFromLatLog: string;
}

const MOCK_HOSPITAL_REPORTS: HospitalCallReportRow[] = [
  {
    sNo: 1,
    status: "Skipped",
    visitDate: "09-06-2026",
    checkInTime: "-",
    closeVisitTime: "-",
    hospitalId: "H-8821",
    hospitalName: "CITY HOSPITAL",
    employeeName: "AAKIB KHAN",
    contactNumber: "9876543210",
    city: "Mumbai",
    state: "MAHARASHTRA",
    visitAddress: "No Address Found",
    hospitalAddress: "123 Main St, Mumbai, Maharashtra 400001, India",
    remark: "Doctor Busy",
    orderYesNo: "No",
    detailsOfOrder: "-",
    totalOrderValue: "-",
    inchargeType: "OT Incharge",
    contactPerson: "Sister D'Souza",
    workingWith: "-",
    attachment: "NA",
    closedFromLatLog: "-"
  },
  {
    sNo: 2,
    status: "Closed",
    visitDate: "09-06-2026",
    checkInTime: "11:15 AM",
    closeVisitTime: "11:30 AM",
    hospitalId: "H-9012",
    hospitalName: "METRO CLINIQ",
    employeeName: "AAKIB KHAN",
    contactNumber: "9123456789",
    city: "Pune",
    state: "MAHARASHTRA",
    visitAddress: "456 Park Avenue, Pune, Maharashtra 411001, India",
    hospitalAddress: "456 Park Avenue, Pune, Maharashtra 411001, India",
    remark: "OT call completed successfully",
    orderYesNo: "Yes",
    detailsOfOrder: "10x Teqmox-CV, 5x Teqpara",
    totalOrderValue: "₹ 7,500",
    inchargeType: "Purchase Incharge",
    contactPerson: "Mr. Rajeev Mehta",
    workingWith: "SHUBHAM SHARMA",
    attachment: "receipt.png",
    closedFromLatLog: "18.520430,73.856743"
  },
  {
    sNo: 3,
    status: "Closed",
    visitDate: "10-06-2026",
    checkInTime: "02:30 PM",
    closeVisitTime: "02:50 PM",
    hospitalId: "H-7741",
    hospitalName: "LIFE LINE CLINIC",
    employeeName: "AAKIB KHAN",
    contactNumber: "8899001122",
    city: "Nagpur",
    state: "MAHARASHTRA",
    visitAddress: "789 Ring Road, Nagpur, Maharashtra 440001, India",
    hospitalAddress: "789 Ring Road, Nagpur, Maharashtra 440001, India",
    remark: "Completed POB call",
    orderYesNo: "Yes",
    detailsOfOrder: "20x Teqmed Cold-X",
    totalOrderValue: "₹ 4,200",
    inchargeType: "General Incharge",
    contactPerson: "Dr. Vinay Joshi",
    workingWith: "-",
    attachment: "NA",
    closedFromLatLog: "21.145800,79.088200"
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

export function HospitalCallReportsPage() {
  // Filters State
  const [selectedStates, setSelectedStates] = React.useState<string[]>(["Maharashtra"]);
  const [speciality, setSpeciality] = React.useState("DERMA");
  const [employee, setEmployee] = React.useState("AAKIB KHAN");
  const [division, setDivision] = React.useState("All");
  const [inchargeType, setInchargeType] = React.useState("All Incharge");
  const [startDate, setStartDate] = React.useState("2026-06-09");
  const [endDate, setEndDate] = React.useState("2026-06-10");
  const [searchQuery, setSearchQuery] = React.useState("");

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

  // Table Data
  const [reports, setReports] = React.useState<HospitalCallReportRow[]>(MOCK_HOSPITAL_REPORTS);

  const handleApplyFilters = () => {
    let filtered = MOCK_HOSPITAL_REPORTS;

    // 1. Specialty Filter
    if (speciality !== "All") {
      // In a real application we would filter by Specialty.
      // For mock purposes we will keep it matching our query.
    }

    // 2. Employee Filter
    if (employee !== "All") {
      filtered = filtered.filter((r) => r.employeeName.toLowerCase().includes(employee.toLowerCase()));
    }

    // 3. Incharge Type Filter
    if (inchargeType !== "All Incharge") {
      filtered = filtered.filter((r) => r.inchargeType.toLowerCase().includes(inchargeType.toLowerCase().replace("incharge", "").trim()));
    }

    // 4. Search Query (Hospital Name / Contact Person)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.hospitalName.toLowerCase().includes(q) ||
          r.contactPerson.toLowerCase().includes(q)
      );
    }

    setReports(filtered);
    toast.success("Filters applied successfully!");
  };

  const handleExportCSV = () => {
    const headers = [
      "S.No",
      "Status",
      "Visit Date",
      "Check-In Time",
      "Close Visit Time",
      "Hospital Id",
      "Hospital Name",
      "Employee Name",
      "Contact Number",
      "City",
      "State",
      "Visit Address",
      "Hospital Address",
      "Remark",
      "Order(yes/no)",
      "Details of Order",
      "Total Order Value",
      "Incharge Type",
      "Contact Person",
      "Working With",
      "Attachment",
      "Closed From Lat,Log"
    ];

    const rows = reports.map((r) => [
      r.sNo,
      r.status,
      r.visitDate,
      r.checkInTime,
      r.closeVisitTime,
      r.hospitalId,
      `"${r.hospitalName}"`,
      `"${r.employeeName}"`,
      r.contactNumber,
      r.city,
      r.state,
      `"${r.visitAddress}"`,
      `"${r.hospitalAddress}"`,
      `"${r.remark}"`,
      r.orderYesNo,
      `"${r.detailsOfOrder}"`,
      r.totalOrderValue,
      r.inchargeType,
      `"${r.contactPerson}"`,
      r.workingWith,
      r.attachment,
      r.closedFromLatLog
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hospital_Call_Report_${startDate}_to_${endDate}.csv`);
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
            Hospital Call Report
            <span title="Report showing OT and purchase call data completed by field reps.">
              <Info className="h-4.5 w-4.5 text-slate-400 cursor-help" />
            </span>
          </h1>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          {/* State HQ Multi-select tag console */}
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

          {/* Employee dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Representative</label>
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="AAKIB KHAN" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Representatives</SelectItem>
                <SelectItem value="AAKIB KHAN">AAKIB KHAN</SelectItem>
                <SelectItem value="SHUBHAM SHARMA">SHUBHAM SHARMA</SelectItem>
                <SelectItem value="YUGAL KISHOR SAHU">YUGAL KISHOR SAHU</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Division */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Division</label>
            <UiSelect value={division} onValueChange={setDivision}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Divisions</SelectItem>
                <SelectItem value="DERMA">DERMA</SelectItem>
                <SelectItem value="OTC">OTC</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Incharge Type */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incharge Type</label>
            <UiSelect value={inchargeType} onValueChange={setInchargeType}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Incharge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Incharge">All Incharge</SelectItem>
                <SelectItem value="OT Incharge">OT Incharge</SelectItem>
                <SelectItem value="Purchase Incharge">Purchase Incharge</SelectItem>
                <SelectItem value="General Incharge">General Incharge</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Search Hospital */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Hospital</label>
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

          {/* From Date */}
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

          {/* To Date */}
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
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-[#008272]" />
            Hospital Call Logs Table ({reports.length} records)
          </span>
          <span className="text-slate-400">Scroll horizontally to view all parameters</span>
        </div>

        {/* Scrollable table container */}
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[2400px]">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 select-none z-10">
              <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5 pl-5 w-16 text-center border-r">S.No</th>
                <th className="p-3.5 w-24 text-center border-r">Status</th>
                <th className="p-3.5 w-32 border-r">Visit Date</th>
                <th className="p-3.5 w-32 border-r">Check-In Time</th>
                <th className="p-3.5 w-32 border-r">Close Visit Time</th>
                <th className="p-3.5 w-28 border-r">Hospital Id</th>
                <th className="p-3.5 w-44 border-r">Hospital Name</th>
                <th className="p-3.5 w-48 border-r">Employee Name</th>
                <th className="p-3.5 w-36 border-r">Contact Number</th>
                <th className="p-3.5 w-32 border-r">City</th>
                <th className="p-3.5 w-36 border-r">State</th>
                <th className="p-3.5 w-60 border-r">Visit Address</th>
                <th className="p-3.5 w-60 border-r">Hospital Address</th>
                <th className="p-3.5 w-56 border-r">Remark</th>
                <th className="p-3.5 w-32 text-center border-r">Order(yes/no)</th>
                <th className="p-3.5 w-60 border-r">Details of Order</th>
                <th className="p-3.5 w-32 border-r">Total Order Value</th>
                <th className="p-3.5 w-36 border-r">Incharge Type</th>
                <th className="p-3.5 w-44 border-r">Contact Person</th>
                <th className="p-3.5 w-36 border-r">Working With</th>
                <th className="p-3.5 w-32 border-r">Attachment</th>
                <th className="p-3.5">Closed From Lat,Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={22} className="p-10 text-center text-slate-400 font-semibold">
                    No Records Found
                  </td>
                </tr>
              ) : (
                reports.map((row) => (
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
                    <td className="p-3.5 border-r">{row.visitDate}</td>
                    <td className="p-3.5 border-r">{row.checkInTime}</td>
                    <td className="p-3.5 border-r">{row.closeVisitTime}</td>
                    <td className="p-3.5 font-semibold text-slate-500 border-r">{row.hospitalId}</td>
                    <td className="p-3.5 font-bold text-slate-900 border-r">{row.hospitalName}</td>
                    <td className="p-3.5 font-bold text-slate-900 border-r">{row.employeeName}</td>
                    <td className="p-3.5 border-r">{row.contactNumber}</td>
                    <td className="p-3.5 border-r">{row.city}</td>
                    <td className="p-3.5 border-r">{row.state}</td>
                    <td className="p-3.5 border-r text-slate-500 truncate max-w-[200px]" title={row.visitAddress}>{row.visitAddress}</td>
                    <td className="p-3.5 border-r text-slate-500 truncate max-w-[200px]" title={row.hospitalAddress}>{row.hospitalAddress}</td>
                    <td className="p-3.5 border-r text-slate-500">{row.remark}</td>
                    <td className="p-3.5 text-center border-r">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.orderYesNo === "Yes"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {row.orderYesNo}
                      </span>
                    </td>
                    <td className="p-3.5 border-r font-medium text-slate-600">{row.detailsOfOrder}</td>
                    <td className="p-3.5 border-r font-bold text-slate-800">{row.totalOrderValue}</td>
                    <td className="p-3.5 border-r font-semibold text-slate-600">{row.inchargeType}</td>
                    <td className="p-3.5 border-r font-bold text-slate-800">{row.contactPerson}</td>
                    <td className="p-3.5 border-r">{row.workingWith}</td>
                    <td className="p-3.5 border-r text-[#008272] hover:underline cursor-pointer">{row.attachment}</td>
                    <td className="p-3.5 font-mono text-[10px] text-slate-500">{row.closedFromLatLog}</td>
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

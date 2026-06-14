import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Info, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PaymentCollectionRecord {
  sNo: number;
  mrName: string;
  clientName: string;
  date: string;
  amountType: string;
  amount: number;
  remark: string;
  attachment: string;
  zone: string;
  clientType: "Doctor" | "Firm";
}

const AVAILABLE_ZONES = ["Bhopal", "Raipur", "Durg", "Jabalpur", "Bhubaneswar", "Balaghat", "Bilaspur"];
const EMPLOYEES = ["Akash Sen", "Amarjeet Singh", "BALRAM PATEL", "AAKIB KHAN"];

const DOCTORS = ["DR KAMALPREET KAUR", "Dr. SUNIL NEMA", "Dr. ANKIT GUPTA", "Dr. A.K. JAIN"];
const FIRMS = ["Teqmed Pharma LLP", "Lotus Medicos", "Noble Medicals", "Apollo Pharmacy"];

const MOCK_COLLECTION_DATA: PaymentCollectionRecord[] = [
  {
    sNo: 1,
    mrName: "Akash Sen",
    clientName: "Dr. SUNIL NEMA",
    date: "08/06/2026",
    amountType: "Cash",
    amount: 5000,
    remark: "Raipur clinic collections",
    attachment: "---",
    zone: "Raipur",
    clientType: "Doctor",
  },
  {
    sNo: 2,
    mrName: "Akash Sen",
    clientName: "Dr. ANKIT GUPTA",
    date: "10/06/2026",
    amountType: "Cheque",
    amount: 12000,
    remark: "Invoice #9932 payment",
    attachment: "receipt_9932.jpg",
    zone: "Raipur",
    clientType: "Doctor",
  },
  {
    sNo: 3,
    mrName: "Amarjeet Singh",
    clientName: "Lotus Medicos",
    date: "09/06/2026",
    amountType: "Bank Transfer",
    amount: 25000,
    remark: "Outstanding clearance",
    attachment: "transfer_slip.pdf",
    zone: "Durg",
    clientType: "Firm",
  },
  {
    sNo: 4,
    mrName: "BALRAM PATEL",
    clientName: "Apollo Pharmacy",
    date: "07/06/2026",
    amountType: "UPI",
    amount: 3500,
    remark: "Retail collection",
    attachment: "---",
    zone: "Bilaspur",
    clientType: "Firm",
  },
];

// SVG illustration of shrugging character and monitor, matching the screenshot
const NoRecordFoundIllustration = () => (
  <div className="flex flex-col items-center justify-center py-10 px-4 animate-fade-in bg-white border-t border-slate-200">
    <svg className="w-96 h-72 text-slate-300" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Desk surface */}
      <path d="M50 320 L550 320" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
      
      {/* Desk items/drawings */}
      <circle cx="150" cy="320" r="12" fill="#E2E8F0" />
      
      {/* PC Monitor */}
      <rect x="360" y="220" width="160" height="90" rx="8" fill="#94A3B8" />
      <rect x="370" y="228" width="140" height="74" rx="4" fill="#F1F5F9" />
      {/* Code lines on screen */}
      <line x1="380" y1="240" x2="440" y2="240" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      <line x1="380" y1="250" x2="420" y2="250" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      <line x1="380" y1="260" x2="480" y2="260" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      <line x1="380" y1="270" x2="450" y2="270" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
      <line x1="380" y1="280" x2="410" y2="280" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />

      {/* Monitor base stand */}
      <path d="M430 310 L430 320" stroke="#64748B" strokeWidth="12" strokeLinecap="round" />
      <path d="M410 320 L470 320" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />

      {/* Character body */}
      <rect x="270" y="295" width="22" height="75" rx="6" fill="#F59E0B" />
      <rect x="305" y="295" width="22" height="75" rx="6" fill="#F59E0B" />
      
      {/* Chair */}
      <path d="M260 270 L340 270" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
      <path d="M300 270 L300 325" stroke="#475569" strokeWidth="14" />
      
      {/* Torso */}
      <rect x="255" y="200" width="85" height="100" rx="20" fill="#334155" />

      {/* Shirt Collar / Neck */}
      <path d="M285 200 L310 200 L297.5 210 Z" fill="#F1F5F9" />

      {/* Shrugging Arms */}
      <path d="M255 215 C220 215 200 240 180 230" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
      <circle cx="180" cy="230" r="10" fill="#F87171" />

      <path d="M340 215 C375 215 395 240 415 230" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
      <circle cx="415" cy="230" r="10" fill="#F87171" />

      {/* Head */}
      <rect x="278" y="145" width="39" height="50" rx="19" fill="#F87171" />
      <rect x="275" y="140" width="45" height="24" rx="8" fill="#1E293B" />

      {/* Floating Elements */}
      <circle cx="120" cy="140" r="20" fill="#E2E8F0" />
      <path d="M112 132 L128 148 M128 132 L112 148" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />

      {/* Speech Bubble: "No Record! Found" */}
      <path d="M330 130 C330 80 470 80 470 130 C470 150 450 160 410 160 L395 185 L390 160 C330 160 330 140 330 130 Z" fill="white" stroke="#38BDF8" strokeWidth="3" />
      <text x="345" y="125" fill="#0F172A" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">No Record !</text>
      <text x="368" y="148" fill="#0F172A" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">Found</text>

      {/* Document icon floating */}
      <rect x="470" y="270" width="30" height="40" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
      <line x1="478" y1="280" x2="492" y2="280" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="478" y1="290" x2="492" y2="290" stroke="#CBD5E1" strokeWidth="2" />
    </svg>
  </div>
);

export function PaymentCollectionReportPage() {
  const [selectedZones, setSelectedZones] = React.useState<string[]>([]);
  const [zoneSearch, setZoneSearch] = React.useState("");
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const zoneRef = React.useRef<HTMLDivElement>(null);

  const [employee, setEmployee] = React.useState("All Employee");
  const [clientType, setClientType] = React.useState("");
  const [selectedClient, setSelectedClient] = React.useState("All");

  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [startFocused, setStartFocused] = React.useState(false);
  const [endFocused, setEndFocused] = React.useState(false);

  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reportRows, setReportRows] = React.useState<PaymentCollectionRecord[]>([]);

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

  // When clientType changes, reset the selected client to "All"
  React.useEffect(() => {
    setSelectedClient("All");
  }, [clientType]);

  const handleApplyFilters = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From Date and To Date to generate report!");
      return;
    }

    // Filter logic
    let filtered = MOCK_COLLECTION_DATA;

    // Filter by zones
    if (selectedZones.length > 0) {
      filtered = filtered.filter((row) =>
        selectedZones.some((zone) => zone.toLowerCase() === row.zone.toLowerCase())
      );
    }

    // Filter by employee
    if (employee !== "All Employee") {
      filtered = filtered.filter((row) => row.mrName.toLowerCase() === employee.toLowerCase());
    }

    // Filter by client type
    if (clientType) {
      filtered = filtered.filter((row) => row.clientType === clientType);
    }

    // Filter by client name
    if (selectedClient !== "All") {
      filtered = filtered.filter((row) => row.clientName.toLowerCase() === selectedClient.toLowerCase());
    }

    // Adjust S.No dynamically
    const adjusted = filtered.map((row, idx) => ({
      ...row,
      sNo: idx + 1,
    }));

    setReportRows(adjusted);
    setHasGenerated(true);
    toast.success("Payment Collection Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate the report first before exporting!");
      return;
    }

    const clientHeader = clientType === "Firm" ? "Firm Name" : "Doctor Name";
    const headers = ["S.No.", "MR Name", clientHeader, "Date", "Amount Type", "Amount", "Remark", "Attachment"];

    const rows = reportRows.map((r) => [
      r.sNo,
      `"${r.mrName}"`,
      `"${r.clientName}"`,
      `"${r.date}"`,
      `"${r.amountType}"`,
      r.amount,
      `"${r.remark}"`,
      `"${r.attachment}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Payment_Collection_Report_${fromDate || "all"}_to_${toDate || "all"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  const removeZoneTag = (z: string) => {
    setSelectedZones((prev) => prev.filter((item) => item !== z));
  };

  const getClientOptions = () => {
    if (clientType === "Firm") return FIRMS;
    return DOCTORS; // Default to DOCTORS when empty or "Doctor"
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
              Payment Collection Report
              <span title="Report showing details of amount given and collected against doctors and firms.">
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
          <div className="w-full sm:w-52 relative" ref={zoneRef}>
            <div
              className="flex items-center flex-wrap gap-1 p-1 border rounded-lg border-slate-200 bg-white min-h-[36px] max-h-[72px] overflow-y-auto cursor-text text-xs"
              onClick={() => setIsZoneOpen(true)}
            >
              {selectedZones.length === 0 && (
                <span className="text-slate-400 pl-1.5 py-0.5 select-none">Select Zone</span>
              )}
              {selectedZones.map((z) => (
                <span
                  key={z}
                  className="inline-flex items-center gap-1 bg-slate-55 border border-slate-200 text-[11px] px-1.5 py-0.5 rounded text-slate-700 font-medium"
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

          {/* All Employee Dropdown */}
          <div className="w-full sm:w-44">
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="All Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Employee">All Employee</SelectItem>
                {EMPLOYEES.map((emp) => (
                  <SelectItem key={emp} value={emp}>
                    {emp}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Type Dropdown */}
          <div className="w-full sm:w-40">
            <UiSelect value={clientType} onValueChange={setClientType}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Firm">Firm</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* 4th Dropdown (Doctor Name or Firm Name dynamically) */}
          <div className="w-full sm:w-48">
            <UiSelect value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {getClientOptions().map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
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
              className="w-full px-3 h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
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
              className="w-full px-3 h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
            />
          </div>

          {/* Action Go Button */}
          <Button
            onClick={handleApplyFilters}
            className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs shadow-xs active:scale-95 transition-transform"
          >
            Go
          </Button>

          {/* Action Export Button */}
          <Button
            onClick={handleExportCSV}
            className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs gap-1 shadow-xs active:scale-95 transition-transform"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
            </svg>
            Export
          </Button>
        </div>
      </div>

      {/* Main Grid Render or Parameter Selection Empty State */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select parameters to generate report.
        </div>
      ) : reportRows.length === 0 ? (
        /* Empty State with Table Headers and Speech Bubble Illustration */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="overflow-x-auto overflow-y-auto scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[1000px]">
              <thead className="bg-slate-50 border-b border-slate-200 select-none text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3 border-r border-slate-200 w-16">S.No.</th>
                  <th className="p-3 border-r border-slate-200 text-left pl-4 w-44">MR Name</th>
                  <th className="p-3 border-r border-slate-200 text-left pl-4 w-60">
                    {clientType === "Firm" ? "Firm Name" : "Doctor Name"}
                  </th>
                  <th className="p-3 border-r border-slate-200 w-28">Date</th>
                  <th className="p-3 border-r border-slate-200 w-32">Amount Type</th>
                  <th className="p-3 border-r border-slate-200 w-28">Amount</th>
                  <th className="p-3 border-r border-slate-200 text-left pl-4 w-60">Remark</th>
                  <th className="p-3 text-left pl-4">Attachment</th>
                </tr>
              </thead>
            </table>
            <NoRecordFoundIllustration />
          </div>
        </div>
      ) : (
        /* Populated Grid Table */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between select-none">
            <span>Payment Collection Log Summary ({reportRows.length} records)</span>
            <span className="text-slate-400">Payment collections from clinics and retail distribution</span>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[1000px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3.5 border-r border-b border-slate-200 w-16">S.No.</th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-44">MR Name</th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-60">
                    {clientType === "Firm" ? "Firm Name" : "Doctor Name"}
                  </th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-28">Date</th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-32">Amount Type</th>
                  <th className="p-3.5 border-r border-b border-slate-200 w-28">Amount</th>
                  <th className="p-3.5 border-r border-b border-slate-200 text-left pl-4 w-60">Remark</th>
                  <th className="p-3.5 border-b border-slate-200 text-left pl-4">Attachment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reportRows.map((row) => (
                  <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 border-r border-b border-slate-200 text-slate-500 font-semibold">{row.sNo}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.mrName}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-800 font-medium">{row.clientName}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-slate-600">{row.date}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 font-semibold text-slate-600">{row.amountType}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 font-bold text-slate-800">₹{row.amount.toLocaleString()}</td>
                    <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600">{row.remark}</td>
                    <td className="p-3.5 border-b border-slate-200 text-left pl-4 font-semibold text-[#008272]">{row.attachment}</td>
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

import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Info,
  ChevronRight,
  X,
  FileSpreadsheet,
  ArrowLeft,
  Search,
  ShoppingCart
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

export interface PobReportRow {
  category: string;
  stockist: string;
  billingName: string;
  date: string;
  productName: string;
  productGroupName: string;
  speciality: string;
  scheme: string;
  freeGiftScheme: string;
  quantity: number;
  freeQuantity: number;
  actualQuantity: number;
  mrp: string;
  rate: string;
  value: string;
  discountPercent: string;
  discountValue: string;
  totalValue: string;
  status: "Approved" | "Pending" | "Rejected" | "Draft";
}

const AVAILABLE_STATUSES = ["Approved", "Pending", "Rejected", "Draft"];

const MOCK_POB_REPORTS: PobReportRow[] = [
  {
    category: "DERMA",
    stockist: "KAPIL PHARMA",
    billingName: "DR RINKU KAPIL",
    date: "09-06-2026",
    productName: "Teqpara 650",
    productGroupName: "Analgesic",
    speciality: "DERMA",
    scheme: "10+1",
    freeGiftScheme: "Writing Pad",
    quantity: 100,
    freeQuantity: 10,
    actualQuantity: 110,
    mrp: "₹ 30.00",
    rate: "₹ 25.00",
    value: "₹ 2,500.00",
    discountPercent: "5%",
    discountValue: "₹ 125.00",
    totalValue: "₹ 2,375.00",
    status: "Approved"
  },
  {
    category: "GYNAE",
    stockist: "METRO DRUGS",
    billingName: "DR ANJALI SHARMA",
    date: "09-06-2026",
    productName: "Teqmox-CV 625",
    productGroupName: "Antibiotics",
    speciality: "GYNAE",
    scheme: "5+1",
    freeGiftScheme: "NA",
    quantity: 50,
    freeQuantity: 10,
    actualQuantity: 60,
    mrp: "₹ 120.00",
    rate: "₹ 100.00",
    value: "₹ 5,000.00",
    discountPercent: "10%",
    discountValue: "₹ 500.00",
    totalValue: "₹ 4,500.00",
    status: "Pending"
  },
  {
    category: "DERMA",
    stockist: "KAPIL PHARMA",
    billingName: "DR RINKU KAPIL",
    date: "10-06-2026",
    productName: "Teqmed Cold-X",
    productGroupName: "Cough & Cold",
    speciality: "DERMA",
    scheme: "NA",
    freeGiftScheme: "Pen",
    quantity: 80,
    freeQuantity: 0,
    actualQuantity: 80,
    mrp: "₹ 45.00",
    rate: "₹ 40.00",
    value: "₹ 3,200.00",
    discountPercent: "0%",
    discountValue: "₹ 0.00",
    totalValue: "₹ 3,200.00",
    status: "Approved"
  }
];

export function PobReportsPage() {
  // Filters State
  const [rep, setRep] = React.useState("RINKU KAPIL");
  const [clientType, setClientType] = React.useState("Doctor");
  const [clientName, setClientName] = React.useState("All Client");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Order Status Selection Autocomplete states
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>(["All Order Status"]);
  const [statusSearch, setStatusSearch] = React.useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = React.useState(false);
  const statusDropdownRef = React.useRef<HTMLDivElement>(null);
  const statusInputRef = React.useRef<HTMLInputElement>(null);

  // Table Data
  const [reports, setReports] = React.useState<PobReportRow[]>(MOCK_POB_REPORTS);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectStatus = (status: string) => {
    let next = [...selectedStatuses];
    if (status === "All Order Status") {
      next = ["All Order Status"];
    } else {
      next = next.filter(s => s !== "All Order Status");
      if (!next.includes(status)) {
        next.push(status);
      }
    }
    setSelectedStatuses(next);
    setStatusSearch("");
    setIsStatusDropdownOpen(false);
  };

  const removeStatusTag = (statusToRemove: string) => {
    let next = selectedStatuses.filter(s => s !== statusToRemove);
    if (next.length === 0) {
      next = ["All Order Status"];
    }
    setSelectedStatuses(next);
  };

  const filteredStatuses = ["All Order Status", ...AVAILABLE_STATUSES].filter(s =>
    s.toLowerCase().includes(statusSearch.toLowerCase()) &&
    !selectedStatuses.includes(s)
  );

  const handleApplyFilters = () => {
    let filtered = MOCK_POB_REPORTS;

    // 1. Rep filter
    if (rep !== "All") {
      filtered = filtered.filter((r) => r.billingName.toLowerCase().includes(rep.toLowerCase()) || rep.toLowerCase().includes("rinku"));
    }

    // 2. Status filter
    if (!selectedStatuses.includes("All Order Status")) {
      filtered = filtered.filter((r) =>
        selectedStatuses.some(status => r.status.toLowerCase() === status.toLowerCase())
      );
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.productName.toLowerCase().includes(q) ||
          r.stockist.toLowerCase().includes(q)
      );
    }

    setReports(filtered);
    toast.success("Filters applied successfully!");
  };

  const handleExportCSV = () => {
    const headers = [
      "Category",
      "Stockist",
      "Billing Name",
      "Date",
      "Product Name",
      "Product Group Name",
      "Speciality",
      "Scheme",
      "Free Gift (Scheme)",
      "Quantity",
      "Free Quantity",
      "Actual Quantity",
      "MRP",
      "Rate",
      "Value",
      "Discount(in %)",
      "Discount(in Value)",
      "Total Value",
      "Status"
    ];

    const rows = reports.map((r) => [
      r.category,
      `"${r.stockist}"`,
      `"${r.billingName}"`,
      r.date,
      `"${r.productName}"`,
      `"${r.productGroupName}"`,
      r.speciality,
      r.scheme,
      `"${r.freeGiftScheme}"`,
      r.quantity,
      r.freeQuantity,
      r.actualQuantity,
      r.mrp,
      r.rate,
      r.value,
      r.discountPercent,
      r.discountValue,
      r.totalValue,
      r.status
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `POB_Report_Rinku_Kapil.csv`);
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
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mt-1">
            POB Report
            <span title="Report giving information of the Product Order Booking (POB).">
              <Info className="h-4.5 w-4.5 text-slate-400 cursor-help" />
            </span>
          </h1>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {/* Representative */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Representative</label>
            <UiSelect value={rep} onValueChange={setRep}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="RINKU KAPIL" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RINKU KAPIL">RINKU KAPIL</SelectItem>
                <SelectItem value="All">All Representatives</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Client Type */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Type</label>
            <UiSelect value={clientType} onValueChange={setClientType}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Chemist">Chemist</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Client Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Name</label>
            <UiSelect value={clientName} onValueChange={setClientName}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Client">All Client</SelectItem>
                <SelectItem value="DR RINKU KAPIL">DR RINKU KAPIL</SelectItem>
                <SelectItem value="DR ANJALI SHARMA">DR ANJALI SHARMA</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Order Status tag selection console */}
          <div className="space-y-1 md:col-span-2 relative" ref={statusDropdownRef}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Status</label>
            <div
              className="flex items-center flex-wrap gap-1.5 p-1 border rounded-lg border-slate-200 bg-slate-50 min-h-[36px] max-h-[72px] overflow-y-auto cursor-text"
              onClick={() => {
                statusInputRef.current?.focus();
                setIsStatusDropdownOpen(true);
              }}
            >
              {selectedStatuses.map((st) => (
                <span key={st} className="inline-flex items-center gap-1 bg-white border border-slate-200 text-xs px-2 py-0.5 rounded-md text-slate-700 font-medium">
                  {st}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStatusTag(st);
                    }}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                ref={statusInputRef}
                type="text"
                placeholder={selectedStatuses.length === 0 ? "Select status..." : ""}
                value={statusSearch}
                onChange={(e) => {
                  setStatusSearch(e.target.value);
                  setIsStatusDropdownOpen(true);
                }}
                onFocus={() => setIsStatusDropdownOpen(true)}
                className="bg-transparent border-none outline-none text-xs flex-1 ml-1 min-w-[60px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (statusSearch.trim()) {
                      const matched = AVAILABLE_STATUSES.find(
                        s => s.toLowerCase() === statusSearch.trim().toLowerCase()
                      );
                      const val = matched || statusSearch.trim();
                      handleSelectStatus(val);
                    }
                  } else if (e.key === "Backspace" && !statusSearch && selectedStatuses.length > 0) {
                    removeStatusTag(selectedStatuses[selectedStatuses.length - 1]);
                  }
                }}
              />
            </div>

            {/* Floating dropdown */}
            {isStatusDropdownOpen && filteredStatuses.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 text-xs py-1">
                {filteredStatuses.map((st) => (
                  <button
                    key={st}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelectStatus(st);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Search bar for items inside table */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search product/stockist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-xs bg-slate-50 border-slate-200"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
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
      </div>

      {/* Horizontally Scrollable Grid Container */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1">
        {/* Info banner */}
        <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
          <span className="flex items-center gap-1.5">
            <ShoppingCart className="h-3.5 w-3.5 text-[#008272]" />
            POB Logs Table ({reports.length} records)
          </span>
          <span className="text-slate-400">Scroll horizontally to view all parameters</span>
        </div>

        {/* Scrollable table container */}
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[2200px]">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 select-none z-10">
              <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5 pl-5 w-28 border-r">Category</th>
                <th className="p-3.5 w-36 border-r">Stockist</th>
                <th className="p-3.5 w-44 border-r">Billing Name</th>
                <th className="p-3.5 w-28 border-r">Date</th>
                <th className="p-3.5 w-40 border-r">Product Name</th>
                <th className="p-3.5 w-36 border-r">Product Group Name</th>
                <th className="p-3.5 w-28 border-r">Speciality</th>
                <th className="p-3.5 w-24 border-r">Scheme</th>
                <th className="p-3.5 w-36 border-r">Free Gift (Scheme)</th>
                <th className="p-3.5 w-24 text-right border-r">Quantity</th>
                <th className="p-3.5 w-24 text-right border-r">Free Quantity</th>
                <th className="p-3.5 w-24 text-right border-r">Actual Quantity</th>
                <th className="p-3.5 w-24 text-right border-r">MRP</th>
                <th className="p-3.5 w-24 text-right border-r">Rate</th>
                <th className="p-3.5 w-28 text-right border-r">Value</th>
                <th className="p-3.5 w-28 text-right border-r">Discount(in %)</th>
                <th className="p-3.5 w-28 text-right border-r">Discount(in Value)</th>
                <th className="p-3.5 w-32 text-right border-r">Total Value</th>
                <th className="p-3.5 w-24 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={19} className="p-10 text-center text-slate-400 font-semibold">
                    No Records Found
                  </td>
                </tr>
              ) : (
                reports.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5 pl-5 font-semibold text-slate-600 border-r">{row.category}</td>
                    <td className="p-3.5 border-r font-medium text-slate-800">{row.stockist}</td>
                    <td className="p-3.5 border-r font-bold text-slate-900">{row.billingName}</td>
                    <td className="p-3.5 border-r text-slate-500">{row.date}</td>
                    <td className="p-3.5 border-r font-bold text-[#008272]">{row.productName}</td>
                    <td className="p-3.5 border-r text-slate-500">{row.productGroupName}</td>
                    <td className="p-3.5 border-r">{row.speciality}</td>
                    <td className="p-3.5 border-r text-center font-mono text-[10px] text-slate-500">{row.scheme}</td>
                    <td className="p-3.5 border-r text-slate-500">{row.freeGiftScheme}</td>
                    <td className="p-3.5 border-r text-right font-medium nums-tabular">{row.quantity}</td>
                    <td className="p-3.5 border-r text-right font-medium nums-tabular text-slate-500">{row.freeQuantity}</td>
                    <td className="p-3.5 border-r text-right font-bold nums-tabular text-slate-800">{row.actualQuantity}</td>
                    <td className="p-3.5 border-r text-right nums-tabular text-slate-500">{row.mrp}</td>
                    <td className="p-3.5 border-r text-right nums-tabular text-slate-500">{row.rate}</td>
                    <td className="p-3.5 border-r text-right nums-tabular font-medium text-slate-700">{row.value}</td>
                    <td className="p-3.5 border-r text-right nums-tabular text-rose-600 font-semibold">{row.discountPercent}</td>
                    <td className="p-3.5 border-r text-right nums-tabular text-rose-600 font-semibold">{row.discountValue}</td>
                    <td className="p-3.5 border-r text-right nums-tabular font-bold text-slate-900">{row.totalValue}</td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          row.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : row.status === "Pending"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
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

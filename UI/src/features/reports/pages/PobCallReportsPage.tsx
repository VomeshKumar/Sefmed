import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Info,
  ChevronRight,
  FileSpreadsheet,
  ArrowLeft,
  Search,
  ShoppingCart,
  Calendar
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

export interface PobCallReportRow {
  sNo: number;
  date: string;
  employeeCode: string;
  employeeName: string;
  hq: string;
  checkInTime: string;
  closeVisitTime: string;
  timeSpentAtVisit: string;
  doctorName: string;
  contactNo: string;
  status: "Closed" | "Skipped" | "Open" | "Pending";
  city: string;
  categoryName: string;
  speciality: string;
  prescribedProducts: { name: string; prescription: string }[] | "NA";
  promotedProducts: { name: string; qty: number }[] | "NA";
  top5Products: string;
  pobProduct: string;
  pobAmount: number;
  businessSlab: string;
  postCallInformation: string;
  objectiveRemarks: string;
  reportedFrom: string;
  clinicHospitalAddress: string;
  reportingMode: "Manual" | "Automated";
}

const MOCK_POB_CALL_REPORTS: PobCallReportRow[] = [
  {
    sNo: 1,
    date: "01-06-2026",
    employeeCode: "TEQEMP0038",
    employeeName: "Amarjeet Singh",
    hq: "Durg",
    checkInTime: "11:42 AM",
    closeVisitTime: "11:42 AM",
    timeSpentAtVisit: "00:00:06",
    doctorName: "PRAVEEN SHUKLA",
    contactNo: "-",
    status: "Closed",
    city: "Bhilai",
    categoryName: "-",
    speciality: "DERMA",
    prescribedProducts: "NA",
    promotedProducts: "NA",
    top5Products: "-",
    pobProduct: "NA",
    pobAmount: 0,
    businessSlab: "0-5000",
    postCallInformation: "-",
    objectiveRemarks: "-",
    reportedFrom: "Unnamed Road, Shanti Nagar, Anustha Residency, Bhilai, Chhattisgarh 490020, India",
    clinicHospitalAddress: "Unnamed Road, Shanti Nagar, Anustha Residency, Bhilai, Chhattisgarh 490020, India",
    reportingMode: "Automated"
  },
  {
    sNo: 2,
    date: "01-06-2026",
    employeeCode: "TEQEMP0038",
    employeeName: "Amarjeet Singh",
    hq: "Durg",
    checkInTime: "11:47 AM",
    closeVisitTime: "11:48 AM",
    timeSpentAtVisit: "00:00:20",
    doctorName: "DR SWASTI TIWARI",
    contactNo: "-",
    status: "Closed",
    city: "Bhilai",
    categoryName: "C",
    speciality: "DERMA",
    prescribedProducts: "NA",
    promotedProducts: [
      { name: "Teqpara 650", qty: 10 }
    ],
    top5Products: "-",
    pobProduct: "Teqpara 650",
    pobAmount: 250,
    businessSlab: "0-5000",
    postCallInformation: "-",
    objectiveRemarks: "-",
    reportedFrom: "IRIS First Line, Anustha Residency, Smriti Nagar, Bhilai, Chhattisgarh 490020, India",
    clinicHospitalAddress: "IRIS First Line, Anustha Residency, Smriti Nagar, Bhilai, Chhattisgarh 490020, India",
    reportingMode: "Automated"
  }
];

export function PobCallReportsPage() {
  // Filters State
  const [division, setDivision] = React.useState("DERMA");
  const [zone, setZone] = React.useState("Chhattisgarh");
  const [status, setStatus] = React.useState("All Status");
  const [employee, setEmployee] = React.useState("Amarjeet Singh");
  const [clientType, setClientType] = React.useState("Doctor");
  const [callStatus, setCallStatus] = React.useState("Closed");
  const [startDate, setStartDate] = React.useState("2026-06-01");
  const [endDate, setEndDate] = React.useState("2026-06-09");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Control whether parameters have been submitted to generate the report
  const [hasGenerated, setHasGenerated] = React.useState(false);

  // Table Data
  const [reports, setReports] = React.useState<PobCallReportRow[]>(MOCK_POB_CALL_REPORTS);

  const handleApplyFilters = () => {
    let filtered = MOCK_POB_CALL_REPORTS;

    // 1. Division Filter
    if (division !== "All Division") {
      filtered = filtered.filter((r) => r.speciality.toLowerCase() === division.toLowerCase());
    }

    // 2. Call Status Filter
    if (callStatus !== "All") {
      filtered = filtered.filter((r) => r.status.toLowerCase() === callStatus.toLowerCase());
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.doctorName.toLowerCase().includes(q) ||
          r.reportedFrom.toLowerCase().includes(q)
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
      "S.No",
      "Date",
      "Employee Code",
      "Employee Name",
      "HQ",
      "Check-In Time",
      "Close Visit Time",
      "Time Spent At Visit",
      "Doctor Name",
      "Contact No",
      "Status",
      "City",
      "Category Name",
      "Speciality",
      "POB Product",
      "POB Amount",
      "Business Slab",
      "Objective Remarks",
      "Reported From",
      "Clinic/Hospital Address",
      "Reporting Mode"
    ];

    const rows = reports.map((r) => [
      r.sNo,
      r.date,
      r.employeeCode,
      `"${r.employeeName}"`,
      r.hq,
      r.checkInTime,
      r.closeVisitTime,
      r.timeSpentAtVisit,
      `"${r.doctorName}"`,
      r.contactNo,
      r.status,
      r.city,
      r.categoryName,
      r.speciality,
      r.pobProduct,
      r.pobAmount,
      r.businessSlab,
      `"${r.objectiveRemarks}"`,
      `"${r.reportedFrom}"`,
      `"${r.clinicHospitalAddress}"`,
      r.reportingMode
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Call_Report_With_POB_${startDate}_to_${endDate}.csv`);
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
            Call Report With POB
            <span title="Report displaying doctor visit call logs alongside product order booking (POB) details.">
              <Info className="h-4.5 w-4.5 text-slate-400 cursor-help" />
            </span>
          </h1>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3.5">
          {/* Division */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Division</label>
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

          {/* Zone */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zone</label>
            <UiSelect value={zone} onValueChange={setZone}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Zone">All Zone</SelectItem>
                <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
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

          {/* Employee dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee</label>
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="All Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Employee">All Employee</SelectItem>
                <SelectItem value="Amarjeet Singh">Amarjeet Singh</SelectItem>
                <SelectItem value="Rinku Kapil">Rinku Kapil</SelectItem>
                <SelectItem value="Aakib Khan">Aakib Khan</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Client Type */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Type</label>
            <UiSelect value={clientType} onValueChange={setClientType}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select Type">Select Type</SelectItem>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Chemist">Chemist</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Call Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Call Status</label>
            <UiSelect value={callStatus} onValueChange={setCallStatus}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Closed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Skipped">Skipped</SelectItem>
              </SelectContent>
            </UiSelect>
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

        {/* Live Search & Filter Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search doctor or location..."
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

      {/* Main Grid Render or Parameter Selection Empty State */}
      {!hasGenerated ? (
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-12 text-center text-slate-600 font-medium leading-relaxed animate-fade-in flex flex-col items-center justify-center space-y-2">
          <Info className="h-8 w-8 text-[#008272] opacity-75" />
          <span className="text-sm">Please select parameters to generate report.</span>
        </div>
      ) : (
        /* Horizontally Scrollable Grid Container */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          {/* Info banner */}
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
            <span className="flex items-center gap-1.5">
              <ShoppingCart className="h-3.5 w-3.5 text-[#008272]" />
              POB Call Logs Table ({reports.length} records)
            </span>
            <span className="text-slate-400">Scroll horizontally to view all parameters</span>
          </div>

          {/* Scrollable table container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[2800px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 select-none z-10">
                <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3.5 pl-5 w-16 text-center border-r">S.No</th>
                  <th className="p-3.5 w-28 border-r">Date</th>
                  <th className="p-3.5 w-32 border-r">Employee Code</th>
                  <th className="p-3.5 w-44 border-r">Employee Name</th>
                  <th className="p-3.5 w-24 border-r">HQ</th>
                  <th className="p-3.5 w-28 border-r">Check-In Time</th>
                  <th className="p-3.5 w-28 border-r">Close Visit Time</th>
                  <th className="p-3.5 w-32 border-r">Time Spent At Visit</th>
                  <th className="p-3.5 w-44 border-r">Doctor Name</th>
                  <th className="p-3.5 w-32 border-r">Contact No</th>
                  <th className="p-3.5 w-24 text-center border-r">Status</th>
                  <th className="p-3.5 w-32 border-r">City</th>
                  <th className="p-3.5 w-32 border-r">Category Name</th>
                  <th className="p-3.5 w-28 border-r">Speciality</th>
                  <th className="p-3.5 w-48 border-r">Prescribed Products</th>
                  <th className="p-3.5 w-60 border-r">Promoted Products</th>
                  <th className="p-3.5 w-32 border-r">Top5 Products</th>
                  <th className="p-3.5 w-36 border-r">POB Product</th>
                  <th className="p-3.5 w-28 text-right border-r">POB Amount</th>
                  <th className="p-3.5 w-28 border-r">business Slab</th>
                  <th className="p-3.5 w-48 border-r">Post Call Information</th>
                  <th className="p-3.5 w-44 border-r">Objective Remarks</th>
                  <th className="p-3.5 w-60 border-r">Reported From</th>
                  <th className="p-3.5 w-60 border-r">Clinic/Hospital Address</th>
                  <th className="p-3.5">Reporting Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={25} className="p-10 text-center text-slate-400 font-semibold">
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  reports.map((row) => (
                    <tr key={row.sNo} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 pl-5 text-center font-semibold text-slate-500 border-r">{row.sNo}</td>
                      <td className="p-3.5 border-r text-slate-500">{row.date}</td>
                      <td className="p-3.5 font-semibold text-slate-500 border-r">{row.employeeCode}</td>
                      <td className="p-3.5 font-bold text-slate-900 border-r">{row.employeeName}</td>
                      <td className="p-3.5 border-r">{row.hq}</td>
                      <td className="p-3.5 border-r">{row.checkInTime}</td>
                      <td className="p-3.5 border-r">{row.closeVisitTime}</td>
                      <td className="p-3.5 border-r font-mono text-[10px] text-slate-500">{row.timeSpentAtVisit}</td>
                      <td className="p-3.5 font-bold text-slate-900 border-r">{row.doctorName}</td>
                      <td className="p-3.5 border-r">{row.contactNo}</td>
                      <td className="p-3.5 text-center border-r">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.status === "Closed"
                              ? "bg-slate-100 text-slate-700 border border-slate-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3.5 border-r">{row.city}</td>
                      <td className="p-3.5 border-r text-center font-bold text-slate-500">{row.categoryName}</td>
                      <td className="p-3.5 border-r">{row.speciality}</td>

                      {/* Prescribed Products */}
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

                      {/* Promoted Products */}
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

                      <td className="p-3.5 border-r text-center">{row.top5Products}</td>
                      <td className="p-3.5 border-r font-medium text-slate-700">{row.pobProduct}</td>
                      <td className="p-3.5 border-r text-right font-bold text-slate-900">₹ {row.pobAmount}</td>
                      <td className="p-3.5 border-r text-center font-mono text-[11px] text-slate-500">{row.businessSlab}</td>
                      <td className="p-3.5 border-r text-slate-500">{row.postCallInformation}</td>
                      <td className="p-3.5 border-r text-slate-500">{row.objectiveRemarks}</td>
                      <td className="p-3.5 border-r text-slate-500 truncate max-w-[200px]" title={row.reportedFrom}>{row.reportedFrom}</td>
                      <td className="p-3.5 border-r text-slate-500 truncate max-w-[200px]" title={row.clinicHospitalAddress}>{row.clinicHospitalAddress}</td>
                      <td className="p-3.5">{row.reportingMode}</td>
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

import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Info,
  FileSpreadsheet,
  ArrowLeft,
  MapPin,
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

export interface DiscrepancyReportRow {
  sNo: number;
  name: string; // Doctor Name, Firm Name, or Hospital Name dynamically
  hospitalName: string;
  visitId: string;
  visitDate: string;
  clinicAddress: string;
  employeesLocation: string;
  checkInTime: string;
  checkOutTime: string;
  distance: number; // Distance in KM
}

const MOCK_DOCTOR_DISCREPANCIES: DiscrepancyReportRow[] = [
  {
    sNo: 1,
    name: "Dr. Nilesh Soni",
    hospitalName: "Soni Hospital & Clinic",
    visitId: "V-88123",
    visitDate: "08-01-2026",
    clinicAddress: "12, Jail Road, Raipur, Chhattisgarh 492001",
    employeesLocation: "Jail Road Crossing, Raipur (0.42 KM away)",
    checkInTime: "10:15 AM",
    checkOutTime: "10:35 AM",
    distance: 0.42
  },
  {
    sNo: 2,
    name: "Dr. Anjali Gupta",
    hospitalName: "Apollo Clinic",
    visitId: "V-88124",
    visitDate: "12-01-2026",
    clinicAddress: "45, Civil Lines, Durg, Chhattisgarh 491001",
    employeesLocation: "Green Chowk, Durg (0.75 KM away)",
    checkInTime: "11:45 AM",
    checkOutTime: "12:05 PM",
    distance: 0.75
  },
  {
    sNo: 3,
    name: "Dr. Sanjay Patel",
    hospitalName: "Patel Nursing Home",
    visitId: "V-88125",
    visitDate: "15-01-2026",
    clinicAddress: "78, Link Road, Bilaspur, Chhattisgarh 495001",
    employeesLocation: "Vyapar Vihar, Bilaspur (1.20 KM away)",
    checkInTime: "02:30 PM",
    checkOutTime: "02:55 PM",
    distance: 1.20
  },
  {
    sNo: 4,
    name: "Dr. Rajesh Sharma",
    hospitalName: "Metro Diagnostic Center",
    visitId: "V-88126",
    visitDate: "20-01-2026",
    clinicAddress: "Sector 1, Bhilai, Chhattisgarh 490001",
    employeesLocation: "Sector 5 Market, Bhilai (0.38 KM away)",
    distance: 0.38,
    checkInTime: "09:30 AM",
    checkOutTime: "09:50 AM"
  },
  {
    sNo: 5,
    name: "Dr. H. S. Chawla",
    hospitalName: "Chawla Children Clinic",
    visitId: "V-88127",
    visitDate: "25-01-2026",
    clinicAddress: "Shankar Nagar, Raipur, Chhattisgarh 492007",
    employeesLocation: "VIP Road, Raipur (2.10 KM away)",
    distance: 2.10,
    checkInTime: "04:15 PM",
    checkOutTime: "04:45 PM"
  }
];

const MOCK_FIRM_DISCREPANCIES: DiscrepancyReportRow[] = [
  {
    sNo: 1,
    name: "Teqmed Pharma LLP",
    hospitalName: "N/A",
    visitId: "V-88223",
    visitDate: "05-01-2026",
    clinicAddress: "Pharma Zone, Ring Road, Raipur, Chhattisgarh 492001",
    employeesLocation: "Ring Road Square, Raipur (0.60 KM away)",
    checkInTime: "09:30 AM",
    checkOutTime: "09:55 AM",
    distance: 0.60
  },
  {
    sNo: 2,
    name: "Kailash Chemists",
    hospitalName: "N/A",
    visitId: "V-88224",
    visitDate: "11-01-2026",
    clinicAddress: "Sector 2, Bhilai, Chhattisgarh 490001",
    employeesLocation: "Sector 5 Market, Bhilai (0.85 KM away)",
    checkInTime: "01:15 PM",
    checkOutTime: "01:40 PM",
    distance: 0.85
  },
  {
    sNo: 3,
    name: "Durga Medicos",
    hospitalName: "N/A",
    visitId: "V-88225",
    visitDate: "20-01-2026",
    clinicAddress: "Main Road, Bilaspur, Chhattisgarh 495001",
    employeesLocation: "Railway Station Road, Bilaspur (1.50 KM away)",
    checkInTime: "04:00 PM",
    checkOutTime: "04:30 PM",
    distance: 1.50
  }
];

const MOCK_HOSPITAL_DISCREPANCIES: DiscrepancyReportRow[] = [
  {
    sNo: 1,
    name: "Apollo Hospital",
    hospitalName: "Apollo Hospital (Main)",
    visitId: "V-88323",
    visitDate: "06-01-2026",
    clinicAddress: "Vidhan Sabha Road, Raipur, Chhattisgarh 492001",
    employeesLocation: "Ambuja Mall Road, Raipur (0.55 KM away)",
    checkInTime: "11:00 AM",
    checkOutTime: "11:45 AM",
    distance: 0.55
  },
  {
    sNo: 2,
    name: "Bhilai General Hospital",
    hospitalName: "BGH Main Block",
    visitId: "V-88324",
    visitDate: "14-01-2026",
    clinicAddress: "Sector 9, Bhilai, Chhattisgarh 490009",
    employeesLocation: "Civic Center, Bhilai (0.90 KM away)",
    checkInTime: "03:00 PM",
    checkOutTime: "03:45 PM",
    distance: 0.90
  },
  {
    sNo: 3,
    name: "Bilaspur District Hospital",
    hospitalName: "District Hosp Wing B",
    visitId: "V-88325",
    visitDate: "22-01-2026",
    clinicAddress: "Koni, Bilaspur, Chhattisgarh 495009",
    employeesLocation: "Koni Crossing, Bilaspur (1.10 KM away)",
    checkInTime: "05:15 PM",
    checkOutTime: "05:45 PM",
    distance: 1.10
  }
];

export function DiscrepancyReportPage() {
  const [employee, setEmployee] = React.useState("Select Employee");
  const [month, setMonth] = React.useState("Select Month");
  const [year, setYear] = React.useState("Select Year");
  const [type, setType] = React.useState("Select Type");
  const [threshold, setThreshold] = React.useState("0.35");

  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reports, setReports] = React.useState<DiscrepancyReportRow[]>([]);

  const handleApplyFilters = () => {
    if (
      employee === "Select Employee" ||
      month === "Select Month" ||
      year === "Select Year" ||
      type === "Select Type"
    ) {
      toast.error("Please select all parameters to generate the report!");
      return;
    }

    let sourceData: DiscrepancyReportRow[] = [];
    if (type === "Doctor") {
      sourceData = MOCK_DOCTOR_DISCREPANCIES;
    } else if (type === "Firm") {
      sourceData = MOCK_FIRM_DISCREPANCIES;
    } else {
      sourceData = MOCK_HOSPITAL_DISCREPANCIES;
    }

    const val = parseFloat(threshold || "0");
    const filtered = sourceData.filter((r) => r.distance >= val);

    setReports(filtered);
    setHasGenerated(true);
    toast.success("Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate the report first before exporting!");
      return;
    }

    const typeLabel = type === "Firm" ? "Firm Name" : type === "Hospital" ? "Hospital Name" : "Doctor Name";

    const headers = [
      typeLabel,
      "Hospital Name",
      "Visit ID",
      "Visit Date",
      "Clinic Address",
      "Employees Location",
      "Check In Time",
      "Check Out Time",
      "Distance (In Kilometer)"
    ];

    const rows = reports.map((r) => [
      `"${r.name}"`,
      `"${r.hospitalName}"`,
      r.visitId,
      r.visitDate,
      `"${r.clinicAddress}"`,
      `"${r.employeesLocation}"`,
      r.checkInTime,
      r.checkOutTime,
      r.distance
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Discrepancy_Report_${type}_${employee}_${month}_${year}.csv`
    );
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
          <div className="flex items-center gap-2 mt-1.5">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
              Discrepancy Report
              <span title="Report showing discrepancy in check in & check out location from where call was completed.">
                <Info className="h-4.5 w-4.5 text-slate-900 cursor-help fill-black stroke-white" />
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Redesigned Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5">
        <div className="flex flex-wrap items-end gap-3">
          {/* Select Employee */}
          <div className="w-full sm:w-48">
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select Employee">Select Employee</SelectItem>
                <SelectItem value="AAKIB KHAN">AAKIB KHAN</SelectItem>
                <SelectItem value="Amarjeet Singh">Amarjeet Singh</SelectItem>
                <SelectItem value="BALRAM PATEL">BALRAM PATEL</SelectItem>
                <SelectItem value="CHANDRAMANI PATEL">CHANDRAMANI PATEL</SelectItem>
                <SelectItem value="DIWAKAR SAHU">DIWAKAR SAHU</SelectItem>
                <SelectItem value="GAGAN KAPIL">GAGAN KAPIL</SelectItem>
                <SelectItem value="HIMANSHU DEWANGAN">HIMANSHU DEWANGAN</SelectItem>
                <SelectItem value="Karan Choudhary">Karan Choudhary</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Month */}
          <div className="w-full sm:w-40">
            <UiSelect value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select Month">Select Month</SelectItem>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Year */}
          <div className="w-full sm:w-32">
            <UiSelect value={year} onValueChange={setYear}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select Year">Select Year</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="2028">2028</SelectItem>
                <SelectItem value="2029">2029</SelectItem>
                <SelectItem value="2030">2030</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Type */}
          <div className="w-full sm:w-40">
            <UiSelect value={type} onValueChange={setType}>
              <SelectTrigger className="w-full h-9 text-xs bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Select Type">Select Type</SelectItem>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Firm">Firm</SelectItem>
                <SelectItem value="Hospital">Hospital</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Location Threshold */}
          <div className="w-full sm:w-48 flex flex-col space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">
              Location Threshold (in KM)
            </label>
            <Input
              type="number"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="h-9 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-[#008272]"
            />
          </div>

          {/* Go & Excel Buttons */}
          <div className="flex gap-2 ml-auto sm:ml-0">
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
      </div>

      {/* Main Grid Render or Parameter Selection Empty State */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select the parameters to generate report.
        </div>
      ) : (
        /* Horizontally Scrollable Grid Container */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#008272]" />
              Discrepancy log summary ({reports.length} records)
            </span>
            <span className="text-slate-400">Scroll horizontally to view all fields</span>
          </div>

          {/* Scrollable table container */}
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[1400px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 select-none z-10 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="p-3.5 w-44 border-r border-b border-slate-200 text-left pl-4">
                    {type === "Firm"
                      ? "Firm Name"
                      : type === "Hospital"
                      ? "Hospital Name"
                      : "Doctor Name"}
                  </th>
                  <th className="p-3.5 w-44 border-r border-b border-slate-200 text-left pl-4">
                    Hospital Name
                  </th>
                  <th className="p-3.5 w-28 border-r border-b border-slate-200 text-center">
                    Visit ID
                  </th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-center">
                    Visit Date
                  </th>
                  <th className="p-3.5 w-64 border-r border-b border-slate-200 text-left pl-4">
                    Clinic Address
                  </th>
                  <th className="p-3.5 w-64 border-r border-b border-slate-200 text-left pl-4">
                    Employees Location
                  </th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-center">
                    Check In Time
                  </th>
                  <th className="p-3.5 w-32 border-r border-b border-slate-200 text-center">
                    Check Out Time
                  </th>
                  <th className="p-3.5 w-36 border-b border-slate-200 text-center">
                    Distance (In Kilometer)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="p-10 text-center text-slate-400 font-semibold"
                    >
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  reports.map((row) => (
                    <tr
                      key={row.visitId}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">
                        {row.name}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-600 font-medium">
                        {row.hospitalName}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-500 font-semibold">
                        {row.visitId}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600">
                        {row.visitDate}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500">
                        {row.clinicAddress}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 text-slate-500 font-medium">
                        {row.employeesLocation}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-medium">
                        {row.checkInTime}
                      </td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-center font-medium">
                        {row.checkOutTime}
                      </td>
                      <td className="p-3.5 border-b border-slate-200 text-center font-bold text-red-600">
                        {row.distance.toFixed(2)}
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

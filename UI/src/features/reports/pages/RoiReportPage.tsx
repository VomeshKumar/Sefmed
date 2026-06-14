import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Info, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface RoiProductData {
  unit: number;
  rate: number;
  tax: number;
  value: number;
}

export interface RoiRecord {
  sNo: number;
  doctorName: string;
  month: string;
  productData: Record<string, RoiProductData>;
}

const ZONES = ["Chhattisgarh", "Bhopal", "Raipur", "Durg", "Jabalpur", "Bhubaneswar", "Balaghat", "Bilaspur"];
const DESIGNATIONS = [
  "Root", "Area General Manager", "NATIONAL SALES MANAGER", "Sr. Regional Sales Manager",
  "Regional Sales Manager", "DM", "Sr. Area Sales Manager", "Area Sales Manager", "Medical Representative"
];

const EMPLOYEES_BY_DESIGNATION: Record<string, string[]> = {
  "NATIONAL SALES MANAGER": ["GAGAN KAPIL", "VINOD SHARMA"],
  "Medical Representative": ["Amarjeet Singh", "Ajeet kumar Sahu", "Akash Sen"],
  "Area Sales Manager": ["BALRAM PATEL", "AJAY TIWARI"],
};

const PRODUCTS = [
  "BENMELO", "CLINSA A", "CLINSA N GEL", "Hair Eva", "HS6", "HYZA-10", "HYZA-25",
  "JORTA-12", "JORTA-6", "Kozan", "Lam kid", "LS 1", "LZQ", "Neroteq Max", "Q-Itra 100",
  "Q-Itra 200(NEW)", "QBIL-M", "QBILL", "Qlob", "Qlob C", "QPENZ", "Stop X", "T Lob",
  "Teq Dx", "TEQ GLOW FM", "TEQ GLOW FW", "Teqcit 10", "Teqcit 5", "Teqmite 50", "Teqsone",
  "TRANZAC", "Tresta 10", "Tresta 20", "UV SERA"
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

// Mock active records for Amarjeet Singh
const MOCK_ACTIVE_RECORDS: RoiRecord[] = [
  {
    sNo: 1,
    doctorName: "Dr. Dinesh Lal",
    month: "January-2026",
    productData: {
      "BENMELO": { unit: 15, rate: 140, tax: 16.8, value: 2268 },
      "CLINSA A": { unit: 10, rate: 90, tax: 10.8, value: 1008 }
    }
  },
  {
    sNo: 2,
    doctorName: "Dr. Sunita Patel",
    month: "January-2026",
    productData: {
      "Kozan": { unit: 8, rate: 180, tax: 21.6, value: 1658.88 },
      "HYZA-10": { unit: 12, rate: 110, tax: 13.2, value: 1478.4 }
    }
  }
];

export function RoiReportPage() {
  const [zone, setZone] = React.useState<string>("");
  const [designation, setDesignation] = React.useState<string>("");
  const [employee, setEmployee] = React.useState<string>("");
  const [month, setMonth] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");

  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reportRows, setReportRows] = React.useState<RoiRecord[]>([]);

  // Dynamically set Employee options based on Designation
  const employeeOptions = React.useMemo(() => {
    if (designation && EMPLOYEES_BY_DESIGNATION[designation]) {
      return EMPLOYEES_BY_DESIGNATION[designation];
    }
    // Return all if no specific mapping exists
    return Object.values(EMPLOYEES_BY_DESIGNATION).flat();
  }, [designation]);

  // Reset employee when designation changes
  React.useEffect(() => {
    setEmployee("");
  }, [designation]);

  const handleGenerate = () => {
    if (!zone) {
      toast.error("Please select a Zone!");
      return;
    }
    if (!designation) {
      toast.error("Please select a Designation!");
      return;
    }
    if (!employee) {
      toast.error("Please select an Employee!");
      return;
    }
    if (!month) {
      toast.error("Please select a Month!");
      return;
    }
    if (!year) {
      toast.error("Please select a Year!");
      return;
    }

    // Load active records only for Amarjeet Singh, others show empty table "No Record Found."
    if (employee === "Amarjeet Singh") {
      setReportRows(MOCK_ACTIVE_RECORDS.map(r => ({
        ...r,
        month: `${month}-${year}`
      })));
    } else {
      setReportRows([]);
    }

    setHasGenerated(true);
    toast.success("ROI Report generated successfully!");
  };

  // Compute total units and values for a record
  const getRecordTotals = (row: RoiRecord) => {
    let totalUnit = 0;
    let totalValue = 0;
    
    Object.values(row.productData).forEach((p) => {
      totalUnit += p.unit;
      totalValue += p.value;
    });

    return { totalUnit, totalValue };
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate report first!");
      return;
    }

    const headers = ["S.No.", "Doctor Name", "Month"];
    PRODUCTS.forEach((p) => {
      headers.push(`${p} Unit`, `${p} Rate`, `${p} Tax`, `${p} Value`);
    });
    headers.push("Total Unit", "Total Value");

    const csvRows = [headers.join(",")];

    if (reportRows.length === 0) {
      csvRows.push("No Record Found.");
    } else {
      reportRows.forEach((r) => {
        const row = [r.sNo, `"${r.doctorName}"`, `"${r.month}"`];
        PRODUCTS.forEach((p) => {
          const val = r.productData[p] || { unit: 0, rate: 0, tax: 0, value: 0 };
          row.push(val.unit, val.rate, val.tax, val.value);
        });
        const totals = getRecordTotals(r);
        row.push(totals.totalUnit, totals.totalValue);
        csvRows.push(row.join(","));
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ROI_Report_${month}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  return (
    <div className="flex flex-col space-y-5 p-6 bg-slate-50/50 min-h-screen animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4 bg-white p-4 rounded-xl shadow-xs border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to="/reports" className="hover:text-[#008272] flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Reports Hub
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
              ROI Report
              <span title="Report showing product business unit, rates, taxes, and values achieved against doctors.">
                <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Filters Console block */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Zone */}
          <div className="w-full sm:w-44">
            <UiSelect value={zone} onValueChange={setZone}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="All Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Zone">All Zone</SelectItem>
                {ZONES.map((z) => (
                  <SelectItem key={z} value={z}>
                    {z}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Designation */}
          <div className="w-full sm:w-44">
            <UiSelect value={designation} onValueChange={setDesignation}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select Designation" />
              </SelectTrigger>
              <SelectContent>
                {DESIGNATIONS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Employee */}
          <div className="w-full sm:w-44">
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {employeeOptions.map((emp) => (
                  <SelectItem key={emp} value={emp}>
                    {emp}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Month */}
          <div className="w-full sm:w-44">
            <UiSelect value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Year */}
          <div className="w-full sm:w-44">
            <UiSelect value={year} onValueChange={setYear}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs rounded shadow-xs active:scale-95 transition-transform"
            >
              Go
            </Button>
            <Button
              onClick={handleExportCSV}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs rounded flex items-center gap-1.5 shadow-xs active:scale-95 transition-transform"
            >
              <Download className="h-3.5 w-3.5" /> Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid Render or Placeholder selection */}
      {!hasGenerated ? (
        <div className="p-8 text-left text-slate-600 font-medium text-sm animate-fade-in pl-1">
          Please select the parameters to generate report.
        </div>
      ) : (
        /* Double-Level Spreadsheet Grid Table Layout matching Snapshot 2/3/4/5 */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[6400px]">
              <thead className="bg-slate-50 select-none z-10 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                {/* Level 1 Headers */}
                <tr>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-16">S.NO.</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-left pl-4 w-48">Doctor Name</th>
                  <th rowSpan={2} className="p-3 border-r border-slate-200 text-center w-36">Month</th>
                  
                  {PRODUCTS.map((p) => (
                    <th key={p} colSpan={4} className="p-3 border-r border-slate-200 text-center font-bold">
                      {p}
                    </th>
                  ))}

                  <th colSpan={2} className="p-3 border-slate-200 text-center font-bold">Total</th>
                </tr>

                {/* Level 2 Sub-Headers */}
                <tr className="border-t border-slate-200 bg-slate-50/50">
                  {PRODUCTS.map((p) => (
                    <React.Fragment key={`${p}-sub`}>
                      <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Unit</th>
                      <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Rate</th>
                      <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Tax</th>
                      <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">Value</th>
                    </React.Fragment>
                  ))}
                  
                  <th className="p-2 border-r border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase font-bold">Unit</th>
                  <th className="p-2 border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase font-bold">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reportRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3 + PRODUCTS.length * 4 + 2}
                      className="p-6 text-center text-slate-400 font-semibold italic border-b border-slate-200"
                    >
                      No Record Found.
                    </td>
                  </tr>
                ) : (
                  reportRows.map((row) => {
                    const totals = getRecordTotals(row);
                    return (
                      <tr key={row.doctorName} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3.5 border-r border-b border-slate-200 text-slate-500 font-semibold text-center">{row.sNo}</td>
                        <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.doctorName}</td>
                        <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-semibold">{row.month}</td>
                        
                        {PRODUCTS.map((p) => {
                          const pVal = row.productData[p] || { unit: 0, rate: 0, tax: 0, value: 0 };
                          return (
                            <React.Fragment key={`${row.doctorName}-${p}`}>
                              <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-700 font-medium">
                                {pVal.unit || "-"}
                              </td>
                              <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">
                                {pVal.rate ? `₹${pVal.rate}` : "-"}
                              </td>
                              <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">
                                {pVal.tax ? `₹${pVal.tax}` : "-"}
                              </td>
                              <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-800 font-bold">
                                {pVal.value ? `₹${pVal.value.toLocaleString()}` : "-"}
                              </td>
                            </React.Fragment>
                          );
                        })}

                        <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-800 font-bold bg-slate-50/50">
                          {totals.totalUnit}
                        </td>
                        <td className="p-3.5 border-b border-slate-200 text-center text-[#008272] font-bold bg-slate-50/50">
                          ₹{totals.totalValue.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

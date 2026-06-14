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

export interface SalesTrendRecord {
  employeeName: string;
  productName: string;
  monthlyData: Record<string, { unit: number; value: number }>;
}

const AVAILABLE_ZONES = ["Bhopal", "Raipur", "Durg", "Jabalpur", "Bhubaneswar", "Balaghat", "Bilaspur"];
const CITIES = ["Durg", "Raipur", "Bhopal", "Jabalpur", "Bilaspur"];
const EMPLOYEES = ["Ajeet kumar Sahu", "Akash Sen", "Amarjeet Singh", "BALRAM PATEL"];

const DERMA_PRODUCTS = [
  "All Product", "BENMELO", "CLINSA A", "CLINSA N GEL", "Hair Eva", "HS6", "HYZA-10", "HYZA-25",
  "JORTA-12", "JORTA-6", "Kozan", "Lam kid", "LS 1", "LZQ", "Neroteq Max", "Q-Itra 100",
  "Q-Itra 200 (NEW)", "QBIL-M", "QBILL", "Qlob", "Qlob C", "QPENZ", "Stop X", "T Lob",
  "Teq Dx", "TEQ GLOW FM", "TEQ GLOW FW", "Teqcit 10", "Teqcit 5", "Teqmite 50", "Teqsone",
  "TRANZAC", "Tresta 10", "Tresta 20", "UV SERA"
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const generateMonthsList = () => {
  const list: string[] = [];
  const startYear = 2020;
  const startMonth = 0; // January
  const endYear = 2026;
  const endMonth = 5; // June 2026 (current month)
  
  let currentYear = startYear;
  let currentMonth = startMonth;
  
  while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
    list.push(`${MONTHS[currentMonth]}-${currentYear}`);
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }
  return list;
};

export function SalesTrendReportPage() {
  const [selectedZones, setSelectedZones] = React.useState<string[]>([]);
  const [zoneSearch, setZoneSearch] = React.useState("");
  const [isZoneOpen, setIsZoneOpen] = React.useState(false);
  const zoneRef = React.useRef<HTMLDivElement>(null);

  const [division, setDivision] = React.useState<string>("");
  const [pobType, setPobType] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("");
  const [employee, setEmployee] = React.useState<string>("");

  const [selectedProducts, setSelectedProducts] = React.useState<string[]>(["All Product"]);
  const [productSearch, setProductSearch] = React.useState("");
  const [isProductOpen, setIsProductOpen] = React.useState(false);
  const productRef = React.useRef<HTMLDivElement>(null);

  const [fromMonth, setFromMonth] = React.useState<string>("");
  const [toMonth, setToMonth] = React.useState<string>("");

  const [compoundUnitValue, setCompoundUnitValue] = React.useState(false);

  const [hasGenerated, setHasGenerated] = React.useState(false);
  const [reportRows, setReportRows] = React.useState<SalesTrendRecord[]>([]);

  const monthsList = React.useMemo(() => generateMonthsList(), []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (zoneRef.current && !zoneRef.current.contains(event.target as Node)) {
        setIsZoneOpen(false);
      }
      if (productRef.current && !productRef.current.contains(event.target as Node)) {
        setIsProductOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset selected products when division changes
  React.useEffect(() => {
    setSelectedProducts(["All Product"]);
  }, [division]);

  const removeZoneTag = (z: string) => {
    setSelectedZones((prev) => prev.filter((item) => item !== z));
  };

  const removeProductTag = (p: string) => {
    setSelectedProducts((prev) => prev.filter((item) => item !== p));
  };

  const handleApplyFilters = () => {
    if (!division) {
      toast.error("Please select a division!");
      return;
    }
    if (!pobType) {
      toast.error("Please select a POB type!");
      return;
    }
    if (!fromMonth || !toMonth) {
      toast.error("Please select both From Month and To Month!");
      return;
    }

    // Verify month range order
    const fromIdx = monthsList.indexOf(fromMonth);
    const toIdx = monthsList.indexOf(toMonth);
    if (fromIdx > toIdx) {
      toast.error("From Month cannot be after To Month!");
      return;
    }

    // Empty grid display by default (matching the "No records found" in snapshots)
    setReportRows([]);
    setHasGenerated(true);
    toast.success("Sales Trend Report generated successfully!");
  };

  const handleExportCSV = () => {
    if (!hasGenerated) {
      toast.error("Please generate the report first before exporting!");
      return;
    }

    const range = monthsList.slice(monthsList.indexOf(fromMonth), monthsList.indexOf(toMonth) + 1);

    const level1 = ["S.No", "Employee Name", "Product Name"];
    const level2 = ["", "", ""];

    range.forEach((m) => {
      if (pobType === "Unit") {
        level1.push(m);
        level2.push("Unit");
      } else if (pobType === "Value") {
        level1.push(m);
        level2.push("Value");
      } else if (pobType === "Unit & Value") {
        level1.push(m, "");
        level2.push("Unit", "Value");
      }
    });
    level1.push("Cumulative");
    level2.push("");

    const csvRows = [level1.join(","), level2.join(",")];
    csvRows.push("1,No records found,,");

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sales_Trend_Report_${fromMonth}_to_${toMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel data exported successfully!");
  };

  const getActiveMonthsRange = () => {
    if (!fromMonth || !toMonth) return [];
    const fromIdx = monthsList.indexOf(fromMonth);
    const toIdx = monthsList.indexOf(toMonth);
    if (fromIdx === -1 || toIdx === -1 || fromIdx > toIdx) return [];
    return monthsList.slice(fromIdx, toIdx + 1);
  };

  const activeMonths = getActiveMonthsRange();

  return (
    <div className="flex flex-col space-y-5 p-6 animate-fade-in bg-slate-50/50 min-h-screen">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4 bg-white p-4 rounded-xl shadow-xs border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link to="/reports" className="hover:text-[#008272] flex items-center gap-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Reports Hub
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-1.5">
                Sales Trend Report
                <span title="Report showing product sales unit and value trends month-over-month.">
                  <Info className="h-4.5 w-4.5 text-slate-900 fill-black stroke-white cursor-help" />
                </span>
              </h1>
            </div>
          </div>

          {/* Compound Unit Value Checkbox */}
          <div className="flex items-center mt-3 md:mt-0 text-xs font-semibold text-slate-700 select-none">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#008272] transition-colors">
              <input
                type="checkbox"
                checked={compoundUnitValue}
                onChange={(e) => setCompoundUnitValue(e.target.checked)}
                className="rounded border-slate-300 text-[#008272] focus:ring-[#008272] h-4 w-4 accent-[#008272]"
              />
              compound of unit & value
            </label>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white border rounded-xl shadow-xs border-slate-100 p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Zone Tag Input */}
          <div className="w-full sm:w-44 relative" ref={zoneRef}>
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
                  className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-[10px] px-1 py-0.5 rounded text-slate-700 font-medium"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeZoneTag(z);
                    }}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    <X className="h-2 w-2" />
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
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DERMA">DERMA</SelectItem>
                <SelectItem value="GYN">GYN</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select POB Type */}
          <div className="w-full sm:w-40">
            <UiSelect value={pobType} onValueChange={setPobType}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select POB Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unit">Unit</SelectItem>
                <SelectItem value="Value">Value</SelectItem>
                <SelectItem value="Unit & Value">Unit & Value</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select City */}
          <div className="w-full sm:w-40">
            <UiSelect value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select Product Tag Select */}
          <div className="w-full sm:w-48 relative" ref={productRef}>
            <div
              className="flex items-center flex-wrap gap-1 p-1 border rounded-lg border-slate-200 bg-white min-h-[36px] max-h-[72px] overflow-y-auto cursor-text text-xs"
              onClick={() => setIsProductOpen(true)}
            >
              {selectedProducts.length === 0 && (
                <span className="text-slate-400 pl-1.5 py-0.5 select-none">Select Product</span>
              )}
              {selectedProducts.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-[10px] px-1.5 py-0.5 rounded text-slate-700 font-medium"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProductTag(p);
                    }}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    <X className="h-2 w-2" />
                  </button>
                  {p}
                </span>
              ))}
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setIsProductOpen(true);
                }}
                onFocus={() => setIsProductOpen(true)}
                className="bg-transparent border-none outline-none text-xs flex-1 ml-1 min-w-[40px] h-5"
              />
            </div>
            {isProductOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50 text-xs py-1">
                {division === "GYN" ? (
                  <div className="px-3 py-2 text-slate-400 italic">No matches found</div>
                ) : division === "DERMA" ? (
                  DERMA_PRODUCTS.filter(
                    (p) =>
                      p.toLowerCase().includes(productSearch.toLowerCase()) &&
                      !selectedProducts.includes(p)
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={(e) => {
                        e.preventDefault();
                        if (p === "All Product") {
                          setSelectedProducts(["All Product"]);
                        } else {
                          const withoutAll = selectedProducts.filter((item) => item !== "All Product");
                          setSelectedProducts([...withoutAll, p]);
                        }
                        setProductSearch("");
                        setIsProductOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 transition-colors"
                    >
                      {p}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-slate-400 italic">Please select division first</div>
                )}
              </div>
            )}
          </div>

          {/* Select Employee */}
          <div className="w-full sm:w-40">
            <UiSelect value={employee} onValueChange={setEmployee}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEES.map((emp) => (
                  <SelectItem key={emp} value={emp}>
                    {emp}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select From Month */}
          <div className="w-full sm:w-44">
            <UiSelect value={fromMonth} onValueChange={setFromMonth}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select From Month" />
              </SelectTrigger>
              <SelectContent>
                {monthsList.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Select To Month */}
          <div className="w-full sm:w-44">
            <UiSelect value={toMonth} onValueChange={setToMonth}>
              <SelectTrigger className="w-full h-9 text-xs bg-white border-slate-200">
                <SelectValue placeholder="Select To Month" />
              </SelectTrigger>
              <SelectContent>
                {monthsList.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleApplyFilters}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs shadow-xs active:scale-95 transition-transform"
            >
              GO
            </Button>
            <Button
              onClick={handleExportCSV}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs shadow-xs active:scale-95 transition-transform"
            >
              EXCEL
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
        /* Double-Level Spreadsheet Grid Table Layout matching Snapshot 2/3/4 */
        <div className="bg-white border rounded-xl shadow-xs border-slate-100 overflow-hidden flex flex-col flex-1 animate-slide-up">
          <div className="p-3 border-b bg-slate-50/50 text-[11px] text-slate-500 font-semibold px-5 flex justify-between select-none">
            <span>Sales Trend Log Summary</span>
            <span className="text-slate-400">Scroll horizontally to view all months</span>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
            <table className="w-full text-center border-collapse min-w-[1000px]">
              <thead className="bg-slate-50 select-none z-10 text-[11px] font-bold text-slate-600 uppercase">
                {/* Level 1 Headers */}
                <tr className="border-b border-slate-200">
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 w-16 text-center">S.No</th>
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 text-left pl-4 w-48">Employee Name</th>
                  <th rowSpan={2} className="p-3 border-r border-b border-slate-200 text-left pl-4 w-60">Product Name</th>
                  
                  {activeMonths.map((m) => (
                    <th
                      key={m}
                      colSpan={pobType === "Unit & Value" ? 2 : 1}
                      className="p-3.5 border-r border-b border-slate-200 text-center font-bold"
                    >
                      {m}
                    </th>
                  ))}
                  
                  <th rowSpan={2} className="p-3 border-b border-slate-200 text-center w-36">Cumulative</th>
                </tr>

                {/* Level 2 Sub-Headers */}
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  {activeMonths.map((m) => {
                    if (pobType === "Unit") {
                      return (
                        <th key={`${m}-unit`} className="p-2 border-r border-b border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">
                          Unit
                        </th>
                      );
                    }
                    if (pobType === "Value") {
                      return (
                        <th key={`${m}-value`} className="p-2 border-r border-b border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">
                          Value
                        </th>
                      );
                    }
                    if (pobType === "Unit & Value") {
                      return (
                        <React.Fragment key={`${m}-both`}>
                          <th className="p-2 border-r border-b border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">
                            Unit
                          </th>
                          <th className="p-2 border-r border-b border-slate-200 text-center text-[10px] text-slate-500 lowercase first-letter:uppercase">
                            Value
                          </th>
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reportRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3 + (pobType === "Unit & Value" ? activeMonths.length * 2 : activeMonths.length) + 1}
                      className="p-6 text-center text-slate-400 font-semibold italic border-b border-slate-200"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  reportRows.map((row, idx) => (
                    <tr key={row.productName} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 border-r border-b border-slate-200 text-slate-500 font-semibold">{idx + 1}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.employeeName}</td>
                      <td className="p-3.5 border-r border-b border-slate-200 text-left pl-4 font-bold text-slate-800">{row.productName}</td>
                      
                      {activeMonths.map((m) => {
                        const monthVal = row.monthlyData[m] || { unit: 0, value: 0 };
                        if (pobType === "Unit") {
                          return (
                            <td key={`${m}-u`} className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-slate-700">
                              {monthVal.unit}
                            </td>
                          );
                        }
                        if (pobType === "Value") {
                          return (
                            <td key={`${m}-v`} className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-slate-700">
                              ₹{monthVal.value.toLocaleString()}
                            </td>
                          );
                        }
                        if (pobType === "Unit & Value") {
                          return (
                            <React.Fragment key={`${m}-uv`}>
                              <td className="p-3.5 border-r border-b border-slate-200 text-center text-slate-600 font-medium">
                                {monthVal.unit}
                              </td>
                              <td className="p-3.5 border-r border-b border-slate-200 text-center font-bold text-slate-800">
                                ₹{monthVal.value.toLocaleString()}
                              </td>
                            </React.Fragment>
                          );
                        }
                        return null;
                      })}

                      <td className="p-3.5 border-b border-slate-200 text-center font-bold text-[#008272]">
                        {/* Simple cumulative sum for demo */}
                        {pobType === "Unit" && activeMonths.reduce((sum, m) => sum + (row.monthlyData[m]?.unit || 0), 0)}
                        {pobType === "Value" && `₹${activeMonths.reduce((sum, m) => sum + (row.monthlyData[m]?.value || 0), 0).toLocaleString()}`}
                        {pobType === "Unit & Value" && (
                          <div className="flex flex-col text-[10px]">
                            <span>Units: {activeMonths.reduce((sum, m) => sum + (row.monthlyData[m]?.unit || 0), 0)}</span>
                            <span>Val: ₹{activeMonths.reduce((sum, m) => sum + (row.monthlyData[m]?.value || 0), 0).toLocaleString()}</span>
                          </div>
                        )}
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

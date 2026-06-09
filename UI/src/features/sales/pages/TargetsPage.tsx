import * as React from "react";
import {
  Plus,
  CheckCircle2,
  Send,
  Ban,
  Eye,
  Trash2,
  Download,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/data/DataTable";
import { StatusBadge } from "@/components/data/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RequirePermission } from "@/lib/rbac/RequirePermission";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { toast } from "sonner";
import {
  useTargetsList,
  useCreateTarget,
  useSubmitTarget,
  useApproveTarget,
  useRejectTarget,
  useDeleteTarget,
  useProductsList,
  useStockistsList,
} from "../hooks";
import { salesTargetSchema, type SalesTargetFormValues } from "../schemas";
import type { SalesTarget } from "../types";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import { useDoctorsList } from "@/features/people/doctors/hooks";
import { useProductCategoriesList } from "@/features/master-data/product-categories/hooks";
import noRecordImg from "../../../../img/No-record1.png";
import { cn } from "@/lib/utils";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed rounded-lg bg-card/20 shadow-xs">
      <img
        src={noRecordImg}
        alt="No Record! Found"
        className="w-[280px] h-auto mb-6 object-contain"
      />
      <h3 className="text-lg font-semibold text-foreground mb-1">No Record! Found</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Please select a division, zone, and employee to view and manage target allocations.
      </p>
    </div>
  );
}

interface SalesTargetRow extends SalesTarget {
  productId?: string;
  productQuantity?: number;
  productValue?: number;
  doctorName?: string;
  firmName?: string;
  firmCity?: string;
  firmType?: string;
  productGroupName?: string;
  rowId?: string;
}

const YEARLY_PRODUCTS = [
  { name: "BENMELO", priPts: 0, secPts: 298.98 },
  { name: "CLINSA A", priPts: 0, secPts: 183.21 },
  { name: "CLINSA N GEL", priPts: 0, secPts: 93.21 },
  { name: "Hair Eva", priPts: 0, secPts: 360.01 },
  { name: "HS6", priPts: 0, secPts: 781.05 },
  { name: "HYZA-10", priPts: 0, secPts: 32.14 },
  { name: "HYZA-25", priPts: 0, secPts: 48.21 },
  { name: "JORTA-12", priPts: 0, secPts: 160.21 },
  { name: "JORTA-6", priPts: 0, secPts: 96.43 },
  { name: "Kozan", priPts: 0, secPts: 94.58 },
  { name: "Kozan-M", priPts: 0, secPts: 112.50 },
  { name: "BENMELO-F", priPts: 0, secPts: 310.00 },
  { name: "CLINSA-Gel", priPts: 0, secPts: 120.00 },
  { name: "Eva-Shampoo", priPts: 0, secPts: 245.00 },
  { name: "HS6-Plus", priPts: 0, secPts: 850.00 },
  { name: "HYZA-50", priPts: 0, secPts: 64.00 },
  { name: "JORTA-AM", priPts: 0, secPts: 185.00 },
  { name: "Kozan-D", priPts: 0, secPts: 105.00 },
  { name: "Cardiv-10", priPts: 0, secPts: 90.00 },
  { name: "Cardiv-AM", priPts: 0, secPts: 150.00 },
  { name: "Glycem-500", priPts: 0, secPts: 54.00 },
  { name: "Glycem-M", priPts: 0, secPts: 108.00 },
  { name: "Pediasure-Plus", priPts: 0, secPts: 180.00 },
  { name: "Multivitamin-AZ", priPts: 0, secPts: 120.00 },
  { name: "Atorvas-10", priPts: 0, secPts: 45.00 },
  { name: "Atorvas-20", priPts: 0, secPts: 75.00 },
  { name: "Atorvas-AM", priPts: 0, secPts: 115.00 },
  { name: "Montas-L", priPts: 0, secPts: 135.00 },
  { name: "Montas-FX", priPts: 0, secPts: 165.00 },
  { name: "Cal-D3", priPts: 0, secPts: 85.00 },
  { name: "Ferro-Red", priPts: 0, secPts: 95.00 },
  { name: "Zinc-Plus", priPts: 0, secPts: 40.00 },
  { name: "Pan-40", priPts: 0, secPts: 72.00 },
  { name: "Pan-D", priPts: 0, secPts: 88.00 },
];

const QUARTER_MONTHS: Record<string, { label: string; yearOffset: number }[]> = {
  "Quarter 1": [
    { label: "April", yearOffset: 0 },
    { label: "May", yearOffset: 0 },
    { label: "June", yearOffset: 0 }
  ],
  "Quarter 2": [
    { label: "July", yearOffset: 0 },
    { label: "August", yearOffset: 0 },
    { label: "September", yearOffset: 0 }
  ],
  "Quarter 3": [
    { label: "October", yearOffset: 0 },
    { label: "November", yearOffset: 0 },
    { label: "December", yearOffset: 0 }
  ],
  "Quarter 4": [
    { label: "January", yearOffset: 1 },
    { label: "February", yearOffset: 1 },
    { label: "March", yearOffset: 1 }
  ]
};

interface CellState {
  target: string;
  achieved: string;
}

interface ProductMonthState {
  secAch: CellState;
  priAch: CellState;
  targetAch: CellState;
  valAch: CellState;
}

type GridState = Record<string, Record<string, ProductMonthState>>;

function YearlySalesTargetView({ employees }: { employees: any[] }) {
  const [employee, setEmployee] = React.useState<string>("emp-abhishek");
  const [year, setYear] = React.useState<string>("2026-2027");
  const [quarter, setQuarter] = React.useState<string>("Quarter 2");

  // Grid values state indexed by [productName][monthLabel]
  const [gridState, setGridState] = React.useState<GridState>(() => {
    const state: GridState = {};
    YEARLY_PRODUCTS.forEach((prod) => {
      state[prod.name] = {};
      ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"].forEach((month) => {
        state[prod.name][month] = {
          secAch: { target: "SEC", achieved: "0" },
          priAch: { target: "PRI", achieved: "0" },
          targetAch: { target: "0", achieved: "0" },
          valAch: { target: "", achieved: "" },
        };
      });
    });
    return state;
  });

  const handleInputChange = (
    prodName: string,
    monthLabel: string,
    colType: "secAch" | "priAch" | "targetAch" | "valAch",
    field: "target" | "achieved",
    value: string
  ) => {
    setGridState((prev) => ({
      ...prev,
      [prodName]: {
        ...prev[prodName],
        [monthLabel]: {
          ...prev[prodName]?.[monthLabel],
          [colType]: {
            ...prev[prodName]?.[monthLabel]?.[colType],
            [field]: value,
          },
        },
      },
    }));
  };

  // Determine active months
  const activeMonths = React.useMemo(() => {
    const months = QUARTER_MONTHS[quarter] || QUARTER_MONTHS["Quarter 2"];
    const startYearStr = year.split("-")[0] || "2026";
    const startYear = parseInt(startYearStr, 10);
    return months.map((m) => ({
      label: m.label,
      year: startYear + m.yearOffset,
    }));
  }, [quarter, year]);

  const handleGo = () => {
    toast.success(`Loaded yearly targets successfully`);
  };

  const handleExport = () => {
    toast.success(`Exporting Yearly Sales Targets to Excel format...`);
  };

  // Parse helper
  const parseNum = (val: string): number => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  // Aggregates for footer
  const aggregates = React.useMemo(() => {
    let secTargetSum = 0;
    let secAchSum = 0;
    let secValSum = 0;
    let priTargetSum = 0;
    let priAchSum = 0;
    let priValSum = 0;
    let purchaseAchSum = 0;
    let purchaseValSum = 0;

    YEARLY_PRODUCTS.forEach((prod) => {
      activeMonths.forEach((m) => {
        const state = gridState[prod.name]?.[m.label];
        if (state) {
          secTargetSum += parseNum(state.secAch.target);
          secAchSum += parseNum(state.secAch.achieved);
          secValSum += parseNum(state.secAch.achieved) * prod.secPts;

          priTargetSum += parseNum(state.priAch.target);
          priAchSum += parseNum(state.priAch.achieved);
          priValSum += parseNum(state.priAch.achieved) * prod.secPts;

          purchaseAchSum += parseNum(state.targetAch.achieved);
          purchaseValSum += parseNum(state.targetAch.achieved) * prod.secPts;
        }
      });
    });

    return {
      secTargetSum,
      secAchSum,
      secValSum,
      priTargetSum,
      priAchSum,
      priValSum,
      purchaseAchSum,
      purchaseValSum,
    };
  }, [gridState, activeMonths]);

  return (
    <div className="space-y-6">
      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 border rounded-lg bg-card shadow-xs">
        <div className="flex flex-col space-y-1">
          <UiSelect value={employee} onValueChange={setEmployee}>
            <SelectTrigger className="w-72 bg-background h-10 border border-input rounded-md px-3 py-2 text-sm shadow-xs">
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Select Employee</SelectItem>
              {employees.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </UiSelect>
        </div>

        <div className="flex flex-col space-y-1">
          <UiSelect value={year} onValueChange={setYear}>
            <SelectTrigger className="w-40 bg-background h-10 border border-input rounded-md px-3 py-2 text-sm shadow-xs">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Select Year</SelectItem>
              <SelectItem value="2025-2026">2025-2026</SelectItem>
              <SelectItem value="2026-2027">2026-2027</SelectItem>
              <SelectItem value="2027-2028">2027-2028</SelectItem>
            </SelectContent>
          </UiSelect>
        </div>

        <div className="flex flex-col space-y-1">
          <UiSelect value={quarter} onValueChange={setQuarter}>
            <SelectTrigger className="w-40 bg-background h-10 border border-input rounded-md px-3 py-2 text-sm shadow-xs">
              <SelectValue placeholder="Select Quarter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Select Quarter</SelectItem>
              <SelectItem value="Quarter 1">Quarter 1</SelectItem>
              <SelectItem value="Quarter 2">Quarter 2</SelectItem>
              <SelectItem value="Quarter 3">Quarter 3</SelectItem>
              <SelectItem value="Quarter 4">Quarter 4</SelectItem>
            </SelectContent>
          </UiSelect>
        </div>

        <Button
          onClick={handleGo}
          className="h-10 px-5 bg-[#008272] text-white hover:bg-[#008272]/90 font-semibold rounded-md"
        >
          Go
        </Button>

        <Button
          onClick={handleExport}
          className="h-10 px-4 bg-[#008272] text-white hover:bg-[#008272]/90 font-semibold rounded-md flex items-center gap-1.5 ml-auto"
        >
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      {/* Grid Container */}
      <div className="w-full overflow-x-auto border border-muted rounded-lg bg-background shadow-xs">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b">
              <th rowSpan={3} className="p-3 border-r text-center text-xs font-semibold text-muted-foreground w-16">Sr.No</th>
              <th rowSpan={3} className="p-3 border-r text-left text-xs font-semibold text-muted-foreground min-w-[150px]">Product Name</th>
              <th rowSpan={3} className="p-3 border-r text-right text-xs font-semibold text-muted-foreground w-20">PRI PTS</th>
              <th rowSpan={3} className="p-3 border-r text-right text-xs font-semibold text-muted-foreground w-20">SEC PTS</th>
              {activeMonths.map((m) => (
                <th key={m.label} colSpan={4} className="p-2 border-r text-center text-xs font-bold text-muted-foreground">
                  {m.label} {m.year}
                </th>
              ))}
            </tr>
            <tr className="bg-muted/20 border-b">
              {activeMonths.map((m) => (
                <th key={m.label} colSpan={4} className="p-1 border-r text-center text-xs font-semibold text-muted-foreground">
                  Qty
                </th>
              ))}
            </tr>
            <tr className="bg-muted/10 border-b text-center text-[10px] font-bold text-muted-foreground">
              {activeMonths.map((m) => (
                <React.Fragment key={m.label}>
                  <th className="p-2 border-r w-28 text-center">SEC/ACH</th>
                  <th className="p-2 border-r w-28 text-center">PRI/ACH</th>
                  <th className="p-2 border-r w-28 text-center">TARGET/ACH</th>
                  <th className="p-2 border-r w-28 text-center">SEC/ACH</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {YEARLY_PRODUCTS.map((prod, idx) => (
              <tr key={prod.name} className="border-b last:border-b-0 hover:bg-muted/5">
                <td className="p-2 border-r text-center text-xs font-medium text-muted-foreground">{idx + 1}</td>
                <td className="p-2 border-r text-left text-xs font-semibold text-foreground">{prod.name}</td>
                <td className="p-2 border-r text-right text-xs text-muted-foreground">{prod.priPts}</td>
                <td className="p-2 border-r text-right text-xs font-medium text-foreground">{prod.secPts.toFixed(2)}</td>
                {activeMonths.map((m) => {
                  const state = gridState[prod.name]?.[m.label] || {
                    secAch: { target: "", achieved: "" },
                    priAch: { target: "", achieved: "" },
                    targetAch: { target: "", achieved: "" },
                    valAch: { target: "", achieved: "" },
                  };
                  return (
                    <React.Fragment key={m.label}>
                      {/* SEC/ACH */}
                      <td className="p-2 border-r text-center">
                        <div className="flex items-center gap-1 justify-center p-1 bg-[#b54282] rounded-md h-8 w-[95px] mx-auto">
                          <input
                            type="text"
                            className="w-10 h-6 text-center text-[10px] font-bold text-foreground bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#008272]"
                            value={state.secAch.target}
                            onChange={(e) => handleInputChange(prod.name, m.label, "secAch", "target", e.target.value)}
                          />
                          <span className="text-white text-xs font-bold px-0.5">/</span>
                          <input
                            type="text"
                            className="w-10 h-6 text-center text-[10px] font-bold text-foreground bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#008272]"
                            value={state.secAch.achieved}
                            onChange={(e) => handleInputChange(prod.name, m.label, "secAch", "achieved", e.target.value)}
                          />
                        </div>
                      </td>

                      {/* PRI/ACH */}
                      <td className="p-2 border-r text-center">
                        <div className="flex items-center gap-1 justify-center p-1 bg-[#b54282] rounded-md h-8 w-[95px] mx-auto">
                          <input
                            type="text"
                            className="w-10 h-6 text-center text-[10px] font-bold text-foreground bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#008272]"
                            value={state.priAch.target}
                            onChange={(e) => handleInputChange(prod.name, m.label, "priAch", "target", e.target.value)}
                          />
                          <span className="text-white text-xs font-bold px-0.5">/</span>
                          <input
                            type="text"
                            className="w-10 h-6 text-center text-[10px] font-bold text-foreground bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#008272]"
                            value={state.priAch.achieved}
                            onChange={(e) => handleInputChange(prod.name, m.label, "priAch", "achieved", e.target.value)}
                          />
                        </div>
                      </td>

                      {/* TARGET/ACH */}
                      <td className="p-2 border-r text-center">
                        <div className="flex items-center gap-1 justify-center p-1 bg-[#b54282] rounded-md h-8 w-[95px] mx-auto">
                          <input
                            type="text"
                            className="w-10 h-6 text-center text-[10px] font-bold text-foreground bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#008272]"
                            value={state.targetAch.target}
                            onChange={(e) => handleInputChange(prod.name, m.label, "targetAch", "target", e.target.value)}
                          />
                          <span className="text-white text-xs font-bold px-0.5">/</span>
                          <input
                            type="text"
                            className="w-10 h-6 text-center text-[10px] font-bold text-foreground bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#008272]"
                            value={state.targetAch.achieved}
                            onChange={(e) => handleInputChange(prod.name, m.label, "targetAch", "achieved", e.target.value)}
                          />
                        </div>
                      </td>

                      {/* SEC/ACH (Value target/ach) */}
                      <td className="p-2 border-r text-center">
                        <div className="flex items-center gap-1 justify-center p-1 bg-[#b54282] rounded-md h-8 w-[95px] mx-auto">
                          <input
                            type="text"
                            className="w-10 h-6 text-center text-[10px] font-bold text-foreground bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#008272]"
                            value={state.valAch.target}
                            onChange={(e) => handleInputChange(prod.name, m.label, "valAch", "target", e.target.value)}
                          />
                          <span className="text-white text-xs font-bold px-0.5">/</span>
                          <input
                            type="text"
                            className="w-10 h-6 text-center text-[10px] font-bold text-foreground bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#008272]"
                            value={state.valAch.achieved}
                            onChange={(e) => handleInputChange(prod.name, m.label, "valAch", "achieved", e.target.value)}
                          />
                        </div>
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-muted-foreground mt-3 pl-1">
        Showing 1 to 34 of 34 entries
      </div>

      {/* Footer summary table */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border border-muted rounded-lg bg-card overflow-hidden mt-6 text-sm shadow-xs">
        {/* Column 1 */}
        <div className="border-r border-muted divide-y divide-muted">
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold text-muted-foreground">Secondary Target</span>
            <span className="font-bold text-foreground bg-muted/20 px-3 py-1 rounded border min-w-16 text-center">
              {aggregates.secTargetSum}
            </span>
          </div>
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold text-muted-foreground">Primary Target</span>
            <span className="font-bold text-foreground bg-muted/20 px-3 py-1 rounded border min-w-16 text-center">
              {aggregates.priTargetSum}
            </span>
          </div>
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold text-muted-foreground">Purchase Achieved</span>
            <span className="font-bold text-foreground bg-muted/20 px-3 py-1 rounded border min-w-16 text-center">
              {aggregates.purchaseAchSum}
            </span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="border-r border-muted divide-y divide-muted">
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold text-muted-foreground">Secondary Achieved</span>
            <span className="font-bold text-foreground bg-muted/20 px-3 py-1 rounded border min-w-16 text-center">
              {aggregates.secAchSum}
            </span>
          </div>
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold text-muted-foreground">Primary Achieved</span>
            <span className="font-bold text-foreground bg-muted/20 px-3 py-1 rounded border min-w-16 text-center">
              {aggregates.priAchSum}
            </span>
          </div>
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold text-muted-foreground">Purchase Value</span>
            <span className="font-bold text-[#008272] bg-muted/20 px-3 py-1 rounded border min-w-16 text-center">
              {aggregates.purchaseValSum}
            </span>
          </div>
        </div>

        {/* Column 3 */}
        <div className="divide-y divide-muted">
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold text-muted-foreground">Secondary Value</span>
            <span className="font-bold text-emerald-600 bg-muted/20 px-3 py-1 rounded border min-w-16 text-center">
              {aggregates.secValSum}
            </span>
          </div>
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold text-muted-foreground">Primary Value</span>
            <span className="font-bold text-[#008272] bg-muted/20 px-3 py-1 rounded border min-w-16 text-center">
              {aggregates.priValSum}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/5 h-[53px]">
            {/* Empty block to match height */}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TargetsPage() {
  const [activeTopTab, setActiveTopTab] = React.useState<"target" | "yearly">("target");
  const [activeSubTab, setActiveSubTab] = React.useState<string>("employee");

  // Custom filters
  const [divisionFilter, setDivisionFilter] = React.useState<string>("default");
  const [zoneFilter, setZoneFilter] = React.useState<string>("default");
  const [employeeFilter, setEmployeeFilter] = React.useState<string>("default");

  // Import file local state
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = React.useState<string>("");

  const [isAllocOpen, setIsAllocOpen] = React.useState(false);

  const [confirmSubmit, setConfirmSubmit] = React.useState<SalesTarget | null>(null);
  const [confirmApprove, setConfirmApprove] = React.useState<SalesTarget | null>(null);
  const [confirmReject, setConfirmReject] = React.useState<SalesTarget | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<SalesTarget | null>(null);

  const [viewDetail, setViewDetail] = React.useState<SalesTarget | null>(null);
  const [rejectRemarks, setRejectRemarks] = React.useState("");

  const { data: targets = [], isLoading } = useTargetsList({});
  const { data: employees = [] } = useEmployeesList({});
  const { data: products = [] } = useProductsList({});
  const { data: divisions = [] } = useDivisionsList();
  const { data: zones = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: doctors = [] } = useDoctorsList();
  const { data: stockists = [] } = useStockistsList({});
  const { data: productCategories = [] } = useProductCategoriesList();

  const employeeMap = React.useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);
  const productMap = React.useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const territoryMap = React.useMemo(() => new Map(territories.map((t) => [t.id, t])), [territories]);
  const categoryMap = React.useMemo(() => new Map(productCategories.map((c) => [c.id, c])), [productCategories]);

  const createMutation = useCreateTarget();
  const submitMutation = useSubmitTarget();
  const approveMutation = useApproveTarget();
  const rejectMutation = useRejectTarget();
  const deleteMutation = useDeleteTarget();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SalesTargetFormValues>({
    resolver: zodResolver(salesTargetSchema),
    defaultValues: {
      targetType: "employee",
      divisionId: "",
      zoneId: "",
      cityId: "",
      employeeId: "",
      month: new Date().toISOString().slice(0, 7),
      remarks: "",
      frequency: "Monthly",
      quarter: "NA",
      year: String(new Date().getFullYear()),
      pobValue: 0,
      secondarySales: 0,
      doctorVisit: 0,
      chemistVisit: 0,
      newDoctorAddition: 0,
      newChemistAddition: 0,
      primarySalesValue: 0,
      primarySalesQty: 0,
      productTargets: [
        {
          productId: "",
          targetQuantity: 0,
          targetAmount: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productTargets",
  });

  const watchEmpId = watch("employeeId");
  const watchProductTargets = watch("productTargets");
  const watchTargetType = watch("targetType");
  const watchZoneId = watch("zoneId");

  const totalProductTargetPreview = React.useMemo(() => {
    return watchProductTargets?.reduce((sum, item) => sum + (item.targetAmount || 0), 0) || 0;
  }, [watchProductTargets]);

  const onAllocSubmit = async (values: SalesTargetFormValues) => {
    try {
      await createMutation.mutateAsync({
        ...values,
        targetAmount: values.primarySalesValue || totalProductTargetPreview || 0,
      } as Parameters<typeof createMutation.mutateAsync>[0]);

      toast.success("Target draft allocated");
      setIsAllocOpen(false);
      reset();
    } catch {
      toast.error("Failed to allocate targets");
    }
  };

  const executeSubmit = async () => {
    if (!confirmSubmit) return;
    try {
      await submitMutation.mutateAsync(confirmSubmit.id);
      toast.success("Target submitted for manager approval");
      setConfirmSubmit(null);
    } catch {
      toast.error("Failed to submit targets");
    }
  };

  const executeApprove = async () => {
    if (!confirmApprove) return;
    try {
      await approveMutation.mutateAsync(confirmApprove.id);
      toast.success("Targets approved");
      setConfirmApprove(null);
    } catch {
      toast.error("Failed to approve target");
    }
  };

  const executeReject = async () => {
    if (!confirmReject) return;
    try {
      await rejectMutation.mutateAsync({ id: confirmReject.id, remarks: rejectRemarks });
      toast.success("Targets rejected");
      setConfirmReject(null);
      setRejectRemarks("");
    } catch {
      toast.error("Failed to reject target");
    }
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success("Targets deleted");
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Import / Export / Download Template mock actions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleImport = () => {
    if (!selectedFileName) {
      toast.error("Please select a file to import first");
      return;
    }
    toast.success(`Imported target template from ${selectedFileName} successfully`);
    setSelectedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExport = () => {
    toast.success("Exporting targets to Excel format...");
  };

  const handleDownloadTemplate = () => {
    toast.info("Downloading Excel target allocation template...");
  };

  const isFiltersUnset =
    divisionFilter === "default" &&
    zoneFilter === "default" &&
    employeeFilter === "default";

  // Filter targets matching filters
  const filteredTargets = React.useMemo(() => {
    if (isFiltersUnset) return [];

    return targets.filter((target) => {
      const emp = employeeMap.get(target.employeeId);

      if (employeeFilter !== "default" && target.employeeId !== employeeFilter) {
        return false;
      }
      if (divisionFilter !== "default" && (!emp || emp.divisionId !== divisionFilter)) {
        return false;
      }
      if (zoneFilter !== "default" && (!emp || emp.zoneId !== zoneFilter)) {
        return false;
      }
      return true;
    });
  }, [targets, isFiltersUnset, employeeFilter, divisionFilter, zoneFilter, employeeMap]);

  const flatTargets = React.useMemo<SalesTargetRow[]>(() => {
    if (activeSubTab === "product") {
      return filteredTargets.flatMap((target) => {
        if (!target.productTargets || target.productTargets.length === 0) {
          return [];
        }
        return target.productTargets.map((pt, index) => ({
          ...target,
          productId: pt.productId,
          productQuantity: pt.targetQuantity,
          productValue: pt.targetAmount,
          rowId: `${target.id}-${pt.productId}-${index}`,
        }));
      });
    }

    if (activeSubTab === "doctor") {
      return filteredTargets.flatMap((target) => {
        const assignedDocs = doctors.filter((doc) => doc.assignedEmployeeId === target.employeeId);
        if (assignedDocs.length === 0) {
          // fallback to display at least one doctor record for mock completeness
          return [{
            ...target,
            doctorName: "Dr. Atul Mohankar",
            rowId: `${target.id}-mockdoc`,
          }];
        }
        return assignedDocs.map((doc, index) => ({
          ...target,
          doctorName: doc.name,
          rowId: `${target.id}-${doc.id}-${index}`,
        }));
      });
    }

    if (activeSubTab === "firm") {
      return filteredTargets.flatMap((target) => {
        const emp = employeeMap.get(target.employeeId);
        const assignedFirms = stockists.filter(
          (s) => emp?.name && s.employeeAssigned?.toLowerCase() === emp.name.toLowerCase()
        );
        if (assignedFirms.length === 0) {
          // fallback to display at least one stockist record for mock completeness
          return [{
            ...target,
            firmName: "ROHIT MEDICAL AGENCY",
            firmCity: "Durg",
            firmType: "Stockist",
            rowId: `${target.id}-mockfirm`,
          }];
        }
        return assignedFirms.map((firm, index) => ({
          ...target,
          firmName: firm.name,
          firmCity: firm.city,
          firmType: firm.type,
          rowId: `${target.id}-${firm.id}-${index}`,
        }));
      });
    }

    if (activeSubTab === "group") {
      return filteredTargets.flatMap((target) => {
        const categoryMapLocal = new Map<string, { qty: number; val: number }>();
        target.productTargets?.forEach((pt) => {
          const prod = productMap.get(pt.productId);
          const catId = prod?.productCategoryId ?? "cat-otc";
          const prev = categoryMapLocal.get(catId) || { qty: 0, val: 0 };
          categoryMapLocal.set(catId, {
            qty: prev.qty + (pt.targetQuantity ?? 0),
            val: prev.val + (pt.targetAmount ?? 0),
          });
        });

        if (categoryMapLocal.size === 0) {
          // fallback to display at least one category record for mock completeness
          return [{
            ...target,
            productGroupName: "Cardiovascular Therapeutics",
            productQuantity: 0,
            productValue: target.targetAmount,
            rowId: `${target.id}-mockgroup`,
          }];
        }

        return Array.from(categoryMapLocal.entries()).map(([catId, stats], index) => {
          const cat = categoryMap.get(catId);
          return {
            ...target,
            productGroupName: cat?.name ?? catId,
            productQuantity: stats.qty,
            productValue: stats.val,
            pobValue: stats.val,
            rowId: `${target.id}-${catId}-${index}`,
          };
        });
      });
    }

    return filteredTargets;
  }, [filteredTargets, activeSubTab, doctors, stockists, employeeMap, productMap, categoryMap]);

  const columns = React.useMemo<Column<SalesTargetRow>[]>(() => {
    const cols: Column<SalesTargetRow>[] = [
      {
        accessorKey: "actions",
        header: "#",
        cell: (item) => (
          <div className="flex items-center gap-1.5 justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={() => setViewDetail(item)}
              title="View Breakdown"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>

            {item.status === "draft" && (
              <RequirePermission permission={PERMISSIONS.SALES_MANAGE}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-[#008272] hover:bg-[#008272]/10"
                  title="Submit Targets"
                  onClick={() => setConfirmSubmit(item)}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  title="Delete Allocation"
                  onClick={() => setConfirmDelete(item)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </RequirePermission>
            )}

            {item.status === "submitted" && (
              <RequirePermission permission={PERMISSIONS.SALES_MANAGE}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-success hover:bg-success/10"
                  title="Approve Target"
                  onClick={() => setConfirmApprove(item)}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  title="Reject Target"
                  onClick={() => {
                    setConfirmReject(item);
                    setRejectRemarks("");
                  }}
                >
                  <Ban className="h-3.5 w-3.5 text-rose-600" />
                </Button>
              </RequirePermission>
            )}
          </div>
        ),
      },
      {
        accessorKey: "srNo",
        header: "Sr.no",
        cell: (item) => {
          const idx = flatTargets.findIndex((t) => (t.rowId && item.rowId) ? t.rowId === item.rowId : t.id === item.id);
          return <span className="nums-tabular text-sm font-medium">{idx !== -1 ? idx + 1 : "-"}</span>;
        },
      },
    ];

    if (activeSubTab === "hq") {
      cols.push({
        accessorKey: "hq",
        header: "HQ",
        cell: (item) => {
          const emp = employeeMap.get(item.employeeId);
          const terr = emp ? territoryMap.get(emp.territoryId) : null;
          return <span className="text-sm font-medium">{terr?.name ?? emp?.territoryId ?? "-"}</span>;
        },
      });
    }

    if (activeSubTab === "product") {
      cols.push(
        {
          accessorKey: "productId",
          header: "Product Name",
          cell: (item) => {
            const prod = productMap.get(item.productId ?? "");
            return <span className="font-semibold text-sm">{prod?.name ?? "Unknown SKU"}</span>;
          },
        },
        {
          accessorKey: "employeeId",
          header: "Employee Name",
          cell: (item) => {
            const emp = employeeMap.get(item.employeeId);
            return (
              <div>
                <div className="font-semibold text-sm">{emp?.name ?? item.employeeId}</div>
                <div className="text-[10px] text-muted-foreground">{emp?.code ?? ""}</div>
              </div>
            );
          },
        },
        {
          accessorKey: "frequency",
          header: "Frequency",
          cell: (item) => <span className="text-sm">{item.frequency ?? "Monthly"}</span>,
        },
        {
          accessorKey: "month",
          header: "Month",
          sortable: true,
          cell: (item) => {
            const [y, m] = item.month.split("-");
            const monthLabel = new Date(Number(y), Number(m) - 1).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            });
            return <span className="nums-tabular text-sm font-medium">{monthLabel}</span>;
          },
        },
        {
          accessorKey: "quarter",
          header: "Quarter",
          cell: (item) => <span className="text-sm nums-tabular">{item.quarter ?? "NA"}</span>,
        },
        {
          accessorKey: "year",
          header: "Year",
          cell: (item) => <span className="text-sm nums-tabular">{item.year ?? "2026"}</span>,
        },
        {
          accessorKey: "productQuantity",
          header: "Product Quantity",
          cell: (item) => <span className="nums-tabular text-sm font-medium">{item.productQuantity ?? 0}</span>,
        },
        {
          accessorKey: "productValue",
          header: "Product Value",
          cell: (item) => <span className="nums-tabular font-semibold text-[#008272]">{fmt(item.productValue ?? 0)}</span>,
        }
      );
    } else if (activeSubTab === "doctor") {
      cols.push(
        {
          accessorKey: "doctorName",
          header: "Doctor Name",
          cell: (item) => <span className="font-semibold text-sm">{item.doctorName}</span>,
        },
        {
          accessorKey: "frequency",
          header: "Frequency",
          cell: (item) => <span className="text-sm">{item.frequency ?? "Monthly"}</span>,
        },
        {
          accessorKey: "month",
          header: "Month",
          sortable: true,
          cell: (item) => {
            const [y, m] = item.month.split("-");
            const monthLabel = new Date(Number(y), Number(m) - 1).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            });
            return <span className="nums-tabular text-sm font-medium">{monthLabel}</span>;
          },
        },
        {
          accessorKey: "quarter",
          header: "Quarter",
          cell: (item) => <span className="text-sm nums-tabular">{item.quarter ?? "NA"}</span>,
        },
        {
          accessorKey: "year",
          header: "Year",
          cell: (item) => <span className="text-sm nums-tabular">{item.year ?? "2026"}</span>,
        },
        {
          accessorKey: "pobValue",
          header: "POB Value",
          cell: (item) => <span className="nums-tabular font-medium">{fmt(item.pobValue ?? 0)}</span>,
        }
      );
    } else if (activeSubTab === "firm") {
      cols.push(
        {
          accessorKey: "firmName",
          header: "Firm Name",
          cell: (item) => <span className="font-semibold text-sm">{item.firmName}</span>,
        },
        {
          accessorKey: "firmCity",
          header: "City",
          cell: (item) => <span className="text-sm">{item.firmCity ?? "-"}</span>,
        },
        {
          accessorKey: "firmType",
          header: "Type",
          cell: (item) => <span className="text-sm">{item.firmType ?? "-"}</span>,
        },
        {
          accessorKey: "frequency",
          header: "Frequency",
          cell: (item) => <span className="text-sm">{item.frequency ?? "Monthly"}</span>,
        },
        {
          accessorKey: "month",
          header: "Month",
          sortable: true,
          cell: (item) => {
            const [y, m] = item.month.split("-");
            const monthLabel = new Date(Number(y), Number(m) - 1).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            });
            return <span className="nums-tabular text-sm font-medium">{monthLabel}</span>;
          },
        },
        {
          accessorKey: "quarter",
          header: "Quarter",
          cell: (item) => <span className="text-sm nums-tabular">{item.quarter ?? "NA"}</span>,
        },
        {
          accessorKey: "year",
          header: "Year",
          cell: (item) => <span className="text-sm nums-tabular">{item.year ?? "2026"}</span>,
        },
        {
          accessorKey: "pobValue",
          header: "POB Value",
          cell: (item) => <span className="nums-tabular font-medium">{fmt(item.pobValue ?? 0)}</span>,
        },
        {
          accessorKey: "secondarySales",
          header: "Secondary Value",
          cell: (item) => (
            <span className="nums-tabular font-medium text-emerald-600">
              {fmt(item.secondarySales ?? 0)}
            </span>
          ),
        }
      );
    } else if (activeSubTab === "group") {
      cols.push(
        {
          accessorKey: "productGroupName",
          header: "Product Group",
          cell: (item) => <span className="font-semibold text-sm">{item.productGroupName}</span>,
        },
        {
          accessorKey: "employeeId",
          header: "Employee Name",
          cell: (item) => {
            const emp = employeeMap.get(item.employeeId);
            return (
              <div>
                <div className="font-semibold text-sm">{emp?.name ?? item.employeeId}</div>
                <div className="text-[10px] text-muted-foreground">{emp?.code ?? ""}</div>
              </div>
            );
          },
        },
        {
          accessorKey: "frequency",
          header: "Frequency",
          cell: (item) => <span className="text-sm">{item.frequency ?? "Monthly"}</span>,
        },
        {
          accessorKey: "month",
          header: "Month",
          sortable: true,
          cell: (item) => {
            const [y, m] = item.month.split("-");
            const monthLabel = new Date(Number(y), Number(m) - 1).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            });
            return <span className="nums-tabular text-sm font-medium">{monthLabel}</span>;
          },
        },
        {
          accessorKey: "quarter",
          header: "Quarter",
          cell: (item) => <span className="text-sm nums-tabular">{item.quarter ?? "NA"}</span>,
        },
        {
          accessorKey: "year",
          header: "Year",
          cell: (item) => <span className="text-sm nums-tabular">{item.year ?? "2026"}</span>,
        },
        {
          accessorKey: "pobValue",
          header: "POB Value",
          cell: (item) => <span className="nums-tabular font-medium">{fmt(item.pobValue ?? 0)}</span>,
        }
      );
    } else {
      cols.push(
        {
          accessorKey: "employeeId",
          header: "Employee Name",
          cell: (item) => {
            const emp = employeeMap.get(item.employeeId);
            return (
              <div>
                <div className="font-semibold text-sm">{emp?.name ?? item.employeeId}</div>
                <div className="text-[10px] text-muted-foreground">{emp?.code ?? ""}</div>
              </div>
            );
          },
        },
        {
          accessorKey: "frequency",
          header: "Frequency",
          cell: (item) => <span className="text-sm">{item.frequency ?? "Monthly"}</span>,
        },
        {
          accessorKey: "month",
          header: "Month",
          sortable: true,
          cell: (item) => {
            const [y, m] = item.month.split("-");
            const monthLabel = new Date(Number(y), Number(m) - 1).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            });
            return <span className="nums-tabular text-sm font-medium">{monthLabel}</span>;
          },
        },
        {
          accessorKey: "quarter",
          header: "Quarter",
          cell: (item) => <span className="text-sm nums-tabular">{item.quarter ?? "NA"}</span>,
        },
        {
          accessorKey: "year",
          header: "Year",
          cell: (item) => <span className="text-sm nums-tabular">{item.year ?? "2026"}</span>,
        },
        {
          accessorKey: "pobValue",
          header: "POB Value",
          cell: (item) => <span className="nums-tabular font-medium">{fmt(item.pobValue ?? 0)}</span>,
        },
        {
          accessorKey: "secondarySales",
          header: "Secondary Value",
          cell: (item) => (
            <span className="nums-tabular font-medium text-emerald-600">
              {fmt(item.secondarySales ?? 0)}
            </span>
          ),
        },
        {
          accessorKey: "doctorVisit",
          header: "Doctor Visit",
          cell: (item) => <span className="nums-tabular text-sm">{item.doctorVisit ?? 0}</span>,
        },
        {
          accessorKey: "chemistVisit",
          header: "Chemist Visit",
          cell: (item) => <span className="nums-tabular text-sm">{item.chemistVisit ?? 0}</span>,
        },
        {
          accessorKey: "newDoctorAddition",
          header: "New Doctor Addition",
          cell: (item) => <span className="nums-tabular text-sm">{item.newDoctorAddition ?? 0}</span>,
        },
        {
          accessorKey: "newChemistAddition",
          header: "New Chemist Addition",
          cell: (item) => <span className="nums-tabular text-sm">{item.newChemistAddition ?? 0}</span>,
        },
        {
          accessorKey: "primarySalesValue",
          header: "Primary Sales Value",
          cell: (item) => (
            <span className="nums-tabular font-semibold text-[#008272]">
              {fmt(item.primarySalesValue ?? item.targetAmount ?? 0)}
            </span>
          ),
        },
        {
          accessorKey: "primarySalesQty",
          header: "Primary Sales Qty",
          cell: (item) => {
            const totalQty = item.productTargets?.reduce((sum, pt) => sum + (pt.targetQuantity ?? 0), 0) ?? 0;
            return <span className="nums-tabular text-sm font-medium">{totalQty}</span>;
          },
        }
      );
    }

    return cols;
  }, [activeSubTab, flatTargets, employeeMap, territoryMap, productMap]);

  return (
    <>
      <PageHeader
        title="Targets"
        description="Redesign target management sheets, allocate monthly values and volume targets to sales representatives, and track secondary targets."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Sales" },
          { label: "Targets" },
        ]}
      />

      <div className="space-y-6">
        {/* Top Tabs */}
        <div className="flex border-b border-muted">
          <button
            className={cn(
              "px-4 py-2 text-sm font-semibold transition-colors duration-150 border-b-2 -mb-[2px]",
              activeTopTab === "target"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTopTab("target")}
          >
            Target
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-semibold transition-colors duration-150 border-b-2 -mb-[2px]",
              activeTopTab === "yearly"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveTopTab("yearly")}
          >
            Yearly Sales Target
          </button>
        </div>

        {activeTopTab === "yearly" ? (
          <YearlySalesTargetView employees={employees} />
        ) : (
          <>
            {/* Actions Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg bg-card/50 shadow-xs">
              {/* Left Actions */}
              <div className="flex items-center gap-2">
                <RequirePermission permission={PERMISSIONS.SALES_MANAGE}>
                  <Button
                    size="sm"
                    className="gap-1.5 h-9 bg-primary text-primary-foreground hover:bg-primary/95 font-semibold"
                    onClick={() => {
                      reset();
                      setIsAllocOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" /> Allocate Target
                  </Button>
                </RequirePermission>

                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-9 border-[#008272] text-[#008272] hover:bg-[#008272]/10 font-semibold"
                  onClick={handleExport}
                >
                  <Download className="h-4 w-4" /> Export
                </Button>
              </div>

              {/* Right Actions - Import File */}
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="flex items-center justify-between border rounded-md bg-background px-3 py-1.5 text-sm text-muted-foreground w-48 cursor-pointer h-9 shadow-xs hover:border-muted-foreground/30 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="truncate">{selectedFileName || "Select file"}</span>
                  <span className="text-xs font-semibold text-primary ml-2 border-l pl-2">Browse</span>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

                <Button
                  size="sm"
                  className="gap-1.5 h-9 bg-[#008272] hover:bg-[#008272]/90 font-semibold text-white"
                  onClick={handleImport}
                >
                  Import
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground border border-input shadow-xs"
                  onClick={handleDownloadTemplate}
                  title="Download Excel Template"
                >
                  <FileSpreadsheet className="h-4 w-4 text-[#008272]" />
                </Button>
              </div>
            </div>

            {/* Sub Tabs switcher */}
            <div className="flex flex-wrap gap-2 py-1">
              {[
                { id: "employee", label: "Employee Wise Target" },
                { id: "hq", label: "Hq Wise Target" },
                { id: "product", label: "Product Wise Target" },
                { id: "doctor", label: "Doctor Wise Target" },
                { id: "firm", label: "Firm Wise Target" },
                { id: "group", label: "Product Group Wise Target" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-150 border",
                    activeSubTab === tab.id
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-background text-muted-foreground hover:text-foreground border-muted"
                  )}
                  onClick={() => setActiveSubTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sefmed Filters */}
            <div className="p-4 border rounded-lg bg-card/20 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Select Division</Label>
                  <UiSelect value={divisionFilter} onValueChange={setDivisionFilter}>
                    <SelectTrigger className="w-full bg-background h-10 border border-input rounded-md px-3 py-2 text-sm shadow-xs">
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Select Division</SelectItem>
                      {divisions.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Select Zone</Label>
                  <UiSelect value={zoneFilter} onValueChange={setZoneFilter}>
                    <SelectTrigger className="w-full bg-background h-10 border border-input rounded-md px-3 py-2 text-sm shadow-xs">
                      <SelectValue placeholder="Select Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Select Zone</SelectItem>
                      {zones.map((z) => (
                        <SelectItem key={z.id} value={z.id}>
                          {z.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-muted-foreground">Select Employee</Label>
                  <UiSelect value={employeeFilter} onValueChange={setEmployeeFilter}>
                    <SelectTrigger className="w-full bg-background h-10 border border-input rounded-md px-3 py-2 text-sm shadow-xs">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Select Employee</SelectItem>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {!isFiltersUnset && (
                <div className="flex justify-end pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setDivisionFilter("default");
                      setZoneFilter("default");
                      setEmployeeFilter("default");
                    }}
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Clear Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Data Table / Empty State */}
            {isFiltersUnset ? (
              <EmptyState />
            ) : (
              <DataTable
                columns={columns}
                data={flatTargets}
                isLoading={isLoading}
                getRowId={(item) => item.rowId ?? item.id}
              />
            )}
          </>
        )}
      </div>

      {/* Allocation Form Dialog — redesigned as Add Target page layout */}
      <Dialog open={isAllocOpen} onOpenChange={setIsAllocOpen}>
        <DialogContent className="sm:max-w-[680px] max-h-[92vh] overflow-y-auto p-0">
          <form onSubmit={handleSubmit(onAllocSubmit)}>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-muted/60 bg-background sticky top-0 z-10">
              <DialogTitle className="text-xl font-semibold text-foreground">Add Target</DialogTitle>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-0">

              {/* Target Type */}
              <div className="grid grid-cols-[180px_1fr] items-start gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right pt-1 text-foreground/70 pr-2">
                  Target Type <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-0.5">
                  {[
                    { value: "employee", label: "Employee Wise" },
                    { value: "hq", label: "HQ Wise" },
                    { value: "product", label: "Product Wise" },
                    { value: "doctor", label: "Doctor Wise" },
                    { value: "firm", label: "Firm Wise" },
                    { value: "group", label: "Product Group Wise" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer text-sm text-foreground/80">
                      <input
                        type="radio"
                        value={opt.value}
                        {...register("targetType")}
                        defaultChecked={opt.value === "employee"}
                        className="accent-[#008272] w-3.5 h-3.5 cursor-pointer"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Division */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-foreground/70 pr-2">
                  Division <span className="text-destructive">*</span>
                </Label>
                <UiSelect onValueChange={(v) => setValue("divisionId", v)}>
                  <SelectTrigger className="w-full bg-background border border-input h-9 text-sm">
                    <SelectValue placeholder="Select Division" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
              </div>

              {/* Zone — visible only for HQ Wise */}
              {watchTargetType === "hq" && (
                <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                  <Label className="text-sm font-semibold text-right text-foreground/70 pr-2">
                    Zone
                  </Label>
                  <UiSelect
                    value={watchZoneId}
                    onValueChange={(v) => {
                      setValue("zoneId", v);
                      setValue("cityId", ""); // reset city when zone changes
                    }}
                  >
                    <SelectTrigger className="w-full bg-background border border-input h-9 text-sm">
                      <SelectValue placeholder="Select Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((z) => (
                        <SelectItem key={z.id} value={z.id}>
                          {z.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              )}

              {/* City (Territory) — visible only for HQ Wise */}
              {watchTargetType === "hq" && (
                <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                  <Label className="text-sm font-semibold text-right text-foreground/70 pr-2">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <UiSelect onValueChange={(v) => setValue("cityId", v)}>
                    <SelectTrigger className="w-full bg-background border border-input h-9 text-sm">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {territories
                        .filter((t) => !watchZoneId || t.zoneId === watchZoneId)
                        .map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              )}

              {/* Employee Name */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-foreground/70 pr-2">
                  Employee Name <span className="text-destructive">*</span>
                </Label>
                <div>
                  <UiSelect value={watchEmpId} onValueChange={(v) => setValue("employeeId", v)}>
                    <SelectTrigger className="w-full bg-background border border-input h-9 text-sm">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {errors.employeeId && (
                    <p className="text-xs text-destructive mt-1">{errors.employeeId.message}</p>
                  )}
                </div>
              </div>

              {/* Frequency */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-foreground/70 pr-2">
                  Frequency <span className="text-destructive">*</span>
                </Label>
                <UiSelect onValueChange={(v) => setValue("frequency", v)}>
                  <SelectTrigger className="w-full bg-background border border-input h-9 text-sm">
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>

              {/* Month (hidden from main label row, combined inline) */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-foreground/70 pr-2">
                  Month <span className="text-destructive">*</span>
                </Label>
                <div>
                  <Input type="month" className="h-9 text-sm bg-background" {...register("month")} />
                  {errors.month && (
                    <p className="text-xs text-destructive mt-1">{errors.month.message}</p>
                  )}
                </div>
              </div>

              {/* POB Value */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-foreground/70 pr-2">POB Value</Label>
                <Input
                  type="number"
                  className="h-9 text-sm bg-background"
                  placeholder=""
                  {...register("pobValue", { valueAsNumber: true })}
                />
              </div>

              {/* Secondary Value */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-foreground/70 pr-2">Secondary Value</Label>
                <Input
                  type="number"
                  className="h-9 text-sm bg-background"
                  {...register("secondarySales", { valueAsNumber: true })}
                />
              </div>

              {/* No Of DR. Visit */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-foreground/70 pr-2">No Of DR. Visit</Label>
                <Input
                  type="number"
                  className="h-9 text-sm bg-background"
                  {...register("doctorVisit", { valueAsNumber: true })}
                />
              </div>

              {/* No Of Chemist Visit */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-foreground/70 pr-2">No Of Chemist Visit</Label>
                <Input
                  type="number"
                  className="h-9 text-sm bg-background"
                  {...register("chemistVisit", { valueAsNumber: true })}
                />
              </div>

              {/* No Of New Chemist Addition */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-foreground/70 pr-2 leading-tight">
                  No Of New Chemist Addition
                </Label>
                <Input
                  type="number"
                  className="h-9 text-sm bg-background"
                  {...register("newChemistAddition", { valueAsNumber: true })}
                />
              </div>

              {/* No Of New Doctor Addition */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-foreground/70 pr-2 leading-tight">
                  No Of New Doctor Addition
                </Label>
                <Input
                  type="number"
                  className="h-9 text-sm bg-background"
                  {...register("newDoctorAddition", { valueAsNumber: true })}
                />
              </div>

              {/* Primary Sales Value */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-[#008272] pr-2 leading-tight">
                  Primary Sales Value
                </Label>
                <Input
                  type="number"
                  className="h-9 text-sm bg-background"
                  {...register("primarySalesValue", { valueAsNumber: true })}
                />
              </div>

              {/* Primary Sales Quantity */}
              <div className="grid grid-cols-[180px_1fr] items-center gap-4 py-3 border-b border-muted/30">
                <Label className="text-sm font-semibold text-right text-foreground/70 pr-2 leading-tight">
                  Primary Sales Quantity
                </Label>
                <Input
                  type="number"
                  className="h-9 text-sm bg-background"
                  {...register("primarySalesQty", { valueAsNumber: true })}
                />
              </div>

              {/* Product Volume Allocations */}
              <div className="pt-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-bold text-[#008272]">Product Volume Allocations</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 border-[#008272] text-[#008272] hover:bg-[#008272]/10"
                    onClick={() => append({ productId: "", targetQuantity: 0, targetAmount: 0 })}
                  >
                    <Plus className="h-3 w-3" /> Add Product SKU
                  </Button>
                </div>
                <div className="space-y-2">
                  {fields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-2 items-end border border-muted/50 p-2 rounded bg-muted/5"
                    >
                      <div className="col-span-5 space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Product SKU *</Label>
                        <UiSelect
                          value={watchProductTargets?.[idx]?.productId}
                          onValueChange={(v) => setValue(`productTargets.${idx}.productId`, v)}
                        >
                          <SelectTrigger className="w-full bg-background h-8 text-xs">
                            <SelectValue placeholder="Select SKU" />
                          </SelectTrigger>
                          <SelectContent>
                            {products
                              .filter((p) => p.status === "active")
                              .map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </UiSelect>
                      </div>
                      <div className="col-span-3 space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Target Qty *</Label>
                        <Input
                          type="number"
                          className="h-8 text-xs"
                          {...register(`productTargets.${idx}.targetQuantity`, { valueAsNumber: true })}
                        />
                      </div>
                      <div className="col-span-3 space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Target Value (₹) *</Label>
                        <Input
                          type="number"
                          className="h-8 text-xs"
                          {...register(`productTargets.${idx}.targetAmount`, { valueAsNumber: true })}
                        />
                      </div>
                      <div className="col-span-1 pb-0.5">
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => remove(idx)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-semibold text-sm border-t mt-3 pt-3 text-muted-foreground">
                  <span>Total Product Volume Value:</span>
                  <span className="text-[#008272] font-bold">{fmt(totalProductTargetPreview)}</span>
                </div>
              </div>
            </div>

            {/* Footer — Save button */}
            <div className="px-6 py-4 border-t border-muted/60 bg-background sticky bottom-0">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setIsAllocOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-6 bg-[#008272] hover:bg-[#008272]/90 text-white font-semibold rounded gap-1.5"
                >
                  <span className="text-base leading-none">✓</span> Save
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details View Modal */}
      <Dialog open={!!viewDetail} onOpenChange={() => setViewDetail(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Representative Target Allocation Details</DialogTitle>
            <DialogDescription>
              Targets overview and volume breakdown for month <strong>{viewDetail?.month}</strong>.
            </DialogDescription>
          </DialogHeader>

          {viewDetail && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg border">
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Employee</div>
                  <div className="font-semibold">{employeeMap.get(viewDetail.employeeId)?.name ?? viewDetail.employeeId}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Month</div>
                  <div className="font-semibold">{viewDetail.month} ({viewDetail.frequency ?? "Monthly"})</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Quarter / Year</div>
                  <div className="font-semibold">{viewDetail.quarter ?? "NA"} / {viewDetail.year ?? "2026"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Status</div>
                  <div className="font-semibold capitalize">
                    <StatusBadge tone={viewDetail.status === "approved" ? "success" : viewDetail.status === "rejected" ? "danger" : "pending"}>
                      {viewDetail.status}
                    </StatusBadge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs bg-[#008272]/5 p-3 rounded-lg border border-[#008272]/10">
                <div>
                  <div className="text-muted-foreground">Primary Sales</div>
                  <div className="font-bold text-[#008272]">{fmt(viewDetail.primarySalesValue ?? viewDetail.targetAmount ?? 0)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Secondary Sales</div>
                  <div className="font-bold text-emerald-600">{fmt(viewDetail.secondarySales ?? 0)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">POB Value</div>
                  <div className="font-bold">{fmt(viewDetail.pobValue ?? 0)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Doctor Visits</div>
                  <div className="font-bold">{viewDetail.doctorVisit ?? 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Chemist Visits</div>
                  <div className="font-bold">{viewDetail.chemistVisit ?? 0}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Additions (D / C)</div>
                  <div className="font-bold">{viewDetail.newDoctorAddition ?? 0} / {viewDetail.newChemistAddition ?? 0}</div>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/30 px-3 py-1.5 text-xs font-bold border-b">Product Volume Allocations</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20 text-xs font-semibold uppercase text-muted-foreground">
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-right">Target Qty</th>
                      <th className="px-3 py-2 text-right">Target Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewDetail.productTargets.map((pt) => {
                      const p = productMap.get(pt.productId);
                      return (
                        <tr key={pt.productId} className="border-b last:border-0 hover:bg-muted/10">
                          <td className="px-3 py-2">{p?.name ?? "Unknown SKU"}</td>
                          <td className="px-3 py-2 text-right nums-tabular">{pt.targetQuantity}</td>
                          <td className="px-3 py-2 text-right nums-tabular font-medium">{fmt(pt.targetAmount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {viewDetail.remarks && (
                <div className="text-xs text-muted-foreground bg-muted/20 border-l-2 p-2">
                  <span className="font-semibold text-foreground block mb-0.5">Allocation Notes:</span>
                  {viewDetail.remarks}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setViewDetail(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog open={!!confirmSubmit} onOpenChange={() => setConfirmSubmit(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Submit Target</DialogTitle>
            <DialogDescription>
              Submit target allocation for <strong>{confirmSubmit?.month}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSubmit(null)}>
              Cancel
            </Button>
            <Button onClick={executeSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog open={!!confirmApprove} onOpenChange={() => setConfirmApprove(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Approve Targets</DialogTitle>
            <DialogDescription>Approve targets allocation for manager review?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmApprove(null)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={executeApprove}
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!confirmReject} onOpenChange={() => setConfirmReject(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Reject Targets</DialogTitle>
            <DialogDescription>Provide rejection remarks.</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-1.5">
            <Label>Remarks *</Label>
            <Textarea
              rows={3}
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              placeholder="Specify reason..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReject(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={executeReject}
              disabled={!rejectRemarks.trim()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Target Draft</DialogTitle>
            <DialogDescription>Delete this target allocation draft permanently?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={executeDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

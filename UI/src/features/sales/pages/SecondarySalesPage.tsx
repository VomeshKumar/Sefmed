import * as React from "react";
import {
  Download,
  AlertTriangle,
  CheckCircle,
  Eye,
  FileSpreadsheet,
  Plus,
  Trash,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import {
  useSecondarySalesList,
  useCreateSecondarySale,
  useStockistsList,
  useProductsList,
} from "../hooks";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { secondarySalesSchema, type SecondarySalesFormValues } from "../schemas";
import type { SecondarySale, SecondarySalesItem } from "../types";

export function SecondarySalesPage() {
  // Buffered Filter states (local UI selections)
  const [bufState, setBufState] = React.useState("all");
  const [bufDivision, setBufDivision] = React.useState("all");
  const [bufEmployeeId, setBufEmployeeId] = React.useState("all");
  const [bufType, setBufType] = React.useState("all");
  const [bufCity, setBufCity] = React.useState("all");
  const [bufFirmId, setBufFirmId] = React.useState("all");
  const [bufMonth, setBufMonth] = React.useState("all");
  const [bufYear, setBufYear] = React.useState("2026");

  // Applied Filter states (transferred only when Go is clicked)
  const [appliedFilters, setAppliedFilters] = React.useState({
    state: "all",
    division: "all",
    employeeId: "all",
    type: "all",
    city: "all",
    firmId: "all",
    month: "all",
    year: "2026",
  });

  // Modal / dialog states
  const [isCollectOpen, setIsCollectOpen] = React.useState(false);
  const [viewDetail, setViewDetail] = React.useState<SecondarySale | null>(null);

  // Pagination page state
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);

  // Load backend data
  const { data: statements = [], isLoading: isStatementsLoading, refetch } = useSecondarySalesList({});
  const { data: stockists = [] } = useStockistsList({});
  const { data: products = [] } = useProductsList({});
  const { data: employees = [] } = useEmployeesList({});

  const createMutation = useCreateSecondarySale();

  // Create lookups
  const stockistMap = React.useMemo(() => new Map(stockists.map((s) => [s.id, s])), [stockists]);
  const productMap = React.useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const employeeMap = React.useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);

  // Dynamic filter options based on active database entries
  const uniqueStates = React.useMemo(() => {
    const states = new Set<string>();
    employees.forEach((e) => {
      if (e.status === "active" && e.state) states.add(e.state);
    });
    if (states.size === 0) states.add("Chhattisgarh");
    return Array.from(states);
  }, [employees]);

  const uniqueDivisions = React.useMemo(() => {
    return Array.from(new Set(products.map((p) => p.productCategoryId).filter(Boolean)));
  }, [products]);

  const uniqueTypes = React.useMemo(() => {
    return Array.from(new Set(stockists.map((s) => s.type).filter(Boolean)));
  }, [stockists]);

  const uniqueCities = React.useMemo(() => {
    return Array.from(new Set(stockists.map((s) => s.city).filter(Boolean)));
  }, [stockists]);

  // Form setup for recording a new ledger statement
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SecondarySalesFormValues>({
    resolver: zodResolver(secondarySalesSchema),
    defaultValues: {
      stockistId: "",
      month: new Date().toISOString().slice(0, 7),
      statementDate: new Date().toISOString().slice(0, 10),
      submittedByEmployeeId: "",
      remarks: "",
      items: [
        {
          productId: "",
          openingStock: 0,
          receivedStock: 0,
          salesQty: 0,
          closingStock: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchStockistId = watch("stockistId");
  const watchEmpId = watch("submittedByEmployeeId");
  const watchItems = watch("items");

  const totalValuePreview = React.useMemo(() => {
    return watchItems?.reduce((sum, item) => {
      const prod = productMap.get(item.productId);
      const val = (item.salesQty || 0) * (prod?.ptr || 0);
      return sum + val;
    }, 0) || 0;
  }, [watchItems, productMap]);

  const handleCreateStatement = async (values: SecondarySalesFormValues) => {
    try {
      const payloadItems = values.items.map((item) => {
        const prod = productMap.get(item.productId);
        const expected = item.openingStock + item.receivedStock - item.salesQty;
        return {
          ...item,
          id: `ssi-${Math.random().toString(36).substring(2, 9)}`,
          expectedClosingStock: expected,
          varianceQty: item.closingStock - expected,
          hasVariance: item.closingStock !== expected,
          value: item.salesQty * (prod?.ptr || 0),
          freeQty: 0,
        };
      });

      await createMutation.mutateAsync({
        ...values,
        items: payloadItems,
      } as Parameters<typeof createMutation.mutateAsync>[0]);

      toast.success("Secondary statement draft saved successfully");
      setIsCollectOpen(false);
      reset();
      refetch();
    } catch {
      toast.error("Failed to save statement draft");
    }
  };

  // Perform filtering based on applied filter state
  const computedRows = React.useMemo(() => {
    return statements
      .map((st) => {
        const firm = stockistMap.get(st.stockistId);
        const rep = employeeMap.get(st.submittedByEmployeeId);

        // Compute aggregates
        let openingQty = 0;
        let openingPrice = 0;
        let salesQty = 0;
        let salesPrice = 0;
        let purchaseQty = 0;
        let purchasePrice = 0;
        let closingQty = 0;
        let closingPrice = 0;
        let freeQty = 0;

        st.items.forEach((item) => {
          const prod = productMap.get(item.productId);
          const pts = prod?.pts || 0;
          const ptr = prod?.ptr || 0;

          openingQty += item.openingStock || 0;
          openingPrice += (item.openingStock || 0) * pts;

          salesQty += item.salesQty || 0;
          salesPrice += (item.salesQty || 0) * ptr;

          purchaseQty += item.receivedStock || 0;
          purchasePrice += (item.receivedStock || 0) * pts;

          closingQty += item.closingStock || 0;
          closingPrice += (item.closingStock || 0) * ptr;

          freeQty += item.freeQty || 0;
        });

        return {
          statement: st,
          firm,
          rep,
          openingQty,
          openingPrice,
          salesQty,
          salesPrice,
          purchaseQty,
          purchasePrice,
          closingQty,
          closingPrice,
          freeQty,
        };
      })
      .filter((row) => {
        const { firm, rep, statement } = row;
        if (!firm) return false;

        // 1. Zone/State Filter
        if (appliedFilters.state && appliedFilters.state !== "all") {
          const firmZone = (firm.zone || "").toLowerCase();
          const targetZone = appliedFilters.state.toLowerCase();
          if (!firmZone.includes(targetZone)) return false;
        }

        // 2. Division Filter
        if (appliedFilters.division && appliedFilters.division !== "all") {
          if (firm.division !== appliedFilters.division) return false;
        }

        // 3. Representative Employee Filter
        if (appliedFilters.employeeId && appliedFilters.employeeId !== "all") {
          const selectedEmp = employees.find((e) => e.id === appliedFilters.employeeId);
          if (selectedEmp && firm.employeeAssigned !== selectedEmp.name) return false;
        }

        // 4. Firm Type Filter
        if (appliedFilters.type && appliedFilters.type !== "all") {
          if (firm.type !== appliedFilters.type) return false;
        }

        // 5. City Filter
        if (appliedFilters.city && appliedFilters.city !== "all") {
          if (firm.city !== appliedFilters.city) return false;
        }

        // 6. Firm Name Filter
        if (appliedFilters.firmId && appliedFilters.firmId !== "all") {
          if (firm.id !== appliedFilters.firmId) return false;
        }

        // 7. Month Filter
        if (appliedFilters.month && appliedFilters.month !== "all") {
          const [yr, mo] = statement.month.split("-");
          if (mo !== appliedFilters.month) return false;
        }

        // 8. Year Filter
        if (appliedFilters.year) {
          const [yr] = statement.month.split("-");
          if (yr !== appliedFilters.year) return false;
        }

        return true;
      });
  }, [statements, stockistMap, employeeMap, productMap, employees, appliedFilters]);

  // Aggregate sums for summary panel at the bottom
  const summaryTotals = React.useMemo(() => {
    let totalOpeningQty = 0;
    let totalOpeningPrice = 0;
    let totalSalesQty = 0;
    let totalSalesPrice = 0;
    let totalPurchaseQty = 0;
    let totalPurchasePrice = 0;
    let totalClosingQty = 0;
    let totalClosingPrice = 0;
    let totalFreeQty = 0;

    computedRows.forEach((row) => {
      totalOpeningQty += row.openingQty;
      totalOpeningPrice += row.openingPrice;
      totalSalesQty += row.salesQty;
      totalSalesPrice += row.salesPrice;
      totalPurchaseQty += row.purchaseQty;
      totalPurchasePrice += row.purchasePrice;
      totalClosingQty += row.closingQty;
      totalClosingPrice += row.closingPrice;
      totalFreeQty += row.freeQty;
    });

    return {
      totalOpeningQty,
      totalOpeningPrice,
      totalSalesQty,
      totalSalesPrice,
      totalPurchaseQty,
      totalPurchasePrice,
      totalClosingQty,
      totalClosingPrice,
      totalFreeQty,
    };
  }, [computedRows]);

  // Handle Go Search Click
  const handleGo = () => {
    setAppliedFilters({
      state: bufState,
      division: bufDivision,
      employeeId: bufEmployeeId,
      type: bufType,
      city: bufCity,
      firmId: bufFirmId,
      month: bufMonth,
      year: bufYear,
    });
    setCurrentPage(1);
    toast.success("Filters applied successfully");
  };

  // Handle Excel Export (CSV download)
  const handleExcelExport = () => {
    if (computedRows.length === 0) {
      toast.error("No records found to export");
      return;
    }
    const headers = [
      "Firm Id",
      "Firm Name",
      "Firm City",
      "Firm Type",
      "Opening Qty",
      "Opening Price",
      "Sales Qty",
      "Sales Price",
      "Purchase Qty",
      "Purchase Price",
      "Closing Qty",
      "Closing Price",
      "Free Qty",
      "Employee Assigned",
    ];

    const rows = computedRows.map((r) => [
      r.firm?.id || "",
      r.firm?.name || "",
      r.firm?.city || "",
      r.firm?.type || "",
      r.openingQty,
      r.openingPrice.toFixed(2),
      r.salesQty,
      r.salesPrice.toFixed(2),
      r.purchaseQty,
      r.purchasePrice.toFixed(2),
      r.closingQty,
      r.closingPrice.toFixed(2),
      r.freeQty,
      r.firm?.employeeAssigned || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Secondary_Sales_Stock_Tally_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel sheet downloaded successfully");
  };

  // Pagination math
  const pageCount = Math.ceil(computedRows.length / pageSize) || 1;
  const paginatedRows = React.useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return computedRows.slice(startIdx, startIdx + pageSize);
  }, [computedRows, currentPage, pageSize]);

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-baseline gap-2">
            Secondary Sales
            <span className="text-xs font-semibold text-slate-500 font-normal">
              (Stock Tally)
            </span>
          </h1>
        </div>

        <Button
          onClick={() => {
            reset();
            setIsCollectOpen(true);
          }}
          className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-4 font-bold text-xs gap-1.5"
        >
          <Plus className="h-4 w-4" /> Collect Statement
        </Button>
      </div>

      {/* Double-Row Filter Grid */}
      <div className="bg-slate-50 p-4 border rounded-lg space-y-3 shadow-sm">
        {/* Row 1 Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* State / Zone Dropdown */}
          <div className="flex flex-col">
            <UiSelect value={bufState} onValueChange={setBufState}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select State</SelectItem>
                {uniqueStates.map((st) => (
                  <SelectItem key={st} value={st}>
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Division Selector */}
          <div className="flex flex-col">
            <UiSelect value={bufDivision} onValueChange={setBufDivision}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Division</SelectItem>
                <SelectItem value="DERMA">DERMA</SelectItem>
                <SelectItem value="CARDIO">CARDIO</SelectItem>
                <SelectItem value="GYN">GYN</SelectItem>
                <SelectItem value="PEDIATRIC">PEDIATRIC</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Employee Rep Selector */}
          <div className="flex flex-col">
            <UiSelect value={bufEmployeeId} onValueChange={setBufEmployeeId}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Employee</SelectItem>
                {employees
                  .filter((e) => e.status === "active")
                  .map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Firm Type Selector */}
          <div className="flex flex-col">
            <UiSelect value={bufType} onValueChange={setBufType}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Type</SelectItem>
                {uniqueTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* City Selector */}
          <div className="flex flex-col">
            <UiSelect value={bufCity} onValueChange={setBufCity}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select City</SelectItem>
                {uniqueCities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Firm Selector */}
          <div className="flex flex-col">
            <UiSelect value={bufFirmId} onValueChange={setBufFirmId}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select Firm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Firm</SelectItem>
                {stockists.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Month Selector */}
          <div className="flex flex-col">
            <UiSelect value={bufMonth} onValueChange={setBufMonth}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Month</SelectItem>
                <SelectItem value="01">January</SelectItem>
                <SelectItem value="02">February</SelectItem>
                <SelectItem value="03">March</SelectItem>
                <SelectItem value="04">April</SelectItem>
                <SelectItem value="05">May</SelectItem>
                <SelectItem value="06">June</SelectItem>
                <SelectItem value="07">July</SelectItem>
                <SelectItem value="08">August</SelectItem>
                <SelectItem value="09">September</SelectItem>
                <SelectItem value="10">October</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>
        </div>

        {/* Row 2 Filters & Run Actions */}
        <div className="flex items-center gap-2.5">
          <div className="w-40">
            <UiSelect value={bufYear} onValueChange={setBufYear}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          <Button
            onClick={handleGo}
            className="bg-[#008272] hover:bg-[#006e60] text-white h-10 px-6 font-bold text-xs gap-1.5"
          >
            Go
          </Button>

          <Button
            onClick={handleExcelExport}
            className="bg-[#008272] hover:bg-[#006e60] text-white h-10 px-6 font-bold text-xs gap-1.5"
          >
            Excel
          </Button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
        {/* Table Length control panel */}
        <div className="flex items-center justify-between p-4 border-b bg-slate-50/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Show</span>
            <UiSelect value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-16 h-8 bg-white text-xs border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </UiSelect>
            <span>records per page</span>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Showing {computedRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
            {Math.min(currentPage * pageSize, computedRows.length)} of {computedRows.length} entries
          </div>
        </div>

        {/* Data table */}
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left border-collapse min-w-[1500px]">
            <thead>
              <tr className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold border-b">
                <th className="py-3 px-3 border-r w-20 text-center">Firm Id</th>
                <th className="py-3 px-3 border-r">Firm Name</th>
                <th className="py-3 px-3 border-r">Firm City</th>
                <th className="py-3 px-3 border-r">Firm Type</th>
                <th className="py-3 px-3 border-r text-center">Opening Qty</th>
                <th className="py-3 px-3 border-r text-right">Opening Price</th>
                <th className="py-3 px-3 border-r text-center">Sales Qty</th>
                <th className="py-3 px-3 border-r text-right">Sales Price</th>
                <th className="py-3 px-3 border-r text-center">Purchase Qty</th>
                <th className="py-3 px-3 border-r text-right">Purchase Price</th>
                <th className="py-3 px-3 border-r text-center">Closing Qty</th>
                <th className="py-3 px-3 border-r text-right">Closing Price</th>
                <th className="py-3 px-3 border-r text-center">Free Qty</th>
                <th className="py-3 px-3 border-r">Employee Assigned</th>
                <th className="py-3 px-3 border-r">Attachment</th>
                <th className="py-3 px-3 text-center w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600 text-xs">
              {isStatementsLoading ? (
                <tr>
                  <td colSpan={16} className="py-16 text-center text-slate-400 font-semibold bg-slate-50/50">
                    <div className="flex flex-col items-center gap-2 justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#008272] border-t-transparent" />
                      <span>Loading statements tally...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={16} className="py-20 text-center text-slate-400 font-semibold bg-slate-50/50">
                    No matching statements found. Select filters and click Go.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
                  <tr key={row.statement.id} className="hover:bg-slate-50/40 border-b align-middle transition-colors">
                    <td className="py-3 px-3 border-r text-center text-slate-500 font-medium">{row.firm?.id}</td>
                    <td className="py-3 px-3 border-r font-semibold text-slate-800">{row.firm?.name}</td>
                    <td className="py-3 px-3 border-r text-slate-600">{row.firm?.city}</td>
                    <td className="py-3 px-3 border-r text-slate-600">{row.firm?.type}</td>
                    <td className="py-3 px-3 border-r text-center font-medium">{row.openingQty}</td>
                    <td className="py-3 px-3 border-r text-right nums-tabular">{row.openingPrice.toFixed(2)}</td>
                    <td className="py-3 px-3 border-r text-center font-medium">{row.salesQty}</td>
                    <td className="py-3 px-3 border-r text-right nums-tabular">{row.salesPrice.toFixed(2)}</td>
                    <td className="py-3 px-3 border-r text-center font-medium">{row.purchaseQty}</td>
                    <td className="py-3 px-3 border-r text-right nums-tabular">{row.purchasePrice.toFixed(2)}</td>
                    <td className="py-3 px-3 border-r text-center font-medium">{row.closingQty}</td>
                    <td className="py-3 px-3 border-r text-right nums-tabular">{row.closingPrice.toFixed(2)}</td>
                    <td className="py-3 px-3 border-r text-center font-medium">{row.freeQty}</td>
                    <td className="py-3 px-3 border-r font-medium text-slate-700">{row.firm?.employeeAssigned}</td>
                    <td className="py-3 px-3 border-r font-semibold text-slate-500 text-center">Not Available</td>
                    <td className="py-3 px-3 text-center">
                      <Button
                        onClick={() => setViewDetail(row.statement)}
                        className="bg-[#008272] hover:bg-[#006e60] text-white h-7 px-3 font-semibold text-[10px] gap-1"
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-end p-4 border-t gap-2.5 bg-slate-50/50">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="h-8 text-xs font-semibold px-3"
          >
            Previous
          </Button>

          <div className="flex items-center justify-center h-8 px-3 border rounded bg-white text-xs font-semibold text-slate-700">
            {currentPage} / {pageCount}
          </div>

          <Button
            variant="outline"
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="h-8 text-xs font-semibold px-3"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Summary Totals Tally Panel exactly as screenshot */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col p-4 space-y-3">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-center border-collapse text-xs min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border">
                <th className="py-3 px-2 border">Total Opening Qty</th>
                <th className="py-3 px-2 border">Total Opening Price</th>
                <th className="py-3 px-2 border">Total Sales Qty</th>
                <th className="py-3 px-2 border">Total Sales Price</th>
                <th className="py-3 px-2 border">Total Purchase Qty</th>
                <th className="py-3 px-2 border">Total Purchase Price</th>
                <th className="py-3 px-2 border">Total Closing Qty</th>
                <th className="py-3 px-2 border">Total Closing Price</th>
                <th className="py-3 px-2 border">Total Free Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-semibold text-slate-800 border">
                <td className="py-3.5 px-2 border bg-slate-50/20">{summaryTotals.totalOpeningQty}</td>
                <td className="py-3.5 px-2 border bg-slate-50/20">{summaryTotals.totalOpeningPrice.toFixed(2)}</td>
                <td className="py-3.5 px-2 border bg-slate-50/20">{summaryTotals.totalSalesQty}</td>
                <td className="py-3.5 px-2 border bg-slate-50/20">{summaryTotals.totalSalesPrice.toFixed(2)}</td>
                <td className="py-3.5 px-2 border bg-slate-50/20">{summaryTotals.totalPurchaseQty}</td>
                <td className="py-3.5 px-2 border bg-slate-50/20">{summaryTotals.totalPurchasePrice.toFixed(2)}</td>
                <td className="py-3.5 px-2 border bg-slate-50/20">{summaryTotals.totalClosingQty}</td>
                <td className="py-3.5 px-2 border bg-slate-50/20">{summaryTotals.totalClosingPrice.toFixed(2)}</td>
                <td className="py-3.5 px-2 border bg-slate-50/20">{summaryTotals.totalFreeQty}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Statement dialog form */}
      <Dialog open={isCollectOpen} onOpenChange={setIsCollectOpen}>
        <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(handleCreateStatement)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Collect Secondary Sales Statement</DialogTitle>
              <DialogDescription>
                Record inventory stock ledger counts. Discrepancies between physical and expected stock will show warning flags, but submission is NOT blocked.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3.5 py-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Stockist distributors *</Label>
                  <UiSelect value={watchStockistId} onValueChange={(v) => setValue("stockistId", v)}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select Stockist" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockists.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {errors.stockistId && <p className="text-xs text-destructive">{errors.stockistId.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Month *</Label>
                  <Input type="month" {...register("month")} />
                  {errors.month && <p className="text-xs text-destructive">{errors.month.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Statement Verification Date *</Label>
                  <Input type="date" {...register("statementDate")} />
                  {errors.statementDate && <p className="text-xs text-destructive">{errors.statementDate.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label>Representative (MR) *</Label>
                  <UiSelect value={watchEmpId} onValueChange={(v) => setValue("submittedByEmployeeId", v)}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select Representative" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.name} ({e.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {errors.submittedByEmployeeId && <p className="text-xs text-destructive">{errors.submittedByEmployeeId.message}</p>}
                </div>
              </div>

              {/* Items Entry */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b pb-1.5">
                  <Label className="text-sm font-bold">Ledger Items</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => append({ productId: "", openingStock: 0, receivedStock: 0, salesQty: 0, closingStock: 0 })}
                  >
                    <Plus className="h-3 w-3" /> Add Product
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, idx) => {
                    const selectedProd = watchItems?.[idx]?.productId;
                    const p = productMap.get(selectedProd);
                    const open = watchItems?.[idx]?.openingStock || 0;
                    const rec = watchItems?.[idx]?.receivedStock || 0;
                    const sales = watchItems?.[idx]?.salesQty || 0;
                    const closing = watchItems?.[idx]?.closingStock || 0;

                    const expected = open + rec - sales;
                    const variance = closing - expected;
                    const hasVar = closing !== expected;

                    return (
                      <div key={field.id} className="border rounded-lg p-3 bg-muted/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-muted-foreground">Ledger Line {idx + 1}</span>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => remove(idx)}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-4 space-y-1">
                            <Label className="text-[10px]">Product *</Label>
                            <UiSelect
                              value={selectedProd}
                              onValueChange={(v) => {
                                setValue(`items.${idx}.productId`, v);
                              }}
                            >
                              <SelectTrigger className="w-full bg-background h-8 text-xs">
                                <SelectValue placeholder="Product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((prod) => (
                                  <SelectItem key={prod.id} value={prod.id}>{prod.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </UiSelect>
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Label className="text-[10px]">Opening *</Label>
                            <Input
                              type="number"
                              className="h-8 text-xs"
                              {...register(`items.${idx}.openingStock`, { valueAsNumber: true })}
                            />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Label className="text-[10px]">Received *</Label>
                            <Input
                              type="number"
                              className="h-8 text-xs"
                              {...register(`items.${idx}.receivedStock`, { valueAsNumber: true })}
                            />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Label className="text-[10px]">Sales Qty *</Label>
                            <Input
                              type="number"
                              className="h-8 text-xs"
                              {...register(`items.${idx}.salesQty`, { valueAsNumber: true })}
                            />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Label className="text-[10px]">Physical Close *</Label>
                            <Input
                              type="number"
                              className="h-8 text-xs"
                              {...register(`items.${idx}.closingStock`, { valueAsNumber: true })}
                            />
                          </div>
                        </div>

                        {/* Reconciliation Check Row */}
                        {selectedProd && (
                          <div className="flex items-center justify-between text-xs p-1.5 rounded bg-background border mt-1">
                            <div className="text-muted-foreground">
                              Expected Closing: <span className="font-semibold text-foreground">{expected}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {hasVar ? (
                                <span className={`font-semibold flex items-center gap-0.5 text-warning`}>
                                  <AlertTriangle className="h-3 w-3" /> Variance: {variance > 0 ? `+${variance}` : variance}
                                </span>
                              ) : (
                                <span className="text-success font-semibold flex items-center gap-0.5">
                                  <CheckCircle className="h-3 w-3" /> Reconciled
                                </span>
                              )}
                              <span>·</span>
                              <div className="font-medium text-slate-700">
                                PTR Value: <span className="text-primary font-bold">₹{(sales * (p?.ptr || 0)).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end font-semibold text-sm border-t pt-2.5">
                Total PTR Value: <span className="text-primary text-base ml-1.5">₹{totalValuePreview.toFixed(2)}</span>
              </div>

              <div className="space-y-1">
                <Label>Audit/Verification Comments</Label>
                <Textarea rows={2} placeholder="Wet packaging loss comments, damaged stock claims..." {...register("remarks")} />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCollectOpen(false)}>Cancel</Button>
              <Button type="submit">Save Draft Ledger</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details View Dialog (Ledger SKU Breakdowns) */}
      <Dialog open={!!viewDetail} onOpenChange={() => setViewDetail(null)}>
        <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Secondary Sales Ledger Details</DialogTitle>
            <DialogDescription>
              Inventory stock movements statement for month <strong>{viewDetail?.month}</strong>.
            </DialogDescription>
          </DialogHeader>

          {viewDetail && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-lg border">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Stockist Firm</div>
                  <div className="font-bold text-slate-800 text-sm">{stockistMap.get(viewDetail.stockistId)?.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Status</div>
                  <div className="font-bold text-slate-800 capitalize text-sm">{viewDetail.status}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Statement Date</div>
                  <div className="font-bold text-slate-800 text-sm">{viewDetail.statementDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total PTR Value</div>
                  <div className="font-bold text-[#008272] text-sm">₹{viewDetail.totalValue.toFixed(2)}</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                      <th className="px-3 py-2.5 text-left border-r">Product</th>
                      <th className="px-3 py-2.5 text-center border-r">Opening</th>
                      <th className="px-3 py-2.5 text-center border-r">Received</th>
                      <th className="px-3 py-2.5 text-center border-r">Sales</th>
                      <th className="px-3 py-2.5 text-center border-r">Free Qty</th>
                      <th className="px-3 py-2.5 text-center border-r">Expected</th>
                      <th className="px-3 py-2.5 text-center border-r">Physical</th>
                      <th className="px-3 py-2.5 text-center">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {viewDetail.items.map((item) => {
                      const p = productMap.get(item.productId);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2.5 border-r font-semibold text-slate-700">{p?.name || item.productId}</td>
                          <td className="px-3 py-2.5 border-r text-center">{item.openingStock}</td>
                          <td className="px-3 py-2.5 border-r text-center">{item.receivedStock}</td>
                          <td className="px-3 py-2.5 border-r text-center">{item.salesQty}</td>
                          <td className="px-3 py-2.5 border-r text-center">{item.freeQty || 0}</td>
                          <td className="px-3 py-2.5 border-r text-center">{item.expectedClosingStock}</td>
                          <td className="px-3 py-2.5 border-r text-center">{item.closingStock}</td>
                          <td className={`px-3 py-2.5 text-center font-bold ${item.varianceQty === 0 ? "text-slate-400" : "text-amber-500"}`}>
                            {item.varianceQty === 0 ? "—" : item.varianceQty > 0 ? `+${item.varianceQty}` : item.varianceQty}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {viewDetail.remarks && (
                <div className="text-xs text-muted-foreground bg-muted/20 border-l-2 p-2">
                  <span className="font-semibold text-foreground block mb-0.5">Comments:</span>
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
    </div>
  );
}

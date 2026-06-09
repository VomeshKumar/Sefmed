import * as React from "react";
import { Download, FileSpreadsheet, FileText, Layers, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/data/DataTable";
import { FilterBar } from "@/components/data/FilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  usePrimarySalesReport,
  useSecondarySalesReport,
  useTargetAchievementReport,
  useProductPerformanceReport,
  useStockistPerformanceReport,
  useTerritoryPerformanceReport,
  useZonePerformanceReport,
  useDivisionPerformanceReport,
} from "../hooks";
import { exportToCSV, exportToExcel } from "../api/export";
import { useStockistsList } from "@/features/sales/hooks";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { mockTerritories } from "@/features/master-data/territories/fixtures";
import { StatusBadge } from "@/components/data/StatusBadge";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function SalesReportsPage() {
  const [activeTab, setActiveTab] = React.useState("primary");
  const [monthFilter, setMonthFilter] = React.useState(new Date().toISOString().slice(0, 7));
  const [stockistFilter, setStockistFilter] = React.useState("all");
  const [employeeFilter, setEmployeeFilter] = React.useState("all");
  const [territoryFilter, setTerritoryFilter] = React.useState("all");

  // Fetch filters data
  const { data: stockists = [] } = useStockistsList({});
  const { data: employees = [] } = useEmployeesList({});

  // Sales Query Adapters
  const { data: primaryData = [], isLoading: loadPrimary } = usePrimarySalesReport({
    month: monthFilter,
    stockistId: stockistFilter === "all" ? undefined : stockistFilter,
  });

  const { data: secondaryData = [], isLoading: loadSecondary } = useSecondarySalesReport({
    month: monthFilter,
    stockistId: stockistFilter === "all" ? undefined : stockistFilter,
  });

  const { data: achievementsData = [], isLoading: loadAchievements } = useTargetAchievementReport({
    month: monthFilter,
    employeeId: employeeFilter === "all" ? undefined : employeeFilter,
  });

  const { data: productsData = [], isLoading: loadProducts } = useProductPerformanceReport({
    month: monthFilter,
  });

  const { data: stockistData = [], isLoading: loadStockist } = useStockistPerformanceReport({
    territoryId: territoryFilter === "all" ? undefined : territoryFilter,
  });

  const { data: territoryData = [], isLoading: loadTerritory } = useTerritoryPerformanceReport({
    month: monthFilter,
  });

  const { data: zoneData = [], isLoading: loadZone } = useZonePerformanceReport({
    month: monthFilter,
  });

  const { data: divisionData = [], isLoading: loadDivision } = useDivisionPerformanceReport({
    month: monthFilter,
  });

  // Table Columns
  const primaryColumns: Column<any>[] = [
    { accessorKey: "orderNumber", header: "Order Number" },
    { accessorKey: "orderDate", header: "Order Date", cell: (item) => <span className="nums-tabular">{item.orderDate}</span> },
    { accessorKey: "stockistName", header: "Stockist" },
    { accessorKey: "stockistCode", header: "Code" },
    { accessorKey: "netAmount", header: "Net Amount", cell: (item) => <span className="font-semibold nums-tabular">{fmt(item.netAmount)}</span> },
    { accessorKey: "status", header: "Status", cell: (item) => <StatusBadge tone={item.status === "approved" || item.status === "delivered" ? "success" : "pending"}>{item.status}</StatusBadge> },
  ];

  const secondaryColumns: Column<any>[] = [
    { accessorKey: "month", header: "Month", cell: (item) => <span className="nums-tabular">{item.month}</span> },
    { accessorKey: "statementDate", header: "Statement Date", cell: (item) => <span className="nums-tabular">{item.statementDate}</span> },
    { accessorKey: "stockistName", header: "Stockist" },
    { accessorKey: "stockistCode", header: "Code" },
    { accessorKey: "totalValue", header: "Total PTR Value", cell: (item) => <span className="font-semibold nums-tabular">{fmt(item.totalValue)}</span> },
    {
      accessorKey: "hasReconciliationWarnings",
      header: "Reconciliation",
      cell: (item) => (
        <StatusBadge tone={item.hasReconciliationWarnings ? "warning" : "success"}>
          {item.hasReconciliationWarnings ? "Discrepancy" : "Reconciled"}
        </StatusBadge>
      ),
    },
  ];

  const achievementColumns: Column<any>[] = [
    { accessorKey: "month", header: "Month", cell: (item) => <span className="nums-tabular">{item.month}</span> },
    { accessorKey: "employeeName", header: "Representative" },
    { accessorKey: "employeeCode", header: "Code" },
    { accessorKey: "targetAmount", header: "Target Allocation", cell: (item) => <span className="nums-tabular">{fmt(item.targetAmount)}</span> },
    {
      accessorKey: "primaryAmount",
      header: "Primary Achieved",
      cell: (item) => (
        <div>
          <span className="font-semibold nums-tabular block">{fmt(item.primaryAmount)}</span>
          <span className="text-xs text-muted-foreground nums-tabular">({item.primaryAchievementPercent}%)</span>
        </div>
      ),
    },
    {
      accessorKey: "secondaryAmount",
      header: "Secondary Achieved",
      cell: (item) => (
        <div>
          <span className="font-semibold nums-tabular block">{fmt(item.secondaryAmount)}</span>
          <span className="text-xs text-muted-foreground nums-tabular">({item.secondaryAchievementPercent}%)</span>
        </div>
      ),
    },
  ];

  const productColumns: Column<any>[] = [
    { accessorKey: "productName", header: "Product" },
    { accessorKey: "productCode", header: "Code" },
    { accessorKey: "packSize", header: "Pack Size" },
    {
      accessorKey: "primaryValue",
      header: "Primary Sales",
      cell: (item) => (
        <div>
          <span className="font-semibold nums-tabular block">{fmt(item.primaryValue)}</span>
          <span className="text-xs text-muted-foreground nums-tabular">{item.primaryUnits} units</span>
        </div>
      ),
    },
    {
      accessorKey: "secondaryValue",
      header: "Secondary Sales",
      cell: (item) => (
        <div>
          <span className="font-semibold nums-tabular block">{fmt(item.secondaryValue)}</span>
          <span className="text-xs text-muted-foreground nums-tabular">{item.secondaryUnits} units</span>
        </div>
      ),
    },
  ];

  const stockistColumns: Column<any>[] = [
    { accessorKey: "stockistName", header: "Stockist" },
    { accessorKey: "stockistCode", header: "Code" },
    { accessorKey: "classification", header: "Classification" },
    { accessorKey: "creditLimit", header: "Credit Limit", cell: (item) => <span className="nums-tabular">{fmt(item.creditLimit)}</span> },
    { accessorKey: "outstandingAmount", header: "Outstanding Balance", cell: (item) => <span className="font-semibold text-destructive nums-tabular">{fmt(item.outstandingAmount)}</span> },
    { accessorKey: "totalPrimaryPurchased", header: "Primary Purchased", cell: (item) => <span className="nums-tabular">{fmt(item.totalPrimaryPurchased)}</span> },
    { accessorKey: "totalSecondaryReported", header: "Secondary Sales", cell: (item) => <span className="nums-tabular">{fmt(item.totalSecondaryReported)}</span> },
  ];

  const rollupColumns: Column<any>[] = [
    { accessorKey: "name", header: "Territory / Region" },
    { accessorKey: "targetAmount", header: "Target Amount", cell: (item) => <span className="nums-tabular">{fmt(item.targetAmount)}</span> },
    {
      accessorKey: "primaryAmount",
      header: "Primary Sales",
      cell: (item) => (
        <div>
          <span className="font-semibold nums-tabular block">{fmt(item.primaryAmount)}</span>
          <span className="text-xs text-muted-foreground nums-tabular">({item.primaryAchievementPercent}%)</span>
        </div>
      ),
    },
    {
      accessorKey: "secondaryAmount",
      header: "Secondary Sales",
      cell: (item) => (
        <div>
          <span className="font-semibold nums-tabular block">{fmt(item.secondaryAmount)}</span>
          <span className="text-xs text-muted-foreground nums-tabular">({item.secondaryAchievementPercent}%)</span>
        </div>
      ),
    },
  ];

  // CSV Headers Mapping
  const getExportHeaders = () => {
    switch (activeTab) {
      case "primary":
        return [
          { label: "Order Number", fieldName: "orderNumber" },
          { label: "Order Date", fieldName: "orderDate" },
          { label: "Stockist Name", fieldName: "stockistName" },
          { label: "Stockist Code", fieldName: "stockistCode" },
          { label: "Net Amount", fieldName: "netAmount" },
          { label: "Status", fieldName: "status" },
        ];
      case "secondary":
        return [
          { label: "Month", fieldName: "month" },
          { label: "Statement Date", fieldName: "statementDate" },
          { label: "Stockist Name", fieldName: "stockistName" },
          { label: "Stockist Code", fieldName: "stockistCode" },
          { label: "Total Value", fieldName: "totalValue" },
        ];
      case "achievements":
        return [
          { label: "Month", fieldName: "month" },
          { label: "Employee Name", fieldName: "employeeName" },
          { label: "Employee Code", fieldName: "employeeCode" },
          { label: "Target Amount", fieldName: "targetAmount" },
          { label: "Primary Amount", fieldName: "primaryAmount" },
          { label: "Primary Achievement %", fieldName: "primaryAchievementPercent" },
          { label: "Secondary Amount", fieldName: "secondaryAmount" },
          { label: "Secondary Achievement %", fieldName: "secondaryAchievementPercent" },
        ];
      case "products":
        return [
          { label: "Product Name", fieldName: "productName" },
          { label: "Product Code", fieldName: "productCode" },
          { label: "Pack Size", fieldName: "packSize" },
          { label: "Primary Units", fieldName: "primaryUnits" },
          { label: "Primary Value", fieldName: "primaryValue" },
          { label: "Secondary Units", fieldName: "secondaryUnits" },
          { label: "Secondary Value", fieldName: "secondaryValue" },
        ];
      case "stockists":
        return [
          { label: "Stockist Name", fieldName: "stockistName" },
          { label: "Stockist Code", fieldName: "stockistCode" },
          { label: "Classification", fieldName: "classification" },
          { label: "Credit Limit", fieldName: "creditLimit" },
          { label: "Outstanding Amount", fieldName: "outstandingAmount" },
          { label: "Primary Purchased", fieldName: "totalPrimaryPurchased" },
          { label: "Secondary Sales", fieldName: "totalSecondaryReported" },
        ];
      default:
        return [
          { label: "Region Name", fieldName: "name" },
          { label: "Target Amount", fieldName: "targetAmount" },
          { label: "Primary Amount", fieldName: "primaryAmount" },
          { label: "Secondary Amount", fieldName: "secondaryAmount" },
        ];
    }
  };

  const getExportData = () => {
    switch (activeTab) {
      case "primary":
        return primaryData;
      case "secondary":
        return secondaryData;
      case "achievements":
        return achievementsData;
      case "products":
        return productsData;
      case "stockists":
        return stockistData;
      case "territories":
        return territoryData;
      case "zones":
        return zoneData;
      case "divisions":
        return divisionData;
      default:
        return [];
    }
  };

  const triggerExport = (format: "csv" | "excel") => {
    const headers = getExportHeaders();
    const rows = getExportData();
    const filename = `sales_report_${activeTab}`;

    if (format === "csv") {
      exportToCSV(headers, rows, filename);
    } else {
      exportToExcel(headers, rows, filename);
    }
    toast.success(`Exporting ${rows.length} rows to ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Reports"
        description="Analyze primary/secondary commercial rollups and target achievements."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Reports", to: "/reports" },
          { label: "Sales Reports" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-9"
              onClick={() => triggerExport("csv")}
              disabled={getExportData().length === 0}
            >
              <FileText className="h-4 w-4" /> Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-9"
              onClick={() => triggerExport("excel")}
              disabled={getExportData().length === 0}
            >
              <FileSpreadsheet className="h-4 w-4" /> Export Excel
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-lg flex flex-wrap h-auto">
          <TabsTrigger value="primary" className="h-9 px-4 rounded-md">Primary Sales</TabsTrigger>
          <TabsTrigger value="secondary" className="h-9 px-4 rounded-md">Secondary Sales</TabsTrigger>
          <TabsTrigger value="achievements" className="h-9 px-4 rounded-md">Target Achievements</TabsTrigger>
          <TabsTrigger value="products" className="h-9 px-4 rounded-md">Products</TabsTrigger>
          <TabsTrigger value="stockists" className="h-9 px-4 rounded-md">Stockists</TabsTrigger>
          <TabsTrigger value="territories" className="h-9 px-4 rounded-md">Territories</TabsTrigger>
          <TabsTrigger value="zones" className="h-9 px-4 rounded-md">Zones</TabsTrigger>
          <TabsTrigger value="divisions" className="h-9 px-4 rounded-md">Divisions</TabsTrigger>
        </TabsList>

        {/* Filters Panel */}
        <FilterBar showSearchInput={false}>
          {activeTab !== "stockists" && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Month:</span>
              <Input
                type="month"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="w-[150px] bg-background h-10"
              />
            </div>
          )}

          {(activeTab === "primary" || activeTab === "secondary") && (
            <UiSelect value={stockistFilter} onValueChange={setStockistFilter}>
              <SelectTrigger className="w-[180px] bg-background h-10">
                <SelectValue placeholder="Stockist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stockists</SelectItem>
                {stockists.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          )}

          {activeTab === "achievements" && (
            <UiSelect value={employeeFilter} onValueChange={setEmployeeFilter}>
              <SelectTrigger className="w-[180px] bg-background h-10">
                <SelectValue placeholder="Representative" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Representatives</SelectItem>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          )}

          {activeTab === "stockists" && (
            <UiSelect value={territoryFilter} onValueChange={setTerritoryFilter}>
              <SelectTrigger className="w-[180px] bg-background h-10">
                <SelectValue placeholder="Territory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Territories</SelectItem>
                {mockTerritories.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          )}
        </FilterBar>

        {/* Tab Contents */}
        <TabsContent value="primary">
          <DataTable columns={primaryColumns} data={primaryData} isLoading={loadPrimary} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="secondary">
          <DataTable columns={secondaryColumns} data={secondaryData} isLoading={loadSecondary} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="achievements">
          <DataTable columns={achievementColumns} data={achievementsData} isLoading={loadAchievements} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="products">
          <DataTable columns={productColumns} data={productsData} isLoading={loadProducts} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="stockists">
          <DataTable columns={stockistColumns} data={stockistData} isLoading={loadStockist} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="territories">
          <DataTable columns={rollupColumns} data={territoryData} isLoading={loadTerritory} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="zones">
          <DataTable columns={rollupColumns} data={zoneData} isLoading={loadZone} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="divisions">
          <DataTable columns={rollupColumns} data={divisionData} isLoading={loadDivision} getRowId={(item) => item.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

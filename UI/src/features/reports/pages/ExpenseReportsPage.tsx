import * as React from "react";
import { Download, FileSpreadsheet, FileText, AlertTriangle, CheckCircle, IndianRupee } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/data/DataTable";
import { FilterBar } from "@/components/data/FilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useExpenseSummaryReport,
  useEmployeeExpenseReport,
  useExpenseHeadAnalysis,
  useTravelExpenseAnalysis,
  useSFCVarianceReport,
} from "../hooks";
import { exportToCSV, exportToExcel } from "../api/export";
import { StatusBadge } from "@/components/data/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function ExpenseReportsPage() {
  const [activeTab, setActiveTab] = React.useState("summary");
  const [monthFilter, setMonthFilter] = React.useState(new Date().toISOString().slice(0, 7));

  // Query Hooks
  const { data: summaryData, isLoading: loadSummary } = useExpenseSummaryReport({ month: monthFilter });
  const { data: employeeData = [], isLoading: loadEmployee } = useEmployeeExpenseReport({ month: monthFilter });
  const { data: headData = [], isLoading: loadHeads } = useExpenseHeadAnalysis({ month: monthFilter });
  const { data: travelData = [], isLoading: loadTravel } = useTravelExpenseAnalysis({ month: monthFilter });
  const { data: varianceData = [], isLoading: loadVariance } = useSFCVarianceReport({ month: monthFilter });

  // Columns Definitions
  const employeeColumns: Column<any>[] = [
    { accessorKey: "employeeName", header: "Employee Name" },
    { accessorKey: "employeeCode", header: "Code" },
    { accessorKey: "totalClaims", header: "Claims Count", cell: (item) => <span className="nums-tabular">{item.totalClaims}</span> },
    { accessorKey: "totalClaimedAmount", header: "Total Claimed", cell: (item) => <span className="nums-tabular font-medium">{fmt(item.totalClaimedAmount)}</span> },
    { accessorKey: "totalApprovedAmount", header: "Total Approved", cell: (item) => <span className="nums-tabular font-bold text-emerald-600">{fmt(item.totalApprovedAmount)}</span> },
  ];

  const headColumns: Column<any>[] = [
    { accessorKey: "label", header: "Expense Category" },
    { accessorKey: "value", header: "Total Amount Claimed", cell: (item) => <span className="font-semibold nums-tabular">{fmt(item.value)}</span> },
  ];

  const travelColumns: Column<any>[] = [
    { accessorKey: "date", header: "Date", cell: (item) => <span className="nums-tabular">{item.date}</span> },
    { accessorKey: "employeeName", header: "Representative" },
    { accessorKey: "description", header: "Route Description" },
    { accessorKey: "quantity", header: "Distance", cell: (item) => <span className="nums-tabular">{item.quantity} {item.unit}</span> },
    { accessorKey: "rate", header: "Rate per Unit", cell: (item) => <span className="nums-tabular">{fmt(item.rate)}</span> },
    { accessorKey: "amount", header: "Claimed Amount", cell: (item) => <span className="font-semibold nums-tabular">{fmt(item.amount)}</span> },
  ];

  const varianceColumns: Column<any>[] = [
    { accessorKey: "date", header: "Date", cell: (item) => <span className="nums-tabular">{item.date}</span> },
    { accessorKey: "employeeName", header: "Representative" },
    { accessorKey: "source", header: "SFC Origin" },
    { accessorKey: "destination", header: "SFC Destination" },
    { accessorKey: "claimedAmount", header: "Claimed Amount", cell: (item) => <span className="nums-tabular">{fmt(item.claimedAmount)}</span> },
    { accessorKey: "allowedAmount", header: "SFC Allowed", cell: (item) => <span className="nums-tabular">{fmt(item.allowedAmount)}</span> },
    {
      accessorKey: "varianceAmount",
      header: "Variance",
      cell: (item) => (
        <span className="font-bold text-destructive nums-tabular">+{fmt(item.varianceAmount)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "SFC Audit",
      cell: (item) => (
        <StatusBadge tone="danger">
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> SFC Deviation
          </span>
        </StatusBadge>
      ),
    },
  ];

  // Export Map
  const getExportHeaders = () => {
    switch (activeTab) {
      case "employees":
        return [
          { label: "Employee Name", fieldName: "employeeName" },
          { label: "Employee Code", fieldName: "employeeCode" },
          { label: "Claims Count", fieldName: "totalClaims" },
          { label: "Total Claimed", fieldName: "totalClaimedAmount" },
          { label: "Total Approved", fieldName: "totalApprovedAmount" },
        ];
      case "heads":
        return [
          { label: "Expense Head", fieldName: "label" },
          { label: "Total Claimed Value", fieldName: "value" },
        ];
      case "travel":
        return [
          { label: "Date", fieldName: "date" },
          { label: "Representative", fieldName: "employeeName" },
          { label: "Description", fieldName: "description" },
          { label: "Distance", fieldName: "quantity" },
          { label: "Rate", fieldName: "rate" },
          { label: "Claimed Amount", fieldName: "amount" },
        ];
      case "variance":
        return [
          { label: "Date", fieldName: "date" },
          { label: "Representative", fieldName: "employeeName" },
          { label: "SFC Origin", fieldName: "source" },
          { label: "SFC Destination", fieldName: "destination" },
          { label: "Claimed Amount", fieldName: "claimedAmount" },
          { label: "SFC Allowed", fieldName: "allowedAmount" },
          { label: "Variance", fieldName: "varianceAmount" },
        ];
      default:
        return [];
    }
  };

  const getExportData = () => {
    switch (activeTab) {
      case "employees":
        return employeeData;
      case "heads":
        return headData;
      case "travel":
        return travelData;
      case "variance":
        return varianceData;
      default:
        return [];
    }
  };

  const triggerExport = (format: "csv" | "excel") => {
    const headers = getExportHeaders();
    const rows = getExportData();
    const filename = `expense_report_${activeTab}`;

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
        title="Expense Reports"
        description="Verify operational expenditures, employee claims, and SFC standard travel route fare compliance."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Reports", to: "/reports" },
          { label: "Expense Reports" },
        ]}
        actions={
          activeTab !== "summary" && (
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
          )
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-lg flex flex-wrap h-auto">
          <TabsTrigger value="summary" className="h-9 px-4 rounded-md">Overall Summary</TabsTrigger>
          <TabsTrigger value="employees" className="h-9 px-4 rounded-md">Employee Claims</TabsTrigger>
          <TabsTrigger value="heads" className="h-9 px-4 rounded-md">Category Spend</TabsTrigger>
          <TabsTrigger value="travel" className="h-9 px-4 rounded-md">Travel Logs</TabsTrigger>
          <TabsTrigger value="variance" className="h-9 px-4 rounded-md">SFC Deviations</TabsTrigger>
        </TabsList>

        {/* Month Filter */}
        <FilterBar showSearchInput={false}>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Month:</span>
            <Input
              type="month"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-[150px] bg-background h-10"
            />
          </div>
        </FilterBar>

        {/* Tab contents */}
        <TabsContent value="summary">
          {summaryData && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Total Claimed Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-extrabold text-foreground flex items-center gap-1">
                      <IndianRupee className="h-6 w-6 text-primary" /> {fmt(summaryData.totalClaimed)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Sum of all expenses in selected month.</p>
                  </CardContent>
                </Card>
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">Total Approved Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-extrabold text-emerald-600 flex items-center gap-1">
                      <IndianRupee className="h-6 w-6 text-emerald-600" /> {fmt(summaryData.totalApproved)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Sum of approved expense claim totals.</p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-card border rounded-lg p-5">
                <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4">Claims Status Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-muted/30 border p-3 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Draft</div>
                    <div className="text-lg font-bold">{summaryData.statusCounts.draft}</div>
                  </div>
                  <div className="bg-muted/30 border p-3 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Pending Review</div>
                    <div className="text-lg font-bold text-amber-500">{summaryData.statusCounts.submitted}</div>
                  </div>
                  <div className="bg-muted/30 border p-3 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Approved</div>
                    <div className="text-lg font-bold text-emerald-600">{summaryData.statusCounts.approved}</div>
                  </div>
                  <div className="bg-muted/30 border p-3 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Rejected</div>
                    <div className="text-lg font-bold text-destructive">{summaryData.statusCounts.rejected}</div>
                  </div>
                  <div className="bg-muted/30 border p-3 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Returned</div>
                    <div className="text-lg font-bold text-blue-500">{summaryData.statusCounts.returned}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="employees">
          <DataTable columns={employeeColumns} data={employeeData} isLoading={loadEmployee} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="heads">
          <DataTable columns={headColumns} data={headData} isLoading={loadHeads} getRowId={(item) => item.category} />
        </TabsContent>

        <TabsContent value="travel">
          <DataTable columns={travelColumns} data={travelData} isLoading={loadTravel} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="variance">
          <DataTable columns={varianceColumns} data={varianceData} isLoading={loadVariance} getRowId={(item) => item.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

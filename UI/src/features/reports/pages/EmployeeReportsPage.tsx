import * as React from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/data/DataTable";
import { FilterBar } from "@/components/data/FilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmployeePerformanceReport } from "../hooks";
import { exportToCSV, exportToExcel } from "../api/export";
import { toast } from "sonner";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function EmployeeReportsPage() {
  const [monthFilter, setMonthFilter] = React.useState(new Date().toISOString().slice(0, 7));

  // Query Hooks
  const { data: scorecardData = [], isLoading } = useEmployeePerformanceReport({ month: monthFilter });

  // Columns Definitions
  const columns: Column<any>[] = [
    { accessorKey: "employeeName", header: "Representative" },
    { accessorKey: "employeeCode", header: "Code" },
    { accessorKey: "designation", header: "Designation" },
    {
      accessorKey: "totalVisits",
      header: "Visits Performance",
      cell: (item) => (
        <div>
          <span className="font-semibold block nums-tabular">{item.closedVisits} / {item.totalVisits} calls</span>
          <span className="text-xs text-muted-foreground block">Completion: <span className="font-medium text-foreground nums-tabular">{item.visitCompletionRate}%</span></span>
          <span className="text-[10px] text-muted-foreground block">Geo verified: <span className="font-medium text-foreground nums-tabular">{item.geoSuccessRate}%</span></span>
        </div>
      ),
    },
    {
      accessorKey: "totalClaimed",
      header: "Expenses",
      cell: (item) => (
        <div>
          <span className="font-semibold block nums-tabular text-foreground">{fmt(item.totalClaimed)} claimed</span>
          <span className="text-xs text-muted-foreground block">Approved: <span className="font-medium text-emerald-600 nums-tabular">{fmt(item.totalApproved)}</span></span>
        </div>
      ),
    },
    {
      accessorKey: "targetAmount",
      header: "Sales Target",
      cell: (item) => (
        <span className="font-semibold nums-tabular">{fmt(item.targetAmount)}</span>
      ),
    },
    {
      accessorKey: "primarySales",
      header: "Primary Achievements",
      cell: (item) => (
        <div>
          <span className="font-semibold block nums-tabular text-foreground">{fmt(item.primarySales)}</span>
          <span className="text-xs text-muted-foreground block">Achievement: <span className="font-medium text-primary nums-tabular">{item.primaryAchievementPercent}%</span></span>
        </div>
      ),
    },
    {
      accessorKey: "secondarySales",
      header: "Secondary Achievements",
      cell: (item) => (
        <div>
          <span className="font-semibold block nums-tabular text-foreground">{fmt(item.secondarySales)}</span>
          <span className="text-xs text-muted-foreground block">Achievement: <span className="font-medium text-primary nums-tabular">{item.secondaryAchievementPercent}%</span></span>
        </div>
      ),
    },
  ];

  // Export Map
  const headers = [
    { label: "Representative", fieldName: "employeeName" },
    { label: "Employee Code", fieldName: "employeeCode" },
    { label: "Designation", fieldName: "designation" },
    { label: "Total Visits", fieldName: "totalVisits" },
    { label: "Closed Visits", fieldName: "closedVisits" },
    { label: "Completion Rate %", fieldName: "visitCompletionRate" },
    { label: "Geo Verified %", fieldName: "geoSuccessRate" },
    { label: "Total Claimed", fieldName: "totalClaimed" },
    { label: "Total Approved", fieldName: "totalApproved" },
    { label: "Allocated Target", fieldName: "targetAmount" },
    { label: "Primary Sales", fieldName: "primarySales" },
    { label: "Primary Achieved %", fieldName: "primaryAchievementPercent" },
    { label: "Secondary Sales", fieldName: "secondarySales" },
    { label: "Secondary Achieved %", fieldName: "secondaryAchievementPercent" },
  ];

  const triggerExport = (format: "csv" | "excel") => {
    const filename = `employee_performance_scorecard`;
    if (format === "csv") {
      exportToCSV(headers, scorecardData, filename);
    } else {
      exportToExcel(headers, scorecardData, filename);
    }
    toast.success(`Exporting ${scorecardData.length} scorecards to ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Performance Reports"
        description="Unified MR field representative scorecards mapping visits, expenses, and target sales achievement."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Reports", to: "/reports" },
          { label: "Employee Reports" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-9"
              onClick={() => triggerExport("csv")}
              disabled={scorecardData.length === 0}
            >
              <FileText className="h-4 w-4" /> Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-9"
              onClick={() => triggerExport("excel")}
              disabled={scorecardData.length === 0}
            >
              <FileSpreadsheet className="h-4 w-4" /> Export Excel
            </Button>
          </div>
        }
      />

      {/* Filter panel */}
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

      {/* Scorecard Table */}
      <DataTable
        columns={columns}
        data={scorecardData}
        isLoading={isLoading}
        getRowId={(item) => item.id}
      />
    </div>
  );
}

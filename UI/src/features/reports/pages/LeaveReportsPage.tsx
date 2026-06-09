import * as React from "react";
import { Download, FileSpreadsheet, FileText, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/data/DataTable";
import { FilterBar } from "@/components/data/FilterBar";
import { Button } from "@/components/ui/button";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLeaveBalanceReport,
  useLeaveUtilizationReport,
  useLeaveApprovalReport,
  useMonthlyLeaveTrendReport,
} from "../hooks";
import { exportToCSV, exportToExcel } from "../api/export";
import { StatusBadge } from "@/components/data/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function LeaveReportsPage() {
  const [activeTab, setActiveTab] = React.useState("balances");
  const [yearFilter, setYearFilter] = React.useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Query Hooks
  const { data: balanceData = [], isLoading: loadBalances } = useLeaveBalanceReport({ year: yearFilter });
  const { data: utilizationData = [], isLoading: loadUtil } = useLeaveUtilizationReport({ year: yearFilter });
  const { data: approvalData = [], isLoading: loadApprovals } = useLeaveApprovalReport({
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const { data: trendData = [], isLoading: loadTrend } = useMonthlyLeaveTrendReport({ year: yearFilter });

  // Columns Definitions
  const balanceColumns: Column<any>[] = [
    { accessorKey: "employeeName", header: "Employee Name" },
    { accessorKey: "employeeCode", header: "Code" },
    { accessorKey: "leaveTypeName", header: "Leave Category" },
    { accessorKey: "allocated", header: "Allocated", cell: (item) => <span className="nums-tabular">{item.allocated}</span> },
    { accessorKey: "used", header: "Used", cell: (item) => <span className="nums-tabular font-semibold text-emerald-600">{item.used}</span> },
    { accessorKey: "pending", header: "Pending", cell: (item) => <span className="nums-tabular text-amber-500">{item.pending}</span> },
    { accessorKey: "remaining", header: "Remaining Balance", cell: (item) => <span className="nums-tabular font-bold">{item.remaining}</span> },
  ];

  const utilizationColumns: Column<any>[] = [
    { accessorKey: "label", header: "Leave Category" },
    { accessorKey: "requestCount", header: "Approved Requests", cell: (item) => <span className="nums-tabular">{item.requestCount}</span> },
    { accessorKey: "totalDaysUsed", header: "Total Days Consumed", cell: (item) => <span className="font-bold text-primary nums-tabular">{item.totalDaysUsed} Days</span> },
  ];

  const approvalColumns: Column<any>[] = [
    { accessorKey: "employeeName", header: "Employee Name" },
    { accessorKey: "leaveTypeName", header: "Leave Type" },
    { accessorKey: "fromDate", header: "From Date", cell: (item) => <span className="nums-tabular text-xs">{item.fromDate.substring(0, 10)}</span> },
    { accessorKey: "toDate", header: "To Date", cell: (item) => <span className="nums-tabular text-xs">{item.toDate.substring(0, 10)}</span> },
    { accessorKey: "totalDays", header: "Duration", cell: (item) => <span className="nums-tabular">{item.totalDays} days</span> },
    { accessorKey: "status", header: "Status", cell: (item) => <StatusBadge tone={item.status === "approved" ? "success" : item.status === "rejected" ? "danger" : "pending"}>{item.status}</StatusBadge> },
    { accessorKey: "reason", header: "Employee Reason" },
    { accessorKey: "approverName", header: "Verified By" },
    { accessorKey: "approvedAt", header: "Action Date", cell: (item) => <span className="nums-tabular text-xs">{item.approvedAt.substring(0, 10)}</span> },
  ];

  const trendColumns: Column<any>[] = [
    { accessorKey: "monthLabel", header: "Month" },
    { accessorKey: "approvedCount", header: "Leaves Count", cell: (item) => <span className="nums-tabular">{item.approvedCount}</span> },
    { accessorKey: "totalDays", header: "Total Days Consumed", cell: (item) => <span className="font-semibold text-primary nums-tabular">{item.totalDays} Days</span> },
  ];

  // Export Map
  const getExportHeaders = () => {
    switch (activeTab) {
      case "balances":
        return [
          { label: "Employee Name", fieldName: "employeeName" },
          { label: "Employee Code", fieldName: "employeeCode" },
          { label: "Leave Type", fieldName: "leaveTypeName" },
          { label: "Allocated", fieldName: "allocated" },
          { label: "Used", fieldName: "used" },
          { label: "Pending", fieldName: "pending" },
          { label: "Remaining", fieldName: "remaining" },
        ];
      case "utilization":
        return [
          { label: "Leave Head", fieldName: "label" },
          { label: "Approved Requests", fieldName: "requestCount" },
          { label: "Total Days Used", fieldName: "totalDaysUsed" },
        ];
      case "approvals":
        return [
          { label: "Employee Name", fieldName: "employeeName" },
          { label: "Employee Code", fieldName: "employeeCode" },
          { label: "Leave Type", fieldName: "leaveTypeName" },
          { label: "From Date", fieldName: "fromDate" },
          { label: "To Date", fieldName: "toDate" },
          { label: "Total Days", fieldName: "totalDays" },
          { label: "Status", fieldName: "status" },
          { label: "Reason", fieldName: "reason" },
          { label: "Approver", fieldName: "approverName" },
          { label: "Action Date", fieldName: "approvedAt" },
        ];
      default:
        return [
          { label: "Month", fieldName: "monthLabel" },
          { label: "Approved Counts", fieldName: "approvedCount" },
          { label: "Total Days Used", fieldName: "totalDays" },
        ];
    }
  };

  const getExportData = () => {
    switch (activeTab) {
      case "balances":
        return balanceData;
      case "utilization":
        return utilizationData;
      case "approvals":
        return approvalData;
      default:
        return trendData;
    }
  };

  const triggerExport = (format: "csv" | "excel") => {
    const headers = getExportHeaders();
    const rows = getExportData();
    const filename = `leave_report_${activeTab}`;

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
        title="Leave Reports"
        description="Monitor staff leave balances, leave type utilization, and approval history logs."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Reports", to: "/reports" },
          { label: "Leave Reports" },
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
          <TabsTrigger value="balances" className="h-9 px-4 rounded-md">Leave Balances</TabsTrigger>
          <TabsTrigger value="utilization" className="h-9 px-4 rounded-md">Utilization Summary</TabsTrigger>
          <TabsTrigger value="approvals" className="h-9 px-4 rounded-md">Approval Audit Logs</TabsTrigger>
          <TabsTrigger value="trends" className="h-9 px-4 rounded-md">Seasonality Trends</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <FilterBar showSearchInput={false}>
          {activeTab !== "approvals" && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Year:</span>
              <UiSelect value={String(yearFilter)} onValueChange={(v) => setYearFilter(Number(v))}>
                <SelectTrigger className="w-[120px] bg-background h-10">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </UiSelect>
            </div>
          )}

          {activeTab === "approvals" && (
            <UiSelect value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-background h-10">
                <SelectValue placeholder="Approval Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </UiSelect>
          )}
        </FilterBar>

        {/* Tab contents */}
        <TabsContent value="balances">
          <DataTable columns={balanceColumns} data={balanceData} isLoading={loadBalances} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="utilization">
          <DataTable columns={utilizationColumns} data={utilizationData} isLoading={loadUtil} getRowId={(item) => item.leaveTypeId} />
        </TabsContent>

        <TabsContent value="approvals">
          <DataTable columns={approvalColumns} data={approvalData} isLoading={loadApprovals} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="trends">
          <DataTable columns={trendColumns} data={trendData} isLoading={loadTrend} getRowId={(item) => item.monthKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

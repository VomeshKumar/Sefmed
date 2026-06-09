import * as React from "react";
import { Download, FileSpreadsheet, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
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
  useDoctorVisitSummary,
  useFirmVisitSummary,
  useVisitProductivityReport,
  useGeoVerificationReport,
  useVisitStatusAnalysisReport,
} from "../hooks";
import { exportToCSV, exportToExcel } from "../api/export";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { StatusBadge } from "@/components/data/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function VisitReportsPage() {
  const [activeTab, setActiveTab] = React.useState("doctor");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [employeeFilter, setEmployeeFilter] = React.useState("all");

  const { data: employees = [] } = useEmployeesList({});

  // Query Hooks
  const { data: doctorData = [], isLoading: loadDoctor } = useDoctorVisitSummary({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const { data: firmData = [], isLoading: loadFirm } = useFirmVisitSummary({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const { data: productivityData = [], isLoading: loadProd } = useVisitProductivityReport({
    employeeId: employeeFilter === "all" ? undefined : employeeFilter,
  });

  const { data: geoData, isLoading: loadGeo } = useGeoVerificationReport();
  const { data: statusData, isLoading: loadStatus } = useVisitStatusAnalysisReport();

  // Columns Definitions
  const doctorColumns: Column<any>[] = [
    { accessorKey: "visitDate", header: "Visit Date", cell: (item) => <span className="nums-tabular text-sm font-medium">{item.visitDate.substring(0, 10)}</span> },
    { accessorKey: "doctorName", header: "Doctor Name" },
    { accessorKey: "specialty", header: "Specialty" },
    { accessorKey: "representativeName", header: "MR Representative" },
    {
      accessorKey: "geoVerificationStatus",
      header: "Geo Verification",
      cell: (item) => {
        const status = item.geoVerificationStatus;
        return (
          <StatusBadge tone={status === "Verified" ? "success" : status === "Outside Radius" ? "danger" : "warning"}>
            {status}
          </StatusBadge>
        );
      },
    },
    { accessorKey: "status", header: "Status", cell: (item) => <StatusBadge tone={item.status === "closed" || item.status === "approved" ? "success" : "pending"}>{item.status}</StatusBadge> },
    { accessorKey: "purpose", header: "Call Purpose" },
  ];

  const firmColumns: Column<any>[] = [
    { accessorKey: "visitDate", header: "Visit Date", cell: (item) => <span className="nums-tabular text-sm font-medium">{item.visitDate.substring(0, 10)}</span> },
    { accessorKey: "firmName", header: "Firm Name" },
    { accessorKey: "firmType", header: "Firm Type" },
    { accessorKey: "representativeName", header: "MR Representative" },
    {
      accessorKey: "geoVerificationStatus",
      header: "Geo Verification",
      cell: (item) => {
        const status = item.geoVerificationStatus;
        return (
          <StatusBadge tone={status === "Verified" ? "success" : status === "Outside Radius" ? "danger" : "warning"}>
            {status}
          </StatusBadge>
        );
      },
    },
    { accessorKey: "status", header: "Status", cell: (item) => <StatusBadge tone={item.status === "closed" || item.status === "approved" ? "success" : "pending"}>{item.status}</StatusBadge> },
    { accessorKey: "purpose", header: "Call Purpose" },
  ];

  const productivityColumns: Column<any>[] = [
    { accessorKey: "employeeName", header: "Representative" },
    { accessorKey: "employeeCode", header: "Code" },
    { accessorKey: "planned", header: "Planned", cell: (item) => <span className="nums-tabular">{item.planned}</span> },
    { accessorKey: "open", header: "Open", cell: (item) => <span className="nums-tabular">{item.open}</span> },
    { accessorKey: "closed", header: "Closed", cell: (item) => <span className="nums-tabular font-semibold text-emerald-600">{item.closed}</span> },
    { accessorKey: "rescheduled", header: "Rescheduled", cell: (item) => <span className="nums-tabular">{item.rescheduled}</span> },
    { accessorKey: "skipped", header: "Skipped", cell: (item) => <span className="nums-tabular">{item.skipped}</span> },
    { accessorKey: "cancelled", header: "Cancelled", cell: (item) => <span className="nums-tabular">{item.cancelled}</span> },
    { accessorKey: "total", header: "Total Calls", cell: (item) => <span className="nums-tabular font-bold">{item.total}</span> },
    {
      accessorKey: "completionRate",
      header: "Call Effectiveness",
      cell: (item) => (
        <span className="font-bold text-primary nums-tabular">{item.completionRate}%</span>
      ),
    },
  ];

  // Export Map
  const getExportHeaders = () => {
    if (activeTab === "doctor") {
      return [
        { label: "Visit Date", fieldName: "visitDate" },
        { label: "Doctor Name", fieldName: "doctorName" },
        { label: "Specialty", fieldName: "specialty" },
        { label: "Representative", fieldName: "representativeName" },
        { label: "Geo Verified", fieldName: "geoVerificationStatus" },
        { label: "Status", fieldName: "status" },
        { label: "Purpose", fieldName: "purpose" },
      ];
    } else if (activeTab === "firm") {
      return [
        { label: "Visit Date", fieldName: "visitDate" },
        { label: "Firm Name", fieldName: "firmName" },
        { label: "Firm Type", fieldName: "firmType" },
        { label: "Representative", fieldName: "representativeName" },
        { label: "Geo Verified", fieldName: "geoVerificationStatus" },
        { label: "Status", fieldName: "status" },
        { label: "Purpose", fieldName: "purpose" },
      ];
    } else {
      return [
        { label: "Representative", fieldName: "employeeName" },
        { label: "Employee Code", fieldName: "employeeCode" },
        { label: "Planned", fieldName: "planned" },
        { label: "Open", fieldName: "open" },
        { label: "Closed", fieldName: "closed" },
        { label: "Rescheduled", fieldName: "rescheduled" },
        { label: "Skipped", fieldName: "skipped" },
        { label: "Cancelled", fieldName: "cancelled" },
        { label: "Total Calls", fieldName: "total" },
        { label: "Effectiveness Rate %", fieldName: "completionRate" },
      ];
    }
  };

  const getExportData = () => {
    if (activeTab === "doctor") return doctorData;
    if (activeTab === "firm") return firmData;
    return productivityData;
  };

  const triggerExport = (format: "csv" | "excel") => {
    const headers = getExportHeaders();
    const rows = getExportData();
    const filename = `visit_report_${activeTab}`;

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
        title="Visit Reports"
        description="Verify call metrics, visit completions, call productivity, and field geo-verifications."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Reports", to: "/reports" },
          { label: "Visit Reports" },
        ]}
        actions={
          activeTab !== "geo" && activeTab !== "status" && (
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
          <TabsTrigger value="doctor" className="h-9 px-4 rounded-md">Doctor Call Summary</TabsTrigger>
          <TabsTrigger value="firm" className="h-9 px-4 rounded-md">Firm Call Summary</TabsTrigger>
          <TabsTrigger value="productivity" className="h-9 px-4 rounded-md">MR Call Productivity</TabsTrigger>
          <TabsTrigger value="geo" className="h-9 px-4 rounded-md">Geo Verification Audits</TabsTrigger>
          <TabsTrigger value="status" className="h-9 px-4 rounded-md">Status Breakdown</TabsTrigger>
        </TabsList>

        {/* Filters */}
        {activeTab !== "geo" && activeTab !== "status" && (
          <FilterBar showSearchInput={false}>
            {(activeTab === "doctor" || activeTab === "firm") && (
              <UiSelect value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-background h-10">
                  <SelectValue placeholder="Call Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  <SelectItem value="skipped">Skipped</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </UiSelect>
            )}

            {activeTab === "productivity" && (
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
          </FilterBar>
        )}

        {/* Tab contents */}
        <TabsContent value="doctor">
          <DataTable columns={doctorColumns} data={doctorData} isLoading={loadDoctor} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="firm">
          <DataTable columns={firmColumns} data={firmData} isLoading={loadFirm} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="productivity">
          <DataTable columns={productivityColumns} data={productivityData} isLoading={loadProd} getRowId={(item) => item.id} />
        </TabsContent>

        <TabsContent value="geo">
          {geoData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">Verification Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-emerald-600 flex items-center gap-1.5">
                    <ShieldCheck className="h-7 w-7" /> {geoData.verificationRate}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Percentage of visits with verified geolocation checks.</p>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">Verified & Compliant Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" /> {geoData.verified}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Calls verified inside radius.</p>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold uppercase text-muted-foreground">Variance Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-destructive flex items-center gap-1.5">
                    <AlertTriangle className="h-6 w-6 text-amber-500" /> {geoData.outsideRadius + geoData.unverified}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Includes {geoData.outsideRadius} Outside Radius and {geoData.unverified} Unverified calls.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="status">
          {statusData && (
            <div className="bg-card border rounded-lg p-5">
              <h3 className="text-base font-semibold mb-4">Workflow Distribution ({statusData.total} Calls)</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {statusData.byStatus.map((item) => (
                  <div key={item.name} className="bg-muted/30 border p-3 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground font-medium mb-1">{item.name}</div>
                    <div className="text-xl font-bold nums-tabular">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

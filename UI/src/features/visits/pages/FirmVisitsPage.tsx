import * as React from "react";
import { Plus, Edit, Trash2, Eye, MapPin, CheckCircle, XCircle, Building2, FileText, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/data/DataTable";
import { FilterBar } from "@/components/data/FilterBar";
import { StatusBadge, type StatusTone } from "@/components/data/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RequirePermission } from "@/lib/rbac/RequirePermission";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { toast } from "sonner";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import { useStockistsList } from "@/features/sales/hooks";
import type { Stockist } from "@/features/sales/types";
import type { Zone } from "@/features/master-data/zones/types";
import type { Territory } from "@/features/master-data/territories/types";
import {
  useFirmVisits,
  useCreateFirmVisit,
  useUpdateFirmVisit,
  useDeleteFirmVisit,
} from "../hooks";
import { createFirmVisitSchema, type FirmVisitFormValues } from "../schemas";
import type { FirmVisit, VisitWorkflowStatus, GeoVerificationStatus } from "../types";

const resolveFirmDetails = (
  item: FirmVisit,
  stockists: Stockist[],
  zones: Zone[],
  territories: Territory[]
) => {
  const stockist = stockists.find(
    (s) => s.name.toLowerCase() === item.firmName.toLowerCase()
  );

  let firmAddress = "—";
  let city = "—";
  let zoneName = "—";

  if (stockist) {
    firmAddress = stockist.address;
    const territory = territories.find((t) => t.id === stockist.territoryId);
    city = territory ? territory.name : stockist.city;
    const zone = zones.find((z) => z.id === stockist.zoneId);
    zoneName = zone ? zone.name : "—";
  } else if (item.geoAddress) {
    const parts = item.geoAddress.split(",").map((p) => p.trim());
    if (parts.length >= 3) {
      zoneName = parts[parts.length - 2];
      city = parts[parts.length - 3];
    }
    firmAddress = item.geoAddress;
  }

  return {
    firmAddress,
    city,
    zone: zoneName,
  };
};

export function FirmVisitsPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [firmTypeFilter, setFirmTypeFilter] = React.useState("all");

  // Dialog States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isLogOpen, setIsLogOpen] = React.useState(false);
  const [editingVisit, setEditingVisit] = React.useState<FirmVisit | null>(null);
  const [loggingVisit, setLoggingVisit] = React.useState<FirmVisit | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Queries
  const { data: employees = [] } = useEmployeesList();
  const { data: zones = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: stockists = [] } = useStockistsList();
  const { data: visits = [], isLoading } = useFirmVisits({
    status: statusFilter === "all" ? undefined : statusFilter,
    firmType: firmTypeFilter === "all" ? undefined : firmTypeFilter,
    query: search || undefined,
  });

  // Mutations
  const createMutation = useCreateFirmVisit();
  const updateMutation = useUpdateFirmVisit();
  const deleteMutation = useDeleteFirmVisit();

  const employeeMap = React.useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);

  // Sefmed counters
  const metrics = React.useMemo(() => {
    const open = visits.filter((v) => v.status === "open" || v.status === "planned").length;
    const closed = visits.filter((v) => v.status === "closed" || v.status === "approved").length;
    const rescheduled = visits.filter((v) => v.status === "rescheduled").length;
    return { open, closed, rescheduled };
  }, [visits]);

  // Form Setup
  const planForm = useForm<FirmVisitFormValues>({
    resolver: zodResolver(createFirmVisitSchema),
    defaultValues: {
      date: new Date().toISOString().substring(0, 16),
      firmName: "",
      firmType: "chemist",
      assignedEmployeeId: "",
      status: "planned",
      purpose: "",
      remarks: "",
      latitude: 21.1904,
      longitude: 81.2849,
      geoAddress: "Sefmed Headquarters, Raipur, India",
      geoVerificationStatus: "Verified",
    },
  });

  const logForm = useForm<{
    remarks: string;
    geoVerificationStatus: GeoVerificationStatus;
    geoAddress: string;
  }>({
    defaultValues: {
      remarks: "",
      geoVerificationStatus: "Verified",
      geoAddress: "",
    },
  });

  React.useEffect(() => {
    if (editingVisit) {
      planForm.reset({
        date: editingVisit.date.substring(0, 16),
        firmName: editingVisit.firmName,
        firmType: editingVisit.firmType,
        assignedEmployeeId: editingVisit.assignedEmployeeId,
        status: editingVisit.status,
        purpose: editingVisit.purpose,
        remarks: editingVisit.remarks || "",
        latitude: editingVisit.latitude || 21.1904,
        longitude: editingVisit.longitude || 81.2849,
        geoAddress: editingVisit.geoAddress || "",
        geoVerificationStatus: editingVisit.geoVerificationStatus || "Unverified",
      });
    } else {
      planForm.reset({
        date: new Date().toISOString().substring(0, 16),
        firmName: "",
        firmType: "chemist",
        assignedEmployeeId: "",
        status: "planned",
        purpose: "",
        remarks: "",
        latitude: 21.1904,
        longitude: 81.2849,
        geoAddress: "Sefmed Headquarters, Raipur, India",
        geoVerificationStatus: "Verified",
      });
    }
  }, [editingVisit, planForm]);

  React.useEffect(() => {
    if (loggingVisit) {
      logForm.reset({
        remarks: loggingVisit.remarks || "",
        geoVerificationStatus: "Verified",
        geoAddress: loggingVisit.geoAddress || "Firm Premises Address, India",
      });
    }
  }, [loggingVisit, logForm]);

  const handleOpenPlan = () => {
    setEditingVisit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditPlan = (visit: FirmVisit) => {
    setEditingVisit(visit);
    setIsFormOpen(true);
  };

  const handleOpenLog = (visit: FirmVisit) => {
    setLoggingVisit(visit);
    setIsLogOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const onPlanSubmit = async (values: FirmVisitFormValues) => {
    try {
      if (editingVisit) {
        await updateMutation.mutateAsync({
          id: editingVisit.id,
          data: values,
        });
        toast.success("Institution/Firm visit rescheduled/updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Institution call planned successfully");
      }
      setIsFormOpen(false);
      setEditingVisit(null);
    } catch (err) {
      toast.error("Failed to plan call");
    }
  };

  const onLogSubmit = async (values: {
    remarks: string;
    geoVerificationStatus: GeoVerificationStatus;
    geoAddress: string;
  }) => {
    if (!loggingVisit) return;
    try {
      await updateMutation.mutateAsync({
        id: loggingVisit.id,
        data: {
          ...values,
          status: "pending_approval",
          date: new Date().toISOString(),
        },
      });
      toast.success("Firm visit report logged! Awaiting senior review.");
      setIsLogOpen(false);
      setLoggingVisit(null);
    } catch (err) {
      toast.error("Failed to log visit report");
    }
  };

  const handleApprove = async (visit: FirmVisit) => {
    try {
      await updateMutation.mutateAsync({
        id: visit.id,
        data: { status: "approved" },
      });
      toast.success("Institution visit approved successfully");
    } catch (err) {
      toast.error("Failed to approve visit");
    }
  };

  const handleReject = async (visit: FirmVisit) => {
    try {
      await updateMutation.mutateAsync({
        id: visit.id,
        data: { status: "rejected" },
      });
      toast.warning("Institution visit marked as Rejected");
    } catch (err) {
      toast.error("Failed to reject visit");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Planned visit deleted");
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete planned visit");
    }
  };

  const getGeoTone = (status?: GeoVerificationStatus): StatusTone => {
    if (status === "Verified") return "success";
    if (status === "Outside Radius") return "warning";
    return "neutral";
  };

  const getWorkflowTone = (status: VisitWorkflowStatus): StatusTone => {
    switch (status) {
      case "approved":
      case "closed":
        return "success";
      case "pending_approval":
      case "open":
        return "warning";
      case "rejected":
      case "cancelled":
        return "danger";
      case "rescheduled":
        return "info";
      default:
        return "neutral";
    }
  };

  const formatWorkflowName = (status: VisitWorkflowStatus) => {
    return status.replace("_", " ").toUpperCase();
  };

  const columns: Column<FirmVisit>[] = [
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/visits/firm/$id" params={{ id: item.id }}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>

            {item.status === "planned" || item.status === "open" ? (
              <RequirePermission permission={PERMISSIONS.VISIT_CREATE}>
                <DropdownMenuItem onClick={() => handleOpenLog(item)}>
                  <FileText className="mr-2 h-4 w-4" /> Log Report
                </DropdownMenuItem>
              </RequirePermission>
            ) : null}

            {item.status === "pending_approval" ? (
              <RequirePermission permission={PERMISSIONS.VISIT_APPROVE}>
                <DropdownMenuItem onClick={() => handleApprove(item)} className="text-success">
                  <CheckCircle className="mr-2 h-4 w-4" /> Approve Visit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReject(item)} className="text-destructive">
                  <XCircle className="mr-2 h-4 w-4" /> Reject Visit
                </DropdownMenuItem>
              </RequirePermission>
            ) : null}

            {item.status === "planned" ? (
              <RequirePermission permission={PERMISSIONS.VISIT_CREATE}>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleOpenEditPlan(item)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Plan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenDelete(item.id)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Plan
                </DropdownMenuItem>
              </RequirePermission>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      accessorKey: "id",
      header: "Firm Id",
      cell: (item) => <span className="font-medium text-muted-foreground">{item.id.substring(0, 9).toUpperCase()}</span>,
    },
    {
      accessorKey: "firmName",
      header: "Firm Name",
      sortable: true,
      cell: (item) => <span className="font-semibold text-foreground">{item.firmName}</span>,
    },
    {
      accessorKey: "visitAddress",
      header: "Visit Address",
      cell: (item) => (
        <span className="text-xs truncate max-w-[180px] block" title={item.geoAddress}>
          {item.geoAddress || "—"}
        </span>
      ),
    },
    {
      accessorKey: "firmAddress",
      header: "Firm Address",
      cell: (item) => {
        const details = resolveFirmDetails(item, stockists, zones, territories);
        return (
          <span className="text-xs truncate max-w-[180px] block" title={details.firmAddress}>
            {details.firmAddress}
          </span>
        );
      },
    },
    {
      accessorKey: "city",
      header: "City",
      cell: (item) => {
        const details = resolveFirmDetails(item, stockists, zones, territories);
        return <span>{details.city}</span>;
      },
    },
    {
      accessorKey: "zone",
      header: "Zone",
      cell: (item) => {
        const details = resolveFirmDetails(item, stockists, zones, territories);
        return <span>{details.zone}</span>;
      },
    },
    {
      accessorKey: "assignedEmployeeId",
      header: "Employee Name",
      cell: (item) => {
        const emp = employeeMap.get(item.assignedEmployeeId);
        return <span className="font-medium text-foreground">{emp ? emp.name : "—"}</span>;
      },
    },
    {
      accessorKey: "date",
      header: "Visit Date",
      sortable: true,
      cell: (item) => <span className="nums-tabular font-medium">{new Date(item.date).toLocaleDateString()}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      sortable: true,
      cell: (item) => (
        <StatusBadge tone={getWorkflowTone(item.status)}>{formatWorkflowName(item.status)}</StatusBadge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Firm / Institution Visits"
        description="Track institutional engagements, stockist audits, and chemist calls."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Visits" },
          { label: "Firm Calls" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <RequirePermission permission={PERMISSIONS.VISIT_CREATE}>
              <Button onClick={handleOpenPlan} className="gap-1.5 h-9">
                <Plus className="h-4 w-4" />
                <span>Plan Call</span>
              </Button>
            </RequirePermission>
            <Button variant="outline" size="sm" asChild className="h-9 gap-1 text-xs">
              <Link to="/visits/planner">
                <span>Planner Panel</span>
              </Link>
            </Button>
          </div>
        }
      />

      {/* Sefmed Counters */}
      <div className="mb-4 grid grid-cols-3 gap-4 max-w-sm bg-card border rounded-lg p-3.5 shadow-sm text-sm">
        <div className="text-center border-r">
          <div className="text-muted-foreground font-medium text-xs uppercase">Open / Active</div>
          <div className="text-lg font-bold text-warning nums-tabular mt-0.5">{metrics.open}</div>
        </div>
        <div className="text-center border-r">
          <div className="text-muted-foreground font-medium text-xs uppercase">Closed / Approved</div>
          <div className="text-lg font-bold text-success nums-tabular mt-0.5">{metrics.closed}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground font-medium text-xs uppercase">Rescheduled</div>
          <div className="text-lg font-bold text-info nums-tabular mt-0.5">{metrics.rescheduled}</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Filters */}
        <FilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search firm calls by name or purpose..."
          showClearButton={statusFilter !== "all" || firmTypeFilter !== "all" || !!search}
          onClearFilters={() => {
            setSearch("");
            setStatusFilter("all");
            setFirmTypeFilter("all");
          }}
        >
          <UiSelect value={firmTypeFilter} onValueChange={setFirmTypeFilter}>
            <SelectTrigger className="w-[150px] bg-background h-10">
              <SelectValue placeholder="Firm Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="chemist">Chemist</SelectItem>
              <SelectItem value="stockist">Stockist</SelectItem>
              <SelectItem value="hospital">Hospital</SelectItem>
            </SelectContent>
          </UiSelect>

          <UiSelect value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-background h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="open">Open (Active)</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
            </SelectContent>
          </UiSelect>
        </FilterBar>

        {/* Data Grid */}
        <DataTable
          columns={columns}
          data={visits}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>

      {/* Plan Firm Visit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={planForm.handleSubmit(onPlanSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingVisit ? "Reschedule Call Plan" : "Plan Institution Visit"}</DialogTitle>
              <DialogDescription>
                Schedule firm calls, audit audits, and chemist engagements.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="planDate">Scheduled Date & Time</Label>
                <Input id="planDate" type="datetime-local" {...planForm.register("date")} />
                {planForm.formState.errors.date && (
                  <p className="text-xs text-destructive">{planForm.formState.errors.date.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="planFirmName">Firm / Institution Name</Label>
                <Input id="planFirmName" placeholder="e.g. Apollo Pharmacy" {...planForm.register("firmName")} />
                {planForm.formState.errors.firmName && (
                  <p className="text-xs text-destructive">{planForm.formState.errors.firmName.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="planFirmType">Institution Type</Label>
                <UiSelect
                  value={planForm.watch("firmType")}
                  onValueChange={(val: "chemist" | "stockist" | "hospital") => planForm.setValue("firmType", val)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chemist">Chemist / Retailer</SelectItem>
                    <SelectItem value="stockist">Stockist / Wholesaler</SelectItem>
                    <SelectItem value="hospital">Hospital / Clinic Premises</SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="planRep">Representative Assigned</Label>
                <UiSelect
                  value={planForm.watch("assignedEmployeeId")}
                  onValueChange={(val) => planForm.setValue("assignedEmployeeId", val)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select representative..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
                {planForm.formState.errors.assignedEmployeeId && (
                  <p className="text-xs text-destructive">{planForm.formState.errors.assignedEmployeeId.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="planPurpose">Visit Purpose</Label>
                <Input id="planPurpose" placeholder="e.g. Audit stocks, collect POB, etc." {...planForm.register("purpose")} />
                {planForm.formState.errors.purpose && (
                  <p className="text-xs text-destructive">{planForm.formState.errors.purpose.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="planRemarks">Remarks</Label>
                <Input id="planRemarks" placeholder="Optional planning remarks..." {...planForm.register("remarks")} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Plan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Log Firm Visit Dialog */}
      <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={logForm.handleSubmit(onLogSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Log completed Call Report</DialogTitle>
              <DialogDescription>
                Log the institution visit details. This auto-captures the current GPS location.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-1 text-sm">
              {/* Geolocation Visual Card */}
              <div className="p-3 bg-muted rounded-md border flex items-start gap-2.5">
                <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-xs text-foreground uppercase">GPS Geolocation Checked</div>
                  <div className="text-xs text-muted-foreground">{logForm.watch("geoAddress")}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] uppercase font-bold text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20">
                      Verified
                    </span>
                    <span className="text-[10px] text-muted-foreground nums-tabular">
                      Coords: {loggingVisit?.latitude}, {loggingVisit?.longitude}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="logRemarks">Call Discussion Remarks</Label>
                <textarea
                  id="logRemarks"
                  rows={4}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Input summary of discussion, POB order bookings collected, stock gaps, etc..."
                  {...logForm.register("remarks")}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsLogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Call Report</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Planned Call</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this planned call report? Representative calendar entry will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

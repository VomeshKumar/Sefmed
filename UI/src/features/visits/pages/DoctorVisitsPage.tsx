import * as React from "react";
import { Plus, Edit, Trash2, Eye, MapPin, CheckCircle, XCircle, Stethoscope, AlertTriangle, FileText, Settings } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { useDoctorsList } from "@/features/people/doctors/hooks";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useVisitTypesList } from "@/features/master-data/visit-types/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import {
  useDoctorVisits,
  useCreateDoctorVisit,
  useUpdateDoctorVisit,
  useDeleteDoctorVisit,
} from "../hooks";
import { createDoctorVisitSchema, type DoctorVisitFormValues } from "../schemas";
import type { DoctorVisit, VisitWorkflowStatus, GeoVerificationStatus } from "../types";

export function DoctorVisitsPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [specialityFilter, setSpecialityFilter] = React.useState("all");

  // Dialog States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isLogOpen, setIsLogOpen] = React.useState(false);
  const [editingVisit, setEditingVisit] = React.useState<DoctorVisit | null>(null);
  const [loggingVisit, setLoggingVisit] = React.useState<DoctorVisit | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Queries
  const { data: doctors = [] } = useDoctorsList();
  const { data: employees = [] } = useEmployeesList();
  const { data: visitTypes = [] } = useVisitTypesList();
  const { data: zones = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: visits = [], isLoading } = useDoctorVisits({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Mutations
  const createMutation = useCreateDoctorVisit();
  const updateMutation = useUpdateDoctorVisit();
  const deleteMutation = useDeleteDoctorVisit();

  // Maps
  const doctorMap = React.useMemo(() => new Map(doctors.map((d) => [d.id, d])), [doctors]);
  const employeeMap = React.useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);
  const visitTypeMap = React.useMemo(() => new Map(visitTypes.map((v) => [v.id, v])), [visitTypes]);
  const zoneMap = React.useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);
  const territoryMap = React.useMemo(() => new Map(territories.map((t) => [t.id, t])), [territories]);

  // Specialities
  const specialities = ["GYN", "CARDIO", "GP", "CHEST", "PEDIATRIC", "DERMA", "ORTHO"];
  const brands = ["Sefmed-500", "Cal-D3", "Multi-Vit", "Cardio-S", "Cofi-D"];

  // Filtered visits on search & speciality
  const filteredVisits = React.useMemo(() => {
    let list = visits;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((v) => {
        const docName = doctorMap.get(v.doctorId)?.name.toLowerCase() || "";
        const repName = employeeMap.get(v.assignedEmployeeId)?.name.toLowerCase() || "";
        return docName.includes(q) || repName.includes(q) || (v.remarks && v.remarks.toLowerCase().includes(q));
      });
    }

    if (specialityFilter !== "all") {
      list = list.filter((v) => {
        const doc = doctorMap.get(v.doctorId);
        return doc?.speciality === specialityFilter;
      });
    }

    return list;
  }, [visits, search, specialityFilter, doctorMap, employeeMap]);

  // Sefmed KPI counter boxes
  const metrics = React.useMemo(() => {
    const open = visits.filter((v) => v.status === "open" || v.status === "planned").length;
    const closed = visits.filter((v) => v.status === "closed" || v.status === "approved").length;
    const rescheduled = visits.filter((v) => v.status === "rescheduled").length;
    const pending = visits.filter((v) => v.status === "pending_approval").length;
    return { open, closed, rescheduled, pending };
  }, [visits]);

  // Form Setup (Plan Call Form)
  const planForm = useForm<DoctorVisitFormValues>({
    resolver: zodResolver(createDoctorVisitSchema),
    defaultValues: {
      date: new Date().toISOString().substring(0, 16),
      doctorId: "",
      assignedEmployeeId: "",
      visitTypeId: "visit-doctor",
      status: "planned",
      jointVisit: false,
      jointEmployeeId: "",
      discussionSummary: "",
      productsDiscussion: [],
      samplesDistributed: [],
      remarks: "",
      latitude: 21.1904,
      longitude: 81.2849,
      geoAddress: "Sefmed Headquarters, Raipur, India",
      geoVerificationStatus: "Verified",
    },
  });

  // Log Form Setup (Log completed visit details)
  const logForm = useForm<{
    discussionSummary: string;
    productsDiscussion: string[];
    samplesDistributed: Array<{ product: string; quantity: number }>;
    remarks: string;
    geoVerificationStatus: GeoVerificationStatus;
    geoAddress: string;
  }>({
    defaultValues: {
      discussionSummary: "",
      productsDiscussion: [],
      samplesDistributed: [],
      remarks: "",
      geoVerificationStatus: "Verified",
      geoAddress: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: logForm.control,
    name: "samplesDistributed",
  });

  const watchPlanJoint = planForm.watch("jointVisit");
  const watchPlanDoctor = planForm.watch("doctorId");

  // Sync representative assignment automatically when doctor is selected in Plan Form
  React.useEffect(() => {
    if (watchPlanDoctor) {
      const doc = doctorMap.get(watchPlanDoctor);
      if (doc?.assignedEmployeeId) {
        planForm.setValue("assignedEmployeeId", doc.assignedEmployeeId);
      }
    }
  }, [watchPlanDoctor, doctorMap, planForm]);

  // Populate forms for edit/logging
  React.useEffect(() => {
    if (editingVisit) {
      planForm.reset({
        date: editingVisit.date.substring(0, 16),
        doctorId: editingVisit.doctorId,
        assignedEmployeeId: editingVisit.assignedEmployeeId,
        visitTypeId: editingVisit.visitTypeId,
        status: editingVisit.status,
        jointVisit: editingVisit.jointVisit,
        jointEmployeeId: editingVisit.jointEmployeeId || "",
        discussionSummary: editingVisit.discussionSummary || "",
        productsDiscussion: editingVisit.productsDiscussion || [],
        samplesDistributed: editingVisit.samplesDistributed || [],
        remarks: editingVisit.remarks || "",
        latitude: editingVisit.latitude || 21.1904,
        longitude: editingVisit.longitude || 81.2849,
        geoAddress: editingVisit.geoAddress || "",
        geoVerificationStatus: editingVisit.geoVerificationStatus || "Unverified",
      });
    } else {
      planForm.reset({
        date: new Date().toISOString().substring(0, 16),
        doctorId: "",
        assignedEmployeeId: "",
        visitTypeId: "visit-doctor",
        status: "planned",
        jointVisit: false,
        jointEmployeeId: "",
        discussionSummary: "",
        productsDiscussion: [],
        samplesDistributed: [],
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
      // Find doctor coordinates/city to mock geo address
      const doc = doctorMap.get(loggingVisit.doctorId);
      logForm.reset({
        discussionSummary: loggingVisit.discussionSummary || "",
        productsDiscussion: loggingVisit.productsDiscussion || [],
        samplesDistributed: loggingVisit.samplesDistributed || [],
        remarks: loggingVisit.remarks || "",
        geoVerificationStatus: "Verified",
        geoAddress: doc ? `${doc.hospitalName}, ${doc.clinicAddress}` : "Doctor Clinic Address",
      });
    }
  }, [loggingVisit, logForm, doctorMap]);

  const handleOpenPlan = () => {
    setEditingVisit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditPlan = (visit: DoctorVisit) => {
    setEditingVisit(visit);
    setIsFormOpen(true);
  };

  const handleOpenLog = (visit: DoctorVisit) => {
    setLoggingVisit(visit);
    setIsLogOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const onPlanSubmit = async (values: DoctorVisitFormValues) => {
    try {
      if (editingVisit) {
        await updateMutation.mutateAsync({
          id: editingVisit.id,
          data: values,
        });
        toast.success("Doctor call rescheduled/updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Doctor call planned successfully");
      }
      setIsFormOpen(false);
      setEditingVisit(null);
    } catch (err) {
      toast.error("Failed to plan call");
    }
  };

  const onLogSubmit = async (values: {
    discussionSummary: string;
    productsDiscussion: string[];
    samplesDistributed: Array<{ product: string; quantity: number }>;
    remarks: string;
    geoVerificationStatus: GeoVerificationStatus;
    geoAddress: string;
  }) => {
    if (!loggingVisit) return;
    try {
      // Completed visits shift workflow state to pending_approval or closed
      const status: VisitWorkflowStatus = "pending_approval";
      await updateMutation.mutateAsync({
        id: loggingVisit.id,
        data: {
          ...values,
          status,
          date: new Date().toISOString(),
        },
      });
      toast.success("Call report logged! Awaiting senior approval.");
      setIsLogOpen(false);
      setLoggingVisit(null);
    } catch (err) {
      toast.error("Failed to log visit report");
    }
  };

  const handleApprove = async (visit: DoctorVisit) => {
    try {
      await updateMutation.mutateAsync({
        id: visit.id,
        data: { status: "approved" },
      });
      toast.success("Doctor visit approved successfully");
    } catch (err) {
      toast.error("Failed to approve visit");
    }
  };

  const handleReject = async (visit: DoctorVisit) => {
    try {
      await updateMutation.mutateAsync({
        id: visit.id,
        data: { status: "rejected" },
      });
      toast.warning("Doctor visit marked as Rejected");
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

  const columns: Column<DoctorVisit>[] = [
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
              <Link to="/visits/doctor/$id" params={{ id: item.id }}>
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
      header: "Visit ID",
      cell: (item) => <span className="font-medium text-muted-foreground">{item.id.substring(0, 9).toUpperCase()}</span>,
    },
    {
      accessorKey: "doctorId",
      header: "Doctor ID",
      cell: (item) => {
        const doc = doctorMap.get(item.doctorId);
        return <span>{doc ? doc.doctorCode : "—"}</span>;
      },
    },
    {
      accessorKey: "doctorName",
      header: "Doctor Name",
      cell: (item) => {
        const doc = doctorMap.get(item.doctorId);
        return <span className="font-semibold text-foreground">{doc ? doc.name : "—"}</span>;
      },
    },
    {
      accessorKey: "clinicAddress",
      header: "Clinic Address",
      cell: (item) => {
        const doc = doctorMap.get(item.doctorId);
        return (
          <span className="text-xs truncate max-w-[200px] block" title={doc?.clinicAddress}>
            {doc ? doc.clinicAddress : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "zone",
      header: "Zone",
      cell: (item) => {
        const doc = doctorMap.get(item.doctorId);
        const zone = doc ? zoneMap.get(doc.zoneId) : null;
        return <span>{zone ? zone.name : "—"}</span>;
      },
    },
    {
      accessorKey: "city",
      header: "City",
      cell: (item) => {
        const doc = doctorMap.get(item.doctorId);
        const territory = doc ? territoryMap.get(doc.territoryId) : null;
        return <span>{territory ? territory.name : "—"}</span>;
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
      accessorKey: "createdAt",
      header: "Created Date",
      sortable: true,
      cell: (item) => <span className="nums-tabular font-medium">{new Date(item.createdAt || item.date).toLocaleDateString()}</span>,
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
        title="Doctor Visits"
        description="Plan, log, and review doctor calls in the field with integrated GPS geo-verification."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Visits" },
          { label: "Doctor Calls" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <RequirePermission permission={PERMISSIONS.VISIT_CREATE}>
              <Button onClick={handleOpenPlan} className="gap-1.5 h-9">
                <Plus className="h-4 w-4" />
                <span>Plan Visit</span>
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
      <div className="mb-4 grid grid-cols-4 gap-4 max-w-xl bg-card border rounded-lg p-3.5 shadow-sm text-sm">
        <div className="text-center border-r">
          <div className="text-muted-foreground font-medium text-xs uppercase">Open / Planned</div>
          <div className="text-lg font-bold text-warning nums-tabular mt-0.5">{metrics.open}</div>
        </div>
        <div className="text-center border-r">
          <div className="text-muted-foreground font-medium text-xs uppercase">Closed / Done</div>
          <div className="text-lg font-bold text-success nums-tabular mt-0.5">{metrics.closed}</div>
        </div>
        <div className="text-center border-r">
          <div className="text-muted-foreground font-medium text-xs uppercase">Pending Review</div>
          <div className="text-lg font-bold text-purple-700 nums-tabular mt-0.5">{metrics.pending}</div>
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
          searchPlaceholder="Search visits by doctor or representative name..."
          showClearButton={statusFilter !== "all" || specialityFilter !== "all" || !!search}
          onClearFilters={() => {
            setSearch("");
            setStatusFilter("all");
            setSpecialityFilter("all");
          }}
        >
          <UiSelect value={specialityFilter} onValueChange={setSpecialityFilter}>
            <SelectTrigger className="w-[150px] bg-background h-10">
              <SelectValue placeholder="Speciality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialities</SelectItem>
              {specialities.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
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
          data={filteredVisits}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>

      {/* Plan Visit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={planForm.handleSubmit(onPlanSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingVisit ? "Reschedule Call Plan" : "Plan Doctor Call"}</DialogTitle>
              <DialogDescription>
                Schedule future calls, assign representatives, and toggle senior joint ridealongs.
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
                <Label htmlFor="planDoctor">Doctor</Label>
                <UiSelect
                  value={watchPlanDoctor}
                  onValueChange={(val) => planForm.setValue("doctorId", val)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select doctor to visit" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} ({d.speciality} - {d.hospitalName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
                {planForm.formState.errors.doctorId && (
                  <p className="text-xs text-destructive">{planForm.formState.errors.doctorId.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="planVisitType">Visit Type</Label>
                <UiSelect
                  value={planForm.watch("visitTypeId")}
                  onValueChange={(val) => planForm.setValue("visitTypeId", val)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select visit configuration" />
                  </SelectTrigger>
                  <SelectContent>
                    {visitTypes.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watchPlanJoint}
                    onChange={(e) => planForm.setValue("jointVisit", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>Joint Ridealong Visit</span>
                </label>
              </div>

              {watchPlanJoint && (
                <div className="space-y-1.5">
                  <Label htmlFor="planSenior">Accompanying Senior Manager</Label>
                  <UiSelect
                    value={planForm.watch("jointEmployeeId")}
                    onValueChange={(val) => planForm.setValue("jointEmployeeId", val)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select accompanying senior..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees
                        .filter((e) => e.designationId !== "desig-mr")
                        .map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.name} ({e.code})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="planRemarks">Planning Remarks</Label>
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

      {/* Log Visit Report Dialog */}
      <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <form onSubmit={logForm.handleSubmit(onLogSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Log Call Report & Verification</DialogTitle>
              <DialogDescription>
                Submit the field visit details. This triggers geolocation check and locks discussion notes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-1 text-sm">
              {/* Geolocation visual check */}
              <div className="p-3 bg-muted rounded-md border flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-xs text-foreground uppercase">GPS Geolocation Auto-Capture</div>
                  <div className="text-xs text-muted-foreground">{logForm.watch("geoAddress")}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] uppercase font-bold text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20">
                      GPS Checked
                    </span>
                    <span className="text-[10px] text-muted-foreground nums-tabular">
                      Coordinates: {loggingVisit?.latitude || 21.1904}, {loggingVisit?.longitude || 81.2849}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="logSummary">Discussion Summary</Label>
                <textarea
                  id="logSummary"
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Summarize product detailing response, prescriber commits, and feedback..."
                  {...logForm.register("discussionSummary")}
                />
              </div>

              <div className="space-y-2">
                <Label>Brand Detailings (Select multiple discussed brands)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {brands.map((b) => {
                    const activeBrands = logForm.watch("productsDiscussion") || [];
                    const checked = activeBrands.includes(b);
                    return (
                      <label
                        key={b}
                        className={`flex items-center gap-2 border rounded p-2 cursor-pointer transition-colors text-xs ${
                          checked ? "bg-primary/10 border-primary font-semibold text-primary" : "bg-card"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const current = logForm.getValues("productsDiscussion") || [];
                            if (checked) {
                              logForm.setValue(
                                "productsDiscussion",
                                current.filter((x) => x !== b),
                              );
                            } else {
                              logForm.setValue("productsDiscussion", [...current, b]);
                            }
                          }}
                          className="sr-only"
                        />
                        <span>{b}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Sample Distributions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-1.5">
                  <Label>Sample Distributions</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => append({ product: brands[0], quantity: 1 })}
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Sample</span>
                  </Button>
                </div>

                {fields.length > 0 ? (
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <UiSelect
                          value={logForm.watch(`samplesDistributed.${index}.product`)}
                          onValueChange={(val) => logForm.setValue(`samplesDistributed.${index}.product`, val)}
                        >
                          <SelectTrigger className="flex-1 bg-background h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((b) => (
                              <SelectItem key={b} value={b} className="text-xs">
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </UiSelect>

                        <Input
                          type="number"
                          placeholder="Qty"
                          className="w-16 h-8 text-xs text-center"
                          {...logForm.register(`samplesDistributed.${index}.quantity`, { valueAsNumber: true })}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-muted-foreground border border-dashed rounded bg-muted/20">
                    No samples distributed. Click Add Sample if samples were handed over.
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="logRemarks">Call Remarks</Label>
                <Input id="logRemarks" placeholder="e.g. Next call planned after 15 days." {...logForm.register("remarks")} />
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

      {/* Delete Planner Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Planned Call</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scheduled visit plan? Representative calendar entries linked to this plan will be removed.
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

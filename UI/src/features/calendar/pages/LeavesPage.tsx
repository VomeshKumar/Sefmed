import * as React from "react";
import {
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  CalendarDays,
  User,
  ThumbsUp,
  ThumbsDown,
  Ban,
  FileText,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/data/DataTable";
import { FilterBar } from "@/components/data/FilterBar";
import { StatusBadge, type StatusTone } from "@/components/data/StatusBadge";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RequirePermission } from "@/lib/rbac/RequirePermission";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { toast } from "sonner";
import {
  useLeaveRequestsList,
  useCreateLeaveRequest,
  useApproveLeave,
  useRejectLeave,
  useCancelLeave,
  useLeaveBalancesForEmployee,
} from "../hooks";
import { createLeaveRequestSchema, type LeaveRequestFormValues } from "../schemas";
import type { LeaveRequest, LeaveStatus } from "../types";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useLeaveTypesList } from "@/features/master-data/leave-types/hooks";

const APPROVER_EMP_ID = "emp-004"; // Simulated current logged-in manager

function getLeaveStatusTone(status: LeaveStatus): StatusTone {
  switch (status) {
    case "approved": return "success";
    case "pending": return "warning";
    case "rejected": return "danger";
    case "cancelled":
    case "withdrawn": return "neutral";
    case "draft": return "info";
    default: return "neutral";
  }
}

function getLeaveStatusLabel(status: LeaveStatus): string {
  const map: Record<LeaveStatus, string> = {
    draft: "Draft",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Cancelled",
    withdrawn: "Withdrawn",
  };
  return map[status] ?? status;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDayTypeLabel(dt: string): string {
  if (dt === "half_first") return "Half Day (First Half)";
  if (dt === "half_second") return "Half Day (Second Half)";
  return "Full Day";
}

type ActiveTab = "all" | "pending" | "approved" | "rejected";

export function LeavesPage() {
  const currentYear = new Date().getFullYear();

  // ── Tab / Filter state ─────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("all");
  const [search, setSearch] = React.useState("");
  const [empFilter, setEmpFilter] = React.useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = React.useState("all");

  // ── Dialog / Sheet state ───────────────────────────────────────────────────
  const [isApplyOpen, setIsApplyOpen] = React.useState(false);
  const [detailLeave, setDetailLeave] = React.useState<LeaveRequest | null>(null);
  const [approveTarget, setApproveTarget] = React.useState<LeaveRequest | null>(null);
  const [rejectTarget, setRejectTarget] = React.useState<LeaveRequest | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");
  const [cancelTarget, setCancelTarget] = React.useState<LeaveRequest | null>(null);

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: employees = [] } = useEmployeesList({});
  const { data: leaveTypes = [] } = useLeaveTypesList({});
  const { data: leaveRequests = [], isLoading } = useLeaveRequestsList({
    employeeId: empFilter === "all" ? undefined : empFilter,
    leaveTypeId: leaveTypeFilter === "all" ? undefined : leaveTypeFilter,
    status: activeTab === "all" ? "all" : activeTab,
    year: currentYear,
    query: search,
  });

  // Balance for selected employee filter
  const { data: balances = [] } = useLeaveBalancesForEmployee(
    empFilter !== "all" ? empFilter : "",
    currentYear,
  );

  // ── Mutations ──────────────────────────────────────────────────────────────
  const createMutation = useCreateLeaveRequest();
  const approveMutation = useApproveLeave();
  const rejectMutation = useRejectLeave();
  const cancelMutation = useCancelLeave();

  // ── Form ───────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(createLeaveRequestSchema),
    defaultValues: {
      employeeId: "",
      leaveTypeId: "",
      fromDate: "",
      toDate: "",
      dayType: "full",
      reason: "",
    },
  });

  const watchEmployeeId = watch("employeeId");
  const watchLeaveTypeId = watch("leaveTypeId");
  const watchDayType = watch("dayType");
  const watchFrom = watch("fromDate");
  const watchTo = watch("toDate");

  const totalDaysPreview = React.useMemo(() => {
    if (!watchFrom || !watchTo) return null;
    const from = new Date(watchFrom);
    const to = new Date(watchTo);
    if (to < from) return null;
    const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return watchDayType === "full" ? diff : 0.5;
  }, [watchFrom, watchTo, watchDayType]);

  const selectedBalance = React.useMemo(() => {
    if (!watchEmployeeId || !watchLeaveTypeId || !empFilter) return null;
    return balances.find((b) => b.leaveTypeId === watchLeaveTypeId) ?? null;
  }, [balances, watchEmployeeId, watchLeaveTypeId, empFilter]);

  const employeeMap = React.useMemo(
    () => new Map(employees.map((e) => [e.id, e])),
    [employees],
  );
  const leaveTypeMap = React.useMemo(
    () => new Map(leaveTypes.map((l) => [l.id, l])),
    [leaveTypes],
  );

  const onApply = async (values: LeaveRequestFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      toast.success("Leave request submitted");
      setIsApplyOpen(false);
      reset();
    } catch {
      toast.error("Failed to submit leave request");
    }
  };

  const handleApprove = async () => {
    if (!approveTarget) return;
    try {
      await approveMutation.mutateAsync({ id: approveTarget.id, approverId: APPROVER_EMP_ID });
      toast.success("Leave approved");
      setApproveTarget(null);
    } catch {
      toast.error("Failed to approve leave");
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    try {
      await rejectMutation.mutateAsync({
        id: rejectTarget.id,
        approverId: APPROVER_EMP_ID,
        reason: rejectReason,
      });
      toast.success("Leave rejected");
      setRejectTarget(null);
      setRejectReason("");
    } catch {
      toast.error("Failed to reject leave");
    }
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancelMutation.mutateAsync(cancelTarget.id);
      toast.success("Leave cancelled");
      setCancelTarget(null);
    } catch {
      toast.error("Failed to cancel leave");
    }
  };

  // ── Summary Metrics ────────────────────────────────────────────────────────
  const metrics = React.useMemo(() => {
    const pending = leaveRequests.filter((l) => l.status === "pending").length;
    const approved = leaveRequests.filter((l) => l.status === "approved").length;
    const rejected = leaveRequests.filter((l) => l.status === "rejected").length;
    const totalDays = leaveRequests
      .filter((l) => l.status === "approved")
      .reduce((acc, l) => acc + l.totalDays, 0);
    return { pending, approved, rejected, totalDays };
  }, [leaveRequests]);

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns: Column<LeaveRequest>[] = [
    {
      accessorKey: "actions",
      header: "",
      cell: (item) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost" size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setDetailLeave(item)}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          {item.status === "pending" && (
            <RequirePermission permission={PERMISSIONS.LEAVE_APPROVE}>
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7 text-success hover:bg-success/10"
                onClick={() => setApproveTarget(item)}
                title="Approve"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost" size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => setRejectTarget(item)}
                title="Reject"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </Button>
            </RequirePermission>
          )}
          {(item.status === "pending" || item.status === "draft") && (
            <Button
              variant="ghost" size="icon"
              className="h-7 w-7 text-muted-foreground hover:bg-muted"
              onClick={() => setCancelTarget(item)}
              title="Cancel"
            >
              <Ban className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
    {
      accessorKey: "employeeId",
      header: "Employee",
      sortable: true,
      cell: (item) => {
        const emp = employeeMap.get(item.employeeId);
        return (
          <div>
            <div className="font-medium">{emp?.name ?? item.employeeId}</div>
            <div className="text-xs text-muted-foreground">{emp?.code}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "leaveTypeId",
      header: "Leave Type",
      cell: (item) => leaveTypeMap.get(item.leaveTypeId)?.name ?? "—",
    },
    {
      accessorKey: "fromDate",
      header: "From",
      sortable: true,
      cell: (item) => <span className="nums-tabular">{formatDate(item.fromDate)}</span>,
    },
    {
      accessorKey: "toDate",
      header: "To",
      cell: (item) => <span className="nums-tabular">{formatDate(item.toDate)}</span>,
    },
    {
      accessorKey: "totalDays",
      header: "Days",
      cell: (item) => (
        <span className="font-semibold nums-tabular">
          {item.totalDays}
          <span className="text-muted-foreground font-normal text-xs ml-1">d</span>
        </span>
      ),
    },
    {
      accessorKey: "dayType",
      header: "Type",
      cell: (item) => (
        <span className="text-xs text-muted-foreground">{getDayTypeLabel(item.dayType)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      sortable: true,
      cell: (item) => (
        <StatusBadge tone={getLeaveStatusTone(item.status)}>
          {getLeaveStatusLabel(item.status)}
        </StatusBadge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Applied On",
      cell: (item) => (
        <span className="text-xs text-muted-foreground nums-tabular">
          {new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
          })}
        </span>
      ),
    },
  ];

  // ── Approval Queue ─────────────────────────────────────────────────────────
  const pendingLeaves = leaveRequests.filter((l) => l.status === "pending");

  return (
    <>
      <PageHeader
        title="Leave Management"
        description="Manage leave requests, approval queue, and employee leave balances."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Calendar" },
          { label: "Leaves" },
        ]}
        actions={
          <RequirePermission permission={PERMISSIONS.LEAVE_VIEW}>
            <Button
              size="sm"
              className="gap-1.5 h-9"
              onClick={() => { reset(); setIsApplyOpen(true); }}
            >
              <Plus className="h-4 w-4" />
              Apply Leave
            </Button>
          </RequirePermission>
        }
      />

      {/* ── KPI Strip ── */}
      <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
        {[
          { label: "Pending", value: metrics.pending, tone: "text-warning", icon: <Clock className="h-4 w-4" /> },
          { label: "Approved", value: metrics.approved, tone: "text-success", icon: <CheckCircle2 className="h-4 w-4" /> },
          { label: "Rejected", value: metrics.rejected, tone: "text-danger", icon: <XCircle className="h-4 w-4" /> },
          { label: "Days Availed", value: metrics.totalDays, tone: "text-info", icon: <CalendarDays className="h-4 w-4" /> },
        ].map(({ label, value, tone, icon }) => (
          <div key={label} className="bg-card border rounded-lg p-3.5 shadow-sm">
            <div className={`flex items-center gap-1.5 ${tone} mb-1`}>
              {icon}
              <span className="text-xs font-medium uppercase text-muted-foreground">{label}</span>
            </div>
            <div className={`text-2xl font-bold nums-tabular ${tone}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Approval Queue Card (only when pending > 0) ── */}
      <RequirePermission permission={PERMISSIONS.LEAVE_APPROVE}>
        {pendingLeaves.length > 0 && (
          <div className="mb-5 bg-warning/5 border border-warning/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-warning" />
              <h3 className="font-semibold text-sm">
                Approval Queue — {pendingLeaves.length} Pending
              </h3>
            </div>
            <div className="space-y-2">
              {pendingLeaves.slice(0, 5).map((leave) => {
                const emp = employeeMap.get(leave.employeeId);
                const lt = leaveTypeMap.get(leave.leaveTypeId);
                return (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between bg-card rounded-lg px-3.5 py-2.5 border shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs shrink-0">
                        {emp?.name.charAt(0) ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{emp?.name ?? leave.employeeId}</div>
                        <div className="text-xs text-muted-foreground">
                          {lt?.name} · {formatDate(leave.fromDate)} – {formatDate(leave.toDate)} ({leave.totalDays}d)
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <Button
                        size="sm" variant="outline"
                        className="h-7 gap-1 text-xs text-success border-success/50 hover:bg-success/10"
                        onClick={() => setApproveTarget(leave)}
                      >
                        <ThumbsUp className="h-3 w-3" /> Approve
                      </Button>
                      <Button
                        size="sm" variant="outline"
                        className="h-7 gap-1 text-xs text-destructive border-destructive/50 hover:bg-destructive/10"
                        onClick={() => setRejectTarget(leave)}
                      >
                        <ThumbsDown className="h-3 w-3" /> Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </RequirePermission>

      {/* ── Status Tabs ── */}
      <div className="flex gap-1 mb-4 bg-muted/40 rounded-lg p-1 w-fit">
        {(["all", "pending", "approved", "rejected"] as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
              activeTab === tab
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Filters + Table ── */}
      <div className="space-y-4">
        <FilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search by employee or reason..."
          showClearButton={empFilter !== "all" || leaveTypeFilter !== "all" || !!search}
          onClearFilters={() => {
            setSearch("");
            setEmpFilter("all");
            setLeaveTypeFilter("all");
          }}
        >
          <UiSelect value={empFilter} onValueChange={setEmpFilter}>
            <SelectTrigger className="w-[180px] bg-background h-10">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </UiSelect>
          <UiSelect value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
            <SelectTrigger className="w-[150px] bg-background h-10">
              <SelectValue placeholder="Leave Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {leaveTypes.map((lt) => (
                <SelectItem key={lt.id} value={lt.id}>{lt.name}</SelectItem>
              ))}
            </SelectContent>
          </UiSelect>
        </FilterBar>

        <DataTable
          columns={columns}
          data={leaveRequests}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>

      {/* ── Apply Leave Dialog ── */}
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onApply)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
              <DialogDescription>
                Submit a leave request. It will be sent to your reporting manager for approval.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-1">
              {/* Employee */}
              <div className="space-y-1.5">
                <Label>Employee</Label>
                <UiSelect
                  value={watchEmployeeId}
                  onValueChange={(v) => {
                    setValue("employeeId", v);
                    setValue("leaveTypeId", "");
                  }}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.name} ({e.code})</SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
                {errors.employeeId && (
                  <p className="text-xs text-destructive">{errors.employeeId.message}</p>
                )}
              </div>

              {/* Leave Type */}
              <div className="space-y-1.5">
                <Label>Leave Type</Label>
                <UiSelect
                  value={watchLeaveTypeId}
                  onValueChange={(v) => setValue("leaveTypeId", v)}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((lt) => (
                      <SelectItem key={lt.id} value={lt.id}>{lt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
                {errors.leaveTypeId && (
                  <p className="text-xs text-destructive">{errors.leaveTypeId.message}</p>
                )}
              </div>

              {/* Balance Info */}
              {selectedBalance && (
                <div className="flex gap-3 text-xs bg-muted/40 rounded-lg p-2.5 border">
                  <div className="text-center">
                    <div className="text-muted-foreground">Allocated</div>
                    <div className="font-bold text-base">{selectedBalance.allocated}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Used</div>
                    <div className="font-bold text-base text-warning">{selectedBalance.used}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Remaining</div>
                    <div className="font-bold text-base text-success">{selectedBalance.remaining}</div>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>From Date</Label>
                  <Input type="date" {...register("fromDate")} />
                  {errors.fromDate && (
                    <p className="text-xs text-destructive">{errors.fromDate.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>To Date</Label>
                  <Input type="date" {...register("toDate")} />
                  {errors.toDate && (
                    <p className="text-xs text-destructive">{errors.toDate.message}</p>
                  )}
                </div>
              </div>

              {/* Day Type */}
              <div className="space-y-1.5">
                <Label>Day Type</Label>
                <UiSelect
                  value={watchDayType}
                  onValueChange={(v) => setValue("dayType", v as "full" | "half_first" | "half_second")}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Day</SelectItem>
                    <SelectItem value="half_first">Half Day — First Half</SelectItem>
                    <SelectItem value="half_second">Half Day — Second Half</SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>

              {/* Days Preview */}
              {totalDaysPreview !== null && (
                <div className="text-xs text-muted-foreground bg-muted/40 rounded px-3 py-2 border">
                  Calculated duration:{" "}
                  <span className="font-semibold text-foreground">
                    {totalDaysPreview} {totalDaysPreview === 1 ? "day" : "days"}
                  </span>
                </div>
              )}

              {/* Reason */}
              <div className="space-y-1.5">
                <Label>Reason</Label>
                <Textarea
                  placeholder="Briefly describe the reason for your leave..."
                  rows={3}
                  {...register("reason")}
                />
                {errors.reason && (
                  <p className="text-xs text-destructive">{errors.reason.message}</p>
                )}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsApplyOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Approve Confirmation ── */}
      <Dialog open={!!approveTarget} onOpenChange={() => setApproveTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Approve Leave
            </DialogTitle>
            <DialogDescription>
              Approving leave for{" "}
              <strong>{employeeMap.get(approveTarget?.employeeId ?? "")?.name}</strong> —{" "}
              {approveTarget ? formatDate(approveTarget.fromDate) : ""} to{" "}
              {approveTarget ? formatDate(approveTarget.toDate) : ""} ({approveTarget?.totalDays}d)
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveTarget(null)}>Cancel</Button>
            <Button
              className="bg-success hover:bg-success/90 text-success-foreground"
              onClick={handleApprove}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? "Approving..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Confirmation ── */}
      <Dialog open={!!rejectTarget} onOpenChange={() => { setRejectTarget(null); setRejectReason(""); }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Reject Leave Request
            </DialogTitle>
            <DialogDescription>
              Rejecting leave for{" "}
              <strong>{employeeMap.get(rejectTarget?.employeeId ?? "")?.name}</strong>.
              Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label className="mb-1.5 block">Rejection Reason</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Peak season, urgent project delivery..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectReason(""); }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectMutation.isPending || !rejectReason.trim()}
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject Leave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Cancel Confirmation ── */}
      <Dialog open={!!cancelTarget} onOpenChange={() => setCancelTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Cancel Leave Request</DialogTitle>
            <DialogDescription>
              This will cancel the leave request. The employee will need to reapply if needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelTarget(null)}>Back</Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Leave"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Detail Sheet ── */}
      <Sheet open={!!detailLeave} onOpenChange={() => setDetailLeave(null)}>
        <SheetContent className="w-[400px] sm:max-w-[440px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Leave Request Details
            </SheetTitle>
            <SheetDescription>Full information for this leave application.</SheetDescription>
          </SheetHeader>
          {detailLeave && (
            <div className="mt-6 space-y-4">
              <StatusBadge tone={getLeaveStatusTone(detailLeave.status)}>
                {getLeaveStatusLabel(detailLeave.status)}
              </StatusBadge>

              <div className="space-y-3 text-sm">
                <DetailRow
                  icon={<User className="h-4 w-4" />}
                  label="Employee"
                  value={employeeMap.get(detailLeave.employeeId)?.name ?? detailLeave.employeeId}
                />
                <DetailRow
                  icon={<FileText className="h-4 w-4" />}
                  label="Leave Type"
                  value={leaveTypeMap.get(detailLeave.leaveTypeId)?.name ?? "—"}
                />
                <DetailRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Duration"
                  value={`${formatDate(detailLeave.fromDate)} → ${formatDate(detailLeave.toDate)}`}
                />
                <DetailRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Total Days"
                  value={`${detailLeave.totalDays} day(s) — ${getDayTypeLabel(detailLeave.dayType)}`}
                />
                <div className="pt-2 border-t">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Reason</p>
                  <p className="text-sm">{detailLeave.reason}</p>
                </div>
                {detailLeave.rejectionReason && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1 text-destructive">Rejection Reason</p>
                    <p className="text-sm text-destructive">{detailLeave.rejectionReason}</p>
                  </div>
                )}
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  Applied:{" "}
                  {new Date(detailLeave.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

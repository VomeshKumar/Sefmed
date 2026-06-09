import * as React from "react";
import {
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Eye,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Receipt,
  User,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilterBar } from "@/components/data/FilterBar";
import { StatusBadge } from "@/components/data/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useExpensesList,
  useApproveExpense,
  useRejectExpense,
  useReturnExpense,
} from "../hooks";
import {
  getExpenseStatusTone,
  getExpenseStatusLabel,
} from "./ExpenseListPage";
import type { Expense } from "../types";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useExpenseHeadsList } from "@/features/master-data/expense-heads/hooks";

const APPROVER_ID = "emp-004";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function ExpenseApprovalPage() {
  const [search, setSearch] = React.useState("");
  const [empFilter, setEmpFilter] = React.useState("all");

  const [approveTarget, setApproveTarget] = React.useState<Expense | null>(null);
  const [rejectTarget, setRejectTarget] = React.useState<Expense | null>(null);
  const [returnTarget, setReturnTarget] = React.useState<Expense | null>(null);

  const [approvedAmtInput, setApprovedAmtInput] = React.useState("");
  const [isPartial, setIsPartial] = React.useState(false);
  const [actionRemarks, setActionRemarks] = React.useState("");

  const { data: employees = [] } = useEmployeesList({});
  const { data: allExpenses = [], isLoading } = useExpensesList({
    status: "pending_approval",
    query: search,
    employeeId: empFilter === "all" ? undefined : empFilter,
  });

  // Also grab submitted (not yet picked up) for the "inbox" view
  const { data: submittedExpenses = [] } = useExpensesList({
    status: "submitted",
    query: search,
    employeeId: empFilter === "all" ? undefined : empFilter,
  });

  const pendingAll = [...submittedExpenses, ...allExpenses];

  const approveMutation = useApproveExpense();
  const rejectMutation = useRejectExpense();
  const returnMutation = useReturnExpense();

  const employeeMap = React.useMemo(
    () => new Map(employees.map((e) => [e.id, e])),
    [employees],
  );

  React.useEffect(() => {
    if (approveTarget) setApprovedAmtInput(String(approveTarget.totalAmount));
  }, [approveTarget]);

  const metrics = React.useMemo(() => {
    const totalAmt = pendingAll.reduce((s, e) => s + e.totalAmount, 0);
    return { count: pendingAll.length, totalAmt };
  }, [pendingAll]);

  const handleApprove = async () => {
    if (!approveTarget) return;
    const amt = parseFloat(approvedAmtInput) || approveTarget.totalAmount;
    const action = isPartial || amt < approveTarget.totalAmount ? "partially_approved" : "approved";
    try {
      await approveMutation.mutateAsync({
        id: approveTarget.id,
        approverId: APPROVER_ID,
        approvedAmount: amt,
        remarks: actionRemarks,
        action,
      });
      toast.success(action === "approved" ? "Expense approved" : "Expense partially approved");
      setApproveTarget(null);
      setActionRemarks("");
    } catch { toast.error("Failed to approve"); }
  };

  const handleReject = async () => {
    if (!rejectTarget || !actionRemarks.trim()) { toast.error("Reason required"); return; }
    try {
      await rejectMutation.mutateAsync({ id: rejectTarget.id, approverId: APPROVER_ID, remarks: actionRemarks });
      toast.success("Expense rejected");
      setRejectTarget(null);
      setActionRemarks("");
    } catch { toast.error("Failed to reject"); }
  };

  const handleReturn = async () => {
    if (!returnTarget || !actionRemarks.trim()) { toast.error("Reason required"); return; }
    try {
      await returnMutation.mutateAsync({ id: returnTarget.id, approverId: APPROVER_ID, remarks: actionRemarks });
      toast.success("Expense returned for correction");
      setReturnTarget(null);
      setActionRemarks("");
    } catch { toast.error("Failed to return"); }
  };

  return (
    <>
      <PageHeader
        title="Expense Approval Queue"
        description="Review and action pending expense claims from your team."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Expense" },
          { label: "Approval Queue" },
        ]}
      />

      {/* ── Summary ── */}
      <div className="mb-5 grid grid-cols-2 gap-4 max-w-xs">
        <div className="bg-card border rounded-lg p-3.5 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1 text-warning">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium uppercase text-muted-foreground">Pending</span>
          </div>
          <div className="text-2xl font-bold nums-tabular text-warning">{metrics.count}</div>
        </div>
        <div className="bg-card border rounded-lg p-3.5 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1 text-primary">
            <IndianRupee className="h-4 w-4" />
            <span className="text-xs font-medium uppercase text-muted-foreground">Value</span>
          </div>
          <div className="text-2xl font-bold nums-tabular text-primary">{fmt(metrics.totalAmt)}</div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="mb-4">
        <FilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search expense code or description..."
          showClearButton={empFilter !== "all" || !!search}
          onClearFilters={() => { setSearch(""); setEmpFilter("all"); }}
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
        </FilterBar>
      </div>

      {/* ── Queue cards ── */}
      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">Loading...</div>
      ) : pendingAll.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <CheckCircle2 className="h-10 w-10 text-success opacity-60" />
          <p className="font-medium text-lg">All Clear!</p>
          <p className="text-sm text-muted-foreground">No pending expense claims in your queue.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingAll.map((expense) => {
            const emp = employeeMap.get(expense.employeeId);
            const [y, m] = expense.month.split("-");
            const monthLabel = new Date(Number(y), Number(m) - 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
            return (
              <div
                key={expense.id}
                className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 flex-wrap">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {emp?.name.charAt(0) ?? "?"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{emp?.name ?? expense.employeeId}</span>
                      <span className="text-xs text-muted-foreground">{emp?.code}</span>
                      <StatusBadge tone={getExpenseStatusTone(expense.status)}>
                        {getExpenseStatusLabel(expense.status)}
                      </StatusBadge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Receipt className="h-3 w-3" /> {expense.expenseCode}
                      </span>
                      <span>·</span>
                      <span>{monthLabel}</span>
                      <span>·</span>
                      <span>{expense.lineItems.length} item{expense.lineItems.length !== 1 ? "s" : ""}</span>
                      {expense.linkedVisitType && (
                        <>
                          <span>·</span>
                          <span className="capitalize">{expense.linkedVisitType} visit linked</span>
                        </>
                      )}
                    </div>
                    {expense.remarks && (
                      <p className="text-xs text-muted-foreground mt-1.5 truncate italic">{expense.remarks}</p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <div className="text-lg font-bold nums-tabular">{fmt(expense.totalAmount)}</div>
                    <div className="text-xs text-muted-foreground">claimed</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t flex-wrap">
                  <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" asChild>
                    <Link to="/expense/list/$id" params={{ id: expense.id }}>
                      <Eye className="h-3 w-3" /> View Details
                    </Link>
                  </Button>
                  <RequirePermission permission={PERMISSIONS.EXPENSE_APPROVE}>
                    <Button
                      size="sm"
                      className="h-7 gap-1.5 text-xs bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => setApproveTarget(expense)}
                    >
                      <ThumbsUp className="h-3 w-3" /> Approve
                    </Button>
                    <Button
                      size="sm" variant="outline"
                      className="h-7 gap-1.5 text-xs text-warning border-warning/50 hover:bg-warning/10"
                      onClick={() => { setReturnTarget(expense); setActionRemarks(""); }}
                    >
                      <RotateCcw className="h-3 w-3" /> Return
                    </Button>
                    <Button
                      size="sm" variant="outline"
                      className="h-7 gap-1.5 text-xs text-destructive border-destructive/50 hover:bg-destructive/10"
                      onClick={() => { setRejectTarget(expense); setActionRemarks(""); }}
                    >
                      <ThumbsDown className="h-3 w-3" /> Reject
                    </Button>
                  </RequirePermission>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Approve Dialog ── */}
      <Dialog open={!!approveTarget} onOpenChange={(o) => { if (!o) { setApproveTarget(null); setActionRemarks(""); } }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-success" /> Approve Expense
            </DialogTitle>
            <DialogDescription>
              Approving <strong>{approveTarget?.expenseCode}</strong> — {emp_name(approveTarget, employeeMap)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="text-sm">
              Claimed: <span className="font-bold">{fmt(approveTarget?.totalAmount ?? 0)}</span>
            </div>
            <div className="space-y-1.5">
              <Label>Approved Amount (₹)</Label>
              <Input
                type="number"
                value={approvedAmtInput}
                onChange={(e) => {
                  setApprovedAmtInput(e.target.value);
                  setIsPartial(parseFloat(e.target.value) < (approveTarget?.totalAmount ?? 0));
                }}
              />
              {isPartial && <p className="text-xs text-warning">Partial approval — amount is less than claimed.</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Remarks (optional)</Label>
              <Textarea rows={2} value={actionRemarks} onChange={(e) => setActionRemarks(e.target.value)} placeholder="Notes for the employee..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setApproveTarget(null); setActionRemarks(""); }}>Cancel</Button>
            <Button className="bg-success hover:bg-success/90 text-success-foreground" onClick={handleApprove} disabled={approveMutation.isPending}>
              {approveMutation.isPending ? "Approving..." : isPartial ? "Partially Approve" : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Dialog ── */}
      <Dialog open={!!rejectTarget} onOpenChange={(o) => { if (!o) { setRejectTarget(null); setActionRemarks(""); } }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ThumbsDown className="h-5 w-5 text-destructive" /> Reject Expense
            </DialogTitle>
            <DialogDescription>
              Rejecting <strong>{rejectTarget?.expenseCode}</strong> — {emp_name(rejectTarget, employeeMap)}. Provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-1.5">
            <Label>Rejection Reason *</Label>
            <Textarea rows={3} value={actionRemarks} onChange={(e) => setActionRemarks(e.target.value)} placeholder="e.g. Receipts missing, amount exceeds policy..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setActionRemarks(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejectMutation.isPending || !actionRemarks.trim()}>
              {rejectMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Return Dialog ── */}
      <Dialog open={!!returnTarget} onOpenChange={(o) => { if (!o) { setReturnTarget(null); setActionRemarks(""); } }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-warning" /> Return for Correction
            </DialogTitle>
            <DialogDescription>
              Return <strong>{returnTarget?.expenseCode}</strong> to the employee with instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-1.5">
            <Label>Correction Instructions *</Label>
            <Textarea rows={3} value={actionRemarks} onChange={(e) => setActionRemarks(e.target.value)} placeholder="e.g. Attach hotel receipts, correct the travel dates..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReturnTarget(null); setActionRemarks(""); }}>Cancel</Button>
            <Button className="bg-warning hover:bg-warning/90 text-warning-foreground" onClick={handleReturn} disabled={returnMutation.isPending || !actionRemarks.trim()}>
              {returnMutation.isPending ? "Returning..." : "Return to Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function emp_name(expense: Expense | null, map: Map<string, { name: string }>) {
  if (!expense) return "";
  return map.get(expense.employeeId)?.name ?? expense.employeeId;
}

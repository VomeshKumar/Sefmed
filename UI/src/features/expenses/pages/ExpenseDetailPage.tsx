import * as React from "react";
import {
  ArrowLeft,
  Send,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Ban,
  Receipt,
  User,
  CalendarDays,
  IndianRupee,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Paperclip,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/data/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useExpense,
  useSubmitExpense,
  useApproveExpense,
  useRejectExpense,
  useReturnExpense,
  useCancelExpense,
} from "../hooks";
import { getExpenseStatusTone, getExpenseStatusLabel } from "./ExpenseListPage";
import type { ApprovalEvent, ExpenseLineItem, ExpenseCategory } from "../types";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useExpenseHeadsList } from "@/features/master-data/expense-heads/hooks";

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  travel: "Travel (TA)",
  daily_allowance: "Daily Allowance (DA)",
  hotel: "Hotel / Lodging",
  food: "Food & Meals",
  local_conveyance: "Local Conveyance",
  miscellaneous: "Miscellaneous",
};

const APPROVER_ID = "emp-004"; // Simulated logged-in manager

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function ApprovalTimeline({ history, employeeMap }: {
  history: ApprovalEvent[];
  employeeMap: Map<string, { name: string; code: string }>;
}) {
  const actionIcon: Record<string, React.ReactNode> = {
    submitted: <Send className="h-3.5 w-3.5 text-primary" />,
    picked_up: <Clock className="h-3.5 w-3.5 text-info" />,
    approved: <CheckCircle2 className="h-3.5 w-3.5 text-success" />,
    partially_approved: <CheckCircle2 className="h-3.5 w-3.5 text-warning" />,
    rejected: <XCircle className="h-3.5 w-3.5 text-destructive" />,
    returned: <RotateCcw className="h-3.5 w-3.5 text-warning" />,
    resubmitted: <Send className="h-3.5 w-3.5 text-primary" />,
    cancelled: <Ban className="h-3.5 w-3.5 text-muted-foreground" />,
  };

  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">No approval history yet.</p>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-3.5 top-4 bottom-4 w-px bg-border" />
      <div className="space-y-3">
        {history.map((event, i) => {
          const actor = employeeMap.get(event.byEmployeeId);
          return (
            <div key={event.id} className="flex items-start gap-3 relative">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background border z-10 shadow-sm">
                {actionIcon[event.action] ?? <Clock className="h-3.5 w-3.5" />}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium capitalize">{event.action.replace("_", " ")}</span>
                  {event.approvalRole && (
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      {event.approvalRole}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {actor?.name ?? event.byEmployeeId} ·{" "}
                  {new Date(event.at).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </div>
                {event.remarks && (
                  <p className="text-xs mt-1 text-muted-foreground bg-muted/50 rounded px-2 py-1.5 border-l-2 border-muted-foreground/30">
                    {event.remarks}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LineItemRow({ item, headMap }: {
  item: ExpenseLineItem;
  headMap: Map<string, { name: string; code: string }>;
}) {
  const head = headMap.get(item.expenseHeadId);
  return (
    <tr className="border-b last:border-0 hover:bg-muted/10 transition-colors">
      <td className="px-4 py-3">
        <div className="font-medium text-sm">{head?.name ?? "—"}</div>
        <div className="text-xs text-muted-foreground">{CATEGORY_LABELS[item.category]}</div>
      </td>
      <td className="px-4 py-3 text-sm nums-tabular">
        {new Date(item.date + "T00:00:00").toLocaleDateString("en-IN", {
          day: "2-digit", month: "short",
        })}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {item.quantity && item.unit
          ? `${item.quantity} ${item.unit} @ ₹${item.rate ?? "—"}`
          : "—"}
      </td>
      <td className="px-4 py-3 text-sm">{item.description ?? "—"}</td>
      <td className="px-4 py-3 text-sm font-semibold nums-tabular text-right">{fmt(item.amount)}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground text-right">
        {item.attachments && item.attachments.length > 0 ? (
          <span className="flex items-center gap-1 justify-end">
            <Paperclip className="h-3 w-3" /> {item.attachments.length}
          </span>
        ) : "—"}
      </td>
    </tr>
  );
}

export function ExpenseDetailPage({ id }: { id: string }) {
  const { data: expense, isLoading } = useExpense(id);
  const { data: employees = [] } = useEmployeesList({});
  const { data: expenseHeads = [] } = useExpenseHeadsList({});

  const [approveOpen, setApproveOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [returnOpen, setReturnOpen] = React.useState(false);
  const [submitOpen, setSubmitOpen] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);

  const [approvedAmtInput, setApprovedAmtInput] = React.useState("");
  const [isPartial, setIsPartial] = React.useState(false);
  const [actionRemarks, setActionRemarks] = React.useState("");

  const submitMutation = useSubmitExpense();
  const approveMutation = useApproveExpense();
  const rejectMutation = useRejectExpense();
  const returnMutation = useReturnExpense();
  const cancelMutation = useCancelExpense();

  const employeeMap = React.useMemo(
    () => new Map(employees.map((e) => [e.id, { name: e.name, code: e.code }])),
    [employees],
  );
  const headMap = React.useMemo(
    () => new Map(expenseHeads.map((h) => [h.id, { name: h.name, code: h.code }])),
    [expenseHeads],
  );

  React.useEffect(() => {
    if (expense) setApprovedAmtInput(String(expense.totalAmount));
  }, [expense]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">Loading expense...</div>
    );
  }

  if (!expense) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-2">
        <p className="text-muted-foreground">Expense not found.</p>
        <Button variant="outline" asChild>
          <Link to="/expense/list"><ArrowLeft className="h-4 w-4 mr-1" /> Back to list</Link>
        </Button>
      </div>
    );
  }

  const emp = employeeMap.get(expense.employeeId);
  const canApprove = expense.status === "pending_approval" || expense.status === "submitted";
  const canSubmit = expense.status === "draft" || expense.status === "returned";
  const canCancel = expense.status === "draft" || expense.status === "submitted";

  const handleApprove = async () => {
    const amt = parseFloat(approvedAmtInput) || expense.totalAmount;
    const action = isPartial || amt < expense.totalAmount ? "partially_approved" : "approved";
    try {
      await approveMutation.mutateAsync({ id: expense.id, approverId: APPROVER_ID, approvedAmount: amt, remarks: actionRemarks, action });
      toast.success(action === "approved" ? "Expense approved" : "Expense partially approved");
      setApproveOpen(false);
    } catch { toast.error("Failed to approve"); }
  };

  const handleReject = async () => {
    if (!actionRemarks.trim()) { toast.error("Rejection reason is required"); return; }
    try {
      await rejectMutation.mutateAsync({ id: expense.id, approverId: APPROVER_ID, remarks: actionRemarks });
      toast.success("Expense rejected");
      setRejectOpen(false);
    } catch { toast.error("Failed to reject"); }
  };

  const handleReturn = async () => {
    if (!actionRemarks.trim()) { toast.error("Return reason is required"); return; }
    try {
      await returnMutation.mutateAsync({ id: expense.id, approverId: APPROVER_ID, remarks: actionRemarks });
      toast.success("Expense returned for correction");
      setReturnOpen(false);
    } catch { toast.error("Failed to return"); }
  };

  const handleSubmit = async () => {
    try {
      await submitMutation.mutateAsync({ id: expense.id, employeeId: expense.employeeId });
      toast.success("Expense submitted for approval");
      setSubmitOpen(false);
    } catch { toast.error("Failed to submit"); }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({ id: expense.id, employeeId: expense.employeeId });
      toast.success("Expense cancelled");
      setCancelOpen(false);
    } catch { toast.error("Failed to cancel"); }
  };

  return (
    <>
      <PageHeader
        title={expense.expenseCode}
        description="Expense claim detail — line items, amounts, and approval history."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Expense" },
          { label: "My Expenses", to: "/expense/list" },
          { label: expense.expenseCode },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {canSubmit && (
              <RequirePermission permission={PERMISSIONS.EXPENSE_CREATE}>
                <Button size="sm" className="h-8 gap-1.5" onClick={() => setSubmitOpen(true)}>
                  <Send className="h-3.5 w-3.5" /> Submit
                </Button>
              </RequirePermission>
            )}
            {canApprove && (
              <RequirePermission permission={PERMISSIONS.EXPENSE_APPROVE}>
                <Button size="sm" className="h-8 gap-1.5 bg-success hover:bg-success/90 text-success-foreground" onClick={() => setApproveOpen(true)}>
                  <ThumbsUp className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="h-8 gap-1.5 text-warning border-warning/50" onClick={() => setReturnOpen(true)}>
                  <RotateCcw className="h-3.5 w-3.5" /> Return
                </Button>
                <Button size="sm" variant="outline" className="h-8 gap-1.5 text-destructive border-destructive/50" onClick={() => setRejectOpen(true)}>
                  <ThumbsDown className="h-3.5 w-3.5" /> Reject
                </Button>
              </RequirePermission>
            )}
            {canCancel && (
              <Button size="sm" variant="outline" className="h-8 gap-1.5 text-muted-foreground" onClick={() => setCancelOpen(true)}>
                <Ban className="h-3.5 w-3.5" /> Cancel
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left column: meta + line items ── */}
        <div className="xl:col-span-2 space-y-5">
          {/* Meta card */}
          <div className="bg-card border rounded-xl shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <h2 className="font-bold text-lg">{expense.expenseCode}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> {emp?.name ?? expense.employeeId} ({emp?.code})
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {(() => {
                      const [y, m] = expense.month.split("-");
                      return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
                    })()}
                  </span>
                  {expense.linkedVisitType && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {expense.linkedVisitType === "doctor" ? "Doctor Visit" : "Firm Visit"}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <StatusBadge tone={getExpenseStatusTone(expense.status)}>
                {getExpenseStatusLabel(expense.status)}
              </StatusBadge>
            </div>

            {/* Amount summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t pt-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Total Claimed</p>
                <p className="text-xl font-bold nums-tabular mt-0.5">{fmt(expense.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Approved</p>
                <p className={`text-xl font-bold nums-tabular mt-0.5 ${expense.approvedAmount > 0 ? "text-success" : "text-muted-foreground"}`}>
                  {expense.approvedAmount > 0 ? fmt(expense.approvedAmount) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Items</p>
                <p className="text-xl font-bold nums-tabular mt-0.5">{expense.lineItems.length}</p>
              </div>
            </div>

            {expense.remarks && (
              <div className="mt-4 border-t pt-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Remarks: </span>{expense.remarks}
              </div>
            )}
          </div>

          {/* Line Items table */}
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b bg-muted/30 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Expense Line Items</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Head / Category</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Date</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Qty × Rate</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Description</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase text-muted-foreground">Amount</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase text-muted-foreground">Files</th>
                </tr>
              </thead>
              <tbody>
                {expense.lineItems.map((item) => (
                  <LineItemRow key={item.id} item={item} headMap={headMap} />
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t bg-muted/30">
                  <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-right">Total</td>
                  <td className="px-4 py-3 text-sm font-bold nums-tabular text-right">{fmt(expense.totalAmount)}</td>
                  <td />
                </tr>
                {expense.approvedAmount > 0 && (
                  <tr className="bg-success/5">
                    <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-right text-success">Approved Amount</td>
                    <td className="px-4 py-3 text-sm font-bold nums-tabular text-right text-success">{fmt(expense.approvedAmount)}</td>
                    <td />
                  </tr>
                )}
              </tfoot>
            </table>
          </div>
        </div>

        {/* ── Right column: approval timeline ── */}
        <div className="space-y-5">
          <div className="bg-card border rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Approval Timeline</h3>
            </div>
            <ApprovalTimeline
              history={expense.approvalHistory}
              employeeMap={employeeMap}
            />
          </div>

          {/* Metadata sidebar */}
          <div className="bg-card border rounded-xl shadow-sm p-5 space-y-3 text-sm">
            <h3 className="font-semibold text-sm mb-3">Details</h3>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(expense.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
            {expense.submittedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span>{new Date(expense.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
              </div>
            )}
            {expense.approvedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actioned</span>
                <span>{new Date(expense.approvedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Visit Link</span>
              <span>{expense.visitId ? (expense.linkedVisitType === "doctor" ? "Doctor Visit" : "Firm Visit") : "None"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Approve Dialog ── */}
      <Dialog open={approveOpen} onOpenChange={(o) => { setApproveOpen(o); if (!o) setActionRemarks(""); }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-success" /> Approve Expense
            </DialogTitle>
            <DialogDescription>
              Review and set the approved amount for <strong>{expense.expenseCode}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Claimed Amount</Label>
              <div className="font-bold text-lg nums-tabular">{fmt(expense.totalAmount)}</div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="approved-amt">Approved Amount (₹)</Label>
              <Input
                id="approved-amt"
                type="number"
                value={approvedAmtInput}
                onChange={(e) => {
                  setApprovedAmtInput(e.target.value);
                  setIsPartial(parseFloat(e.target.value) < expense.totalAmount);
                }}
              />
              {isPartial && (
                <p className="text-xs text-warning">Partial approval — amount is less than claimed.</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="approve-remarks">Remarks (optional)</Label>
              <Textarea id="approve-remarks" rows={2} value={actionRemarks} onChange={(e) => setActionRemarks(e.target.value)} placeholder="Any notes for the employee..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>Cancel</Button>
            <Button className="bg-success hover:bg-success/90 text-success-foreground" onClick={handleApprove} disabled={approveMutation.isPending}>
              {approveMutation.isPending ? "Approving..." : isPartial ? "Partially Approve" : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Dialog ── */}
      <Dialog open={rejectOpen} onOpenChange={(o) => { setRejectOpen(o); if (!o) setActionRemarks(""); }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ThumbsDown className="h-5 w-5 text-destructive" /> Reject Expense
            </DialogTitle>
            <DialogDescription>Provide a reason for rejecting <strong>{expense.expenseCode}</strong>.</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-1.5">
            <Label>Rejection Reason *</Label>
            <Textarea rows={3} value={actionRemarks} onChange={(e) => setActionRemarks(e.target.value)} placeholder="e.g. Receipts missing, amount exceeds policy cap..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejectMutation.isPending || !actionRemarks.trim()}>
              {rejectMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Return Dialog ── */}
      <Dialog open={returnOpen} onOpenChange={(o) => { setReturnOpen(o); if (!o) setActionRemarks(""); }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-warning" /> Return for Correction
            </DialogTitle>
            <DialogDescription>Specify what needs to be corrected in <strong>{expense.expenseCode}</strong>.</DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-1.5">
            <Label>Correction Required *</Label>
            <Textarea rows={3} value={actionRemarks} onChange={(e) => setActionRemarks(e.target.value)} placeholder="e.g. Please attach hotel receipts for hotel claim..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnOpen(false)}>Cancel</Button>
            <Button className="bg-warning hover:bg-warning/90 text-warning-foreground" onClick={handleReturn} disabled={returnMutation.isPending || !actionRemarks.trim()}>
              {returnMutation.isPending ? "Returning..." : "Return to Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Submit Dialog ── */}
      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Submit for Approval</DialogTitle>
            <DialogDescription>
              Submit <strong>{expense.expenseCode}</strong> ({fmt(expense.totalAmount)}) to your manager for approval?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
              {submitMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Cancel Dialog ── */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Cancel Expense</DialogTitle>
            <DialogDescription>Cancel <strong>{expense.expenseCode}</strong>?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Back</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

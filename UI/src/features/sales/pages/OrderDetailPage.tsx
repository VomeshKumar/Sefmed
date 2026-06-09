import * as React from "react";
import { ArrowLeft, ShoppingCart, User, CalendarDays, CheckCircle2, XCircle, Clock, AlertTriangle, ShieldCheck, Truck, PackageCheck, Ban } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/data/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  useOrder,
  useApproveOrder,
  useRejectOrder,
  useDispatchOrder,
  useDeliverOrder,
  useCancelOrder,
  useStockistsList,
  useProductsList,
} from "../hooks";
import { getOrderStatusTone, getOrderStatusLabel } from "./OrdersPage";
import { useEmployeesList } from "@/features/people/employees/hooks";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const APPROVER_ID = "emp-004"; // Simulated logged in manager

export function OrderDetailPage({ id }: { id: string }) {
  const { data: order, isLoading } = useOrder(id);
  const { data: stockists = [] } = useStockistsList({});
  const { data: products = [] } = useProductsList({});
  const { data: employees = [] } = useEmployeesList({});

  const [approveOpen, setApproveOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [actionRemarks, setActionRemarks] = React.useState("");

  const approveMutation = useApproveOrder();
  const rejectMutation = useRejectOrder();
  const dispatchMutation = useDispatchOrder();
  const deliverMutation = useDeliverOrder();
  const cancelMutation = useCancelOrder();

  const stockistMap = React.useMemo(() => new Map(stockists.map((s) => [s.id, s])), [stockists]);
  const productMap = React.useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const employeeMap = React.useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);

  if (isLoading) {
    return <div className="text-center text-muted-foreground py-12">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-muted-foreground">Order not found.</p>
        <Button variant="outline" asChild>
          <Link to="/sales/orders"><ArrowLeft className="h-4 w-4 mr-1" /> Orders List</Link>
        </Button>
      </div>
    );
  }

  const stockist = stockistMap.get(order.stockistId);
  const employee = order.employeeId ? employeeMap.get(order.employeeId) : null;

  const canApprove = ["submitted", "pending_approval"].includes(order.status);
  const canDispatch = order.status === "approved";
  const canDeliver = order.status === "dispatched";
  const canCancel = ["draft", "submitted", "pending_approval"].includes(order.status);

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({
        id: order.id,
        approverId: APPROVER_ID,
        remarks: actionRemarks || undefined,
      });
      toast.success(order.isCreditLimitExceeded ? "Order approved with credit override" : "Order approved");
      setApproveOpen(false);
      setActionRemarks("");
    } catch {
      toast.error("Failed to approve order");
    }
  };

  const handleReject = async () => {
    if (!actionRemarks.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    try {
      await rejectMutation.mutateAsync({
        id: order.id,
        approverId: APPROVER_ID,
        remarks: actionRemarks,
      });
      toast.success("Order rejected");
      setRejectOpen(false);
      setActionRemarks("");
    } catch {
      toast.error("Failed to reject order");
    }
  };

  const handleDispatch = async () => {
    try {
      await dispatchMutation.mutateAsync(order.id);
      toast.success("Order marked as dispatched");
    } catch {
      toast.error("Failed to dispatch order");
    }
  };

  const handleDeliver = async () => {
    try {
      await deliverMutation.mutateAsync(order.id);
      toast.success("Order marked as delivered. Invoice finalized and stockist outstanding incremented.");
    } catch {
      toast.error("Failed to deliver order");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(order.id);
      toast.success("Order cancelled");
      setCancelOpen(false);
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  return (
    <>
      <PageHeader
        title={order.orderNumber}
        description={`Sales order booked for ${stockist?.name ?? "Stockist"}`}
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Sales" },
          { label: "Orders", to: "/sales/orders" },
          { label: order.orderNumber },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {canApprove && (
              <RequirePermission permission={PERMISSIONS.SALES_MANAGE}>
                <Button size="sm" className="h-8 bg-success hover:bg-success/90 text-success-foreground gap-1.5" onClick={() => setApproveOpen(true)}>
                  <ShieldCheck className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/50 hover:bg-destructive/10 gap-1.5" onClick={() => setRejectOpen(true)}>
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
              </RequirePermission>
            )}

            {canDispatch && (
              <RequirePermission permission={PERMISSIONS.SALES_MANAGE}>
                <Button size="sm" className="h-8 gap-1.5" onClick={handleDispatch}>
                  <Truck className="h-3.5 w-3.5" /> Mark Dispatched
                </Button>
              </RequirePermission>
            )}

            {canDeliver && (
              <RequirePermission permission={PERMISSIONS.SALES_MANAGE}>
                <Button size="sm" className="h-8 bg-success hover:bg-success/90 text-success-foreground gap-1.5" onClick={handleDeliver}>
                  <PackageCheck className="h-3.5 w-3.5" /> Deliver & Invoice
                </Button>
              </RequirePermission>
            )}

            {canCancel && (
              <RequirePermission permission={PERMISSIONS.SALES_MANAGE}>
                <Button size="sm" variant="outline" className="h-8 text-muted-foreground gap-1.5" onClick={() => setCancelOpen(true)}>
                  <Ban className="h-3.5 w-3.5" /> Cancel Order
                </Button>
              </RequirePermission>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: items list */}
        <div className="xl:col-span-2 space-y-5">
          {/* Header summary */}
          <div className="bg-card border rounded-xl shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h2 className="font-bold text-lg">{order.orderNumber}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> {stockist?.name} ({stockist?.code})
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(order.orderDate + "T00:00:00").toLocaleDateString("en-IN", {
                      day: "2-digit", month: "long", year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <StatusBadge tone={getOrderStatusTone(order.status)}>
                {getOrderStatusLabel(order.status)}
              </StatusBadge>
            </div>

            {/* Credit Warning Bar */}
            {order.isCreditLimitExceeded && (
              <div className={`p-3.5 rounded-lg border text-sm flex flex-col gap-1 ${
                order.creditLimitOverrideApprovedBy ? "bg-success/5 border-success/20 text-success" : "bg-destructive/5 border-destructive/20 text-destructive"
              }`}>
                <div className="font-bold flex items-center gap-1.5 text-foreground">
                  <AlertTriangle className={`h-4 w-4 ${order.creditLimitOverrideApprovedBy ? "text-success" : "text-destructive"}`} />
                  Credit Limit Exception State
                </div>
                <p className="text-xs">
                  {order.creditLimitOverrideApprovedBy ? (
                    <span>
                      Override Approved. Approved by: <strong>{employeeMap.get(order.creditLimitOverrideApprovedBy)?.name ?? order.creditLimitOverrideApprovedBy}</strong>.
                    </span>
                  ) : (
                    <span>
                      Warning: Booked amount exceeds stockist credit limit. This order requires manager approval override.
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Stats block */}
            <div className="grid grid-cols-3 gap-4 border-t pt-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Subtotal</p>
                <p className="text-lg font-bold nums-tabular mt-0.5">{fmt(order.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Discounts</p>
                <p className="text-lg font-bold nums-tabular mt-0.5 text-success">-{fmt(order.discountAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Net Value</p>
                <p className="text-lg font-bold nums-tabular mt-0.5 text-primary">{fmt(order.netAmount)}</p>
              </div>
            </div>

            {order.remarks && (
              <div className="border-t pt-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Remarks: </span>
                {order.remarks}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b bg-muted/30 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Ordered SKUs</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Product</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase text-muted-foreground">PTS Rate</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase text-muted-foreground">Quantity</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const p = productMap.get(item.productId);
                  return (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/10">
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm">{p?.name ?? "Unknown SKU"}</div>
                        <div className="text-xs text-muted-foreground">{p?.code} · {p?.packSize}</div>
                      </td>
                      <td className="px-4 py-3 text-right nums-tabular text-sm">{fmt(item.rate)}</td>
                      <td className="px-4 py-3 text-right nums-tabular text-sm">{item.quantity}</td>
                      <td className="px-4 py-3 text-right nums-tabular text-sm font-semibold">{fmt(item.amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t bg-muted/30">
                  <td colSpan={3} className="px-4 py-2.5 text-right font-semibold text-sm">Subtotal</td>
                  <td className="px-4 py-2.5 text-right font-bold text-sm nums-tabular">{fmt(order.totalAmount)}</td>
                </tr>
                <tr className="bg-muted/10">
                  <td colSpan={3} className="px-4 py-2.5 text-right font-semibold text-sm text-success">Discount</td>
                  <td className="px-4 py-2.5 text-right font-bold text-sm text-success nums-tabular">-{fmt(order.discountAmount)}</td>
                </tr>
                <tr className="border-t bg-muted/40">
                  <td colSpan={3} className="px-4 py-3 text-right font-bold text-sm">Net Payable</td>
                  <td className="px-4 py-3 text-right font-bold text-base text-primary nums-tabular">{fmt(order.netAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right Column: metadata details */}
        <div className="space-y-5 text-sm">
          <div className="bg-card border rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-sm">Order Parameters</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date</span>
                <span>{new Date(order.orderDate + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created At</span>
                <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booked By</span>
                <span>{employee ? `${employee.name} (${employee.code})` : "Direct/Stockist"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <span className="capitalize font-semibold">{order.paymentStatus.replace("_", " ")}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-xl shadow-sm p-5 space-y-3">
            <h3 className="font-semibold text-sm">Stockist Account</h3>
            {stockist ? (
              <div className="space-y-2">
                <div className="font-semibold text-sm">{stockist.name}</div>
                <div className="text-xs text-muted-foreground">{stockist.address}, {stockist.city}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  <div>Credit Limit: <strong>{fmt(stockist.creditLimit)}</strong></div>
                  <div>Outstanding: <strong>{fmt(stockist.outstandingAmount)}</strong></div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No stockist loaded.</p>
            )}
          </div>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-success" /> Approve Order
            </DialogTitle>
            <DialogDescription>
              Confirm approval for <strong>{order.orderNumber}</strong>. 
              {order.isCreditLimitExceeded && (
                <span className="block mt-1.5 text-warning font-semibold">
                  Note: This will override the stockist's credit limit exception.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Remarks / Instructions (optional)</Label>
            <Textarea rows={2} value={actionRemarks} onChange={(e) => setActionRemarks(e.target.value)} placeholder="Add remarks for warehouse or representative..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>Cancel</Button>
            <Button className="bg-success hover:bg-success/90 text-success-foreground" onClick={handleApprove}>Approve Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" /> Reject Order
            </DialogTitle>
            <DialogDescription>Provide a rejection reason for order <strong>{order.orderNumber}</strong>.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Rejection Reason *</Label>
            <Textarea rows={3} value={actionRemarks} onChange={(e) => setActionRemarks(e.target.value)} placeholder="Specify reason..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!actionRemarks.trim()}>Reject Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>Cancel order <strong>{order.orderNumber}</strong>? This action cannot be reversed.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Back</Button>
            <Button variant="destructive" onClick={handleCancel}>Cancel Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

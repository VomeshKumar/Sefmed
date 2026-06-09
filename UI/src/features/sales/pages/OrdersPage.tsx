import * as React from "react";
import {
  Plus,
  Eye,
  Send,
  Ban,
  Trash2,
  Receipt,
  ShoppingCart,
  ShieldAlert,
  Download,
  Calendar,
  Layers,
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Settings
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/PageHeader";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RequirePermission } from "@/lib/rbac/RequirePermission";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { toast } from "sonner";
import {
  useOrdersList,
  useCreateOrder,
  useSubmitOrder,
  useCancelOrder,
  useDeleteOrder,
  useStockistsList,
  useProductsList,
  useDoctorOrdersList,
} from "../hooks";
import { orderSchema, type OrderFormValues } from "../schemas";
import type { Order, OrderStatus } from "../types";
import { useEmployeesList } from "@/features/people/employees/hooks";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function getOrderStatusTone(status: OrderStatus): StatusTone {
  switch (status) {
    case "draft": return "neutral";
    case "submitted": return "info";
    case "pending_approval": return "warning";
    case "approved": return "success";
    case "rejected": return "danger";
    case "dispatched": return "pending";
    case "delivered": return "success";
    case "cancelled": return "neutral";
    default: return "neutral";
  }
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    draft: "Draft",
    submitted: "Submitted",
    pending_approval: "Pending Approval",
    approved: "Approved",
    rejected: "Rejected",
    dispatched: "Dispatched",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return map[status] ?? status;
}

export function OrdersPage() {
  const [activeTab, setActiveTab] = React.useState<"primary" | "doctor">("primary");

  // Temporary filter selections
  const [tempZone, setTempZone] = React.useState("all");
  const [tempFirm, setTempFirm] = React.useState("all");
  const [tempCity, setTempCity] = React.useState("all");
  const [tempStatus, setTempStatus] = React.useState("all");
  const [tempMonth, setTempMonth] = React.useState("06"); // June
  const [tempYear, setTempYear] = React.useState("2026");
  const [tempEmployee, setTempEmployee] = React.useState("all");

  // Applied filter state (updated on GO click)
  const [appliedFilters, setAppliedFilters] = React.useState({
    zone: "all",
    firm: "all",
    city: "all",
    status: "all",
    month: "06",
    year: "2026",
    employee: "all",
  });

  // Modal dialog states
  const [isBookOpen, setIsBookOpen] = React.useState(false);
  const [confirmSubmit, setConfirmSubmit] = React.useState<Order | null>(null);
  const [confirmCancel, setConfirmCancel] = React.useState<Order | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<Order | null>(null);

  // Load Data hooks
  const { data: orders = [], isLoading: isPrimaryLoading, refetch: refetchOrders } = useOrdersList({});
  const { data: doctorOrders = [], isLoading: isDoctorLoading } = useDoctorOrdersList({});
  const { data: stockists = [] } = useStockistsList({});
  const { data: products = [] } = useProductsList({});
  const { data: employees = [] } = useEmployeesList({});

  const stockistMap = React.useMemo(() => new Map(stockists.map((s) => [s.id, s])), [stockists]);
  const productMap = React.useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const employeeMap = React.useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);

  // Mutations
  const createMutation = useCreateOrder();
  const submitMutation = useSubmitOrder();
  const cancelMutation = useCancelOrder();
  const deleteMutation = useDeleteOrder();

  // Populate dynamic dropdown list options from stockists & orders
  const uniqueZones = React.useMemo(() => {
    return Array.from(new Set(stockists.map((s) => s.zone).filter((x): x is string => !!x)));
  }, [stockists]);

  const uniqueCities = React.useMemo(() => {
    return Array.from(new Set(stockists.map((s) => s.city).filter((x): x is string => !!x)));
  }, [stockists]);

  const uniqueEmployees = React.useMemo(() => {
    return Array.from(new Set(employees.map((e) => e.name).filter(Boolean)));
  }, [employees]);

  const uniqueFirms = React.useMemo(() => {
    return stockists.map((s) => ({ id: s.id, name: s.name }));
  }, [stockists]);

  // Trigger search filters row application
  const handleApplyFilters = () => {
    setAppliedFilters({
      zone: tempZone,
      firm: tempFirm,
      city: tempCity,
      status: tempStatus,
      month: tempMonth,
      year: tempYear,
      employee: tempEmployee,
    });
    toast.success("Filters applied successfully");
  };

  // Perform filtering locally for Primary Sales Orders
  const filteredPrimaryOrders = React.useMemo(() => {
    return orders.filter((item) => {
      const stockist = stockistMap.get(item.stockistId);
      
      // Filter by Month and Year
      if (appliedFilters.month && appliedFilters.year) {
        const orderDateStr = item.orderDate; // YYYY-MM-DD
        const targetPrefix = `${appliedFilters.year}-${appliedFilters.month}`;
        if (!orderDateStr.startsWith(targetPrefix)) return false;
      }

      // Filter by Zone
      if (appliedFilters.zone !== "all" && stockist?.zone !== appliedFilters.zone) return false;

      // Filter by Firm Name
      if (appliedFilters.firm !== "all" && item.stockistId !== appliedFilters.firm) return false;

      // Filter by City
      if (appliedFilters.city !== "all" && stockist?.city !== appliedFilters.city) return false;

      // Filter by Status
      if (appliedFilters.status !== "all" && item.status !== appliedFilters.status) return false;

      // Filter by Employee Representative
      if (appliedFilters.employee !== "all" && item.employeeId) {
        const emp = employeeMap.get(item.employeeId);
        if (emp?.name !== appliedFilters.employee) return false;
      }

      return true;
    });
  }, [orders, appliedFilters, stockistMap, employeeMap]);

  // Perform filtering locally for Doctor Orders
  const filteredDoctorOrders = React.useMemo(() => {
    return doctorOrders.filter((item) => {
      // Filter by Month and Year
      if (appliedFilters.month && appliedFilters.year) {
        const orderDateStr = item.date; // YYYY-MM-DD
        const targetPrefix = `${appliedFilters.year}-${appliedFilters.month}`;
        if (!orderDateStr.startsWith(targetPrefix)) return false;
      }

      // Filter by Zone
      if (appliedFilters.zone !== "all" && item.zone !== appliedFilters.zone) return false;

      // Filter by Chemist/Firm Name
      if (appliedFilters.firm !== "all") {
        const selectedFirmName = uniqueFirms.find(f => f.id === appliedFilters.firm)?.name;
        if (selectedFirmName && item.chemistName !== selectedFirmName) return false;
      }

      // Filter by City
      if (appliedFilters.city !== "all" && item.city !== appliedFilters.city) return false;

      // Filter by Status
      if (appliedFilters.status !== "all") {
        // Status values: Pending, Completed, Cancelled
        const mappedStatus = appliedFilters.status === "active" ? "Completed" : "Pending";
        if (item.status !== mappedStatus) return false;
      }

      // Filter by Representative
      if (appliedFilters.employee !== "all" && item.representativeName !== appliedFilters.employee) return false;

      return true;
    });
  }, [doctorOrders, appliedFilters, uniqueFirms]);

  // Book Order form resolver setup
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      stockistId: "",
      employeeId: "",
      orderDate: new Date().toISOString().slice(0, 10),
      remarks: "",
      discountAmount: 0,
      items: [
        {
          productId: "",
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchStockistId = watch("stockistId");
  const watchItems = watch("items");
  const watchDiscount = watch("discountAmount") || 0;
  const watchEmpId = watch("employeeId");

  const subtotal = React.useMemo(() => {
    return watchItems?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  }, [watchItems]);

  const total = React.useMemo(() => {
    return Math.max(0, subtotal - watchDiscount);
  }, [subtotal, watchDiscount]);

  // Credit Limit Check
  const creditStatus = React.useMemo(() => {
    if (!watchStockistId) return null;
    const stockist = stockistMap.get(watchStockistId);
    if (!stockist) return null;

    const projectedOutstanding = (stockist.outstandingAmount || 0) + total;
    const limit = stockist.creditLimit || 0;
    const isExceeded = projectedOutstanding > limit;
    const variance = projectedOutstanding - limit;

    return {
      stockistName: stockist.name,
      creditLimit: limit,
      outstandingAmount: stockist.outstandingAmount || 0,
      isExceeded,
      variance,
    };
  }, [watchStockistId, total, stockistMap]);

  const onBookSubmit = async (values: OrderFormValues) => {
    try {
      await createMutation.mutateAsync({
        ...values,
        employeeId: values.employeeId || undefined,
        items: values.items.map((item) => ({
          ...item,
          id: `oi-${Math.random().toString(36).substring(2, 9)}`,
        })),
      } as Parameters<typeof createMutation.mutateAsync>[0]);

      toast.success("Order booked as draft");
      setIsBookOpen(false);
      reset();
      refetchOrders();
    } catch {
      toast.error("Failed to book sales order");
    }
  };

  const executeSubmit = async () => {
    if (!confirmSubmit) return;
    try {
      await submitMutation.mutateAsync(confirmSubmit.id);
      if (confirmSubmit.isCreditLimitExceeded) {
        toast.warning("Order submitted to manager for credit override review");
      } else {
        toast.success("Order submitted successfully");
      }
      setConfirmSubmit(null);
      refetchOrders();
    } catch {
      toast.error("Failed to submit order");
    }
  };

  const executeCancel = async () => {
    if (!confirmCancel) return;
    try {
      await cancelMutation.mutateAsync(confirmCancel.id);
      toast.success("Order cancelled");
      setConfirmCancel(null);
      refetchOrders();
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success("Draft order deleted");
      setConfirmDelete(null);
      refetchOrders();
    } catch {
      toast.error("Failed to delete order");
    }
  };

  // CSV Exporter for active tab records
  const handleExport = () => {
    if (activeTab === "primary") {
      if (filteredPrimaryOrders.length === 0) {
        toast.error("No data available to export");
        return;
      }
      const headers = ["Order No", "Firm Name", "Date", "Items Count", "Order Value", "Status"];
      const rows = filteredPrimaryOrders.map((o) => [
        o.orderNumber,
        stockistMap.get(o.stockistId)?.name || "Unknown",
        o.orderDate,
        o.items.length,
        o.netAmount,
        o.status,
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Primary_Orders_Export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      if (filteredDoctorOrders.length === 0) {
        toast.error("No data available to export");
        return;
      }
      const headers = ["Order No", "Doctor Name", "Firm (Chemist)", "Date", "Product Details", "Quantity", "Representative", "Status"];
      const rows = filteredDoctorOrders.map((d) => [
        d.orderNumber,
        d.doctorName,
        d.chemistName,
        d.date,
        d.productDetails,
        d.quantity,
        d.representativeName,
        d.status,
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Doctor_Orders_Export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast.success("CSV Export completed");
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Header with Page Title and Booking trigger */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Home</span>
            <span>/</span>
            <span>Sales</span>
            <span>/</span>
            <span className="text-foreground font-semibold">Orders</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        </div>

        <RequirePermission permission={PERMISSIONS.SALES_MANAGE}>
          <Button
            onClick={() => {
              reset();
              setIsBookOpen(true);
            }}
            className="bg-[#008272] hover:bg-[#006e60] text-white gap-1.5 h-9 font-semibold ml-auto"
          >
            <Plus className="h-4 w-4" /> Book Order
          </Button>
        </RequirePermission>
      </div>

      {/* Tabs Header exactly as screenshot */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "primary" | "doctor")}
        className="w-full"
      >
        <TabsList className="flex gap-6 border-b rounded-none bg-transparent p-0 mb-4 h-11 w-full justify-start">
          <TabsTrigger
            value="primary"
            className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-[#008272] data-[state=active]:text-[#008272] hover:text-[#008272] text-sm font-bold px-1 py-3 text-slate-600 transition-all shadow-none"
          >
            Order Details
          </TabsTrigger>
          <TabsTrigger
            value="doctor"
            className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-[#008272] data-[state=active]:text-[#008272] hover:text-[#008272] text-sm font-bold px-1 py-3 text-slate-600 transition-all shadow-none"
          >
            Doctors Order Details
          </TabsTrigger>
        </TabsList>

        {/* Double-row Filters Bar matching the snapshot */}
        <div className="bg-slate-50 border rounded-lg p-4 space-y-3 shadow-sm mb-6">
          {/* Row 1 Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Zone */}
            <UiSelect value={tempZone} onValueChange={setTempZone}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Zone</SelectItem>
                {uniqueZones.map((z) => (
                  <SelectItem key={z} value={z}>{z}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Firm Name */}
            <UiSelect value={tempFirm} onValueChange={setTempFirm}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select Firm Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Firm Name</SelectItem>
                {uniqueFirms.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* City */}
            <UiSelect value={tempCity} onValueChange={setTempCity}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select City</SelectItem>
                {uniqueCities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Status */}
            <UiSelect value={tempStatus} onValueChange={setTempStatus}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </UiSelect>

            {/* Month select */}
            <UiSelect value={tempMonth} onValueChange={setTempMonth}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { id: "01", label: "January" },
                  { id: "02", label: "February" },
                  { id: "03", label: "March" },
                  { id: "04", label: "April" },
                  { id: "05", label: "May" },
                  { id: "06", label: "June" },
                  { id: "07", label: "July" },
                  { id: "08", label: "August" },
                  { id: "09", label: "September" },
                  { id: "10", label: "October" },
                  { id: "11", label: "November" },
                  { id: "12", label: "December" }
                ].map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Year select */}
            <UiSelect value={tempYear} onValueChange={setTempYear}>
              <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {["2024", "2025", "2026", "2027", "2028"].map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Row 2 Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-60">
              <UiSelect value={tempEmployee} onValueChange={setTempEmployee}>
                <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select Employee</SelectItem>
                  {uniqueEmployees.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </UiSelect>
            </div>

            <Button
              onClick={handleApplyFilters}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-10 px-5 font-bold text-xs"
            >
              GO
            </Button>

            <Button
              onClick={handleExport}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-10 px-4 font-bold text-xs gap-1.5"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Tab 1 Content - Primary Sales Orders */}
        <TabsContent value="primary">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b">
                    <th className="py-3.5 px-4 border-r w-24 text-center">Actions</th>
                    <th className="py-3.5 px-4 border-r w-40">Order No</th>
                    <th className="py-3.5 px-4 border-r">Firm Name (Stockist)</th>
                    <th className="py-3.5 px-4 border-r w-36">Date</th>
                    <th className="py-3.5 px-4 border-r w-28 text-center">Items Count</th>
                    <th className="py-3.5 px-4 border-r w-36">Order Value</th>
                    <th className="py-3.5 px-4 w-44 text-center">Workflow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-600 text-xs">
                  {isPrimaryLoading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/50">
                        <div className="flex flex-col items-center gap-2 justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#008272] border-t-transparent" />
                          <span>Loading primary sales orders...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredPrimaryOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400 font-semibold bg-slate-50/50">
                        No orders matching the applied filters were found. Click GO after changing dropdowns.
                      </td>
                    </tr>
                  ) : (
                    filteredPrimaryOrders.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 border-b align-middle transition-colors">
                        <td className="py-2.5 px-4 border-r text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-[#008272] hover:bg-[#006e60] text-white h-7 px-2 font-medium flex items-center gap-1 text-[10px] rounded mx-auto"
                              >
                                <Settings className="h-3 w-3" />
                                <span>▼</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-32 bg-white border shadow-md rounded">
                              <DropdownMenuItem
                                asChild
                                className="cursor-pointer hover:bg-slate-100 flex items-center gap-1.5 py-1.5 px-2.5 text-xs text-slate-700"
                              >
                                <Link to="/sales/orders/$id" params={{ id: item.id }}>
                                  <Eye className="h-3.5 w-3.5 text-slate-500" /> View Details
                                </Link>
                              </DropdownMenuItem>

                              {item.status === "draft" && (
                                <RequirePermission permission={PERMISSIONS.SALES_MANAGE}>
                                  <DropdownMenuItem
                                    onClick={() => setConfirmSubmit(item)}
                                    className="cursor-pointer hover:bg-slate-100 flex items-center gap-1.5 py-1.5 px-2.5 text-xs text-[#008272]"
                                  >
                                    <Send className="h-3.5 w-3.5" /> Submit Order
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setConfirmDelete(item)}
                                    className="cursor-pointer hover:bg-red-50 flex items-center gap-1.5 py-1.5 px-2.5 text-xs text-red-600"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" /> Delete Draft
                                  </DropdownMenuItem>
                                </RequirePermission>
                              )}

                              {["submitted", "pending_approval", "approved", "dispatched"].includes(item.status) && (
                                <RequirePermission permission={PERMISSIONS.SALES_MANAGE}>
                                  <DropdownMenuItem
                                    onClick={() => setConfirmCancel(item)}
                                    className="cursor-pointer hover:bg-slate-100 flex items-center gap-1.5 py-1.5 px-2.5 text-xs text-slate-700"
                                  >
                                    <Ban className="h-3.5 w-3.5 text-slate-500" /> Cancel Order
                                  </DropdownMenuItem>
                                </RequirePermission>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>

                        <td className="py-2.5 px-4 border-r font-semibold text-slate-800">
                          <Link to="/sales/orders/$id" params={{ id: item.id }} className="hover:underline text-slate-900">
                            {item.orderNumber}
                          </Link>
                        </td>

                        <td className="py-2.5 px-4 border-r">
                          <div className="font-semibold text-slate-800">{stockistMap.get(item.stockistId)?.name || "Unknown"}</div>
                          <div className="text-[10px] text-slate-500">{stockistMap.get(item.stockistId)?.code}</div>
                        </td>

                        <td className="py-2.5 px-4 border-r text-slate-500 font-medium">
                          {new Date(item.orderDate + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>

                        <td className="py-2.5 px-4 border-r text-center font-medium text-slate-700">{item.items.length} sku(s)</td>

                        <td className="py-2.5 px-4 border-r">
                          <div className="font-bold text-slate-900">{fmt(item.netAmount)}</div>
                          {item.isCreditLimitExceeded && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-red-600 font-bold mt-0.5">
                              <ShieldAlert className="h-2 w-2" /> Limit Exceeded
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-4 text-center">
                          <StatusBadge tone={getOrderStatusTone(item.status)}>
                            {getOrderStatusLabel(item.status)}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2 Content - Doctors Prescription Orders */}
        <TabsContent value="doctor">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b">
                    <th className="py-3.5 px-4 border-r w-40">Order No</th>
                    <th className="py-3.5 px-4 border-r">Doctor Name</th>
                    <th className="py-3.5 px-4 border-r">Assigned Chemist</th>
                    <th className="py-3.5 px-4 border-r w-36">Date</th>
                    <th className="py-3.5 px-4 border-r">Product Details</th>
                    <th className="py-3.5 px-4 border-r w-24 text-center">Quantity</th>
                    <th className="py-3.5 px-4 border-r">Representative</th>
                    <th className="py-3.5 px-4 w-36 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-600 text-xs">
                  {isDoctorLoading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/50">
                        <div className="flex flex-col items-center gap-2 justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#008272] border-t-transparent" />
                          <span>Loading doctor orders...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredDoctorOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-400 font-semibold bg-slate-50/50">
                        No doctor prescription orders matching the applied filters were found. Click GO after changing dropdowns.
                      </td>
                    </tr>
                  ) : (
                    filteredDoctorOrders.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 border-b align-middle transition-colors">
                        <td className="py-2.5 px-4 border-r font-mono font-semibold text-slate-700">{item.orderNumber}</td>
                        <td className="py-2.5 px-4 border-r font-semibold text-slate-900">{item.doctorName}</td>
                        <td className="py-2.5 px-4 border-r font-medium text-slate-800">{item.chemistName}</td>
                        <td className="py-2.5 px-4 border-r text-slate-500 font-medium">
                          {new Date(item.date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="py-2.5 px-4 border-r text-slate-700">{item.productDetails}</td>
                        <td className="py-2.5 px-4 border-r text-center font-bold text-slate-800">{item.quantity}</td>
                        <td className="py-2.5 px-4 border-r text-slate-700 font-medium">{item.representativeName}</td>
                        <td className="py-2.5 px-4 text-center">
                          {item.status === "Completed" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Completed
                            </span>
                          ) : item.status === "Pending" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                              Cancelled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Booking Form Dialog */}
      <Dialog open={isBookOpen} onOpenChange={setIsBookOpen}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto bg-white p-6 rounded-lg shadow-xl border">
          <form onSubmit={handleSubmit(onBookSubmit)} className="space-y-4">
            <DialogHeader className="border-b pb-3">
              <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#008272]" /> Book Sales Order
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Place a primary sales order. Exceeding a stockist's credit limit will place the order in Pending Approval for override.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-1">
                  <Label className="text-xs font-semibold">Stockist *</Label>
                  <UiSelect value={watchStockistId} onValueChange={(v) => setValue("stockistId", v)}>
                    <SelectTrigger className="w-full bg-slate-50 text-xs h-9">
                      <SelectValue placeholder="Select Stockist" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockists
                        .filter((s) => s.status === "active")
                        .map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>
                        ))}
                    </SelectContent>
                  </UiSelect>
                  {errors.stockistId && <p className="text-[10px] text-destructive">{errors.stockistId.message}</p>}
                </div>
                <div className="space-y-1.5 col-span-1">
                  <Label className="text-xs font-semibold">Order Date *</Label>
                  <Input type="date" {...register("orderDate")} className="text-xs h-9 bg-slate-50" />
                  {errors.orderDate && <p className="text-[10px] text-destructive">{errors.orderDate.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-1">
                  <Label className="text-xs font-semibold">Booked By Representative</Label>
                  <UiSelect value={watchEmpId} onValueChange={(v) => setValue("employeeId", v)}>
                    <SelectTrigger className="w-full bg-slate-50 text-xs h-9">
                      <SelectValue placeholder="Select Representative" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.name} ({e.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Credit Status Warnings */}
              {creditStatus && (
                <div className={`p-3 rounded-lg border text-sm flex flex-col gap-1 ${
                  creditStatus.isExceeded ? "bg-red-50 border-red-200 text-red-800" : "bg-slate-50 border-slate-200 text-slate-600"
                }`}>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldAlert className={`h-4 w-4 ${creditStatus.isExceeded ? "text-red-600" : "text-slate-500"}`} />
                    Stockist Credit Status
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                    <div>Limit: <span className="font-semibold text-slate-800">{fmt(creditStatus.creditLimit)}</span></div>
                    <div>Outstanding: <span className="font-semibold text-slate-800">{fmt(creditStatus.outstandingAmount)}</span></div>
                  </div>
                  {creditStatus.isExceeded && (
                    <p className="text-[10px] font-bold mt-1 text-red-700">
                      ⚠️ Warning: Booking this order will exceed limit by {fmt(creditStatus.variance)}. Approval workflow required.
                    </p>
                  )}
                </div>
              )}

              {/* Order Items */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b pb-1.5">
                  <Label className="text-xs font-bold text-slate-700">Order Items</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs border-[#008272] text-[#008272] hover:bg-[#008272]/5 gap-1"
                    onClick={() => append({ productId: "", quantity: 1, rate: 0, amount: 0 })}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add SKU
                  </Button>
                </div>
                {errors.items?.root && <p className="text-xs text-destructive">{errors.items.root.message}</p>}

                <div className="space-y-2">
                  {fields.map((field, idx) => {
                    const selectedProd = watchItems?.[idx]?.productId;
                    return (
                      <div key={field.id} className="grid grid-cols-12 gap-2 items-end border p-2.5 rounded bg-slate-50/50">
                        <div className="col-span-6 space-y-1">
                          <Label className="text-[9px] uppercase font-bold text-slate-500">Product *</Label>
                          <UiSelect
                            value={selectedProd}
                            onValueChange={(v) => {
                              setValue(`items.${idx}.productId`, v);
                              const prod = productMap.get(v);
                              if (prod) {
                                setValue(`items.${idx}.rate`, prod.pts);
                                setValue(`items.${idx}.amount`, (watchItems?.[idx]?.quantity || 1) * prod.pts);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full bg-white h-8 text-xs">
                              <SelectValue placeholder="SKU" />
                            </SelectTrigger>
                            <SelectContent>
                              {products
                                .filter((p) => p.status === "active")
                                .map((p) => (
                                  <SelectItem key={p.id} value={p.id}>{p.name} ({p.packSize})</SelectItem>
                                ))}
                            </SelectContent>
                          </UiSelect>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-[9px] uppercase font-bold text-slate-500">Qty *</Label>
                          <Input
                            type="number"
                            className="h-8 text-xs bg-white"
                            placeholder="Qty"
                            {...register(`items.${idx}.quantity`, { valueAsNumber: true })}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value) || 0;
                              const rate = watchItems?.[idx]?.rate || 0;
                              setValue(`items.${idx}.amount`, qty * rate);
                            }}
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-[9px] uppercase font-bold text-slate-500">Rate (₹)</Label>
                          <Input
                            type="number"
                            className="h-8 text-xs bg-slate-100 text-slate-500"
                            disabled
                            {...register(`items.${idx}.rate`, { valueAsNumber: true })}
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-between pb-1">
                          <div className="text-xs font-bold text-right flex-1 pr-1.5 nums-tabular">
                            {fmt(watchItems?.[idx]?.amount || 0)}
                          </div>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:bg-red-50"
                              onClick={() => remove(idx)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Discounts & Totals */}
              <div className="grid grid-cols-2 gap-4 border-t pt-3 items-end">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Discount Amount (₹)</Label>
                  <Input type="number" {...register("discountAmount", { valueAsNumber: true })} className="h-9 text-xs bg-slate-50" />
                </div>
                <div className="text-right space-y-0.5">
                  <div className="text-xs text-slate-500">Subtotal: {fmt(subtotal)}</div>
                  <div className="text-sm font-bold text-[#008272]">Total Payable: {fmt(total)}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Remarks / Instructions</Label>
                <Textarea rows={2} placeholder="Write instructions..." {...register("remarks")} className="text-xs bg-slate-50" />
              </div>
            </div>

            <DialogFooter className="border-t pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsBookOpen(false)} className="h-9 text-xs font-bold">Cancel</Button>
              <Button type="submit" className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-5 text-xs font-bold">Save Draft Order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog open={!!confirmSubmit} onOpenChange={() => setConfirmSubmit(null)}>
        <DialogContent className="sm:max-w-[400px] bg-white p-6 rounded-lg shadow-xl border">
          <form onSubmit={(e) => { e.preventDefault(); executeSubmit(); }} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-800">Submit Sales Order</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Are you sure you want to submit order <strong>{confirmSubmit?.orderNumber}</strong> ({fmt(confirmSubmit?.netAmount ?? 0)})?
                {confirmSubmit?.isCreditLimitExceeded && (
                  <span className="block mt-2 font-bold text-red-600">
                    ⚠️ Alert: Credit limit exceeded. This will require manager override approval.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" onClick={() => setConfirmSubmit(null)} className="h-8 text-xs font-bold">Cancel</Button>
              <Button type="submit" className="bg-[#008272] hover:bg-[#006e60] text-white h-8 px-4 text-xs font-bold">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={!!confirmCancel} onOpenChange={() => setConfirmCancel(null)}>
        <DialogContent className="sm:max-w-[400px] bg-white p-6 rounded-lg shadow-xl border">
          <form onSubmit={(e) => { e.preventDefault(); executeCancel(); }} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-800">Cancel Order</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Cancel order <strong>{confirmCancel?.orderNumber}</strong>? This action is irreversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" onClick={() => setConfirmCancel(null)} className="h-8 text-xs font-bold">Back</Button>
              <Button type="submit" variant="destructive" className="h-8 px-4 text-xs font-bold">Cancel Order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-[400px] bg-white p-6 rounded-lg shadow-xl border">
          <form onSubmit={(e) => { e.preventDefault(); executeDelete(); }} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-800">Delete Draft</DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Permanently delete draft <strong>{confirmDelete?.orderNumber}</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-2 gap-2">
              <Button type="button" variant="outline" onClick={() => setConfirmDelete(null)} className="h-8 text-xs font-bold">Back</Button>
              <Button type="submit" variant="destructive" className="h-8 px-4 text-xs font-bold">Delete</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import * as React from "react";
import {
  Plus,
  Eye,
  Send,
  Ban,
  Trash2,
  Receipt,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/data/DataTable";
import { NoRecordFoundIllustration } from "@/components/data/NoRecordFoundIllustration";
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
import { RequirePermission } from "@/lib/rbac/RequirePermission";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { toast } from "sonner";
import {
  useExpensesList,
  useCreateExpense,
  useSubmitExpense,
  useCancelExpense,
  useDeleteExpense,
} from "../hooks";
import { createExpenseSchema, type CreateExpenseFormValues } from "../schemas";
import type { Expense, ExpenseStatus, ExpenseCategory } from "../types";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useExpenseHeadsList } from "@/features/master-data/expense-heads/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { useDesignationsList } from "@/features/master-data/designations/hooks";
import { cn } from "@/lib/utils";

// Format currency
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function getExpenseStatusTone(status: ExpenseStatus): StatusTone {
  switch (status) {
    case "approved": return "success";
    case "partially_approved": return "warning";
    case "pending_approval":
    case "submitted": return "pending";
    case "rejected": return "danger";
    case "returned": return "warning";
    case "draft": return "neutral";
    case "cancelled": return "neutral";
    default: return "neutral";
  }
}

export function getExpenseStatusLabel(status: ExpenseStatus): string {
  const map: Record<ExpenseStatus, string> = {
    draft: "Draft",
    submitted: "Submitted",
    pending_approval: "Pending Approval",
    approved: "Approved",
    partially_approved: "Partially Approved",
    rejected: "Rejected",
    returned: "Returned",
    cancelled: "Cancelled",
  };
  return map[status] ?? status;
}

export function ExpenseListPage() {
  // Filter Toolbar States
  const [selectedZone, setSelectedZone] = React.useState("");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [selectedDivision, setSelectedDivision] = React.useState("");
  const [selectedDesignation, setSelectedDesignation] = React.useState("");
  const [selectedEmployee, setSelectedEmployee] = React.useState("");
  const [hasSearched, setHasSearched] = React.useState(false);

  // Master data loads
  const { data: zones = [] } = useZonesList({ status: "active" });
  const { data: divisions = [] } = useDivisionsList();
  const { data: designations = [] } = useDesignationsList();
  const { data: employees = [] } = useEmployeesList({});
  const { data: expenses = [], isLoading } = useExpensesList({
    status: "all",
  });

  const employeeMap = React.useMemo(
    () => new Map(employees.map((e) => [e.id, e])),
    [employees],
  );

  // Filter logic on "Go" click
  const filteredExpenses = React.useMemo(() => {
    if (!hasSearched) return [];

    return expenses.filter((exp) => {
      const emp = employeeMap.get(exp.employeeId);

      // Zone filter (mock checking division/territory as fallback since zoneId isn't on Employee directly)
      if (selectedZone && selectedZone !== "all" && emp?.territoryId !== selectedZone) {
        // Simple fallback check
        if (selectedZone === "zone-north" && emp?.name.toLowerCase().includes("north")) {
          // fallback matched
        } else {
          return false;
        }
      }
      // Division filter
      if (selectedDivision && selectedDivision !== "all" && emp?.divisionId !== selectedDivision) return false;
      // Designation filter
      if (selectedDesignation && selectedDesignation !== "all" && emp?.designationId !== selectedDesignation) return false;
      // Employee filter
      if (selectedEmployee && selectedEmployee !== "all" && exp.employeeId !== selectedEmployee) return false;

      // Date Range filters
      if (fromDate) {
        const expDate = new Date(exp.createdAt).getTime();
        const limitDate = new Date(fromDate).getTime();
        if (expDate < limitDate) return false;
      }
      if (toDate) {
        const expDate = new Date(exp.createdAt).getTime();
        const limitDate = new Date(toDate).getTime();
        if (expDate > limitDate) return false;
      }

      return true;
    });
  }, [expenses, hasSearched, selectedZone, fromDate, toDate, selectedDivision, selectedDesignation, selectedEmployee, employeeMap]);

  // Handle Go Search click
  const handleGo = () => {
    setHasSearched(true);
    toast.success("Filters applied");
  };

  // Handle Export CSV
  const handleExport = () => {
    if (filteredExpenses.length === 0) {
      toast.error("No records found to export");
      return;
    }

    const headers = ["Expense Code", "Employee Name", "Month", "Items Count", "Total Amount", "Approved Amount", "Status", "Created At"];
    const csvRows = [headers.join(",")];

    filteredExpenses.forEach((exp) => {
      const emp = employeeMap.get(exp.employeeId);
      const row = [
        `"${exp.expenseCode}"`,
        `"${emp?.name || exp.employeeId}"`,
        `"${exp.month}"`,
        exp.lineItems.length,
        exp.totalAmount,
        exp.approvedAmount,
        `"${exp.status}"`,
        `"${new Date(exp.createdAt).toLocaleDateString("en-IN")}"`,
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "expenses_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV report exported successfully");
  };

  const columns: Column<Expense>[] = [
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" asChild>
            <Link to="/expense/list/$id" params={{ id: item.id }}>
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "expenseCode",
      header: "Code",
      sortable: true,
      cell: (item) => (
        <Link
          to="/expense/list/$id"
          params={{ id: item.id }}
          className="font-semibold tracking-wider text-[#008272] hover:underline"
        >
          {item.expenseCode}
        </Link>
      ),
    },
    {
      accessorKey: "employeeId",
      header: "Employee",
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
      accessorKey: "month",
      header: "Month",
      sortable: true,
      cell: (item) => {
        const [y, m] = item.month.split("-");
        return (
          <span className="nums-tabular text-sm">
            {new Date(Number(y), Number(m) - 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
          </span>
        );
      },
    },
    {
      accessorKey: "lineItems",
      header: "Items",
      cell: (item) => (
        <span className="text-sm text-muted-foreground">
          {item.lineItems.length} items
        </span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      sortable: true,
      cell: (item) => (
        <span className="font-semibold nums-tabular">{fmt(item.totalAmount)}</span>
      ),
    },
    {
      accessorKey: "approvedAmount",
      header: "Approved",
      cell: (item) => (
        <span
          className={`nums-tabular ${
            item.approvedAmount > 0 ? "font-semibold text-success" : "text-muted-foreground"
          }`}
        >
          {item.approvedAmount > 0 ? fmt(item.approvedAmount) : "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      sortable: true,
      cell: (item) => (
        <StatusBadge tone={getExpenseStatusTone(item.status)}>
          {getExpenseStatusLabel(item.status)}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      <div>
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">
          Expenses
        </h1>

        {/* Card Body */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 mb-6">
          
          {/* Filters Toolbar Row matching the screenshot */}
          <div className="flex flex-wrap gap-2.5 items-center pb-4 border-b border-slate-100 mb-4">
            
            {/* Zone Filter */}
            <UiSelect value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-36 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {zones.map((z) => (
                  <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* From Date picker */}
            <Input
              type="text"
              placeholder="From Date"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-32 bg-white border-slate-200 text-slate-500 text-xs h-9"
            />

            {/* To Date picker */}
            <Input
              type="text"
              placeholder="To Date"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-32 bg-white border-slate-200 text-slate-500 text-xs h-9"
            />

            {/* Division Filter */}
            <UiSelect value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger className="w-36 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Designation Filter */}
            <UiSelect value={selectedDesignation} onValueChange={setSelectedDesignation}>
              <SelectTrigger className="w-38 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="Select Designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designations</SelectItem>
                {designations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Employee Filter */}
            <UiSelect value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-38 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Go Button */}
            <Button
              onClick={handleGo}
              className="bg-[#008272] hover:bg-[#006e60] text-white px-3.5 h-9 font-semibold text-xs rounded transition-colors cursor-pointer"
            >
              Go
            </Button>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              className="bg-[#008272] hover:bg-[#006e60] text-white px-3.5 h-9 font-semibold text-xs rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="h-4.5 w-4.5" />
              Export
            </Button>
          </div>

          {/* Results Table / Illustration area */}
          {filteredExpenses.length === 0 ? (
            <NoRecordFoundIllustration />
          ) : (
            <DataTable
              columns={columns}
              data={filteredExpenses}
              isLoading={isLoading}
              getRowId={(item) => item.id}
            />
          )}

        </div>
      </div>

      {/* Sefmed Premium Footer */}
      <footer className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-semibold">
        <div>2026 &copy; Sefmed &amp; Powered by Cuztomise</div>
      </footer>
    </div>
  );
}

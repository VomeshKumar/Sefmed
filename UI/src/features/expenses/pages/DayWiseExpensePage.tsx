import * as React from "react";
import { FileSpreadsheet } from "lucide-react";
import { DataTable, type Column } from "@/components/data/DataTable";
import { StatusBadge, type StatusTone } from "@/components/data/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NoRecordFoundIllustration } from "@/components/data/NoRecordFoundIllustration";
import { toast } from "sonner";
import { useExpensesList } from "../hooks";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { useDesignationsList } from "@/features/master-data/designations/hooks";
import type { Expense, ExpenseLineItem, ExpenseStatus } from "../types";
import { getExpenseStatusTone, getExpenseStatusLabel } from "./ExpenseListPage";

// Format currency
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// Format date to DD/MM/YYYY
const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
};

export function DayWiseExpensePage() {
  // Filter states
  const [selectedZone, setSelectedZone] = React.useState("");
  const [selectedDivision, setSelectedDivision] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedDesignation, setSelectedDesignation] = React.useState("");
  const [selectedEmployee, setSelectedEmployee] = React.useState("all");
  const [hasSearched, setHasSearched] = React.useState(false);

  // Master data loads
  const { data: zones = [] } = useZonesList({ status: "active" });
  const { data: divisions = [] } = useDivisionsList();
  const { data: designations = [] } = useDesignationsList();
  const { data: employees = [] } = useEmployeesList({});
  const { data: expenses = [], isLoading } = useExpensesList({
    status: "all",
  });

  // Maps for efficient lookups
  const employeeMap = React.useMemo(
    () => new Map(employees.map((e) => [e.id, e])),
    [employees]
  );
  const zoneMap = React.useMemo(
    () => new Map(zones.map((z) => [z.id, z])),
    [zones]
  );
  const divisionMap = React.useMemo(
    () => new Map(divisions.map((d) => [d.id, d])),
    [divisions]
  );
  const designationMap = React.useMemo(
    () => new Map(designations.map((d) => [d.id, d])),
    [designations]
  );

  // Flatten expenses to single line items representing day-wise expense entries
  const dayWiseItems = React.useMemo(() => {
    if (!hasSearched) return [];

    const items: Array<
      ExpenseLineItem & {
        expenseCode: string;
        employeeId: string;
        status: ExpenseStatus;
        employeeName: string;
        employeeCode: string;
        zoneName: string;
        divisionName: string;
        designationName: string;
      }
    > = [];

    expenses.forEach((exp) => {
      const emp = employeeMap.get(exp.employeeId);
      if (!emp) return;

      // Apply Filters
      // Zone Filter
      if (selectedZone && selectedZone !== "all" && emp.territoryId !== selectedZone) {
        if (selectedZone === "zone-north" && emp.name.toLowerCase().includes("north")) {
          // matched north fallback
        } else {
          return;
        }
      }

      // Division Filter
      if (selectedDivision && selectedDivision !== "all" && emp.divisionId !== selectedDivision) {
        return;
      }

      // Designation Filter
      if (selectedDesignation && selectedDesignation !== "all" && emp.designationId !== selectedDesignation) {
        return;
      }

      // Employee Filter
      if (selectedEmployee && selectedEmployee !== "all" && exp.employeeId !== selectedEmployee) {
        return;
      }

      // Flat-map line items and filter by Date
      exp.lineItems.forEach((item) => {
        if (selectedDate && item.date !== selectedDate) {
          return;
        }

        const zone = emp.territoryId ? zoneMap.get(emp.territoryId) : null;
        const div = emp.divisionId ? divisionMap.get(emp.divisionId) : null;
        const des = emp.designationId ? designationMap.get(emp.designationId) : null;

        items.push({
          ...item,
          expenseCode: exp.expenseCode,
          employeeId: exp.employeeId,
          status: exp.status,
          employeeName: emp.name,
          employeeCode: emp.code || "",
          zoneName: zone ? zone.name : "N/A",
          divisionName: div ? div.name : "N/A",
          designationName: des ? des.name : "N/A",
        });
      });
    });

    return items;
  }, [
    expenses,
    hasSearched,
    selectedZone,
    selectedDivision,
    selectedDate,
    selectedDesignation,
    selectedEmployee,
    employeeMap,
    zoneMap,
    divisionMap,
    designationMap,
  ]);

  // Handle Go search click
  const handleGo = () => {
    setHasSearched(true);
    toast.success("Day wise filters applied");
  };

  // Handle CSV Export
  const handleExport = () => {
    if (dayWiseItems.length === 0) {
      toast.error("No records found to export");
      return;
    }

    const headers = [
      "Date",
      "Employee Name",
      "Employee Code",
      "Zone",
      "Division",
      "Designation",
      "Expense Head",
      "Description",
      "Amount",
      "Status",
    ];

    const csvRows = [headers.join(",")];

    dayWiseItems.forEach((item) => {
      const row = [
        `"${formatDate(item.date)}"`,
        `"${item.employeeName}"`,
        `"${item.employeeCode}"`,
        `"${item.zoneName}"`,
        `"${item.divisionName}"`,
        `"${item.designationName}"`,
        `"${item.category.replace("_", " ").toUpperCase()}"`,
        `"${(item.description || "").replace(/"/g, '""')}"`,
        item.amount,
        `"${getExpenseStatusLabel(item.status)}"`,
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `day_wise_expenses_${selectedDate || "report"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV report exported successfully");
  };

  const columns: Column<(typeof dayWiseItems)[0]>[] = [
    {
      accessorKey: "date",
      header: "Date",
      sortable: true,
      cell: (item) => <span className="nums-tabular text-sm">{formatDate(item.date)}</span>,
    },
    {
      accessorKey: "employeeName",
      header: "Employee",
      cell: (item) => (
        <div>
          <div className="font-medium">{item.employeeName}</div>
          <div className="text-xs text-muted-foreground">{item.employeeCode}</div>
        </div>
      ),
    },
    {
      accessorKey: "zoneName",
      header: "Zone",
    },
    {
      accessorKey: "divisionName",
      header: "Division",
    },
    {
      accessorKey: "designationName",
      header: "Designation",
    },
    {
      accessorKey: "category",
      header: "Expense Head",
      cell: (item) => (
        <span className="capitalize text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
          {item.category.replace("_", " ")}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (item) => (
        <span className="text-xs text-slate-500 max-w-[200px] truncate block" title={item.description}>
          {item.description || "—"}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      sortable: true,
      cell: (item) => <span className="font-semibold nums-tabular">{fmt(item.amount)}</span>,
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
          Day wise expense
        </h1>

        {/* Card Container */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 mb-6">
          {/* Filters Toolbar Row */}
          <div className="flex flex-wrap gap-2.5 items-center pb-4 border-b border-slate-100 mb-4">
            {/* Zone Selector */}
            <UiSelect value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-36 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {zones.map((z) => (
                  <SelectItem key={z.id} value={z.id}>
                    {z.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Division Selector */}
            <UiSelect value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger className="w-36 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Date Selector */}
            <Input
              type="text"
              placeholder="Select Date"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-34 bg-white border-slate-200 text-slate-500 text-xs h-9"
            />

            {/* Designation Selector */}
            <UiSelect value={selectedDesignation} onValueChange={setSelectedDesignation}>
              <SelectTrigger className="w-38 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="Select Designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designations</SelectItem>
                {designations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Employee Selector (Defaults to All Employee initially) */}
            <UiSelect value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-38 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="All Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employee</SelectItem>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
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
          {!hasSearched || dayWiseItems.length === 0 ? (
            <NoRecordFoundIllustration />
          ) : (
            <DataTable
              columns={columns}
              data={dayWiseItems}
              isLoading={isLoading}
              getRowId={(item) => `${item.expenseId}-${item.id}`}
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

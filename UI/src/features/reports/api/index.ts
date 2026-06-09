import { mockSavedReports } from "../fixtures";
import type { SavedReport, ReportDefinition, GeneratedReport, ReportFilter, ReportSort, ReportModule } from "../types";
import { logAuditEvent, getStoredOrders, getStoredTargets, getStoredSecondarySales, getStoredStockists } from "@/features/sales/api/index";
import { doctorsApi } from "@/features/people/doctors/api/index";
import { mockEmployees } from "@/features/people/employees/fixtures";
import { visitsApi } from "@/features/visits/api/index";
import { leaveRequestsApi } from "@/features/calendar/api/index";
import { expensesApi } from "@/features/expenses/api/index";

const SAVED_REPORTS_KEY = "sefmed_saved_reports";
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const getSavedReports = (): SavedReport[] => {
  if (typeof window === "undefined") return mockSavedReports;
  const stored = localStorage.getItem(SAVED_REPORTS_KEY);
  if (!stored) {
    localStorage.setItem(SAVED_REPORTS_KEY, JSON.stringify(mockSavedReports));
    return mockSavedReports;
  }
  return JSON.parse(stored);
};

export const saveSavedReports = (data: SavedReport[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(SAVED_REPORTS_KEY, JSON.stringify(data));
  }
};

const matchFilter = (row: any, filter: ReportFilter): boolean => {
  const fieldVal = row[filter.fieldName];
  const filterVal = filter.value;

  if (fieldVal === undefined || fieldVal === null) return false;

  switch (filter.operator) {
    case "equals":
      return String(fieldVal).toLowerCase() === String(filterVal).toLowerCase();
    case "contains":
      return String(fieldVal).toLowerCase().includes(String(filterVal).toLowerCase());
    case "gt":
      return Number(fieldVal) > Number(filterVal);
    case "lt":
      return Number(fieldVal) < Number(filterVal);
    case "between": {
      const parts = filterVal.split(",");
      const minVal = parts[0]?.trim();
      const maxVal = parts[1]?.trim();
      if (!minVal || !maxVal) return true;
      if (!isNaN(Number(fieldVal)) && !isNaN(Number(minVal)) && !isNaN(Number(maxVal))) {
        return Number(fieldVal) >= Number(minVal) && Number(fieldVal) <= Number(maxVal);
      } else {
        return String(fieldVal) >= minVal && String(fieldVal) <= maxVal;
      }
    }
    case "in": {
      const items = filterVal.split(",").map((i) => i.trim().toLowerCase());
      return items.includes(String(fieldVal).toLowerCase());
    }
    default:
      return true;
  }
};

export const reportsApi = {
  listSavedReports: async (): Promise<SavedReport[]> => {
    await delay(100);
    return getSavedReports();
  },

  getSavedReportById: async (id: string): Promise<SavedReport | null> => {
    await delay(100);
    return getSavedReports().find((r) => r.id === id) ?? null;
  },

  createSavedReport: async (definition: Omit<ReportDefinition, "id" | "createdAt" | "updatedAt">): Promise<SavedReport> => {
    await delay(200);
    const reports = getSavedReports();
    const newDef: ReportDefinition = {
      ...definition,
      id: `def-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newSaved: SavedReport = {
      id: `rep-${Math.random().toString(36).substring(2, 9)}`,
      name: definition.name,
      reportDefinition: newDef,
      createdBy: definition.createdByEmployeeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reports.push(newSaved);
    saveSavedReports(reports);
    logAuditEvent("report.saved", `Custom report "${newSaved.name}" saved`, newSaved.id, definition.createdByEmployeeId);
    return newSaved;
  },

  deleteSavedReport: async (id: string, userId = "emp-004"): Promise<void> => {
    await delay(150);
    const reports = getSavedReports();
    const reportToDelete = reports.find((r) => r.id === id);
    if (reportToDelete) {
      saveSavedReports(reports.filter((r) => r.id !== id));
      logAuditEvent("report.deleted", `Custom report "${reportToDelete.name}" deleted`, id, userId);
    }
  },

  generateReport: async (definition: ReportDefinition): Promise<GeneratedReport> => {
    await delay(250);
    let rawRows: Record<string, any>[] = [];

    // Fetch datasets based on module selection
    switch (definition.module) {
      case "employees":
        rawRows = mockEmployees;
        break;
      case "doctors":
        rawRows = await doctorsApi.list();
        break;
      case "visits": {
        const dVis = await visitsApi.listDoctorVisits();
        const fVis = await visitsApi.listFirmVisits();
        rawRows = [
          ...dVis.map((v) => ({ ...v, visitorType: "doctor" })),
          ...fVis.map((v) => ({ ...v, visitorType: "firm" })),
        ];
        break;
      }
      case "leaves":
        rawRows = await leaveRequestsApi.list();
        break;
      case "expenses":
        rawRows = await expensesApi.list();
        break;
      case "orders":
        rawRows = getStoredOrders();
        break;
      case "targets":
        rawRows = getStoredTargets();
        break;
      case "stockists":
        rawRows = getStoredStockists();
        break;
      case "secondary_sales":
        rawRows = getStoredSecondarySales();
        break;
      default:
        rawRows = [];
    }

    // Apply Filter constraints
    let filtered = rawRows;
    if (definition.filters && definition.filters.length > 0) {
      filtered = rawRows.filter((row) =>
        definition.filters.every((filter) => matchFilter(row, filter))
      );
    }

    // Apply Sorting logic
    if (definition.sorts && definition.sorts.length > 0) {
      const sort = definition.sorts[0];
      filtered.sort((a, b) => {
        const aVal = a[sort.fieldName];
        const bVal = b[sort.fieldName];
        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sort.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    // Return the generated result
    logAuditEvent(
      "report.generated",
      `Custom report generated for module: ${definition.module}. Count: ${filtered.length}`,
      definition.id || "temp-def",
      definition.createdByEmployeeId
    );

    return {
      definitionId: definition.id,
      module: definition.module,
      headers: definition.columns.sort((a, b) => a.sequenceOrder - b.sequenceOrder),
      rows: filtered,
      rowCount: filtered.length,
      generatedAt: new Date().toISOString(),
    };
  },
};

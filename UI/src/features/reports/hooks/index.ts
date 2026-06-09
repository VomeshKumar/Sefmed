import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "../api/index";
import { salesReportAdapters } from "../api/adapters/salesReportAdapters";
import { visitReportAdapters } from "../api/adapters/visitReportAdapters";
import { expenseReportAdapters } from "../api/adapters/expenseReportAdapters";
import { leaveReportAdapters } from "../api/adapters/leaveReportAdapters";
import { employeeReportAdapters } from "../api/adapters/employeeReportAdapters";
import type { ReportDefinition } from "../types";

export function useSavedReportsList() {
  return useQuery({
    queryKey: ["reports", "saved-list"],
    queryFn: () => reportsApi.listSavedReports(),
  });
}

export function useSavedReport(id: string) {
  return useQuery({
    queryKey: ["reports", "saved", id],
    queryFn: () => reportsApi.getSavedReportById(id),
    enabled: !!id,
  });
}

export function useCreateSavedReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (definition: Omit<ReportDefinition, "id" | "createdAt" | "updatedAt">) =>
      reportsApi.createSavedReport(definition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", "saved-list"] });
    },
  });
}

export function useDeleteSavedReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId?: string }) =>
      reportsApi.deleteSavedReport(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", "saved-list"] });
    },
  });
}

export function useGenerateReport(definition: ReportDefinition | null, enabled = true) {
  return useQuery({
    queryKey: ["reports", "generate", definition ? JSON.stringify(definition) : "empty"],
    queryFn: () => {
      if (!definition) throw new Error("No definition provided");
      return reportsApi.generateReport(definition);
    },
    enabled: enabled && !!definition,
  });
}

// ─── Sales Reports Hooks ────────────────────────────────────────────────────────
export function usePrimarySalesReport(filters?: { month?: string; stockistId?: string }) {
  return useQuery({
    queryKey: ["reports", "sales", "primary", filters?.month, filters?.stockistId],
    queryFn: () => salesReportAdapters.getPrimarySalesReport(filters),
  });
}

export function useSecondarySalesReport(filters?: { month?: string; stockistId?: string }) {
  return useQuery({
    queryKey: ["reports", "sales", "secondary", filters?.month, filters?.stockistId],
    queryFn: () => salesReportAdapters.getSecondarySalesReport(filters),
  });
}

export function useTargetAchievementReport(filters?: { month?: string; employeeId?: string }) {
  return useQuery({
    queryKey: ["reports", "sales", "targets", filters?.month, filters?.employeeId],
    queryFn: () => salesReportAdapters.getTargetAchievementReport(filters),
  });
}

export function useProductPerformanceReport(filters?: { month?: string }) {
  return useQuery({
    queryKey: ["reports", "sales", "products", filters?.month],
    queryFn: () => salesReportAdapters.getProductPerformanceReport(filters),
  });
}

export function useStockistPerformanceReport(filters?: { territoryId?: string }) {
  return useQuery({
    queryKey: ["reports", "sales", "stockists", filters?.territoryId],
    queryFn: () => salesReportAdapters.getStockistPerformanceReport(filters),
  });
}

export function useTerritoryPerformanceReport(filters?: { month?: string }) {
  return useQuery({
    queryKey: ["reports", "sales", "territory-rollups", filters?.month],
    queryFn: () => salesReportAdapters.getTerritoryPerformanceReport(filters),
  });
}

export function useZonePerformanceReport(filters?: { month?: string }) {
  return useQuery({
    queryKey: ["reports", "sales", "zone-rollups", filters?.month],
    queryFn: () => salesReportAdapters.getZonePerformanceReport(filters),
  });
}

export function useDivisionPerformanceReport(filters?: { month?: string }) {
  return useQuery({
    queryKey: ["reports", "sales", "division-rollups", filters?.month],
    queryFn: () => salesReportAdapters.getDivisionPerformanceReport(filters),
  });
}

// ─── Visit Reports Hooks ────────────────────────────────────────────────────────
export function useDoctorVisitSummary(filters?: { status?: string }) {
  return useQuery({
    queryKey: ["reports", "visits", "doctor", filters?.status],
    queryFn: () => visitReportAdapters.getDoctorVisitSummary(filters),
  });
}

export function useFirmVisitSummary(filters?: { status?: string }) {
  return useQuery({
    queryKey: ["reports", "visits", "firm", filters?.status],
    queryFn: () => visitReportAdapters.getFirmVisitSummary(filters),
  });
}

export function useVisitProductivityReport(filters?: { employeeId?: string }) {
  return useQuery({
    queryKey: ["reports", "visits", "productivity", filters?.employeeId],
    queryFn: () => visitReportAdapters.getVisitProductivityReport(filters),
  });
}

export function useGeoVerificationReport() {
  return useQuery({
    queryKey: ["reports", "visits", "geo-verification"],
    queryFn: () => visitReportAdapters.getGeoVerificationReport(),
  });
}

export function useVisitStatusAnalysisReport() {
  return useQuery({
    queryKey: ["reports", "visits", "status-analysis"],
    queryFn: () => visitReportAdapters.getVisitStatusAnalysisReport(),
  });
}

// ─── Expense Reports Hooks ──────────────────────────────────────────────────────
export function useExpenseSummaryReport(filters?: { month?: string }) {
  return useQuery({
    queryKey: ["reports", "expenses", "summary", filters?.month],
    queryFn: () => expenseReportAdapters.getExpenseSummary(filters),
  });
}

export function useEmployeeExpenseReport(filters?: { month?: string }) {
  return useQuery({
    queryKey: ["reports", "expenses", "employees", filters?.month],
    queryFn: () => expenseReportAdapters.getEmployeeExpenseReport(filters),
  });
}

export function useExpenseHeadAnalysis(filters?: { month?: string }) {
  return useQuery({
    queryKey: ["reports", "expenses", "heads", filters?.month],
    queryFn: () => expenseReportAdapters.getExpenseHeadAnalysis(filters),
  });
}

export function useTravelExpenseAnalysis(filters?: { month?: string }) {
  return useQuery({
    queryKey: ["reports", "expenses", "travel", filters?.month],
    queryFn: () => expenseReportAdapters.getTravelExpenseAnalysis(filters),
  });
}

export function useSFCVarianceReport(filters?: { month?: string }) {
  return useQuery({
    queryKey: ["reports", "expenses", "sfc-variance", filters?.month],
    queryFn: () => expenseReportAdapters.getSFCVarianceReport(filters),
  });
}

// ─── Leave Reports Hooks ────────────────────────────────────────────────────────
export function useLeaveBalanceReport(filters?: { year?: number }) {
  return useQuery({
    queryKey: ["reports", "leaves", "balances", filters?.year],
    queryFn: () => leaveReportAdapters.getLeaveBalanceReport(filters),
  });
}

export function useLeaveUtilizationReport(filters?: { year?: number }) {
  return useQuery({
    queryKey: ["reports", "leaves", "utilization", filters?.year],
    queryFn: () => leaveReportAdapters.getLeaveUtilizationReport(filters),
  });
}

export function useLeaveApprovalReport(filters?: { status?: string }) {
  return useQuery({
    queryKey: ["reports", "leaves", "approvals", filters?.status],
    queryFn: () => leaveReportAdapters.getLeaveApprovalReport(filters),
  });
}

export function useMonthlyLeaveTrendReport(filters?: { year?: number }) {
  return useQuery({
    queryKey: ["reports", "leaves", "monthly-trend", filters?.year],
    queryFn: () => leaveReportAdapters.getMonthlyLeaveTrendReport(filters),
  });
}

// ─── Employee Reports Hooks ─────────────────────────────────────────────────────
export function useEmployeePerformanceReport(filters?: { month?: string }) {
  return useQuery({
    queryKey: ["reports", "employees", "performance", filters?.month],
    queryFn: () => employeeReportAdapters.getEmployeePerformanceReport(filters),
  });
}

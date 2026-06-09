import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "./index";
import type { ExpenseDashboardStats } from "../types";

const CURRENT_YEAR = new Date().getFullYear();

function computeStats(year: number): ExpenseDashboardStats {
  const all = getExpenses().filter(
    (e) => e.month.startsWith(String(year)),
  );

  const totalSubmitted = all.filter((e) =>
    ["submitted", "pending_approval", "approved", "partially_approved", "rejected", "returned"].includes(e.status),
  ).length;
  const totalApproved = all.filter(
    (e) => e.status === "approved" || e.status === "partially_approved",
  ).length;
  const totalRejected = all.filter((e) => e.status === "rejected").length;
  const totalPending = all.filter(
    (e) => e.status === "submitted" || e.status === "pending_approval",
  ).length;

  const approvedAmount = all
    .filter((e) => e.status === "approved" || e.status === "partially_approved")
    .reduce((sum, e) => sum + e.approvedAmount, 0);

  const pendingAmount = all
    .filter((e) => e.status === "submitted" || e.status === "pending_approval")
    .reduce((sum, e) => sum + e.totalAmount, 0);

  // Average expense per visit — only approved expenses with a linked visit
  const visitLinkedApproved = all.filter(
    (e) =>
      (e.status === "approved" || e.status === "partially_approved") &&
      !!e.visitId,
  );
  const averageExpensePerVisit =
    visitLinkedApproved.length > 0
      ? visitLinkedApproved.reduce((sum, e) => sum + e.approvedAmount, 0) /
        visitLinkedApproved.length
      : 0;

  // Monthly trend: last 6 months of approved amounts
  const monthlyMap = new Map<string, number>();
  all
    .filter((e) => e.status === "approved" || e.status === "partially_approved")
    .forEach((e) => {
      monthlyMap.set(e.month, (monthlyMap.get(e.month) ?? 0) + e.approvedAmount);
    });

  const monthlyTrend = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, amount]) => ({ month, amount }));

  return {
    totalSubmitted,
    totalApproved,
    totalRejected,
    totalPending,
    approvedAmount,
    pendingAmount,
    averageExpensePerVisit: Math.round(averageExpensePerVisit),
    monthlyTrend,
  };
}

export function useExpenseDashboardStats(year: number = CURRENT_YEAR) {
  return useQuery({
    queryKey: ["expenses", "dashboard-stats", year],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 150));
      return computeStats(year);
    },
  });
}

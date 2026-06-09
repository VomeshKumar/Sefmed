import { useQuery } from "@tanstack/react-query";
import {
  getStoredOrders,
  getStoredTargets,
  getStoredSecondarySales,
  getStoredStockists,
  getStoredProducts,
  delay,
} from "./index";
import type { SalesDashboardStats, PerformanceMetric } from "../types";
import { mockEmployees } from "@/features/people/employees/fixtures";
import { mockTerritories } from "@/features/master-data/territories/fixtures";
import { mockZones } from "@/features/master-data/zones/fixtures";
import { mockDivisions } from "@/features/master-data/divisions/fixtures";

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = `${CURRENT_YEAR}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

// Helper: resolve active/delivered orders for month
const getPrimarySalesForMonth = (month: string): number => {
  return getStoredOrders()
    .filter((o) => o.orderDate.startsWith(month) && ["approved", "dispatched", "delivered"].includes(o.status))
    .reduce((s, o) => s + o.netAmount, 0);
};

// Helper: resolve approved secondary sales value for month
const getSecondarySalesForMonth = (month: string): number => {
  return getStoredSecondarySales()
    .filter((s) => s.month === month && s.status === "approved")
    .reduce((s, st) => s + st.totalValue, 0);
};

// Helper: resolve targets for month
const getTargetsForMonth = (month: string): number => {
  return getStoredTargets()
    .filter((t) => t.month === month && t.status === "approved")
    .reduce((s, t) => s + t.targetAmount, 0);
};

export function computeSalesStats(month: string = CURRENT_MONTH): SalesDashboardStats {
  const stockists = getStoredStockists();
  const products = getStoredProducts();
  const orders = getStoredOrders().filter((o) => o.orderDate.startsWith(month) && ["approved", "dispatched", "delivered"].includes(o.status));
  const targets = getStoredTargets().filter((t) => t.month === month && t.status === "approved");
  const secondarySales = getStoredSecondarySales().filter((s) => s.month === month && s.status === "approved");

  const totalPrimarySales = getPrimarySalesForMonth(month);
  const totalSecondarySales = getSecondarySalesForMonth(month);
  const totalTargetAmount = getTargetsForMonth(month);

  const achievementPrimaryPercent = totalTargetAmount > 0 ? Math.round((totalPrimarySales / totalTargetAmount) * 100) : 0;
  const achievementSecondaryPercent = totalTargetAmount > 0 ? Math.round((totalSecondarySales / totalTargetAmount) * 100) : 0;

  const totalOutstanding = stockists.reduce((s, st) => s + st.outstandingAmount, 0);

  // Top Products Metric
  const topProducts: PerformanceMetric[] = products.map((p) => {
    // Target amount for this product in targets
    const targetAmt = targets.reduce((sum, t) => {
      const pt = t.productTargets.find((pt) => pt.productId === p.id);
      return sum + (pt ? pt.targetAmount : 0);
    }, 0);

    const primaryAmt = orders.reduce((sum, o) => {
      const oi = o.items.filter((oi) => oi.productId === p.id);
      return sum + oi.reduce((s, item) => s + item.amount, 0);
    }, 0);

    const secondaryAmt = secondarySales.reduce((sum, s) => {
      const ssi = s.items.filter((ssi) => ssi.productId === p.id);
      return sum + ssi.reduce((s, item) => s + item.value, 0);
    }, 0);

    return {
      id: p.id,
      name: p.name,
      targetAmount: targetAmt,
      primaryAmount: primaryAmt,
      secondaryAmount: secondaryAmt,
      achievementPrimaryPercent: targetAmt > 0 ? Math.round((primaryAmt / targetAmt) * 100) : 0,
      achievementSecondaryPercent: targetAmt > 0 ? Math.round((secondaryAmt / targetAmt) * 100) : 0,
    };
  }).sort((a, b) => b.primaryAmount - a.primaryAmount).slice(0, 5);

  // Top Employees
  const topEmployees: PerformanceMetric[] = mockEmployees.map((e) => {
    const targetAmt = targets.filter((t) => t.employeeId === e.id).reduce((sum, t) => sum + t.targetAmount, 0);
    const primaryAmt = orders.filter((o) => o.employeeId === e.id).reduce((sum, o) => sum + o.netAmount, 0);
    const secondaryAmt = secondarySales.filter((s) => s.submittedByEmployeeId === e.id).reduce((sum, s) => sum + s.totalValue, 0);

    return {
      id: e.id,
      name: e.name,
      targetAmount: targetAmt,
      primaryAmount: primaryAmt,
      secondaryAmount: secondaryAmt,
      achievementPrimaryPercent: targetAmt > 0 ? Math.round((primaryAmt / targetAmt) * 100) : 0,
      achievementSecondaryPercent: targetAmt > 0 ? Math.round((secondaryAmt / targetAmt) * 100) : 0,
    };
  }).sort((a, b) => b.primaryAmount - a.primaryAmount).slice(0, 5);

  // Top Territories
  const topTerritories: PerformanceMetric[] = mockTerritories.map((t) => {
    const stockistIds = stockists.filter((s) => s.territoryId === t.id).map((s) => s.id);
    const primaryAmt = orders.filter((o) => stockistIds.includes(o.stockistId)).reduce((sum, o) => sum + o.netAmount, 0);
    const secondaryAmt = secondarySales.filter((s) => stockistIds.includes(s.stockistId)).reduce((sum, s) => sum + s.totalValue, 0);

    // Target is resolved by employees located in this territory
    const reps = mockEmployees.filter((e) => e.territoryId === t.id).map((e) => e.id);
    const targetAmt = targets.filter((tar) => reps.includes(tar.employeeId)).reduce((sum, tar) => sum + tar.targetAmount, 0);

    return {
      id: t.id,
      name: t.name,
      targetAmount: targetAmt,
      primaryAmount: primaryAmt,
      secondaryAmount: secondaryAmt,
      achievementPrimaryPercent: targetAmt > 0 ? Math.round((primaryAmt / targetAmt) * 100) : 0,
      achievementSecondaryPercent: targetAmt > 0 ? Math.round((secondaryAmt / targetAmt) * 100) : 0,
    };
  }).sort((a, b) => b.primaryAmount - a.primaryAmount).slice(0, 5);

  // Monthly trend for past 6 months
  const monthlyTrend = [];
  const startMonth = new Date();
  startMonth.setMonth(startMonth.getMonth() - 5);
  for (let i = 0; i < 6; i++) {
    const m = `${startMonth.getFullYear()}-${String(startMonth.getMonth() + 1).padStart(2, "0")}`;
    monthlyTrend.push({
      month: startMonth.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      target: getTargetsForMonth(m),
      primary: getPrimarySalesForMonth(m),
      secondary: getSecondarySalesForMonth(m),
    });
    startMonth.setMonth(startMonth.getMonth() + 1);
  }

  return {
    totalPrimarySales,
    totalSecondarySales,
    totalTargetAmount,
    achievementPrimaryPercent,
    achievementSecondaryPercent,
    totalOutstanding,
    topProducts,
    topEmployees,
    topTerritories,
    monthlyTrend,
  };
}

export function useSalesDashboardStats(month: string = CURRENT_MONTH) {
  return useQuery({
    queryKey: ["sales", "dashboard-stats", month],
    queryFn: async () => {
      await delay(150);
      return computeSalesStats(month);
    },
  });
}

// ─── Sales Analytics Hook (Revisions 8 - Territory, Zone, Division performance) ───
export function computeAnalyticsMetrics(month: string = CURRENT_MONTH) {
  const stockists = getStoredStockists();
  const orders = getStoredOrders().filter((o) => o.orderDate.startsWith(month) && ["approved", "dispatched", "delivered"].includes(o.status));
  const targets = getStoredTargets().filter((t) => t.month === month && t.status === "approved");
  const secondarySales = getStoredSecondarySales().filter((s) => s.month === month && s.status === "approved");

  // Division performance
  const divisionPerformance: PerformanceMetric[] = mockDivisions.map((d) => {
    const reps = mockEmployees.filter((e) => e.divisionId === d.id).map((e) => e.id);
    const targetAmt = targets.filter((t) => reps.includes(t.employeeId)).reduce((s, t) => s + t.targetAmount, 0);
    const primaryAmt = orders.filter((o) => o.employeeId && reps.includes(o.employeeId)).reduce((s, o) => s + o.netAmount, 0);
    const secondaryAmt = secondarySales.filter((s) => reps.includes(s.submittedByEmployeeId)).reduce((s, sale) => s + sale.totalValue, 0);

    return {
      id: d.id,
      name: d.name,
      targetAmount: targetAmt,
      primaryAmount: primaryAmt,
      secondaryAmount: secondaryAmt,
      achievementPrimaryPercent: targetAmt > 0 ? Math.round((primaryAmt / targetAmt) * 100) : 0,
      achievementSecondaryPercent: targetAmt > 0 ? Math.round((secondaryAmt / targetAmt) * 100) : 0,
    };
  });

  // Zone performance
  const zonePerformance: PerformanceMetric[] = mockZones.map((z) => {
    const reps = mockEmployees.filter((e) => e.zoneId === z.id).map((e) => e.id);
    const targetAmt = targets.filter((t) => reps.includes(t.employeeId)).reduce((s, t) => s + t.targetAmount, 0);
    const primaryAmt = orders.filter((o) => o.employeeId && reps.includes(o.employeeId)).reduce((s, o) => s + o.netAmount, 0);
    const secondaryAmt = secondarySales.filter((s) => reps.includes(s.submittedByEmployeeId)).reduce((s, sale) => s + sale.totalValue, 0);

    return {
      id: z.id,
      name: z.name,
      targetAmount: targetAmt,
      primaryAmount: primaryAmt,
      secondaryAmount: secondaryAmt,
      achievementPrimaryPercent: targetAmt > 0 ? Math.round((primaryAmt / targetAmt) * 100) : 0,
      achievementSecondaryPercent: targetAmt > 0 ? Math.round((secondaryAmt / targetAmt) * 100) : 0,
    };
  });

  // Territory Performance
  const territoryPerformance: PerformanceMetric[] = mockTerritories.map((t) => {
    const reps = mockEmployees.filter((e) => e.territoryId === t.id).map((e) => e.id);
    const targetAmt = targets.filter((tar) => reps.includes(tar.employeeId)).reduce((s, tar) => s + tar.targetAmount, 0);
    
    const stockistIds = stockists.filter((s) => s.territoryId === t.id).map((s) => s.id);
    const primaryAmt = orders.filter((o) => stockistIds.includes(o.stockistId)).reduce((s, o) => s + o.netAmount, 0);
    const secondaryAmt = secondarySales.filter((s) => stockistIds.includes(s.stockistId)).reduce((s, sale) => s + sale.totalValue, 0);

    return {
      id: t.id,
      name: t.name,
      targetAmount: targetAmt,
      primaryAmount: primaryAmt,
      secondaryAmount: secondaryAmt,
      achievementPrimaryPercent: targetAmt > 0 ? Math.round((primaryAmt / targetAmt) * 100) : 0,
      achievementSecondaryPercent: targetAmt > 0 ? Math.round((secondaryAmt / targetAmt) * 100) : 0,
    };
  });

  return {
    divisionPerformance,
    zonePerformance,
    territoryPerformance,
  };
}

export function useSalesAnalyticsMetrics(month: string = CURRENT_MONTH) {
  return useQuery({
    queryKey: ["sales", "analytics-metrics", month],
    queryFn: async () => {
      await delay(150);
      return computeAnalyticsMetrics(month);
    },
  });
}

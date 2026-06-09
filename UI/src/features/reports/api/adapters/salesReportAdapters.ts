import {
  getStoredOrders,
  getStoredTargets,
  getStoredSecondarySales,
  getStoredStockists,
  getStoredProducts,
} from "@/features/sales/api/index";
import { mockEmployees } from "@/features/people/employees/fixtures";
import { mockTerritories } from "@/features/master-data/territories/fixtures";
import { mockZones } from "@/features/master-data/zones/fixtures";
import { mockDivisions } from "@/features/master-data/divisions/fixtures";

export const salesReportAdapters = {
  getPrimarySalesReport: async (filters?: { month?: string; stockistId?: string }) => {
    const orders = getStoredOrders().filter((o) => ["approved", "dispatched", "delivered"].includes(o.status));
    const stockists = getStoredStockists();
    const stockistMap = new Map(stockists.map((s) => [s.id, s]));

    let filtered = orders;
    if (filters?.month) {
      filtered = filtered.filter((o) => o.orderDate.startsWith(filters.month!));
    }
    if (filters?.stockistId && filters.stockistId !== "all") {
      filtered = filtered.filter((o) => o.stockistId === filters.stockistId);
    }

    return filtered.map((o) => {
      const s = stockistMap.get(o.stockistId);
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        orderDate: o.orderDate,
        stockistName: s?.name ?? "Unknown",
        stockistCode: s?.code ?? "—",
        netAmount: o.netAmount,
        status: o.status,
      };
    });
  },

  getSecondarySalesReport: async (filters?: { month?: string; stockistId?: string }) => {
    const secSales = getStoredSecondarySales().filter((s) => s.status === "approved");
    const stockists = getStoredStockists();
    const stockistMap = new Map(stockists.map((s) => [s.id, s]));

    let filtered = secSales;
    if (filters?.month) {
      filtered = filtered.filter((s) => s.month === filters.month!);
    }
    if (filters?.stockistId && filters.stockistId !== "all") {
      filtered = filtered.filter((s) => s.stockistId === filters.stockistId);
    }

    return filtered.map((s) => {
      const st = stockistMap.get(s.stockistId);
      return {
        id: s.id,
        month: s.month,
        statementDate: s.statementDate,
        stockistName: st?.name ?? "Unknown",
        stockistCode: st?.code ?? "—",
        totalValue: s.totalValue,
        hasReconciliationWarnings: s.hasReconciliationWarnings,
      };
    });
  },

  getTargetAchievementReport: async (filters?: { month?: string; employeeId?: string }) => {
    const targets = getStoredTargets().filter((t) => t.status === "approved");
    const orders = getStoredOrders().filter((o) => ["approved", "dispatched", "delivered"].includes(o.status));
    const secSales = getStoredSecondarySales().filter((s) => s.status === "approved");
    const employees = mockEmployees;
    const empMap = new Map(employees.map((e) => [e.id, e]));

    let filtered = targets;
    if (filters?.month) {
      filtered = filtered.filter((t) => t.month === filters.month!);
    }
    if (filters?.employeeId && filters.employeeId !== "all") {
      filtered = filtered.filter((t) => t.employeeId === filters.employeeId);
    }

    return filtered.map((t) => {
      const emp = empMap.get(t.employeeId);
      // Compute actuals for this employee in this target month
      const primaryAmt = orders
        .filter((o) => o.employeeId === t.employeeId && o.orderDate.startsWith(t.month))
        .reduce((sum, o) => sum + o.netAmount, 0);

      const secondaryAmt = secSales
        .filter((s) => s.submittedByEmployeeId === t.employeeId && s.month === t.month)
        .reduce((sum, s) => sum + s.totalValue, 0);

      return {
        id: t.id,
        month: t.month,
        employeeName: emp?.name ?? "Unknown",
        employeeCode: emp?.code ?? "—",
        targetAmount: t.targetAmount,
        primaryAmount: primaryAmt,
        secondaryAmount: secondaryAmt,
        primaryAchievementPercent: t.targetAmount > 0 ? Math.round((primaryAmt / t.targetAmount) * 100) : 0,
        secondaryAchievementPercent: t.targetAmount > 0 ? Math.round((secondaryAmt / t.targetAmount) * 100) : 0,
      };
    });
  },

  getProductPerformanceReport: async (filters?: { month?: string }) => {
    const products = getStoredProducts();
    const orders = getStoredOrders().filter((o) => ["approved", "dispatched", "delivered"].includes(o.status));
    const secSales = getStoredSecondarySales().filter((s) => s.status === "approved");

    let monthFilteredOrders = orders;
    let monthFilteredSec = secSales;

    if (filters?.month) {
      monthFilteredOrders = orders.filter((o) => o.orderDate.startsWith(filters.month!));
      monthFilteredSec = secSales.filter((s) => s.month === filters.month!);
    }

    return products.map((p) => {
      // Primary units and value
      let primaryUnits = 0;
      let primaryValue = 0;
      monthFilteredOrders.forEach((o) => {
        o.items.forEach((item) => {
          if (item.productId === p.id) {
            primaryUnits += item.quantity;
            primaryValue += item.amount;
          }
        });
      });

      // Secondary units and value
      let secondaryUnits = 0;
      let secondaryValue = 0;
      monthFilteredSec.forEach((s) => {
        s.items.forEach((item) => {
          if (item.productId === p.id) {
            secondaryUnits += item.salesQty;
            secondaryValue += item.value;
          }
        });
      });

      return {
        id: p.id,
        productName: p.name,
        productCode: p.code,
        packSize: p.packSize,
        primaryUnits,
        primaryValue,
        secondaryUnits,
        secondaryValue,
      };
    });
  },

  getStockistPerformanceReport: async (filters?: { territoryId?: string }) => {
    const stockists = getStoredStockists();
    const orders = getStoredOrders().filter((o) => ["approved", "dispatched", "delivered"].includes(o.status));
    const secSales = getStoredSecondarySales().filter((s) => s.status === "approved");

    let filteredStockists = stockists;
    if (filters?.territoryId && filters.territoryId !== "all") {
      filteredStockists = stockists.filter((s) => s.territoryId === filters.territoryId);
    }

    return filteredStockists.map((s) => {
      const stockistOrders = orders.filter((o) => o.stockistId === s.id);
      const totalPrimaryPurchased = stockistOrders.reduce((sum, o) => sum + o.netAmount, 0);
      const ordersCount = stockistOrders.length;

      const stockistSec = secSales.filter((ss) => ss.stockistId === s.id);
      const totalSecondaryReported = stockistSec.reduce((sum, ss) => sum + ss.totalValue, 0);

      return {
        id: s.id,
        stockistName: s.name,
        stockistCode: s.code,
        classification: s.type.replace("_", " ").toUpperCase(),
        creditLimit: s.creditLimit,
        outstandingAmount: s.outstandingAmount,
        totalPrimaryPurchased,
        ordersCount,
        totalSecondaryReported,
      };
    });
  },

  getTerritoryPerformanceReport: async (filters?: { month?: string }) => {
    const territories = mockTerritories;
    const stockists = getStoredStockists();
    const orders = getStoredOrders().filter((o) => ["approved", "dispatched", "delivered"].includes(o.status));
    const secSales = getStoredSecondarySales().filter((s) => s.status === "approved");
    const targets = getStoredTargets().filter((t) => t.status === "approved");

    let month = filters?.month || new Date().toISOString().slice(0, 7);

    return territories.map((t) => {
      const tStockistIds = stockists.filter((s) => s.territoryId === t.id).map((s) => s.id);

      // Primary sales in territory
      const primaryAmt = orders
        .filter((o) => o.orderDate.startsWith(month) && tStockistIds.includes(o.stockistId))
        .reduce((sum, o) => sum + o.netAmount, 0);

      // Secondary sales in territory
      const secondaryAmt = secSales
        .filter((s) => s.month === month && tStockistIds.includes(s.stockistId))
        .reduce((sum, s) => sum + s.totalValue, 0);

      // Target allocated to employees in this territory
      const tEmployeeIds = mockEmployees.filter((e) => e.territoryId === t.id).map((e) => e.id);
      const targetAmt = targets
        .filter((tar) => tar.month === month && tEmployeeIds.includes(tar.employeeId))
        .reduce((sum, tar) => sum + tar.targetAmount, 0);

      return {
        id: t.id,
        name: t.name,
        targetAmount: targetAmt,
        primaryAmount: primaryAmt,
        secondaryAmount: secondaryAmt,
        primaryAchievementPercent: targetAmt > 0 ? Math.round((primaryAmt / targetAmt) * 100) : 0,
        secondaryAchievementPercent: targetAmt > 0 ? Math.round((secondaryAmt / targetAmt) * 100) : 0,
      };
    });
  },

  getZonePerformanceReport: async (filters?: { month?: string }) => {
    const zones = mockZones;
    const stockists = getStoredStockists();
    const orders = getStoredOrders().filter((o) => ["approved", "dispatched", "delivered"].includes(o.status));
    const secSales = getStoredSecondarySales().filter((s) => s.status === "approved");
    const targets = getStoredTargets().filter((t) => t.status === "approved");

    let month = filters?.month || new Date().toISOString().slice(0, 7);

    return zones.map((z) => {
      const zStockistIds = stockists.filter((s) => s.zoneId === z.id).map((s) => s.id);

      const primaryAmt = orders
        .filter((o) => o.orderDate.startsWith(month) && zStockistIds.includes(o.stockistId))
        .reduce((sum, o) => sum + o.netAmount, 0);

      const secondaryAmt = secSales
        .filter((s) => s.month === month && zStockistIds.includes(s.stockistId))
        .reduce((sum, s) => sum + s.totalValue, 0);

      const zEmployeeIds = mockEmployees.filter((e) => e.zoneId === z.id).map((e) => e.id);
      const targetAmt = targets
        .filter((tar) => tar.month === month && zEmployeeIds.includes(tar.employeeId))
        .reduce((sum, tar) => sum + tar.targetAmount, 0);

      return {
        id: z.id,
        name: z.name,
        targetAmount: targetAmt,
        primaryAmount: primaryAmt,
        secondaryAmount: secondaryAmt,
        primaryAchievementPercent: targetAmt > 0 ? Math.round((primaryAmt / targetAmt) * 100) : 0,
        secondaryAchievementPercent: targetAmt > 0 ? Math.round((secondaryAmt / targetAmt) * 100) : 0,
      };
    });
  },

  getDivisionPerformanceReport: async (filters?: { month?: string }) => {
    const divisions = mockDivisions;
    const targets = getStoredTargets().filter((t) => t.status === "approved");
    const orders = getStoredOrders().filter((o) => ["approved", "dispatched", "delivered"].includes(o.status));
    const secSales = getStoredSecondarySales().filter((s) => s.status === "approved");

    let month = filters?.month || new Date().toISOString().slice(0, 7);

    return divisions.map((d) => {
      const dEmployeeIds = mockEmployees.filter((e) => e.divisionId === d.id).map((e) => e.id);

      const targetAmt = targets
        .filter((t) => t.month === month && dEmployeeIds.includes(t.employeeId))
        .reduce((sum, t) => sum + t.targetAmount, 0);

      const primaryAmt = orders
        .filter((o) => o.orderDate.startsWith(month) && o.employeeId && dEmployeeIds.includes(o.employeeId))
        .reduce((sum, o) => sum + o.netAmount, 0);

      const secondaryAmt = secSales
        .filter((s) => s.month === month && dEmployeeIds.includes(s.submittedByEmployeeId))
        .reduce((sum, s) => sum + s.totalValue, 0);

      return {
        id: d.id,
        name: d.name,
        targetAmount: targetAmt,
        primaryAmount: primaryAmt,
        secondaryAmount: secondaryAmt,
        primaryAchievementPercent: targetAmt > 0 ? Math.round((primaryAmt / targetAmt) * 100) : 0,
        secondaryAchievementPercent: targetAmt > 0 ? Math.round((secondaryAmt / targetAmt) * 100) : 0,
      };
    });
  },
};

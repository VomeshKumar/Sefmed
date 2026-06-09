import { mockEmployees } from "@/features/people/employees/fixtures";
import { visitsApi } from "@/features/visits/api/index";
import { expensesApi } from "@/features/expenses/api/index";
import {
  getStoredOrders,
  getStoredTargets,
  getStoredSecondarySales,
} from "@/features/sales/api/index";

export const employeeReportAdapters = {
  getEmployeePerformanceReport: async (filters?: { month?: string }) => {
    const month = filters?.month || new Date().toISOString().slice(0, 7);

    // 1. Fetch visits data
    const dVisits = await visitsApi.listDoctorVisits();
    const fVisits = await visitsApi.listFirmVisits();
    const allVisits = [...dVisits, ...fVisits];

    // 2. Fetch expenses data
    const expenses = await expensesApi.list({ month });

    // 3. Fetch sales data
    const orders = getStoredOrders().filter((o) => ["approved", "dispatched", "delivered"].includes(o.status));
    const secSales = getStoredSecondarySales().filter((s) => s.status === "approved");
    const targets = getStoredTargets().filter((t) => t.status === "approved");

    return mockEmployees.map((e) => {
      // Visit productivity
      const empVisits = allVisits.filter((v) => v.assignedEmployeeId === e.id);
      const totalVisits = empVisits.length;
      const closedVisits = empVisits.filter((v) => v.status === "closed" || v.status === "approved").length;
      const visitCompletionRate = totalVisits > 0 ? Math.round((closedVisits / totalVisits) * 100) : 0;

      // Geolocation verification success rate
      const geoVerified = empVisits.filter((v) => v.geoVerificationStatus === "Verified").length;
      const geoSuccessRate = totalVisits > 0 ? Math.round((geoVerified / totalVisits) * 100) : 0;

      // Expenses utilization
      const empExpenses = expenses.filter((exp) => exp.employeeId === e.id);
      const totalClaimed = empExpenses.reduce((sum, exp) => sum + exp.totalAmount, 0);
      const totalApproved = empExpenses.reduce((sum, exp) => sum + exp.approvedAmount, 0);

      // Target achievements
      const empTarget = targets.find((t) => t.employeeId === e.id && t.month === month);
      const targetAmount = empTarget?.targetAmount || 0;

      const primarySales = orders
        .filter((o) => o.employeeId === e.id && o.orderDate.startsWith(month))
        .reduce((sum, o) => sum + o.netAmount, 0);

      const secondarySales = secSales
        .filter((s) => s.submittedByEmployeeId === e.id && s.month === month)
        .reduce((sum, s) => sum + s.totalValue, 0);

      return {
        id: e.id,
        employeeName: e.name,
        employeeCode: e.code,
        designation: e.designationId === "des-001" ? "Medical Representative" : e.designationId === "des-002" ? "Area Business Manager" : "Manager",
        month,
        totalVisits,
        closedVisits,
        visitCompletionRate,
        geoSuccessRate,
        totalClaimed,
        totalApproved,
        targetAmount,
        primarySales,
        secondarySales,
        primaryAchievementPercent: targetAmount > 0 ? Math.round((primarySales / targetAmount) * 100) : 0,
        secondaryAchievementPercent: targetAmount > 0 ? Math.round((secondarySales / targetAmount) * 100) : 0,
      };
    });
  },
};

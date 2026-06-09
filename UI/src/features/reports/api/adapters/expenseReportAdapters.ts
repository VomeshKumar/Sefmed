import { expensesApi, sfcApi } from "@/features/expenses/api/index";
import { mockEmployees } from "@/features/people/employees/fixtures";

export const expenseReportAdapters = {
  getExpenseSummary: async (filters?: { month?: string }) => {
    const list = await expensesApi.list(filters?.month ? { month: filters.month } : undefined);
    
    const totalClaimed = list.reduce((sum, e) => sum + e.totalAmount, 0);
    const totalApproved = list.reduce((sum, e) => sum + e.approvedAmount, 0);

    const draft = list.filter((e) => e.status === "draft").length;
    const submitted = list.filter((e) => e.status === "submitted" || e.status === "pending_approval").length;
    const approved = list.filter((e) => e.status === "approved" || e.status === "partially_approved").length;
    const rejected = list.filter((e) => e.status === "rejected").length;
    const returned = list.filter((e) => e.status === "returned").length;

    return {
      totalClaimed,
      totalApproved,
      statusCounts: {
        draft,
        submitted,
        approved,
        rejected,
        returned,
        total: list.length,
      },
    };
  },

  getEmployeeExpenseReport: async (filters?: { month?: string }) => {
    const list = await expensesApi.list(filters?.month ? { month: filters.month } : undefined);
    const empMap = new Map(mockEmployees.map((e) => [e.id, e]));

    const employeeTotals: Record<string, { totalClaims: number; claimed: number; approved: number }> = {};

    list.forEach((e) => {
      if (!employeeTotals[e.employeeId]) {
        employeeTotals[e.employeeId] = { totalClaims: 0, claimed: 0, approved: 0 };
      }
      employeeTotals[e.employeeId].totalClaims += 1;
      employeeTotals[e.employeeId].claimed += e.totalAmount;
      employeeTotals[e.employeeId].approved += e.approvedAmount;
    });

    return mockEmployees.map((emp) => {
      const stats = employeeTotals[emp.id] || { totalClaims: 0, claimed: 0, approved: 0 };
      return {
        id: emp.id,
        employeeName: emp.name,
        employeeCode: emp.code,
        totalClaims: stats.totalClaims,
        totalClaimedAmount: stats.claimed,
        totalApprovedAmount: stats.approved,
      };
    }).filter((item) => item.totalClaims > 0);
  },

  getExpenseHeadAnalysis: async (filters?: { month?: string }) => {
    const list = await expensesApi.list(filters?.month ? { month: filters.month } : undefined);
    
    const headTotals: Record<string, number> = {
      travel: 0,
      daily_allowance: 0,
      hotel: 0,
      food: 0,
      local_conveyance: 0,
      miscellaneous: 0,
    };

    list.forEach((e) => {
      e.lineItems.forEach((item) => {
        if (headTotals[item.category] !== undefined) {
          headTotals[item.category] += item.amount;
        } else {
          headTotals.miscellaneous += item.amount;
        }
      });
    });

    return Object.keys(headTotals).map((key) => {
      const label = key.replace("_", " ").toUpperCase();
      return {
        category: key,
        label,
        value: headTotals[key],
      };
    });
  },

  getTravelExpenseAnalysis: async (filters?: { month?: string }) => {
    const list = await expensesApi.list(filters?.month ? { month: filters.month } : undefined);
    const empMap = new Map(mockEmployees.map((e) => [e.id, e]));

    const travelLines: Array<{
      id: string;
      date: string;
      employeeName: string;
      employeeCode: string;
      description: string;
      quantity: number;
      rate: number;
      amount: number;
      unit: string;
    }> = [];

    list.forEach((e) => {
      const emp = empMap.get(e.employeeId);
      e.lineItems.forEach((line) => {
        if (line.category === "travel") {
          travelLines.push({
            id: line.id,
            date: line.date,
            employeeName: emp?.name ?? "Unknown",
            employeeCode: emp?.code ?? "—",
            description: line.description || "Travel conveyance",
            quantity: line.quantity || 0,
            rate: line.rate || 0,
            amount: line.amount,
            unit: line.unit || "km",
          });
        }
      });
    });

    return travelLines.sort((a, b) => b.date.localeCompare(a.date));
  },

  getSFCVarianceReport: async (filters?: { month?: string }) => {
    const list = await expensesApi.list(filters?.month ? { month: filters.month } : undefined);
    const sfcs = await sfcApi.list();
    const empMap = new Map(mockEmployees.map((e) => [e.id, e]));

    const varianceRecords: Array<{
      id: string;
      date: string;
      employeeName: string;
      description: string;
      claimedAmount: number;
      allowedAmount: number;
      varianceAmount: number;
      source: string;
      destination: string;
      status: "compliant" | "over_claim";
    }> = [];

    list.forEach((e) => {
      const emp = empMap.get(e.employeeId);
      e.lineItems.forEach((line) => {
        if (line.category === "travel" && line.description) {
          // Check description for source/destination matching e.g. "Delhi to Noida" or "Delhi - Noida"
          const desc = line.description.toLowerCase();
          const matchedSFC = sfcs.find((sfc) => {
            const src = sfc.source.toLowerCase();
            const dest = sfc.destination.toLowerCase();
            return (desc.includes(src) && desc.includes(dest));
          });

          if (matchedSFC) {
            let allowed = 0;
            if (matchedSFC.flatFare) {
              allowed = matchedSFC.flatFare;
            } else if (matchedSFC.allowedFarePerKm && line.quantity) {
              allowed = matchedSFC.allowedFarePerKm * line.quantity;
            }

            const claimed = line.amount;
            const variance = claimed - allowed;

            if (variance !== 0) {
              varianceRecords.push({
                id: line.id,
                date: line.date,
                employeeName: emp?.name ?? "Unknown",
                description: line.description,
                claimedAmount: claimed,
                allowedAmount: allowed,
                varianceAmount: variance,
                source: matchedSFC.source,
                destination: matchedSFC.destination,
                status: variance > 0 ? "over_claim" : "compliant",
              });
            }
          } else {
            // No direct route matched, let's look at average fare limits (or flag as unchecked compliant)
          }
        }
      });
    });

    return varianceRecords.sort((a, b) => b.date.localeCompare(a.date));
  },
};

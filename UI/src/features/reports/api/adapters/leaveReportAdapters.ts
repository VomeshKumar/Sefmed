import { leaveRequestsApi, leaveBalancesApi } from "@/features/calendar/api/index";
import { leaveTypesApi } from "@/features/master-data/leave-types/api/index";
import { mockEmployees } from "@/features/people/employees/fixtures";
import type { LeaveType } from "@/features/master-data/leave-types/types";

export const leaveReportAdapters = {
  getLeaveBalanceReport: async (filters?: { year?: number }) => {
    const year = filters?.year || new Date().getFullYear();
    const balances = await leaveBalancesApi.list(year);
    const leaveTypes = await leaveTypesApi.list();
    const typeMap = new Map<string, LeaveType>(leaveTypes.map((t) => [t.id, t]));
    const empMap = new Map(mockEmployees.map((e) => [e.id, e]));

    return balances.map((b) => {
      const emp = empMap.get(b.employeeId);
      const type = typeMap.get(b.leaveTypeId);
      return {
        id: b.id,
        employeeName: emp?.name ?? "Unknown",
        employeeCode: emp?.code ?? "—",
        leaveTypeName: type?.name ?? "Leave",
        year: b.year,
        allocated: b.allocated,
        used: b.used,
        pending: b.pending,
        remaining: b.remaining,
      };
    });
  },

  getLeaveUtilizationReport: async (filters?: { year?: number }) => {
    const year = filters?.year || new Date().getFullYear();
    const leaves = await leaveRequestsApi.list({ year });
    const leaveTypes = await leaveTypesApi.list();

    const utilization: Record<string, { label: string; count: number; days: number }> = {};
    leaveTypes.forEach((t) => {
      utilization[t.id] = { label: t.name, count: 0, days: 0 };
    });

    const approvedLeaves = leaves.filter((l) => l.status === "approved");
    approvedLeaves.forEach((l) => {
      if (utilization[l.leaveTypeId]) {
        utilization[l.leaveTypeId].count += 1;
        utilization[l.leaveTypeId].days += l.totalDays;
      }
    });

    return Object.keys(utilization).map((key) => ({
      leaveTypeId: key,
      label: utilization[key].label,
      requestCount: utilization[key].count,
      totalDaysUsed: utilization[key].days,
    }));
  },

  getLeaveApprovalReport: async (filters?: { status?: string }) => {
    const leaves = await leaveRequestsApi.list(
      filters?.status && filters.status !== "all" ? { status: filters.status as any } : undefined
    );
    const leaveTypes = await leaveTypesApi.list();
    const typeMap = new Map<string, LeaveType>(leaveTypes.map((t) => [t.id, t]));
    const empMap = new Map(mockEmployees.map((e) => [e.id, e]));

    return leaves.map((l) => {
      const emp = empMap.get(l.employeeId);
      const approver = l.approverId ? empMap.get(l.approverId) : null;
      const type = typeMap.get(l.leaveTypeId);
      return {
        id: l.id,
        employeeName: emp?.name ?? "Unknown",
        employeeCode: emp?.code ?? "—",
        leaveTypeName: type?.name ?? "—",
        fromDate: l.fromDate,
        toDate: l.toDate,
        totalDays: l.totalDays,
        status: l.status,
        reason: l.reason,
        approverName: approver?.name ?? (l.approverId ? "Manager" : "—"),
        approvedAt: l.approvedAt || l.rejectedAt || "—",
      };
    });
  },

  getMonthlyLeaveTrendReport: async (filters?: { year?: number }) => {
    const year = filters?.year || new Date().getFullYear();
    const leaves = await leaveRequestsApi.list({ year });
    const approved = leaves.filter((l) => l.status === "approved");

    const months = Array.from({ length: 12 }, (_, i) => {
      const mStr = String(i + 1).padStart(2, "0");
      return {
        monthKey: `${year}-${mStr}`,
        monthLabel: new Date(year, i).toLocaleDateString("en-US", { month: "short" }),
        approvedCount: 0,
        totalDays: 0,
      };
    });

    approved.forEach((l) => {
      const m = new Date(l.fromDate).getMonth();
      if (m >= 0 && m < 12) {
        months[m].approvedCount += 1;
        months[m].totalDays += l.totalDays;
      }
    });

    return months;
  },
};

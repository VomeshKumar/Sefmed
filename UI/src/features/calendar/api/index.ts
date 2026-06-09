import { mockHolidays, mockLeaveRequests, mockLeaveBalances } from "../fixtures";
import type { Holiday, LeaveRequest, LeaveBalance, LeaveStatus } from "../types";

// ─── Holiday API ───────────────────────────────────────────────────────────────
const HOLIDAY_KEY = "sefmed_calendar_holidays";

const getHolidays = (): Holiday[] => {
  if (typeof window === "undefined") return mockHolidays;
  const stored = localStorage.getItem(HOLIDAY_KEY);
  if (!stored) {
    localStorage.setItem(HOLIDAY_KEY, JSON.stringify(mockHolidays));
    return mockHolidays;
  }
  return JSON.parse(stored);
};

const saveHolidays = (data: Holiday[]) => {
  if (typeof window !== "undefined") localStorage.setItem(HOLIDAY_KEY, JSON.stringify(data));
};

export const holidaysApi = {
  list: async (filters?: { year?: number; type?: string; query?: string }): Promise<Holiday[]> => {
    await new Promise((r) => setTimeout(r, 300));
    let list = getHolidays();
    if (filters?.year) list = list.filter((h) => h.year === filters.year);
    if (filters?.type && filters.type !== "all") list = list.filter((h) => h.type === filters.type);
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter((h) => h.name.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.date.localeCompare(b.date));
  },

  getById: async (id: string): Promise<Holiday | null> => {
    await new Promise((r) => setTimeout(r, 150));
    return getHolidays().find((h) => h.id === id) ?? null;
  },

  create: async (data: Omit<Holiday, "id" | "createdAt">): Promise<Holiday> => {
    await new Promise((r) => setTimeout(r, 300));
    const list = getHolidays();
    const item: Holiday = {
      ...data,
      id: `hol-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(item);
    saveHolidays(list);
    return item;
  },

  update: async (id: string, data: Partial<Omit<Holiday, "id" | "createdAt">>): Promise<Holiday> => {
    await new Promise((r) => setTimeout(r, 300));
    const list = getHolidays();
    const idx = list.findIndex((h) => h.id === id);
    if (idx === -1) throw new Error("Holiday not found");
    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveHolidays(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 300));
    const list = getHolidays().filter((h) => h.id !== id);
    saveHolidays(list);
  },
};

// ─── Leave Requests API ────────────────────────────────────────────────────────
const LEAVE_KEY = "sefmed_calendar_leaves";

const getLeaves = (): LeaveRequest[] => {
  if (typeof window === "undefined") return mockLeaveRequests;
  const stored = localStorage.getItem(LEAVE_KEY);
  if (!stored) {
    localStorage.setItem(LEAVE_KEY, JSON.stringify(mockLeaveRequests));
    return mockLeaveRequests;
  }
  return JSON.parse(stored);
};

const saveLeaves = (data: LeaveRequest[]) => {
  if (typeof window !== "undefined") localStorage.setItem(LEAVE_KEY, JSON.stringify(data));
};

export const leaveRequestsApi = {
  list: async (filters?: {
    employeeId?: string;
    leaveTypeId?: string;
    status?: LeaveStatus | "all";
    year?: number;
    query?: string;
  }): Promise<LeaveRequest[]> => {
    await new Promise((r) => setTimeout(r, 300));
    let list = getLeaves();
    if (filters?.employeeId) list = list.filter((l) => l.employeeId === filters.employeeId);
    if (filters?.leaveTypeId) list = list.filter((l) => l.leaveTypeId === filters.leaveTypeId);
    if (filters?.status && filters.status !== "all") list = list.filter((l) => l.status === filters.status);
    if (filters?.year) list = list.filter((l) => new Date(l.fromDate).getFullYear() === filters.year);
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (l) => l.reason.toLowerCase().includes(q) || l.employeeId.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  getById: async (id: string): Promise<LeaveRequest | null> => {
    await new Promise((r) => setTimeout(r, 150));
    return getLeaves().find((l) => l.id === id) ?? null;
  },

  create: async (
    data: Omit<LeaveRequest, "id" | "createdAt" | "status" | "totalDays">,
  ): Promise<LeaveRequest> => {
    await new Promise((r) => setTimeout(r, 300));
    const list = getLeaves();
    const from = new Date(data.fromDate);
    const to = new Date(data.toDate);
    const dayDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = data.dayType === "full" ? dayDiff : 0.5;
    const item: LeaveRequest = {
      ...data,
      id: `lr-${Math.random().toString(36).substring(2, 9)}`,
      status: "pending",
      totalDays,
      createdAt: new Date().toISOString(),
    };
    list.push(item);
    saveLeaves(list);
    return item;
  },

  approve: async (id: string, approverId: string): Promise<LeaveRequest> => {
    await new Promise((r) => setTimeout(r, 300));
    const list = getLeaves();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error("Leave request not found");
    const updated: LeaveRequest = {
      ...list[idx],
      status: "approved",
      approverId,
      approvedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveLeaves(list);
    return updated;
  },

  reject: async (id: string, approverId: string, reason: string): Promise<LeaveRequest> => {
    await new Promise((r) => setTimeout(r, 300));
    const list = getLeaves();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error("Leave request not found");
    const updated: LeaveRequest = {
      ...list[idx],
      status: "rejected",
      approverId,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
    };
    list[idx] = updated;
    saveLeaves(list);
    return updated;
  },

  cancel: async (id: string): Promise<LeaveRequest> => {
    await new Promise((r) => setTimeout(r, 300));
    const list = getLeaves();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error("Leave request not found");
    const updated = { ...list[idx], status: "cancelled" as LeaveStatus };
    list[idx] = updated;
    saveLeaves(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 300));
    saveLeaves(getLeaves().filter((l) => l.id !== id));
  },
};

// ─── Leave Balance API ─────────────────────────────────────────────────────────
const BALANCE_KEY = "sefmed_calendar_leave_balances";

const getBalances = (): LeaveBalance[] => {
  if (typeof window === "undefined") return mockLeaveBalances;
  const stored = localStorage.getItem(BALANCE_KEY);
  if (!stored) {
    localStorage.setItem(BALANCE_KEY, JSON.stringify(mockLeaveBalances));
    return mockLeaveBalances;
  }
  return JSON.parse(stored);
};

export const leaveBalancesApi = {
  listForEmployee: async (employeeId: string, year?: number): Promise<LeaveBalance[]> => {
    await new Promise((r) => setTimeout(r, 150));
    let list = getBalances().filter((b) => b.employeeId === employeeId);
    if (year) list = list.filter((b) => b.year === year);
    return list;
  },

  list: async (year?: number): Promise<LeaveBalance[]> => {
    await new Promise((r) => setTimeout(r, 150));
    let list = getBalances();
    if (year) list = list.filter((b) => b.year === year);
    return list;
  },
};

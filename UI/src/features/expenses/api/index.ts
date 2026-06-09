import { mockExpenses, mockSFCs } from "../fixtures";
import type {
  Expense,
  ExpenseStatus,
  SFC,
  TransportType,
  ApprovalAction,
} from "../types";

// ─── Storage Keys ──────────────────────────────────────────────────────────────
const EXPENSE_KEY = "sefmed_expenses";
const SFC_KEY = "sefmed_sfcs";

// ─── Storage Helpers ───────────────────────────────────────────────────────────
const getExpenses = (): Expense[] => {
  if (typeof window === "undefined") return mockExpenses;
  const stored = localStorage.getItem(EXPENSE_KEY);
  if (!stored) {
    localStorage.setItem(EXPENSE_KEY, JSON.stringify(mockExpenses));
    return mockExpenses;
  }
  return JSON.parse(stored);
};

const saveExpenses = (data: Expense[]) => {
  if (typeof window !== "undefined")
    localStorage.setItem(EXPENSE_KEY, JSON.stringify(data));
};

const getSFCs = (): SFC[] => {
  if (typeof window === "undefined") return mockSFCs;
  const stored = localStorage.getItem(SFC_KEY);
  if (!stored) {
    localStorage.setItem(SFC_KEY, JSON.stringify(mockSFCs));
    return mockSFCs;
  }
  return JSON.parse(stored);
};

const saveSFCs = (data: SFC[]) => {
  if (typeof window !== "undefined")
    localStorage.setItem(SFC_KEY, JSON.stringify(data));
};

const delay = () => new Promise((r) => setTimeout(r, 300));
const shortDelay = () => new Promise((r) => setTimeout(r, 150));

// ─── Expense API ───────────────────────────────────────────────────────────────
export const expensesApi = {
  list: async (filters?: {
    query?: string;
    employeeId?: string;
    status?: ExpenseStatus | "all";
    month?: string;
    expenseHeadId?: string;
  }): Promise<Expense[]> => {
    await delay();
    let list = getExpenses();

    if (filters?.employeeId) {
      list = list.filter((e) => e.employeeId === filters.employeeId);
    }
    if (filters?.status && filters.status !== "all") {
      list = list.filter((e) => e.status === filters.status);
    }
    if (filters?.month) {
      list = list.filter((e) => e.month === filters.month);
    }
    if (filters?.expenseHeadId) {
      list = list.filter((e) =>
        e.lineItems.some((li) => li.expenseHeadId === filters.expenseHeadId),
      );
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (e) =>
          e.expenseCode.toLowerCase().includes(q) ||
          e.remarks?.toLowerCase().includes(q) ||
          e.lineItems.some((li) =>
            li.description?.toLowerCase().includes(q),
          ),
      );
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  getById: async (id: string): Promise<Expense | null> => {
    await shortDelay();
    return getExpenses().find((e) => e.id === id) ?? null;
  },

  create: async (
    data: Omit<
      Expense,
      | "id"
      | "expenseCode"
      | "approvalHistory"
      | "status"
      | "totalAmount"
      | "approvedAmount"
      | "createdAt"
      | "updatedAt"
    >,
  ): Promise<Expense> => {
    await delay();
    const list = getExpenses();
    const seq = String(list.length + 1).padStart(4, "0");
    const year = new Date().getFullYear();
    const totalAmount = data.lineItems.reduce((sum, li) => sum + li.amount, 0);
    const item: Expense = {
      ...data,
      id: `exp-${Math.random().toString(36).substring(2, 9)}`,
      expenseCode: `EXP-${year}-${seq}`,
      lineItems: data.lineItems.map((li) => ({
        ...li,
        id: li.id || `li-${Math.random().toString(36).substring(2, 9)}`,
      })),
      approvalHistory: [],
      status: "draft",
      totalAmount,
      approvedAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(item);
    saveExpenses(list);
    return item;
  },

  update: async (
    id: string,
    data: Partial<Omit<Expense, "id" | "expenseCode" | "createdAt">>,
  ): Promise<Expense> => {
    await delay();
    const list = getExpenses();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Expense not found");
    const totalAmount =
      data.lineItems
        ? data.lineItems.reduce((s, li) => s + li.amount, 0)
        : list[idx].totalAmount;
    const updated: Expense = {
      ...list[idx],
      ...data,
      totalAmount,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveExpenses(list);
    return updated;
  },

  submit: async (id: string, employeeId: string): Promise<Expense> => {
    await delay();
    const list = getExpenses();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Expense not found");
    const now = new Date().toISOString();
    const updated: Expense = {
      ...list[idx],
      status: "submitted",
      submittedAt: now,
      updatedAt: now,
      approvalHistory: [
        ...list[idx].approvalHistory,
        {
          id: `ae-${Math.random().toString(36).substring(2, 9)}`,
          expenseId: id,
          action: "submitted",
          byEmployeeId: employeeId,
          approvalLevel: 0,
          approvalRole: "Employee",
          at: now,
        },
      ],
    };
    list[idx] = updated;
    saveExpenses(list);
    return updated;
  },

  approve: async (
    id: string,
    approverId: string,
    approvedAmount: number,
    remarks?: string,
    action: "approved" | "partially_approved" = "approved",
  ): Promise<Expense> => {
    await delay();
    const list = getExpenses();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Expense not found");
    const now = new Date().toISOString();
    const updated: Expense = {
      ...list[idx],
      status: action,
      approvedAmount,
      approvedAt: now,
      updatedAt: now,
      approvalHistory: [
        ...list[idx].approvalHistory,
        {
          id: `ae-${Math.random().toString(36).substring(2, 9)}`,
          expenseId: id,
          action: action as ApprovalAction,
          byEmployeeId: approverId,
          approvalLevel: 1,
          approvalRole: "Manager",
          remarks,
          at: now,
        },
      ],
    };
    list[idx] = updated;
    saveExpenses(list);
    return updated;
  },

  reject: async (
    id: string,
    approverId: string,
    remarks: string,
  ): Promise<Expense> => {
    await delay();
    const list = getExpenses();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Expense not found");
    const now = new Date().toISOString();
    const updated: Expense = {
      ...list[idx],
      status: "rejected",
      updatedAt: now,
      approvalHistory: [
        ...list[idx].approvalHistory,
        {
          id: `ae-${Math.random().toString(36).substring(2, 9)}`,
          expenseId: id,
          action: "rejected",
          byEmployeeId: approverId,
          approvalLevel: 1,
          approvalRole: "Manager",
          remarks,
          at: now,
        },
      ],
    };
    list[idx] = updated;
    saveExpenses(list);
    return updated;
  },

  return: async (
    id: string,
    approverId: string,
    remarks: string,
  ): Promise<Expense> => {
    await delay();
    const list = getExpenses();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Expense not found");
    const now = new Date().toISOString();
    const updated: Expense = {
      ...list[idx],
      status: "returned",
      updatedAt: now,
      approvalHistory: [
        ...list[idx].approvalHistory,
        {
          id: `ae-${Math.random().toString(36).substring(2, 9)}`,
          expenseId: id,
          action: "returned",
          byEmployeeId: approverId,
          approvalLevel: 1,
          approvalRole: "Manager",
          remarks,
          at: now,
        },
      ],
    };
    list[idx] = updated;
    saveExpenses(list);
    return updated;
  },

  cancel: async (id: string, employeeId: string): Promise<Expense> => {
    await delay();
    const list = getExpenses();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Expense not found");
    const now = new Date().toISOString();
    const updated: Expense = {
      ...list[idx],
      status: "cancelled",
      updatedAt: now,
      approvalHistory: [
        ...list[idx].approvalHistory,
        {
          id: `ae-${Math.random().toString(36).substring(2, 9)}`,
          expenseId: id,
          action: "cancelled",
          byEmployeeId: employeeId,
          approvalLevel: 0,
          approvalRole: "Employee",
          at: now,
        },
      ],
    };
    list[idx] = updated;
    saveExpenses(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    saveExpenses(getExpenses().filter((e) => e.id !== id));
  },
};

// ─── SFC API ───────────────────────────────────────────────────────────────────
export const sfcApi = {
  list: async (filters?: {
    transportType?: TransportType | "all";
    query?: string;
  }): Promise<SFC[]> => {
    await delay();
    let list = getSFCs();
    if (filters?.transportType && filters.transportType !== "all") {
      list = list.filter((s) => s.transportType === filters.transportType);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (s) =>
          s.source.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => a.source.localeCompare(b.source));
  },

  getById: async (id: string): Promise<SFC | null> => {
    await shortDelay();
    return getSFCs().find((s) => s.id === id) ?? null;
  },

  create: async (data: Omit<SFC, "id" | "createdAt">): Promise<SFC> => {
    await delay();
    const list = getSFCs();
    const item: SFC = {
      ...data,
      id: `sfc-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(item);
    saveSFCs(list);
    return item;
  },

  update: async (
    id: string,
    data: Partial<Omit<SFC, "id" | "createdAt">>,
  ): Promise<SFC> => {
    await delay();
    const list = getSFCs();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("SFC route not found");
    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveSFCs(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay();
    saveSFCs(getSFCs().filter((s) => s.id !== id));
  },
};

// ─── Dashboard Adapters (raw data helpers) ─────────────────────────────────────
export { getExpenses };

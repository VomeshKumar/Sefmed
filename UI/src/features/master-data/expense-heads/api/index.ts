import { mockExpenseHeads } from "../fixtures";
import type { ExpenseHead } from "../types";

const STORAGE_KEY = "sefmed_md_expense_heads";

const getStoredExpenseHeads = (): ExpenseHead[] => {
  if (typeof window === "undefined") return mockExpenseHeads;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockExpenseHeads));
    return mockExpenseHeads;
  }
  return JSON.parse(stored);
};

const saveStoredExpenseHeads = (data: ExpenseHead[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const expenseHeadsApi = {
  list: async (filters?: { query?: string; status?: string }): Promise<ExpenseHead[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getStoredExpenseHeads();

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (e) => e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q),
      );
    }

    if (filters?.status) {
      list = list.filter((e) => e.status === filters.status);
    }

    return list;
  },

  create: async (data: Omit<ExpenseHead, "id" | "createdAt">): Promise<ExpenseHead> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredExpenseHeads();
    const newItem: ExpenseHead = {
      ...data,
      id: `head-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveStoredExpenseHeads(list);
    return newItem;
  },

  update: async (
    id: string,
    data: Partial<Omit<ExpenseHead, "id" | "createdAt">>,
  ): Promise<ExpenseHead> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredExpenseHeads();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Expense Head not found");

    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveStoredExpenseHeads(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredExpenseHeads();
    const filtered = list.filter((item) => item.id !== id);
    saveStoredExpenseHeads(filtered);
  },
};

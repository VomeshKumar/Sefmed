import { mockLeaveTypes } from "../fixtures";
import type { LeaveType } from "../types";

const STORAGE_KEY = "sefmed_md_leave_types";

const getStoredLeaveTypes = (): LeaveType[] => {
  if (typeof window === "undefined") return mockLeaveTypes;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockLeaveTypes));
    return mockLeaveTypes;
  }
  return JSON.parse(stored);
};

const saveStoredLeaveTypes = (data: LeaveType[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const leaveTypesApi = {
  list: async (filters?: { query?: string; status?: string }): Promise<LeaveType[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getStoredLeaveTypes();

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (l) => l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q),
      );
    }

    if (filters?.status) {
      list = list.filter((l) => l.status === filters.status);
    }

    return list;
  },

  create: async (data: Omit<LeaveType, "id" | "createdAt">): Promise<LeaveType> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredLeaveTypes();
    const newItem: LeaveType = {
      ...data,
      id: `leave-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveStoredLeaveTypes(list);
    return newItem;
  },

  update: async (
    id: string,
    data: Partial<Omit<LeaveType, "id" | "createdAt">>,
  ): Promise<LeaveType> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredLeaveTypes();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Leave Type not found");

    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveStoredLeaveTypes(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredLeaveTypes();
    const filtered = list.filter((item) => item.id !== id);
    saveStoredLeaveTypes(filtered);
  },
};

import { mockVisitTypes } from "../fixtures";
import type { VisitType } from "../types";

const STORAGE_KEY = "sefmed_md_visit_types";

const getStoredVisitTypes = (): VisitType[] => {
  if (typeof window === "undefined") return mockVisitTypes;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockVisitTypes));
    return mockVisitTypes;
  }
  return JSON.parse(stored);
};

const saveStoredVisitTypes = (data: VisitType[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const visitTypesApi = {
  list: async (filters?: { query?: string; status?: string }): Promise<VisitType[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getStoredVisitTypes();

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (v) => v.name.toLowerCase().includes(q) || v.code.toLowerCase().includes(q),
      );
    }

    if (filters?.status) {
      list = list.filter((v) => v.status === filters.status);
    }

    return list;
  },

  create: async (data: Omit<VisitType, "id" | "createdAt">): Promise<VisitType> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredVisitTypes();
    const newItem: VisitType = {
      ...data,
      id: `visit-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveStoredVisitTypes(list);
    return newItem;
  },

  update: async (
    id: string,
    data: Partial<Omit<VisitType, "id" | "createdAt">>,
  ): Promise<VisitType> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredVisitTypes();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Visit Type not found");

    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveStoredVisitTypes(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredVisitTypes();
    const filtered = list.filter((item) => item.id !== id);
    saveStoredVisitTypes(filtered);
  },
};

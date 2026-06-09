import { mockDivisions } from "../fixtures";
import type { Division } from "../types";

const STORAGE_KEY = "sefmed_md_divisions";

const getStoredDivisions = (): Division[] => {
  if (typeof window === "undefined") return mockDivisions;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockDivisions));
    return mockDivisions;
  }
  return JSON.parse(stored);
};

const saveStoredDivisions = (data: Division[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const divisionsApi = {
  list: async (filters?: { query?: string; status?: string }): Promise<Division[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getStoredDivisions();

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q),
      );
    }

    if (filters?.status) {
      list = list.filter((d) => d.status === filters.status);
    }

    return list;
  },

  create: async (data: Omit<Division, "id" | "createdAt">): Promise<Division> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredDivisions();
    const newItem: Division = {
      ...data,
      id: `div-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveStoredDivisions(list);
    return newItem;
  },

  update: async (
    id: string,
    data: Partial<Omit<Division, "id" | "createdAt">>,
  ): Promise<Division> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredDivisions();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Division not found");

    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveStoredDivisions(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredDivisions();
    const filtered = list.filter((item) => item.id !== id);
    saveStoredDivisions(filtered);
  },
};

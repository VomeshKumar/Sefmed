import { mockTerritories } from "../fixtures";
import type { Territory } from "../types";

const STORAGE_KEY = "sefmed_md_territories";

const getStoredTerritories = (): Territory[] => {
  if (typeof window === "undefined") return mockTerritories;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTerritories));
    return mockTerritories;
  }
  return JSON.parse(stored);
};

const saveStoredTerritories = (data: Territory[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const territoriesApi = {
  list: async (filters?: { query?: string; zoneId?: string; status?: string }): Promise<Territory[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getStoredTerritories();

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q),
      );
    }

    if (filters?.zoneId) {
      list = list.filter((t) => t.zoneId === filters.zoneId);
    }

    if (filters?.status) {
      list = list.filter((t) => t.status === filters.status);
    }

    return list;
  },

  create: async (data: Omit<Territory, "id" | "createdAt">): Promise<Territory> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredTerritories();
    const newItem: Territory = {
      ...data,
      id: `terr-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveStoredTerritories(list);
    return newItem;
  },

  update: async (
    id: string,
    data: Partial<Omit<Territory, "id" | "createdAt">>,
  ): Promise<Territory> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredTerritories();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Territory not found");

    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveStoredTerritories(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredTerritories();
    const filtered = list.filter((item) => item.id !== id);
    saveStoredTerritories(filtered);
  },
};

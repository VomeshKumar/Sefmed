import { mockZones } from "../fixtures";
import type { Zone } from "../types";

const STORAGE_KEY = "sefmed_md_zones";

const getStoredZones = (): Zone[] => {
  if (typeof window === "undefined") return mockZones;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockZones));
    return mockZones;
  }
  return JSON.parse(stored);
};

const saveStoredZones = (data: Zone[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const zonesApi = {
  list: async (filters?: { query?: string; status?: string }): Promise<Zone[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getStoredZones();

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (z) => z.name.toLowerCase().includes(q) || z.code.toLowerCase().includes(q),
      );
    }

    if (filters?.status) {
      list = list.filter((z) => z.status === filters.status);
    }

    return list;
  },

  create: async (data: Omit<Zone, "id" | "createdAt">): Promise<Zone> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredZones();
    const newItem: Zone = {
      ...data,
      id: `zone-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveStoredZones(list);
    return newItem;
  },

  update: async (
    id: string,
    data: Partial<Omit<Zone, "id" | "createdAt">>,
  ): Promise<Zone> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredZones();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Zone not found");

    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveStoredZones(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredZones();
    const filtered = list.filter((item) => item.id !== id);
    saveStoredZones(filtered);
  },
};

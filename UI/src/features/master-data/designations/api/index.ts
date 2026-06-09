import { mockDesignations } from "../fixtures";
import type { Designation } from "../types";

const STORAGE_KEY = "sefmed_md_designations";

const getStoredDesignations = (): Designation[] => {
  if (typeof window === "undefined") return mockDesignations;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockDesignations));
    return mockDesignations;
  }
  return JSON.parse(stored);
};

const saveStoredDesignations = (data: Designation[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const designationsApi = {
  list: async (filters?: { query?: string; status?: string }): Promise<Designation[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getStoredDesignations();

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

  create: async (data: Omit<Designation, "id" | "createdAt">): Promise<Designation> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredDesignations();
    const newItem: Designation = {
      ...data,
      id: `desig-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveStoredDesignations(list);
    return newItem;
  },

  update: async (
    id: string,
    data: Partial<Omit<Designation, "id" | "createdAt">>,
  ): Promise<Designation> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredDesignations();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Designation not found");

    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveStoredDesignations(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredDesignations();
    const filtered = list.filter((item) => item.id !== id);
    saveStoredDesignations(filtered);
  },
};

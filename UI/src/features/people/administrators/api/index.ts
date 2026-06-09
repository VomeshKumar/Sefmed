import { mockAdministrators } from "../fixtures";
import type { Administrator } from "../types";

const STORAGE_KEY = "sefmed_people_administrators";

const getStoredAdministrators = (): Administrator[] => {
  if (typeof window === "undefined") return mockAdministrators;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAdministrators));
    return mockAdministrators;
  }
  return JSON.parse(stored);
};

const saveStoredAdministrators = (data: Administrator[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const administratorsApi = {
  list: async (filters?: { query?: string; status?: string }): Promise<Administrator[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getStoredAdministrators();

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.contact.includes(q),
      );
    }

    if (filters?.status) {
      list = list.filter((a) => a.status === filters.status);
    }

    return list;
  },

  get: async (id: string): Promise<Administrator | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = getStoredAdministrators();
    return list.find((a) => a.id === id) || null;
  },

  create: async (data: Omit<Administrator, "id" | "createdAt">): Promise<Administrator> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredAdministrators();
    const newItem: Administrator = {
      ...data,
      id: `admin-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveStoredAdministrators(list);
    return newItem;
  },

  update: async (
    id: string,
    data: Partial<Omit<Administrator, "id" | "createdAt">>,
  ): Promise<Administrator> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredAdministrators();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Administrator not found");

    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveStoredAdministrators(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredAdministrators();
    const filtered = list.filter((item) => item.id !== id);
    saveStoredAdministrators(filtered);
  },
};

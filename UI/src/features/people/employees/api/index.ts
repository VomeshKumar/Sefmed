import { mockEmployees } from "../fixtures";
import type { Employee } from "../types";

const STORAGE_KEY = "sefmed_people_employees";

const getStoredEmployees = (): Employee[] => {
  if (typeof window === "undefined") return mockEmployees;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEmployees));
    return mockEmployees;
  }
  try {
    const parsed = JSON.parse(stored) as Employee[];
    if (!parsed.some((e) => e.id === "emp-abhishek")) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEmployees));
      return mockEmployees;
    }
    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEmployees));
    return mockEmployees;
  }
};

const saveStoredEmployees = (data: Employee[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const employeesApi = {
  list: async (filters?: {
    query?: string;
    designationId?: string;
    divisionId?: string;
    zoneId?: string;
    status?: string;
  }): Promise<Employee[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getStoredEmployees();

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.contact.includes(q),
      );
    }

    if (filters?.designationId) {
      list = list.filter((e) => e.designationId === filters.designationId);
    }

    if (filters?.divisionId) {
      list = list.filter((e) => e.divisionId === filters.divisionId);
    }

    if (filters?.zoneId) {
      list = list.filter((e) => e.zoneId === filters.zoneId);
    }

    if (filters?.status) {
      list = list.filter((e) => e.status === filters.status);
    }

    return list;
  },

  get: async (id: string): Promise<Employee | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = getStoredEmployees();
    return list.find((e) => e.id === id) || null;
  },

  create: async (data: Omit<Employee, "id" | "createdAt">): Promise<Employee> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredEmployees();
    const newItem: Employee = {
      ...data,
      id: `emp-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveStoredEmployees(list);
    return newItem;
  },

  update: async (
    id: string,
    data: Partial<Omit<Employee, "id" | "createdAt">>,
  ): Promise<Employee> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredEmployees();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Employee not found");

    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveStoredEmployees(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredEmployees();
    const filtered = list.filter((item) => item.id !== id);
    saveStoredEmployees(filtered);
  },
};

import { mockDoctors } from "../fixtures";
import type { Doctor } from "../types";

const STORAGE_KEY = "sefmed_people_doctors";

const getStoredDoctors = (): Doctor[] => {
  if (typeof window === "undefined") return mockDoctors;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockDoctors));
    return mockDoctors;
  }
  return JSON.parse(stored);
};

const saveStoredDoctors = (data: Doctor[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const doctorsApi = {
  list: async (filters?: {
    query?: string;
    speciality?: string;
    status?: string;
    zoneId?: string;
    territoryId?: string;
    assignedEmployeeId?: string;
  }): Promise<Doctor[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getStoredDoctors();

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.registrationNumber.toLowerCase().includes(q) ||
          d.doctorCode.toLowerCase().includes(q) ||
          d.hospitalName.toLowerCase().includes(q) ||
          (d.clinicAddress && d.clinicAddress.toLowerCase().includes(q)) ||
          d.contact.includes(q),
      );
    }

    if (filters?.speciality) {
      list = list.filter((d) => d.speciality === filters.speciality);
    }

    if (filters?.status) {
      list = list.filter((d) => d.status === filters.status);
    }

    if (filters?.zoneId) {
      list = list.filter((d) => d.zoneId === filters.zoneId);
    }

    if (filters?.territoryId) {
      list = list.filter((d) => d.territoryId === filters.territoryId);
    }

    if (filters?.assignedEmployeeId) {
      list = list.filter((d) => d.assignedEmployeeId === filters.assignedEmployeeId);
    }

    return list;
  },

  get: async (id: string): Promise<Doctor | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const list = getStoredDoctors();
    return list.find((d) => d.id === id) || null;
  },

  create: async (data: Omit<Doctor, "id" | "createdAt">): Promise<Doctor> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredDoctors();
    const newItem: Doctor = {
      ...data,
      id: `doc-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveStoredDoctors(list);
    return newItem;
  },

  update: async (
    id: string,
    data: Partial<Omit<Doctor, "id" | "createdAt">>,
  ): Promise<Doctor> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredDoctors();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Doctor not found");

    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveStoredDoctors(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredDoctors();
    const filtered = list.filter((item) => item.id !== id);
    saveStoredDoctors(filtered);
  },
};

import { mockDoctorVisits, mockFirmVisits, mockVisitPlanner } from "../fixtures";
import type { DoctorVisit, FirmVisit, VisitPlanner } from "../types";

const DVISITS_KEY = "sefmed_visits_doctor";
const FVISITS_KEY = "sefmed_visits_firm";
const PLANNER_KEY = "sefmed_visits_planner";

// Getter/setters for LocalStorage
const getDoctorVisits = (): DoctorVisit[] => {
  if (typeof window === "undefined") return mockDoctorVisits;
  const stored = localStorage.getItem(DVISITS_KEY);
  if (!stored) {
    localStorage.setItem(DVISITS_KEY, JSON.stringify(mockDoctorVisits));
    return mockDoctorVisits;
  }
  return JSON.parse(stored);
};

const saveDoctorVisits = (data: DoctorVisit[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(DVISITS_KEY, JSON.stringify(data));
  }
};

const getFirmVisits = (): FirmVisit[] => {
  if (typeof window === "undefined") return mockFirmVisits;
  const stored = localStorage.getItem(FVISITS_KEY);
  if (!stored) {
    localStorage.setItem(FVISITS_KEY, JSON.stringify(mockFirmVisits));
    return mockFirmVisits;
  }
  return JSON.parse(stored);
};

const saveFirmVisits = (data: FirmVisit[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(FVISITS_KEY, JSON.stringify(data));
  }
};

const getPlannerItems = (): VisitPlanner[] => {
  if (typeof window === "undefined") return mockVisitPlanner;
  const stored = localStorage.getItem(PLANNER_KEY);
  if (!stored) {
    localStorage.setItem(PLANNER_KEY, JSON.stringify(mockVisitPlanner));
    return mockVisitPlanner;
  }
  return JSON.parse(stored);
};

const savePlannerItems = (data: VisitPlanner[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(PLANNER_KEY, JSON.stringify(data));
  }
};

export const visitsApi = {
  // Doctor Visits Endpoints
  listDoctorVisits: async (filters?: {
    query?: string;
    speciality?: string; // Doctor's speciality (requires mapping lookups outside, or done in component)
    status?: string;
    doctorId?: string;
    assignedEmployeeId?: string;
  }): Promise<DoctorVisit[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getDoctorVisits();

    if (filters?.status) {
      list = list.filter((v) => v.status === filters.status);
    }
    if (filters?.doctorId) {
      list = list.filter((v) => v.doctorId === filters.doctorId);
    }
    if (filters?.assignedEmployeeId) {
      list = list.filter((v) => v.assignedEmployeeId === filters.assignedEmployeeId);
    }
    return list;
  },

  getDoctorVisit: async (id: string): Promise<DoctorVisit | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return getDoctorVisits().find((v) => v.id === id) || null;
  },

  createDoctorVisit: async (data: Omit<DoctorVisit, "id" | "createdAt">): Promise<DoctorVisit> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getDoctorVisits();
    const newItem: DoctorVisit = {
      ...data,
      id: `dvisit-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveDoctorVisits(list);
    return newItem;
  },

  updateDoctorVisit: async (
    id: string,
    data: Partial<Omit<DoctorVisit, "id" | "createdAt">>,
  ): Promise<DoctorVisit> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getDoctorVisits();
    const idx = list.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error("Doctor visit not found");
    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveDoctorVisits(list);
    return updated;
  },

  deleteDoctorVisit: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    saveDoctorVisits(getDoctorVisits().filter((v) => v.id !== id));
  },

  // Firm Visits Endpoints
  listFirmVisits: async (filters?: {
    query?: string;
    status?: string;
    firmType?: string;
    assignedEmployeeId?: string;
  }): Promise<FirmVisit[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getFirmVisits();

    if (filters?.status) {
      list = list.filter((v) => v.status === filters.status);
    }
    if (filters?.firmType) {
      list = list.filter((v) => v.firmType === filters.firmType);
    }
    if (filters?.assignedEmployeeId) {
      list = list.filter((v) => v.assignedEmployeeId === filters.assignedEmployeeId);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (v) =>
          v.firmName.toLowerCase().includes(q) ||
          v.purpose.toLowerCase().includes(q) ||
          (v.remarks && v.remarks.toLowerCase().includes(q)),
      );
    }
    return list;
  },

  getFirmVisit: async (id: string): Promise<FirmVisit | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return getFirmVisits().find((v) => v.id === id) || null;
  },

  createFirmVisit: async (data: Omit<FirmVisit, "id" | "createdAt">): Promise<FirmVisit> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getFirmVisits();
    const newItem: FirmVisit = {
      ...data,
      id: `fvisit-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveFirmVisits(list);
    return newItem;
  },

  updateFirmVisit: async (
    id: string,
    data: Partial<Omit<FirmVisit, "id" | "createdAt">>,
  ): Promise<FirmVisit> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getFirmVisits();
    const idx = list.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error("Firm visit not found");
    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveFirmVisits(list);
    return updated;
  },

  deleteFirmVisit: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    saveFirmVisits(getFirmVisits().filter((v) => v.id !== id));
  },

  // Planner Endpoints
  listPlannerItems: async (filters?: {
    assignedEmployeeId?: string;
    plannedDate?: string;
  }): Promise<VisitPlanner[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getPlannerItems();

    if (filters?.assignedEmployeeId) {
      list = list.filter((p) => p.assignedEmployeeId === filters.assignedEmployeeId);
    }
    if (filters?.plannedDate) {
      const dateStr = filters.plannedDate.substring(0, 10);
      list = list.filter((p) => p.plannedDate.startsWith(dateStr));
    }
    return list;
  },

  createPlannerItem: async (data: Omit<VisitPlanner, "id" | "createdAt">): Promise<VisitPlanner> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getPlannerItems();
    const newItem: VisitPlanner = {
      ...data,
      id: `plan-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    savePlannerItems(list);
    return newItem;
  },

  updatePlannerItem: async (
    id: string,
    data: Partial<Omit<VisitPlanner, "id" | "createdAt">>,
  ): Promise<VisitPlanner> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getPlannerItems();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Planner item not found");
    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    savePlannerItems(list);
    return updated;
  },

  deletePlannerItem: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    savePlannerItems(getPlannerItems().filter((p) => p.id !== id));
  },

  // Dashboard Visit Adapters
  getDashboardVisitStats: async (): Promise<{
    totalVisits: number;
    openVisits: number;
    closedVisits: number;
    rescheduledVisits: number;
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const dVisits = getDoctorVisits();
    const fVisits = getFirmVisits();

    const allVisits = [...dVisits, ...fVisits];
    const totalVisits = allVisits.length;
    const openVisits = allVisits.filter((v) => v.status === "open" || v.status === "planned").length;
    const closedVisits = allVisits.filter((v) => v.status === "closed" || v.status === "approved").length;
    const rescheduledVisits = allVisits.filter((v) => v.status === "rescheduled").length;

    return {
      totalVisits,
      openVisits,
      closedVisits,
      rescheduledVisits,
    };
  },
};

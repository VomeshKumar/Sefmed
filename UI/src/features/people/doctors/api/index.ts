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
    const response = await fetch("http://localhost:3000/api/doctors");
    if (!response.ok) {
      throw new Error("Failed to fetch doctors");
    }
    let list: Doctor[] = await response.json();

    // Map backend snake_case fields to frontend expected fields
    list = list.map((d: any) => ({
      id: d.id.toString(),
      name: d.doctor_name,
      doctorCode: d.doctor_code,
      registrationNumber: d.registration_number,
      hospitalName: d.hospital_name,
      clinicAddress: d.district || d.city,
      speciality: d.speciality,
      category: d.category,
      assignedEmployeeId: d.assigned_to,
      contact: d.contact_number,
      status: "active",
      zoneId: d.zone,
      territoryId: d.city,
      createdAt: d.created_at,
      qualification: d.qualification,
      divisionId: d.division,
      email: d.email,
      gender: d.gender,
      dob: d.date_of_birth,
      anniversary: d.anniversary,
      type: d.type,
      firm: d.firm_name,
      approxBusiness: d.approximated_business ? Number(d.approximated_business) : undefined,
      prefix: d.prefix,
      maritalStatus: d.marital_status,
      district: d.district,
      pincode: d.pincode,
      state: d.state,
    } as any));

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.registrationNumber?.toLowerCase().includes(q) ||
          d.doctorCode?.toLowerCase().includes(q) ||
          d.hospitalName?.toLowerCase().includes(q) ||
          (d.clinicAddress && d.clinicAddress.toLowerCase().includes(q)) ||
          d.contact?.includes(q),
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

  create: async (data: any): Promise<Doctor> => {
    // Map frontend fields to backend expected fields
    const payload = {
      doctorCode: data.doctorCode,
      prefix: data.prefix,
      doctorName: data.name,
      hospitalName: data.hospitalName,
      gender: data.gender,
      contactNumber: data.contact,
      email: data.email,
      dateOfBirth: data.dob,
      maritalStatus: data.maritalStatus,
      anniversary: data.anniversary,
      qualification: data.qualification,
      state: data.state,
      division: data.divisionId,
      zone: data.zoneId,
      district: data.district,
      city: data.territoryId, // territoryId is city
      pincode: data.pincode,
      speciality: data.speciality,
      type: data.type,
      category: data.category,
      approximatedBusiness: data.approxBusiness?.toString(),
      assignedTo: data.assignedEmployeeId,
      firmName: data.firm,
      registrationNumber: data.registrationNumber
    };

    const response = await fetch("http://localhost:3000/api/doctors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create doctor");
    }

    const result = await response.json();
    return {
      ...data,
      id: result.doctorId.toString(),
      createdAt: new Date().toISOString(),
    } as Doctor;
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

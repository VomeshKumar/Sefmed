import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { visitsApi } from "../api";
import type { DoctorVisit, FirmVisit, VisitPlanner } from "../types";

// Doctor Visit Hooks
export function useDoctorVisits(filters?: {
  query?: string;
  status?: string;
  doctorId?: string;
  assignedEmployeeId?: string;
}) {
  return useQuery({
    queryKey: ["doctorVisits", filters],
    queryFn: () => visitsApi.listDoctorVisits(filters),
  });
}

export function useDoctorVisitDetail(id: string) {
  return useQuery({
    queryKey: ["doctorVisit", id],
    queryFn: () => visitsApi.getDoctorVisit(id),
    enabled: !!id,
  });
}

export function useCreateDoctorVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<DoctorVisit, "id" | "createdAt">) => visitsApi.createDoctorVisit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorVisits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardVisitStats"] });
    },
  });
}

export function useUpdateDoctorVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<DoctorVisit, "id" | "createdAt">> }) =>
      visitsApi.updateDoctorVisit(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctorVisits"] });
      queryClient.invalidateQueries({ queryKey: ["doctorVisit", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboardVisitStats"] });
    },
  });
}

export function useDeleteDoctorVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => visitsApi.deleteDoctorVisit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorVisits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardVisitStats"] });
    },
  });
}

// Firm Visit Hooks
export function useFirmVisits(filters?: {
  query?: string;
  status?: string;
  firmType?: string;
  assignedEmployeeId?: string;
}) {
  return useQuery({
    queryKey: ["firmVisits", filters],
    queryFn: () => visitsApi.listFirmVisits(filters),
  });
}

export function useFirmVisitDetail(id: string) {
  return useQuery({
    queryKey: ["firmVisit", id],
    queryFn: () => visitsApi.getFirmVisit(id),
    enabled: !!id,
  });
}

export function useCreateFirmVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<FirmVisit, "id" | "createdAt">) => visitsApi.createFirmVisit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firmVisits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardVisitStats"] });
    },
  });
}

export function useUpdateFirmVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<FirmVisit, "id" | "createdAt">> }) =>
      visitsApi.updateFirmVisit(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["firmVisits"] });
      queryClient.invalidateQueries({ queryKey: ["firmVisit", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboardVisitStats"] });
    },
  });
}

export function useDeleteFirmVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => visitsApi.deleteFirmVisit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firmVisits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardVisitStats"] });
    },
  });
}

// Planner Hooks
export function usePlannerItems(filters?: {
  assignedEmployeeId?: string;
  plannedDate?: string;
}) {
  return useQuery({
    queryKey: ["plannerItems", filters],
    queryFn: () => visitsApi.listPlannerItems(filters),
  });
}

export function useCreatePlannerItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<VisitPlanner, "id" | "createdAt">) => visitsApi.createPlannerItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plannerItems"] });
    },
  });
}

export function useUpdatePlannerItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<VisitPlanner, "id" | "createdAt">> }) =>
      visitsApi.updatePlannerItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plannerItems"] });
    },
  });
}

export function useDeletePlannerItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => visitsApi.deletePlannerItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plannerItems"] });
    },
  });
}

// Dashboard Adapter Hook
export function useDashboardVisitStats() {
  return useQuery({
    queryKey: ["dashboardVisitStats"],
    queryFn: () => visitsApi.getDashboardVisitStats(),
  });
}

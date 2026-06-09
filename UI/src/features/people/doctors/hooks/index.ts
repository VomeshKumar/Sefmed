import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorsApi } from "../api";
import type { Doctor } from "../types";

export function useDoctorsList(filters?: {
  query?: string;
  speciality?: string;
  status?: string;
  zoneId?: string;
  territoryId?: string;
  assignedEmployeeId?: string;
}) {
  return useQuery({
    queryKey: ["doctors", filters],
    queryFn: () => doctorsApi.list(filters),
  });
}

export function useDoctorDetail(id: string) {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => doctorsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Doctor, "id" | "createdAt">) => doctorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Doctor, "id" | "createdAt">> }) =>
      doctorsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", variables.id] });
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doctorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}

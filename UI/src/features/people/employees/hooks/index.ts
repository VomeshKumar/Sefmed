import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeesApi } from "../api";
import type { Employee } from "../types";

export function useEmployeesList(filters?: {
  query?: string;
  designationId?: string;
  divisionId?: string;
  zoneId?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ["employees", filters],
    queryFn: () => employeesApi.list(filters),
  });
}

export function useEmployeeDetail(id: string) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => employeesApi.get(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Employee, "id" | "createdAt">) => employeesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Employee, "id" | "createdAt">> }) =>
      employeesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", variables.id] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

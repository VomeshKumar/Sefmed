import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { designationsApi } from "../api";
import type { Designation } from "../types";

export function useDesignationsList(filters?: { query?: string; status?: string }) {
  return useQuery({
    queryKey: ["designations", filters],
    queryFn: () => designationsApi.list(filters),
  });
}

export function useCreateDesignation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Designation, "id" | "createdAt">) => designationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designations"] });
    },
  });
}

export function useUpdateDesignation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Designation, "id" | "createdAt">> }) =>
      designationsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designations"] });
    },
  });
}

export function useDeleteDesignation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => designationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designations"] });
    },
  });
}

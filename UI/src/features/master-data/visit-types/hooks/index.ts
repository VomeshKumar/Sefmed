import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { visitTypesApi } from "../api";
import type { VisitType } from "../types";

export function useVisitTypesList(filters?: { query?: string; status?: string }) {
  return useQuery({
    queryKey: ["visit-types", filters],
    queryFn: () => visitTypesApi.list(filters),
  });
}

export function useCreateVisitType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<VisitType, "id" | "createdAt">) => visitTypesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visit-types"] });
    },
  });
}

export function useUpdateVisitType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<VisitType, "id" | "createdAt">> }) =>
      visitTypesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visit-types"] });
    },
  });
}

export function useDeleteVisitType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => visitTypesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visit-types"] });
    },
  });
}

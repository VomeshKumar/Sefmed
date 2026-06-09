import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { territoriesApi } from "../api";
import type { Territory } from "../types";

export function useTerritoriesList(filters?: { query?: string; zoneId?: string; status?: string }) {
  return useQuery({
    queryKey: ["territories", filters],
    queryFn: () => territoriesApi.list(filters),
  });
}

export function useCreateTerritory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Territory, "id" | "createdAt">) => territoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["territories"] });
    },
  });
}

export function useUpdateTerritory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Territory, "id" | "createdAt">> }) =>
      territoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["territories"] });
    },
  });
}

export function useDeleteTerritory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => territoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["territories"] });
    },
  });
}

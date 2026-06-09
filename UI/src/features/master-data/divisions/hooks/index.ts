import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { divisionsApi } from "../api";
import type { Division } from "../types";

export function useDivisionsList(filters?: { query?: string; status?: string }) {
  return useQuery({
    queryKey: ["divisions", filters],
    queryFn: () => divisionsApi.list(filters),
  });
}

export function useCreateDivision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Division, "id" | "createdAt">) => divisionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
    },
  });
}

export function useUpdateDivision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Division, "id" | "createdAt">> }) =>
      divisionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
    },
  });
}

export function useDeleteDivision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => divisionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions"] });
    },
  });
}

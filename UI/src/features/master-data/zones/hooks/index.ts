import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zonesApi } from "../api";
import type { Zone } from "../types";

export function useZonesList(filters?: { query?: string; status?: string }) {
  return useQuery({
    queryKey: ["zones", filters],
    queryFn: () => zonesApi.list(filters),
  });
}

export function useCreateZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Zone, "id" | "createdAt">) => zonesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}

export function useUpdateZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Zone, "id" | "createdAt">> }) =>
      zonesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}

export function useDeleteZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => zonesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zones"] });
    },
  });
}

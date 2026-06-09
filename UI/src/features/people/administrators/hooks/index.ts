import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { administratorsApi } from "../api";
import type { Administrator } from "../types";

export function useAdministratorsList(filters?: { query?: string; status?: string }) {
  return useQuery({
    queryKey: ["administrators", filters],
    queryFn: () => administratorsApi.list(filters),
  });
}

export function useAdministratorDetail(id: string) {
  return useQuery({
    queryKey: ["administrator", id],
    queryFn: () => administratorsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateAdministrator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Administrator, "id" | "createdAt">) =>
      administratorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
    },
  });
}

export function useUpdateAdministrator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Administrator, "id" | "createdAt">>;
    }) => administratorsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
      queryClient.invalidateQueries({ queryKey: ["administrator", variables.id] });
    },
  });
}

export function useDeleteAdministrator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => administratorsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administrators"] });
    },
  });
}

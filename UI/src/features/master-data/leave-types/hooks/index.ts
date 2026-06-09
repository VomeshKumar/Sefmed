import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveTypesApi } from "../api";
import type { LeaveType } from "../types";

export function useLeaveTypesList(filters?: { query?: string; status?: string }) {
  return useQuery({
    queryKey: ["leave-types", filters],
    queryFn: () => leaveTypesApi.list(filters),
  });
}

export function useCreateLeaveType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<LeaveType, "id" | "createdAt">) => leaveTypesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-types"] });
    },
  });
}

export function useUpdateLeaveType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<LeaveType, "id" | "createdAt">> }) =>
      leaveTypesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-types"] });
    },
  });
}

export function useDeleteLeaveType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leaveTypesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-types"] });
    },
  });
}

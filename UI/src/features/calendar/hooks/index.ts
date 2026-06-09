import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { holidaysApi, leaveRequestsApi, leaveBalancesApi } from "../api";
import type { LeaveStatus } from "../types";

// ─── Query Keys ────────────────────────────────────────────────────────────────
export const calendarKeys = {
  holidays: ["holidays"] as const,
  holidayList: (filters?: object) => ["holidays", "list", filters] as const,
  holiday: (id: string) => ["holidays", "detail", id] as const,

  leaves: ["leaves"] as const,
  leaveList: (filters?: object) => ["leaves", "list", filters] as const,
  leave: (id: string) => ["leaves", "detail", id] as const,

  balances: ["leave-balances"] as const,
  balancesForEmployee: (empId: string, year?: number) => ["leave-balances", empId, year] as const,
  allBalances: (year?: number) => ["leave-balances", "all", year] as const,
};

// ─── Holiday Hooks ─────────────────────────────────────────────────────────────
export function useHolidaysList(filters?: { year?: number; type?: string; query?: string }) {
  return useQuery({
    queryKey: calendarKeys.holidayList(filters),
    queryFn: () => holidaysApi.list(filters),
  });
}

export function useHoliday(id: string) {
  return useQuery({
    queryKey: calendarKeys.holiday(id),
    queryFn: () => holidaysApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateHoliday() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: holidaysApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: calendarKeys.holidays }),
  });
}

export function useUpdateHoliday() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof holidaysApi.update>[1] }) =>
      holidaysApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: calendarKeys.holidays }),
  });
}

export function useDeleteHoliday() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: holidaysApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: calendarKeys.holidays }),
  });
}

// ─── Leave Request Hooks ───────────────────────────────────────────────────────
export function useLeaveRequestsList(filters?: {
  employeeId?: string;
  leaveTypeId?: string;
  status?: LeaveStatus | "all";
  year?: number;
  query?: string;
}) {
  return useQuery({
    queryKey: calendarKeys.leaveList(filters),
    queryFn: () => leaveRequestsApi.list(filters),
  });
}

export function useLeaveRequest(id: string) {
  return useQuery({
    queryKey: calendarKeys.leave(id),
    queryFn: () => leaveRequestsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateLeaveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: leaveRequestsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: calendarKeys.leaves }),
  });
}

export function useApproveLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approverId }: { id: string; approverId: string }) =>
      leaveRequestsApi.approve(id, approverId),
    onSuccess: () => qc.invalidateQueries({ queryKey: calendarKeys.leaves }),
  });
}

export function useRejectLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approverId, reason }: { id: string; approverId: string; reason: string }) =>
      leaveRequestsApi.reject(id, approverId, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: calendarKeys.leaves }),
  });
}

export function useCancelLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: leaveRequestsApi.cancel,
    onSuccess: () => qc.invalidateQueries({ queryKey: calendarKeys.leaves }),
  });
}

export function useDeleteLeaveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: leaveRequestsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: calendarKeys.leaves }),
  });
}

// ─── Leave Balance Hooks ───────────────────────────────────────────────────────
export function useLeaveBalancesForEmployee(employeeId: string, year?: number) {
  return useQuery({
    queryKey: calendarKeys.balancesForEmployee(employeeId, year),
    queryFn: () => leaveBalancesApi.listForEmployee(employeeId, year),
    enabled: !!employeeId,
  });
}

export function useAllLeaveBalances(year?: number) {
  return useQuery({
    queryKey: calendarKeys.allBalances(year),
    queryFn: () => leaveBalancesApi.list(year),
  });
}

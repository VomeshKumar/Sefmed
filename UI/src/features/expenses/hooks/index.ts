import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expensesApi, sfcApi } from "../api";
import type { Expense, ExpenseStatus, TransportType } from "../types";

// ─── Query Keys ────────────────────────────────────────────────────────────────
export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => ["expenses", "list"] as const,
  list: (filters?: object) => ["expenses", "list", filters] as const,
  detail: (id: string) => ["expenses", "detail", id] as const,

  sfcs: ["sfcs"] as const,
  sfcList: (filters?: object) => ["sfcs", "list", filters] as const,
};

// ─── Expense List ──────────────────────────────────────────────────────────────
export function useExpensesList(filters?: {
  query?: string;
  employeeId?: string;
  status?: ExpenseStatus | "all";
  month?: string;
  expenseHeadId?: string;
}) {
  return useQuery({
    queryKey: expenseKeys.list(filters),
    queryFn: () => expensesApi.list(filters),
  });
}

// ─── Expense Detail ────────────────────────────────────────────────────────────
export function useExpense(id: string) {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => expensesApi.getById(id),
    enabled: !!id,
  });
}

// ─── Create Expense ────────────────────────────────────────────────────────────
export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: expensesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.all }),
  });
}

// ─── Update Expense ────────────────────────────────────────────────────────────
export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof expensesApi.update>[1];
    }) => expensesApi.update(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: expenseKeys.all });
      qc.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
    },
  });
}

// ─── Submit Expense ────────────────────────────────────────────────────────────
export function useSubmitExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, employeeId }: { id: string; employeeId: string }) =>
      expensesApi.submit(id, employeeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.all }),
  });
}

// ─── Approve Expense ───────────────────────────────────────────────────────────
export function useApproveExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      approverId,
      approvedAmount,
      remarks,
      action,
    }: {
      id: string;
      approverId: string;
      approvedAmount: number;
      remarks?: string;
      action?: "approved" | "partially_approved";
    }) => expensesApi.approve(id, approverId, approvedAmount, remarks, action),
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.all }),
  });
}

// ─── Reject Expense ────────────────────────────────────────────────────────────
export function useRejectExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      approverId,
      remarks,
    }: {
      id: string;
      approverId: string;
      remarks: string;
    }) => expensesApi.reject(id, approverId, remarks),
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.all }),
  });
}

// ─── Return Expense ────────────────────────────────────────────────────────────
export function useReturnExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      approverId,
      remarks,
    }: {
      id: string;
      approverId: string;
      remarks: string;
    }) => expensesApi.return(id, approverId, remarks),
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.all }),
  });
}

// ─── Cancel Expense ────────────────────────────────────────────────────────────
export function useCancelExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, employeeId }: { id: string; employeeId: string }) =>
      expensesApi.cancel(id, employeeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.all }),
  });
}

// ─── Delete Expense ────────────────────────────────────────────────────────────
export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: expensesApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.all }),
  });
}

// ─── SFC Hooks ─────────────────────────────────────────────────────────────────
export function useSFCList(filters?: {
  transportType?: TransportType | "all";
  query?: string;
}) {
  return useQuery({
    queryKey: expenseKeys.sfcList(filters),
    queryFn: () => sfcApi.list(filters),
  });
}

export function useCreateSFC() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sfcApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.sfcs }),
  });
}

export function useUpdateSFC() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof sfcApi.update>[1];
    }) => sfcApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.sfcs }),
  });
}

export function useDeleteSFC() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sfcApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.sfcs }),
  });
}

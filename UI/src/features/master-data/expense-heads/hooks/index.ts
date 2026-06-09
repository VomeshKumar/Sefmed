import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseHeadsApi } from "../api";
import type { ExpenseHead } from "../types";

export function useExpenseHeadsList(filters?: { query?: string; status?: string }) {
  return useQuery({
    queryKey: ["expense-heads", filters],
    queryFn: () => expenseHeadsApi.list(filters),
  });
}

export function useCreateExpenseHead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ExpenseHead, "id" | "createdAt">) => expenseHeadsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-heads"] });
    },
  });
}

export function useUpdateExpenseHead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<ExpenseHead, "id" | "createdAt">> }) =>
      expenseHeadsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-heads"] });
    },
  });
}

export function useDeleteExpenseHead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expenseHeadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-heads"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productCategoriesApi } from "../api";
import type { ProductCategory } from "../types";

export function useProductCategoriesList(filters?: { query?: string; status?: string }) {
  return useQuery({
    queryKey: ["product-categories", filters],
    queryFn: () => productCategoriesApi.list(filters),
  });
}

export function useCreateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ProductCategory, "id" | "createdAt">) => productCategoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
  });
}

export function useUpdateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<ProductCategory, "id" | "createdAt">> }) =>
      productCategoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
  });
}

export function useDeleteProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productCategoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    },
  });
}

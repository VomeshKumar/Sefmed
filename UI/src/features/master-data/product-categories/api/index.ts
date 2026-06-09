import { mockProductCategories } from "../fixtures";
import type { ProductCategory } from "../types";

const STORAGE_KEY = "sefmed_md_product_categories";

const getStoredProductCategories = (): ProductCategory[] => {
  if (typeof window === "undefined") return mockProductCategories;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProductCategories));
    return mockProductCategories;
  }
  return JSON.parse(stored);
};

const saveStoredProductCategories = (data: ProductCategory[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const productCategoriesApi = {
  list: async (filters?: { query?: string; status?: string }): Promise<ProductCategory[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let list = getStoredProductCategories();

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q),
      );
    }

    if (filters?.status) {
      list = list.filter((p) => p.status === filters.status);
    }

    return list;
  },

  create: async (data: Omit<ProductCategory, "id" | "createdAt">): Promise<ProductCategory> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredProductCategories();
    const newItem: ProductCategory = {
      ...data,
      id: `cat-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(newItem);
    saveStoredProductCategories(list);
    return newItem;
  },

  update: async (
    id: string,
    data: Partial<Omit<ProductCategory, "id" | "createdAt">>,
  ): Promise<ProductCategory> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredProductCategories();
    const idx = list.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error("Product Category not found");

    const updated = { ...list[idx], ...data };
    list[idx] = updated;
    saveStoredProductCategories(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const list = getStoredProductCategories();
    const filtered = list.filter((item) => item.id !== id);
    saveStoredProductCategories(filtered);
  },
};

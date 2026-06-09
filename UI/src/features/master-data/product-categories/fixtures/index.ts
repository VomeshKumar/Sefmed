import type { ProductCategory } from "../types";

export const mockProductCategories: ProductCategory[] = [
  {
    id: "cat-cardio",
    name: "Cardiovascular Therapeutics",
    code: "CARDIO",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-diabetic",
    name: "Diabetic & Endocrine",
    code: "DIABETIC",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "cat-pediatric",
    name: "Pediatric Wellness & Nutrition",
    code: "PEDIATRIC",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "cat-otc",
    name: "OTC Wellness & Supplements",
    code: "OTC_WELLNESS",
    status: "active",
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "cat-cosmo",
    name: "Dermaceuticals & Cosmetics",
    code: "DERMA_COSMO",
    status: "inactive",
    createdAt: "2026-03-01T00:00:00Z",
  },
];

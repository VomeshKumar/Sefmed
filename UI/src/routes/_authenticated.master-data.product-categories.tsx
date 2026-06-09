import { createFileRoute } from "@tanstack/react-router";
import { ProductCategoriesPage } from "@/features/master-data/product-categories/pages/ProductCategoriesPage";

export const Route = createFileRoute(
  "/_authenticated/master-data/product-categories",
)({
  head: () => ({ meta: [{ title: "Product Categories — SEFMED CRM" }] }),
  component: ProductCategoriesPage,
});

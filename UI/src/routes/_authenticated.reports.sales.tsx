import { createFileRoute } from "@tanstack/react-router";
import { SalesReportsPage } from "@/features/reports/pages/SalesReportsPage";

export const Route = createFileRoute("/_authenticated/reports/sales")({
  head: () => ({ meta: [{ title: "Sales Reports — SEFMED CRM" }] }),
  component: SalesReportsPage,
});

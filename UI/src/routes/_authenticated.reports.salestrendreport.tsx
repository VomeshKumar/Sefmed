import { createFileRoute } from "@tanstack/react-router";
import { SalesTrendReportPage } from "@/features/reports/pages/SalesTrendReportPage";

export const Route = createFileRoute("/_authenticated/reports/salestrendreport")({
  head: () => ({ meta: [{ title: "Sales Trend Report — SEFMED CRM" }] }),
  component: SalesTrendReportPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { DiscrepancyReportPage } from "@/features/reports/pages/DiscrepancyReportPage";

export const Route = createFileRoute("/_authenticated/reports/discrepancyreport")({
  head: () => ({ meta: [{ title: "Discrepancy Report — SEFMED CRM" }] }),
  component: DiscrepancyReportPage,
});

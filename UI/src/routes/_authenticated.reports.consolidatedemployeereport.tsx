import { createFileRoute } from "@tanstack/react-router";
import { ConsolidatedEmployeeReportPage } from "@/features/reports/pages/ConsolidatedEmployeeReportPage";

export const Route = createFileRoute("/_authenticated/reports/consolidatedemployeereport")({
  head: () => ({ meta: [{ title: "Consolidated Employee Wise Report — SEFMED CRM" }] }),
  component: ConsolidatedEmployeeReportPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { ChemistVisitReportPage } from "@/features/reports/pages/ChemistVisitReportPage";

export const Route = createFileRoute("/_authenticated/reports/chemistvisitreport")({
  head: () => ({ meta: [{ title: "Firm Visit Report — SEFMED CRM" }] }),
  component: ChemistVisitReportPage,
});

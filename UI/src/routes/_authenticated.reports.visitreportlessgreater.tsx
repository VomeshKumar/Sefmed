import { createFileRoute } from "@tanstack/react-router";
import { VisitReportLessGreaterPage } from "@/features/reports/pages/VisitReportLessGreaterPage";

export const Route = createFileRoute("/_authenticated/reports/visitreportlessgreater")({
  head: () => ({ meta: [{ title: "Visit Report — SEFMED CRM" }] }),
  component: VisitReportLessGreaterPage,
});

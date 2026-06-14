import { createFileRoute } from "@tanstack/react-router";
import { PresentationReportPage } from "@/features/reports/pages/PresentationReportPage";

export const Route = createFileRoute("/_authenticated/reports/presentationreport")({
  head: () => ({ meta: [{ title: "Presentation Report — SEFMED CRM" }] }),
  component: PresentationReportPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { CallAverageReportPage } from "@/features/reports/pages/CallAverageReportPage";

export const Route = createFileRoute("/_authenticated/reports/showcallaveragereport")({
  head: () => ({ meta: [{ title: "Call Average Report — SEFMED CRM" }] }),
  component: CallAverageReportPage,
});

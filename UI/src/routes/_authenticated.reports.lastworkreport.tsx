import { createFileRoute } from "@tanstack/react-router";
import { LastWorkReportPage } from "@/features/reports/pages/LastWorkReportPage";

export const Route = createFileRoute("/_authenticated/reports/lastworkreport")({
  head: () => ({ meta: [{ title: "Last Work Report — SEFMED CRM" }] }),
  component: LastWorkReportPage,
});

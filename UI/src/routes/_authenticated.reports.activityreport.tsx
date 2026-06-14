import { createFileRoute } from "@tanstack/react-router";
import { ActivityReportPage } from "@/features/reports/pages/ActivityReportPage";

export const Route = createFileRoute("/_authenticated/reports/activityreport")({
  head: () => ({ meta: [{ title: "Activity Report — SEFMED CRM" }] }),
  component: ActivityReportPage,
});

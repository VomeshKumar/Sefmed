import { createFileRoute } from "@tanstack/react-router";
import { DateWiseCallActivityReportPage } from "@/features/reports/pages/DateWiseCallActivityReportPage";

export const Route = createFileRoute("/_authenticated/reports/datewisecallactivityreport")({
  head: () => ({ meta: [{ title: "Date Wise Call Activity Report — SEFMED CRM" }] }),
  component: DateWiseCallActivityReportPage,
});

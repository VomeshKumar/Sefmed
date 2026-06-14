import { createFileRoute } from "@tanstack/react-router";
import { ObjectiveReportPage } from "@/features/reports/pages/ObjectiveReportPage";

export const Route = createFileRoute("/_authenticated/reports/objectivereport")({
  head: () => ({ meta: [{ title: "Objective Wise Call Report — SEFMED CRM" }] }),
  component: ObjectiveReportPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { DailyCallReportForLotusPage } from "@/features/reports/pages/DailyCallReportForLotusPage";

export const Route = createFileRoute("/_authenticated/reports/dailycallreportforlotus")({
  head: () => ({ meta: [{ title: "Daily Call Report — SEFMED CRM" }] }),
  component: DailyCallReportForLotusPage,
});

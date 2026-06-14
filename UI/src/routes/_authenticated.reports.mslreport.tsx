import { createFileRoute } from "@tanstack/react-router";
import { MslReportPage } from "@/features/reports/pages/MslReportPage";

export const Route = createFileRoute("/_authenticated/reports/mslreport")({
  head: () => ({ meta: [{ title: "MSL Report — SEFMED CRM" }] }),
  component: MslReportPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { DcrReportPage } from "@/features/reports/pages/DcrReportPage";

export const Route = createFileRoute("/_authenticated/reports/docotrandfirmcallreport")({
  head: () => ({ meta: [{ title: "DCR Report — SEFMED CRM" }] }),
  component: DcrReportPage,
});

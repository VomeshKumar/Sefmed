import { createFileRoute } from "@tanstack/react-router";
import { RoiReportPage } from "@/features/reports/pages/RoiReportPage";

export const Route = createFileRoute("/_authenticated/reports/roireport")({
  head: () => ({ meta: [{ title: "ROI Report — SEFMED CRM" }] }),
  component: RoiReportPage,
});

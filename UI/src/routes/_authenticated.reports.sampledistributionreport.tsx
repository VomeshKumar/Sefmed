import { createFileRoute } from "@tanstack/react-router";
import { SampleDistributionReportPage } from "@/features/reports/pages/SampleDistributionReportPage";

export const Route = createFileRoute("/_authenticated/reports/sampledistributionreport")({
  head: () => ({ meta: [{ title: "Sample Distribution Report — SEFMED CRM" }] }),
  component: SampleDistributionReportPage,
});

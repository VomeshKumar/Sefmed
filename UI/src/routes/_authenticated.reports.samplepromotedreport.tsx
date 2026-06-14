import { createFileRoute } from "@tanstack/react-router";
import { SamplePromotedReportPage } from "@/features/reports/pages/SamplePromotedReportPage";

export const Route = createFileRoute("/_authenticated/reports/samplepromotedreport")({
  head: () => ({ meta: [{ title: "Sample Promoted Report — SEFMED CRM" }] }),
  component: SamplePromotedReportPage,
});

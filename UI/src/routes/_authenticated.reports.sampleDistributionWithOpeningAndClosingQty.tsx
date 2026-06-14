import { createFileRoute } from "@tanstack/react-router";
import { SampleDistributionWithOpeningAndClosingQtyPage } from "@/features/reports/pages/SampleDistributionWithOpeningAndClosingQtyPage";

export const Route = createFileRoute("/_authenticated/reports/sampleDistributionWithOpeningAndClosingQty")({
  head: () => ({ meta: [{ title: "Sample Distribution With Opening & Closing Quantity — SEFMED CRM" }] }),
  component: SampleDistributionWithOpeningAndClosingQtyPage,
});

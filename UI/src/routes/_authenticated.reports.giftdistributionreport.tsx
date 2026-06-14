import { createFileRoute } from "@tanstack/react-router";
import { GiftDistributionReportPage } from "@/features/reports/pages/GiftDistributionReportPage";

export const Route = createFileRoute("/_authenticated/reports/giftdistributionreport")({
  head: () => ({ meta: [{ title: "Gift Distribution Report — SEFMED CRM" }] }),
  component: GiftDistributionReportPage,
});

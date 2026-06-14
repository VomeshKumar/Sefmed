import { createFileRoute } from "@tanstack/react-router";
import { PaymentCollectionReportPage } from "@/features/reports/pages/PaymentCollectionReportPage";

export const Route = createFileRoute("/_authenticated/reports/paymentcollectionreport")({
  head: () => ({ meta: [{ title: "Payment Collection Report — SEFMED CRM" }] }),
  component: PaymentCollectionReportPage,
});

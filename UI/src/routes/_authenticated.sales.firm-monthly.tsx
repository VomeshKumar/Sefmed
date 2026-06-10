import { createFileRoute } from "@tanstack/react-router";
import { FirmMonthlyReportPage } from "@/features/sales/pages/FirmMonthlyReportPage";

export const Route = createFileRoute("/_authenticated/sales/firm-monthly")({
  head: () => ({ meta: [{ title: "Firm Monthly Sales — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <FirmMonthlyReportPage />;
}


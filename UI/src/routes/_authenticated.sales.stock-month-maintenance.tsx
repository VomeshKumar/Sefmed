import { createFileRoute } from "@tanstack/react-router";
import { StockMonthMaintenancePage } from "@/features/sales/pages/StockMonthMaintenancePage";

export const Route = createFileRoute("/_authenticated/sales/stock-month-maintenance")({
  head: () => ({ meta: [{ title: "Stock Month Maintenance — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <StockMonthMaintenancePage />;
}


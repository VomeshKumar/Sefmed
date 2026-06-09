import { createFileRoute } from "@tanstack/react-router";
import { StockistsPage } from "@/features/sales/pages/StockistsPage";

export const Route = createFileRoute("/_authenticated/sales/stockists")({
  head: () => ({ meta: [{ title: "Stockists — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <StockistsPage />;
}

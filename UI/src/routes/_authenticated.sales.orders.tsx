import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "@/features/sales/pages/OrdersPage";

export const Route = createFileRoute("/_authenticated/sales/orders")({
  head: () => ({ meta: [{ title: "Orders — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <OrdersPage />;
}

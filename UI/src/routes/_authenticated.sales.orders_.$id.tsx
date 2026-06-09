import { createFileRoute } from "@tanstack/react-router";
import { OrderDetailPage } from "@/features/sales/pages/OrderDetailPage";

export const Route = createFileRoute("/_authenticated/sales/orders_/$id")({
  head: () => ({ meta: [{ title: "Order Details — SEFMED CRM" }] }),
  component: PageComponent,
});

function PageComponent() {
  const { id } = Route.useParams();
  return <OrderDetailPage id={id} />;
}

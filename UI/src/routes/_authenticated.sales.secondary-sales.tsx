import { createFileRoute } from "@tanstack/react-router";
import { SecondarySalesPage } from "@/features/sales/pages/SecondarySalesPage";

export const Route = createFileRoute("/_authenticated/sales/secondary-sales")({
  head: () => ({ meta: [{ title: "Secondary Sales — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <SecondarySalesPage />;
}

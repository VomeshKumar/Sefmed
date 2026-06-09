import { createFileRoute } from "@tanstack/react-router";
import { SalesAnalyticsPage } from "@/features/sales/pages/SalesAnalyticsPage";

export const Route = createFileRoute("/_authenticated/sales/analytics")({
  head: () => ({ meta: [{ title: "Sales Analytics — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <SalesAnalyticsPage />;
}

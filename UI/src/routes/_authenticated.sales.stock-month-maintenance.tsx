import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/sales/stock-month-maintenance")({
  head: () => ({ meta: [{ title: "Stock Month Maintenance — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Stock Month Maintenance"
      description="Stock closure schedules and month-wise maintenance options."
      module="Sales Management"
    />
  );
}

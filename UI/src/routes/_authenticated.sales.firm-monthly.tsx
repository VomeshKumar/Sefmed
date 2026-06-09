import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/sales/firm-monthly")({
  head: () => ({ meta: [{ title: "Firm Monthly Sales — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Firm Monthly Sales"
      description="Track and analyze monthly sales performances for chemist firms."
      module="Sales Management"
    />
  );
}

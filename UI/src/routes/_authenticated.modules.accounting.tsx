import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/modules/accounting")({
  head: () => ({ meta: [{ title: "Accounting — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Accounting"
      description="Scaffolded module — reserved route."
      module="Modules"
    />
  );
}

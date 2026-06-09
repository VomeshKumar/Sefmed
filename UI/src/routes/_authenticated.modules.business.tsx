import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/modules/business")({
  head: () => ({ meta: [{ title: "Business — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Business"
      description="Scaffolded module — reserved route."
      module="Modules"
    />
  );
}

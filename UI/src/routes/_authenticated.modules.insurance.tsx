import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/modules/insurance")({
  head: () => ({ meta: [{ title: "Insurance — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Insurance"
      description="Scaffolded module — reserved route."
      module="Modules"
    />
  );
}

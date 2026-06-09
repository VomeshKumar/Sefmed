import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/modules/edetailing")({
  head: () => ({ meta: [{ title: "Edetailing — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Edetailing"
      description="Scaffolded module — reserved route."
      module="Modules"
    />
  );
}

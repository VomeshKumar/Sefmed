import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/modules/hr")({
  head: () => ({ meta: [{ title: "Hr — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Hr"
      description="Scaffolded module — reserved route."
      module="Modules"
    />
  );
}

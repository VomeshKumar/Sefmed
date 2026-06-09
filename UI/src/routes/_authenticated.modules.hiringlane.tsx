import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/modules/hiringlane")({
  head: () => ({ meta: [{ title: "Hiringlane — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Hiringlane"
      description="Scaffolded module — reserved route."
      module="Modules"
    />
  );
}

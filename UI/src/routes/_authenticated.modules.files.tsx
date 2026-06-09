import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/modules/files")({
  head: () => ({ meta: [{ title: "Files — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Files"
      description="Scaffolded module — reserved route."
      module="Modules"
    />
  );
}

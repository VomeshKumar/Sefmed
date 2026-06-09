import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/settings/workflows")({
  head: () => ({ meta: [{ title: "Workflow Definitions — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Workflow Definitions"
      description="Author and version workflow definitions."
      module="Settings"
    />
  );
}

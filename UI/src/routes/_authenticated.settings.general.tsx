import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/settings/general")({
  head: () => ({ meta: [{ title: "General Settings — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="General Settings"
      description="Organization, branding and locale."
      module="Settings"
    />
  );
}

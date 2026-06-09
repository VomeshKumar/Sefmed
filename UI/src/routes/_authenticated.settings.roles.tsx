import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/settings/roles")({
  head: () => ({ meta: [{ title: "Roles & Permissions — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Roles & Permissions"
      description="Manage roles, scopes and permission grants."
      module="Settings"
    />
  );
}

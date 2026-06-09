import { createFileRoute } from "@tanstack/react-router";
import { FeatureStub } from "@/components/layout/FeatureStub";

export const Route = createFileRoute("/_authenticated/modules/reminders")({
  head: () => ({ meta: [{ title: "Reminders — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return (
    <FeatureStub
      title="Reminders"
      description="Scaffolded module — reserved route."
      module="Modules"
    />
  );
}

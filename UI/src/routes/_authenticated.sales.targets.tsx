import { createFileRoute } from "@tanstack/react-router";
import { TargetsPage } from "@/features/sales/pages/TargetsPage";

export const Route = createFileRoute("/_authenticated/sales/targets")({
  head: () => ({ meta: [{ title: "Sales Targets — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <TargetsPage />;
}

import { createFileRoute } from "@tanstack/react-router";
import { SFCPage } from "@/features/expenses/pages/SFCPage";

export const Route = createFileRoute("/_authenticated/expense/sfc")({
  head: () => ({ meta: [{ title: "Standard Fare Chart — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <SFCPage />;
}

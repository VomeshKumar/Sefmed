import { createFileRoute } from "@tanstack/react-router";
import { SFCApprovalPage } from "@/features/expenses/pages/SFCApprovalPage";

export const Route = createFileRoute("/_authenticated/expense/sfc-approval")({
  head: () => ({ meta: [{ title: "SFC Approval — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <SFCApprovalPage />;
}

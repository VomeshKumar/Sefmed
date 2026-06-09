import { createFileRoute } from "@tanstack/react-router";
import { ExpenseApprovalPage } from "@/features/expenses/pages/ExpenseApprovalPage";

export const Route = createFileRoute("/_authenticated/expense/approval")({
  head: () => ({ meta: [{ title: "Expense Approvals — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <ExpenseApprovalPage />;
}

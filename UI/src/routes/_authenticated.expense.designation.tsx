import { createFileRoute } from "@tanstack/react-router";
import { DesignationWiseExpensePage } from "@/features/expenses/pages/DesignationWiseExpensePage";

export const Route = createFileRoute("/_authenticated/expense/designation")({
  head: () => ({ meta: [{ title: "Designation Wise Expense — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <DesignationWiseExpensePage />;
}

import { createFileRoute } from "@tanstack/react-router";
import { ExpenseListPage } from "@/features/expenses/pages/ExpenseListPage";

export const Route = createFileRoute("/_authenticated/expense/list")({
  head: () => ({ meta: [{ title: "My Expenses — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <ExpenseListPage />;
}

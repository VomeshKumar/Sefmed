import { createFileRoute } from "@tanstack/react-router";
import { ExpenseMonthMaintenancePage } from "@/features/expenses/pages/ExpenseMonthMaintenancePage";

export const Route = createFileRoute("/_authenticated/expense/month-maintenance")({
  head: () => ({ meta: [{ title: "Expense Month Maintenance — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <ExpenseMonthMaintenancePage />;
}

import { createFileRoute } from "@tanstack/react-router";
import { DayWiseExpensePage } from "@/features/expenses/pages/DayWiseExpensePage";

export const Route = createFileRoute("/_authenticated/expense/day-wise")({
  head: () => ({ meta: [{ title: "Day Wise Expense — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <DayWiseExpensePage />;
}

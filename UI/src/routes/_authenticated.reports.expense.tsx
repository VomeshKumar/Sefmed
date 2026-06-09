import { createFileRoute } from "@tanstack/react-router";
import { ExpenseReportsPage } from "@/features/reports/pages/ExpenseReportsPage";

export const Route = createFileRoute("/_authenticated/reports/expense")({
  head: () => ({ meta: [{ title: "Expense Reports — SEFMED CRM" }] }),
  component: ExpenseReportsPage,
});

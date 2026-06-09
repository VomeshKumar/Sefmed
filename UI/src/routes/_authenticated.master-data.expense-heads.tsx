import { createFileRoute } from "@tanstack/react-router";
import { ExpenseHeadsPage } from "@/features/master-data/expense-heads/pages/ExpenseHeadsPage";

export const Route = createFileRoute("/_authenticated/master-data/expense-heads")({
  head: () => ({ meta: [{ title: "Expense Heads — SEFMED CRM" }] }),
  component: ExpenseHeadsPage,
});

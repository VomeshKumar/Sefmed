import { createFileRoute } from "@tanstack/react-router";
import { ExpenseDetailPage } from "@/features/expenses/pages/ExpenseDetailPage";

export const Route = createFileRoute("/_authenticated/expense/list_/$id")({
  head: () => ({ meta: [{ title: "Expense Detail — SEFMED CRM" }] }),
  component: PageComponent,
});

function PageComponent() {
  const { id } = Route.useParams();
  return <ExpenseDetailPage id={id} />;
}

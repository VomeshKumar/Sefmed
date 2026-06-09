import { createFileRoute } from "@tanstack/react-router";
import { EmployeeDetailPage } from "@/features/people/employees/pages/EmployeeDetailPage";

export const Route = createFileRoute(
  "/_authenticated/people/employees_/$id",
)({
  head: () => ({ meta: [{ title: "Employee Profile — SEFMED CRM" }] }),
  component: PageComponent,
});

function PageComponent() {
  const { id } = Route.useParams();
  return <EmployeeDetailPage id={id} />;
}

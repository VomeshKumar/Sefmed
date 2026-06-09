import { createFileRoute } from "@tanstack/react-router";
import { AdministratorDetailPage } from "@/features/people/administrators/pages/AdministratorDetailPage";

export const Route = createFileRoute(
  "/_authenticated/people/administrators_/$id",
)({
  head: () => ({ meta: [{ title: "Administrator Profile — SEFMED CRM" }] }),
  component: PageComponent,
});

function PageComponent() {
  const { id } = Route.useParams();
  return <AdministratorDetailPage id={id} />;
}

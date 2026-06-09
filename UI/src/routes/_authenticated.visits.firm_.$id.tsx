import { createFileRoute } from "@tanstack/react-router";
import { FirmVisitDetailPage } from "@/features/visits/pages/FirmVisitDetailPage";

export const Route = createFileRoute(
  "/_authenticated/visits/firm_/$id",
)({
  head: () => ({ meta: [{ title: "Firm Visit Detail — SEFMED CRM" }] }),
  component: PageComponent,
});

function PageComponent() {
  const { id } = Route.useParams();
  return <FirmVisitDetailPage id={id} />;
}

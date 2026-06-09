import { createFileRoute } from "@tanstack/react-router";
import { DoctorVisitDetailPage } from "@/features/visits/pages/DoctorVisitDetailPage";

export const Route = createFileRoute(
  "/_authenticated/visits/doctor_/$id",
)({
  head: () => ({ meta: [{ title: "Doctor Call Detail — SEFMED CRM" }] }),
  component: PageComponent,
});

function PageComponent() {
  const { id } = Route.useParams();
  return <DoctorVisitDetailPage id={id} />;
}

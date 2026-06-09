import { createFileRoute } from "@tanstack/react-router";
import { DoctorDetailPage } from "@/features/people/doctors/pages/DoctorDetailPage";

export const Route = createFileRoute(
  "/_authenticated/people/doctors_/$id",
)({
  head: () => ({ meta: [{ title: "Doctor Profile — SEFMED CRM" }] }),
  component: PageComponent,
});

function PageComponent() {
  const { id } = Route.useParams();
  return <DoctorDetailPage id={id} />;
}

import { createFileRoute } from "@tanstack/react-router";
import { DoctorsPage } from "@/features/people/doctors/pages/DoctorsPage";

export const Route = createFileRoute("/_authenticated/people/doctors")({
  head: () => ({ meta: [{ title: "Doctors — SEFMED CRM" }] }),
  component: DoctorsPage,
});


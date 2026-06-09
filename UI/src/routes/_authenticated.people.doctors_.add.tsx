import { createFileRoute } from "@tanstack/react-router";
import { AddDoctorPage } from "@/features/people/doctors/pages/AddDoctorPage";

export const Route = createFileRoute("/_authenticated/people/doctors_/add")({
  head: () => ({ meta: [{ title: "Add Doctor — SEFMED CRM" }] }),
  component: AddDoctorPage,
});

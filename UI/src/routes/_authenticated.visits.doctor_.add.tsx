import { createFileRoute } from "@tanstack/react-router";
import { AddDoctorVisitPage } from "@/features/visits/pages/AddDoctorVisitPage";

export const Route = createFileRoute("/_authenticated/visits/doctor_/add")({
  head: () => ({ meta: [{ title: "Add Visits — SEFMED CRM" }] }),
  component: AddDoctorVisitPage,
});

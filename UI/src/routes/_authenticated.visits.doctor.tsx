import { createFileRoute } from "@tanstack/react-router";
import { DoctorVisitsPage } from "@/features/visits/pages/DoctorVisitsPage";

export const Route = createFileRoute("/_authenticated/visits/doctor")({
  head: () => ({ meta: [{ title: "Doctor Visits — SEFMED CRM" }] }),
  component: DoctorVisitsPage,
});


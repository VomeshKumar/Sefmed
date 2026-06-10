import { createFileRoute } from "@tanstack/react-router";
import { HospitalCallReportsPage } from "@/features/reports/pages/HospitalCallReportsPage";

export const Route = createFileRoute("/_authenticated/reports/hospitalcallreports")({
  head: () => ({ meta: [{ title: "Hospital Call Report — SEFMED CRM" }] }),
  component: HospitalCallReportsPage,
});

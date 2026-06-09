import { createFileRoute } from "@tanstack/react-router";
import { VisitTypesPage } from "@/features/master-data/visit-types/pages/VisitTypesPage";

export const Route = createFileRoute("/_authenticated/master-data/visit-types")({
  head: () => ({ meta: [{ title: "Visit Types — SEFMED CRM" }] }),
  component: VisitTypesPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { VisitReportsPage } from "@/features/reports/pages/VisitReportsPage";

export const Route = createFileRoute("/_authenticated/reports/visit")({
  head: () => ({ meta: [{ title: "Visit Reports — SEFMED CRM" }] }),
  component: VisitReportsPage,
});

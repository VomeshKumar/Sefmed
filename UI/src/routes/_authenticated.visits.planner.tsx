import { createFileRoute } from "@tanstack/react-router";
import { VisitPlannerPage } from "@/features/visits/pages/VisitPlannerPage";

export const Route = createFileRoute("/_authenticated/visits/planner")({
  head: () => ({ meta: [{ title: "Visit Planner — SEFMED CRM" }] }),
  component: VisitPlannerPage,
});

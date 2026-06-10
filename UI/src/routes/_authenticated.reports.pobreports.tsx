import { createFileRoute } from "@tanstack/react-router";
import { PobReportsPage } from "@/features/reports/pages/PobReportsPage";

export const Route = createFileRoute("/_authenticated/reports/pobreports")({
  head: () => ({ meta: [{ title: "POB Report — SEFMED CRM" }] }),
  component: PobReportsPage,
});

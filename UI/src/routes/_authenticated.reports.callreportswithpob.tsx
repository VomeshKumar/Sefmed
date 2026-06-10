import { createFileRoute } from "@tanstack/react-router";
import { PobCallReportsPage } from "@/features/reports/pages/PobCallReportsPage";

export const Route = createFileRoute("/_authenticated/reports/callreportswithpob")({
  head: () => ({ meta: [{ title: "Call Report With POB — SEFMED CRM" }] }),
  component: PobCallReportsPage,
});

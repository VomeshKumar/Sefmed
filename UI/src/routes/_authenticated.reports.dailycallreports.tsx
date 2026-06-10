import { createFileRoute } from "@tanstack/react-router";
import { DailyCallReportsPage } from "@/features/reports/pages/DailyCallReportsPage";

export const Route = createFileRoute("/_authenticated/reports/dailycallreports")({
  head: () => ({ meta: [{ title: "Call Report — SEFMED CRM" }] }),
  component: DailyCallReportsPage,
});

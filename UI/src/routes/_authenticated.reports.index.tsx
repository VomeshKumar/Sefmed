import { createFileRoute } from "@tanstack/react-router";
import { ReportsHubPage } from "@/features/reports/pages/ReportsHubPage";

export const Route = createFileRoute("/_authenticated/reports/")({
  head: () => ({ meta: [{ title: "Reports Hub — SEFMED CRM" }] }),
  component: ReportsHubPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { LeaveReportsPage } from "@/features/reports/pages/LeaveReportsPage";

export const Route = createFileRoute("/_authenticated/reports/leave")({
  head: () => ({ meta: [{ title: "Leave Reports — SEFMED CRM" }] }),
  component: LeaveReportsPage,
});

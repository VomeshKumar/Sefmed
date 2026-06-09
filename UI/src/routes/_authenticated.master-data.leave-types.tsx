import { createFileRoute } from "@tanstack/react-router";
import { LeaveTypesPage } from "@/features/master-data/leave-types/pages/LeaveTypesPage";

export const Route = createFileRoute(
  "/_authenticated/master-data/leave-types",
)({
  head: () => ({ meta: [{ title: "Leave Types — SEFMED CRM" }] }),
  component: LeaveTypesPage,
});

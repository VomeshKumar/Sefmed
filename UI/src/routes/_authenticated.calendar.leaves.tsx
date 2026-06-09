import { createFileRoute } from "@tanstack/react-router";
import { LeavesPage } from "@/features/calendar/pages/LeavesPage";

export const Route = createFileRoute("/_authenticated/calendar/leaves")({
  head: () => ({ meta: [{ title: "Leave Management — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <LeavesPage />;
}


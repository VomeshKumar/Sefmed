import { createFileRoute } from "@tanstack/react-router";
import { HolidayCalendarPage } from "@/features/calendar/pages/HolidayCalendarPage";

export const Route = createFileRoute("/_authenticated/calendar/holidays")({
  head: () => ({ meta: [{ title: "Holiday Calendar — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <HolidayCalendarPage />;
}

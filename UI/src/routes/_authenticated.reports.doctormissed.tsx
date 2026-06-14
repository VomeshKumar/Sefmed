import { createFileRoute } from "@tanstack/react-router";
import { DoctorsAttendedMissedPage } from "@/features/reports/pages/DoctorsAttendedMissedPage";

export const Route = createFileRoute("/_authenticated/reports/doctormissed")({
  head: () => ({ meta: [{ title: "Doctors Attended/Doctors Missed — SEFMED CRM" }] }),
  component: DoctorsAttendedMissedPage,
});

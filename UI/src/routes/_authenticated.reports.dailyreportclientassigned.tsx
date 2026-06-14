import { createFileRoute } from "@tanstack/react-router";
import { DoctorCoverageReportPage } from "@/features/reports/pages/DoctorCoverageReportPage";

export const Route = createFileRoute("/_authenticated/reports/dailyreportclientassigned")({
  head: () => ({ meta: [{ title: "Doctor Coverage Report — SEFMED CRM" }] }),
  component: DoctorCoverageReportPage,
});

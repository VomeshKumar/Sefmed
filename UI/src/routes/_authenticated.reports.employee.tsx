import { createFileRoute } from "@tanstack/react-router";
import { EmployeeReportsPage } from "@/features/reports/pages/EmployeeReportsPage";

export const Route = createFileRoute("/_authenticated/reports/employee")({
  head: () => ({ meta: [{ title: "Employee Reports — SEFMED CRM" }] }),
  component: EmployeeReportsPage,
});

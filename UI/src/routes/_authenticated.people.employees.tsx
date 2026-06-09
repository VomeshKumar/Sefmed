import { createFileRoute } from "@tanstack/react-router";
import { EmployeesPage } from "@/features/people/employees/pages/EmployeesPage";

export const Route = createFileRoute("/_authenticated/people/employees")({
  head: () => ({ meta: [{ title: "Employees — SEFMED CRM" }] }),
  component: EmployeesPage,
});

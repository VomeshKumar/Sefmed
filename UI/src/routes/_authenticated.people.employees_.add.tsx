import { createFileRoute } from "@tanstack/react-router";
import { AddEmployeePage } from "@/features/people/employees/pages/AddEmployeePage";

export const Route = createFileRoute("/_authenticated/people/employees_/add")({
  head: () => ({ meta: [{ title: "Add Employee — SEFMED CRM" }] }),
  component: AddEmployeePage,
});

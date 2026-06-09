import { createFileRoute } from "@tanstack/react-router";
import { AdministratorsPage } from "@/features/people/administrators/pages/AdministratorsPage";

export const Route = createFileRoute("/_authenticated/people/administrators")({
  head: () => ({ meta: [{ title: "Administrators — SEFMED CRM" }] }),
  component: AdministratorsPage,
});

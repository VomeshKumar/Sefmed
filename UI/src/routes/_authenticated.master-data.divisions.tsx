import { createFileRoute } from "@tanstack/react-router";
import { DivisionsPage } from "@/features/master-data/divisions/pages/DivisionsPage";

export const Route = createFileRoute("/_authenticated/master-data/divisions")({
  head: () => ({ meta: [{ title: "Divisions — SEFMED CRM" }] }),
  component: DivisionsPage,
});


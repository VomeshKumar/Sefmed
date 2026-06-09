import { createFileRoute } from "@tanstack/react-router";
import { TerritoriesPage } from "@/features/master-data/territories/pages/TerritoriesPage";

export const Route = createFileRoute("/_authenticated/master-data/territories")({
  head: () => ({ meta: [{ title: "Territories — SEFMED CRM" }] }),
  component: TerritoriesPage,
});


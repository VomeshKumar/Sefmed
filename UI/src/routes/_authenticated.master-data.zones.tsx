import { createFileRoute } from "@tanstack/react-router";
import { ZonesPage } from "@/features/master-data/zones/pages/ZonesPage";

export const Route = createFileRoute("/_authenticated/master-data/zones")({
  head: () => ({ meta: [{ title: "Zones — SEFMED CRM" }] }),
  component: ZonesPage,
});


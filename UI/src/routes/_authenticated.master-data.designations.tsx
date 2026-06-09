import { createFileRoute } from "@tanstack/react-router";
import { DesignationsPage } from "@/features/master-data/designations/pages/DesignationsPage";

export const Route = createFileRoute("/_authenticated/master-data/designations")({
  head: () => ({ meta: [{ title: "Designations — SEFMED CRM" }] }),
  component: DesignationsPage,
});


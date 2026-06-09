import { createFileRoute } from "@tanstack/react-router";
import { AddFirmVisitPage } from "@/features/visits/pages/AddFirmVisitPage";

export const Route = createFileRoute("/_authenticated/visits/firm_/add")({
  head: () => ({ meta: [{ title: "Add Visits — SEFMED CRM" }] }),
  component: AddFirmVisitPage,
});

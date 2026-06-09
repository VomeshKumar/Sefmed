import { createFileRoute } from "@tanstack/react-router";
import { FirmVisitsPage } from "@/features/visits/pages/FirmVisitsPage";

export const Route = createFileRoute("/_authenticated/visits/firm")({
  head: () => ({ meta: [{ title: "Firm Visits — SEFMED CRM" }] }),
  component: FirmVisitsPage,
});


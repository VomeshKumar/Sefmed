import { createFileRoute } from "@tanstack/react-router";
import { RateMasterPage } from "@/features/sales/pages/RateMasterPage";

export const Route = createFileRoute("/_authenticated/sales/rate-master")({
  head: () => ({ meta: [{ title: "Rate Master — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <RateMasterPage />;
}


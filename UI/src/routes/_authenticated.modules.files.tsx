import { createFileRoute } from "@tanstack/react-router";
import { FilesPage } from "@/features/files/pages/FilesPage";

export const Route = createFileRoute("/_authenticated/modules/files")({
  head: () => ({ meta: [{ title: "Files — SEFMED CRM" }] }),
  component: Page,
});

function Page() {
  return <FilesPage />;
}


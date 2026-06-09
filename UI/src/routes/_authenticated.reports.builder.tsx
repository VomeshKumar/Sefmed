import { createFileRoute } from "@tanstack/react-router";
import { ReportBuilderPage } from "@/features/reports/pages/ReportBuilderPage";
import { z } from "zod";

const searchSchema = z.object({
  savedReportId: z.string().optional(),
  module: z.string().optional(),
  templateName: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/reports/builder")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({ meta: [{ title: "Report Builder — SEFMED CRM" }] }),
  component: ReportBuilderPage,
});

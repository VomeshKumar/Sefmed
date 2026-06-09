import { z } from "zod";

export const createVisitTypeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  status: z.enum(["active", "inactive"]),
});

export const updateVisitTypeSchema = createVisitTypeSchema.partial();

export const searchVisitTypeSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type VisitTypeFormValues = z.infer<typeof createVisitTypeSchema>;

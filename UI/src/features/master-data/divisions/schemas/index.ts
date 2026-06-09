import { z } from "zod";

export const createDivisionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export const updateDivisionSchema = createDivisionSchema.partial();

export const searchDivisionSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type DivisionFormValues = z.infer<typeof createDivisionSchema>;

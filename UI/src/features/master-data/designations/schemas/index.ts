import { z } from "zod";

export const createDesignationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  status: z.enum(["active", "inactive"]),
});

export const updateDesignationSchema = createDesignationSchema.partial();

export const searchDesignationSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type DesignationFormValues = z.infer<typeof createDesignationSchema>;

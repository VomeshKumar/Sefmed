import { z } from "zod";

export const createZoneSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  status: z.enum(["active", "inactive"]),
});

export const updateZoneSchema = createZoneSchema.partial();

export const searchZoneSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type ZoneFormValues = z.infer<typeof createZoneSchema>;

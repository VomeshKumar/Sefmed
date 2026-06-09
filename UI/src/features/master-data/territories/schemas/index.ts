import { z } from "zod";

export const createTerritorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  zoneId: z.string().min(1, "Zone must be selected"),
  status: z.enum(["active", "inactive"]),
});

export const updateTerritorySchema = createTerritorySchema.partial();

export const searchTerritorySchema = z.object({
  query: z.string().optional(),
  zoneId: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type TerritoryFormValues = z.infer<typeof createTerritorySchema>;

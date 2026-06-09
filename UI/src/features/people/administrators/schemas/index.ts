import { z } from "zod";

export const createAdministratorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  city: z.string().min(1, "City must be selected"),
  contact: z.string().min(10, "Contact must be at least 10 digits"),
  divisionId: z.string().min(1, "Division must be selected"),
  zoneId: z.string().min(1, "Zone must be selected"),
  role: z.enum(["zonal", "divisional", "sales", "hr", "payroll", "admin", "superadmin", "support"]),
  status: z.enum(["active", "inactive"]),
  address: z.string().optional(),
  state: z.string().optional(),
  dcrEmail: z.string().email("Invalid email address").or(z.literal("")).optional(),
  alias: z.string().optional(),
});

export const updateAdministratorSchema = createAdministratorSchema.partial();

export const searchAdministratorSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type AdministratorFormValues = z.infer<typeof createAdministratorSchema>;

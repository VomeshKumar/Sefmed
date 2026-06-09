import { z } from "zod";

const baseAdministratorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  city: z.string().optional().or(z.literal("")),
  contact: z.string().min(10, "Contact must be at least 10 digits"),
  divisionId: z.string().optional().or(z.literal("")),
  zoneId: z.string().optional().or(z.literal("")),
  role: z.enum(["zonal", "divisional", "sales", "hr", "payroll", "admin", "superadmin", "support"]),
  status: z.enum(["active", "inactive"]),
  address: z.string().optional(),
  state: z.string().optional(),
  dcrEmail: z.string().email("Invalid email address").or(z.literal("")).optional(),
  alias: z.string().optional(),
});

export const createAdministratorSchema = baseAdministratorSchema.superRefine((data, ctx) => {
  const isZonal = data.role === "zonal";
  const isSales = data.role === "sales";
  const isDivisional = data.role === "divisional";

  // Division is required for zonal, divisional, sales
  if (isZonal || isDivisional || isSales) {
    if (!data.divisionId || data.divisionId.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Division must be selected",
        path: ["divisionId"],
      });
    }
  }

  // Zone is required for zonal, sales
  if (isZonal || isSales) {
    if (!data.zoneId || data.zoneId.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Zone must be selected",
        path: ["zoneId"],
      });
    }
  }

  // City is required for zonal
  if (isZonal) {
    if (!data.city || data.city.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City must be selected",
        path: ["city"],
      });
    }
  }
});

export const updateAdministratorSchema = baseAdministratorSchema.partial();

export const searchAdministratorSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type AdministratorFormValues = z.infer<typeof createAdministratorSchema>;

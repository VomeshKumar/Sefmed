import { z } from "zod";

export const createDoctorSchema = z.object({
  name: z.string().min(2, "Doctor name must be at least 2 characters"),
  registrationNumber: z.string().optional().or(z.literal("")),
  doctorCode: z.string().optional().or(z.literal("")),
  hospitalName: z.string().optional().or(z.literal("")),
  clinicAddress: z.string().optional().or(z.literal("")),
  speciality: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  assignedEmployeeId: z.string().optional().or(z.literal("")),
  contact: z.string().optional().or(z.literal("")),
  zoneId: z.string().min(1, "Zone must be selected"),
  territoryId: z.string().min(1, "City must be selected"), // territoryId maps to City*
  status: z.enum(["active", "inactive"]),
  qualification: z.string().optional().or(z.literal("")),
  divisionId: z.string().min(1, "Division must be selected"), // divisionId maps to Division*
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
  gender: z.string().optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  anniversary: z.string().optional().or(z.literal("")),
  type: z.string().optional().or(z.literal("")),
  firm: z.string().optional().or(z.literal("")),
  approxBusiness: z.number().or(z.nan()).optional(),
  country: z.string().optional(),
  prefix: z.string().optional().or(z.literal("")),
  maritalStatus: z.string().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  pincode: z.string().optional().or(z.literal("")),
  state: z.string().min(1, "State must be selected"),
});

export const updateDoctorSchema = createDoctorSchema.partial();

export const searchDoctorSchema = z.object({
  query: z.string().optional(),
  speciality: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type DoctorFormValues = z.infer<typeof createDoctorSchema>;

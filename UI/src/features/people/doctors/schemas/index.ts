import { z } from "zod";

export const createDoctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  registrationNumber: z.string().min(4, "Registration number must be at least 4 digits"),
  doctorCode: z.string().min(2, "Doctor code must be at least 2 characters"),
  hospitalName: z.string().min(2, "Hospital name must be at least 2 characters"),
  clinicAddress: z.string().min(5, "Clinic address must be at least 5 characters"),
  speciality: z.string().min(2, "Speciality must be selected"),
  category: z.string().min(1, "Category must be selected"),
  assignedEmployeeId: z.string().min(1, "Employee must be assigned"),
  contact: z.string().min(10, "Contact number must be at least 10 digits"),
  zoneId: z.string().min(1, "Zone must be selected"),
  territoryId: z.string().min(1, "Territory must be selected"),
  status: z.enum(["active", "inactive"]),
  qualification: z.string().optional(),
  divisionId: z.string().optional(),
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
  gender: z.string().optional(),
  dob: z.string().optional(),
  anniversary: z.string().optional(),
  type: z.string().optional(),
  firm: z.string().optional(),
  approxBusiness: z.number().or(z.nan()).optional(),
  country: z.string().optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial();

export const searchDoctorSchema = z.object({
  query: z.string().optional(),
  speciality: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type DoctorFormValues = z.infer<typeof createDoctorSchema>;

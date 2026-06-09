import { z } from "zod";

// Shared statuses
export const geoVerificationStatusEnum = z.enum(["Verified", "Unverified", "Outside Radius"]);
export const visitWorkflowStatusEnum = z.enum([
  "planned",
  "open",
  "closed",
  "pending_approval",
  "approved",
  "rejected",
  "rescheduled",
  "skipped",
  "cancelled",
]);

// Doctor Visit Schema
export const createDoctorVisitSchema = z.object({
  date: z.string().min(1, "Date is required"),
  doctorId: z.string().min(1, "Doctor must be selected"),
  assignedEmployeeId: z.string().min(1, "Representative must be assigned"),
  visitTypeId: z.string().min(1, "Visit type is required"),
  status: visitWorkflowStatusEnum,
  jointVisit: z.boolean(),
  jointEmployeeId: z.string().optional(),
  discussionSummary: z.string().optional(),
  productsDiscussion: z.array(z.string()).optional(),
  samplesDistributed: z
    .array(
      z.object({
        product: z.string().min(1, "Product name is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      }),
    )
    .optional(),
  remarks: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  geoAddress: z.string().optional(),
  geoVerificationStatus: geoVerificationStatusEnum.optional(),
});

export const updateDoctorVisitSchema = createDoctorVisitSchema.partial();

// Firm Visit Schema
export const createFirmVisitSchema = z.object({
  date: z.string().min(1, "Date is required"),
  firmName: z.string().min(2, "Firm name must be at least 2 characters"),
  firmType: z.enum(["chemist", "stockist", "hospital"]),
  assignedEmployeeId: z.string().min(1, "Representative must be assigned"),
  status: visitWorkflowStatusEnum,
  purpose: z.string().min(3, "Purpose must be at least 3 characters"),
  remarks: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  geoAddress: z.string().optional(),
  geoVerificationStatus: geoVerificationStatusEnum.optional(),
});

export const updateFirmVisitSchema = createFirmVisitSchema.partial();

// Visit Planner Schema
export const createVisitPlannerSchema = z.object({
  plannedDate: z.string().min(1, "Date is required"),
  assignedEmployeeId: z.string().min(1, "Representative must be assigned"),
  doctorId: z.string().optional(),
  firmName: z.string().optional(),
  territoryId: z.string().min(1, "Territory must be selected"),
  visitTypeId: z.string().min(1, "Visit type is required"),
  status: z.enum(["planned", "rescheduled", "cancelled"]),
  remarks: z.string().optional(),
});

export const updateVisitPlannerSchema = createVisitPlannerSchema.partial();

export type DoctorVisitFormValues = z.infer<typeof createDoctorVisitSchema>;
export type FirmVisitFormValues = z.infer<typeof createFirmVisitSchema>;
export type VisitPlannerFormValues = z.infer<typeof createVisitPlannerSchema>;

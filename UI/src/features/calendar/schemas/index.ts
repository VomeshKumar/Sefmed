import { z } from "zod";

// ─── Holiday Schema ────────────────────────────────────────────────────────────
export const createHolidaySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  date: z.string().min(1, "Date is required"),
  type: z.enum(["national", "regional", "optional", "restricted"]),
  zone: z.string().min(1, "Zone is required"),
  employeeName: z.string().optional(),
  description: z.string().optional(),
  applicableDivisions: z.array(z.string()).optional(),
  year: z.number().int().min(2020).max(2030),
});

export type HolidayFormValues = z.infer<typeof createHolidaySchema>;

// ─── Leave Request Schema ──────────────────────────────────────────────────────
export const createLeaveRequestSchema = z
  .object({
    employeeId: z.string().min(1, "Employee is required"),
    leaveTypeId: z.string().min(1, "Leave type is required"),
    fromDate: z.string().min(1, "From date is required"),
    toDate: z.string().min(1, "To date is required"),
    dayType: z.enum(["full", "half_first", "half_second"]),
    reason: z.string().min(5, "Please provide a reason (min 5 characters)"),
  })
  .refine(
    (data) => {
      const from = new Date(data.fromDate);
      const to = new Date(data.toDate);
      return to >= from;
    },
    { message: "To date must be on or after From date", path: ["toDate"] },
  );

export type LeaveRequestFormValues = z.infer<typeof createLeaveRequestSchema>;

// ─── Leave Approval Schema ─────────────────────────────────────────────────────
export const approveLeaveSchema = z.object({
  action: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().optional(),
  approverId: z.string().min(1),
});

export type LeaveApprovalFormValues = z.infer<typeof approveLeaveSchema>;

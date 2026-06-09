import { z } from "zod";

// ─── Line Item Schema ──────────────────────────────────────────────────────────
export const expenseLineItemSchema = z.object({
  expenseHeadId: z.string().min(1, "Expense head is required"),
  category: z.enum([
    "travel",
    "daily_allowance",
    "hotel",
    "food",
    "local_conveyance",
    "miscellaneous",
  ]),
  date: z.string().min(1, "Date is required"),
  quantity: z.number().positive().optional(),
  rate: z.number().positive().optional(),
  unit: z.string().optional(),
  amount: z.number().positive("Amount must be greater than 0"),
  description: z.string().optional(),
});

export type ExpenseLineItemFormValues = z.infer<typeof expenseLineItemSchema>;

// ─── Create Expense Schema ─────────────────────────────────────────────────────
export const createExpenseSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  visitId: z.string().optional(),
  linkedVisitType: z.enum(["doctor", "firm"]).optional(),
  month: z.string().min(7, "Month is required (YYYY-MM)"),
  remarks: z.string().optional(),
  lineItems: z
    .array(expenseLineItemSchema)
    .min(1, "At least one expense line item is required"),
});

export type CreateExpenseFormValues = z.infer<typeof createExpenseSchema>;

// ─── Update Expense Schema ─────────────────────────────────────────────────────
export const updateExpenseSchema = createExpenseSchema.partial().extend({
  id: z.string().min(1),
});

export type UpdateExpenseFormValues = z.infer<typeof updateExpenseSchema>;

// ─── Search / Filter Schema ────────────────────────────────────────────────────
export const searchExpenseSchema = z.object({
  query: z.string().optional(),
  employeeId: z.string().optional(),
  status: z.string().optional(),
  month: z.string().optional(),
  expenseHeadId: z.string().optional(),
});

export type SearchExpenseValues = z.infer<typeof searchExpenseSchema>;

// ─── Approval Schema ───────────────────────────────────────────────────────────
export const approvalSchema = z.object({
  action: z.enum(["approved", "partially_approved", "rejected", "returned"]),
  approvedAmount: z.number().min(0).optional(),
  remarks: z.string().optional(),
  approverId: z.string().min(1, "Approver is required"),
  approvalLevel: z.number().int().min(1).default(1),
  approvalRole: z.string().default("Manager"),
});

export type ApprovalFormValues = z.infer<typeof approvalSchema>;

// ─── SFC Schema ───────────────────────────────────────────────────────────────
export const sfcSchema = z
  .object({
    source: z.string().min(2, "Source is required"),
    destination: z.string().min(2, "Destination is required"),
    distanceKm: z.number().min(0, "Distance must be 0 or more"),
    transportType: z.enum(["bike", "car", "bus", "train", "flight"]),
    allowedFarePerKm: z.number().positive().optional(),
    flatFare: z.number().positive().optional(),
    isRoundTripAllowed: z.boolean(),
    effectiveFrom: z.string().min(1, "Effective from date is required"),
    effectiveTo: z.string().optional(),
    routeId: z.number().optional(),
    routeName: z.string().optional(),
    citiesInRoute: z.string().optional(),
    zone: z.string().optional(),
    division: z.string().optional(),
    employeeName: z.string().optional(),
    designation: z.string().optional(),
    fare: z.number().optional(),
  })
  .refine(
    (data) =>
      data.allowedFarePerKm !== undefined || data.flatFare !== undefined,
    {
      message: "Either Fare Per Km or Flat Fare must be provided",
      path: ["allowedFarePerKm"],
    },
  );

export type SFCFormValues = z.infer<typeof sfcSchema>;

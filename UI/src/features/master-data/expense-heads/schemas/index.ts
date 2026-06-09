import { z } from "zod";

export const createExpenseHeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  monthlyCap: z.coerce.number().min(0, "Monthly cap must be 0 or positive"),
  editable: z.boolean(),
  status: z.enum(["active", "inactive"]),
});

export const updateExpenseHeadSchema = createExpenseHeadSchema.partial();

export const searchExpenseHeadSchema = z.object({
  query: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type ExpenseHeadFormValues = z.infer<typeof createExpenseHeadSchema>;

import { z } from "zod";

export const reportColumnSchema = z.object({
  fieldName: z.string().min(1, "Field name is required"),
  label: z.string().min(1, "Label is required"),
  dataType: z.enum(["string", "number", "date", "boolean", "select"]),
  isVisible: z.boolean(),
  sequenceOrder: z.number().int().nonnegative(),
});

export const reportFilterSchema = z.object({
  fieldName: z.string().min(1, "Field name is required"),
  operator: z.enum(["equals", "contains", "gt", "lt", "between", "in"]),
  value: z.string().min(1, "Filter value is required"),
});

export const reportSortSchema = z.object({
  fieldName: z.string().min(1, "Field name is required"),
  direction: z.enum(["asc", "desc"]),
});

export const reportDefinitionSchema = z.object({
  name: z.string().min(2, "Report name must be at least 2 characters"),
  description: z.string().optional(),
  module: z.enum([
    "employees",
    "doctors",
    "visits",
    "leaves",
    "expenses",
    "orders",
    "targets",
    "stockists",
    "secondary_sales",
  ]),
  columns: z.array(reportColumnSchema).min(1, "Select at least one column"),
  filters: z.array(reportFilterSchema),
  sorts: z.array(reportSortSchema),
  sharingScope: z.enum(["private", "shared"]),
});

export type ReportDefinitionFormValues = z.infer<typeof reportDefinitionSchema>;

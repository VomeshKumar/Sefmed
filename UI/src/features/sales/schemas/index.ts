import { z } from "zod";

// ─── Product Schema ─────────────────────────────────────────────────────────────
export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  code: z.string().min(2, "SKU/Product code must be at least 2 characters"),
  productCategoryId: z.string().min(1, "Product category is required"),
  mrp: z.number().positive("MRP must be greater than 0"),
  pts: z.number().positive("PTS must be greater than 0"),
  ptr: z.number().positive("PTR must be greater than 0"),
  packSize: z.string().min(1, "Pack size is required"),
  status: z.enum(["active", "inactive", "discontinued"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// ─── Stockist Schema ────────────────────────────────────────────────────────────
export const stockistSchema = z.object({
  name: z.string().min(2, "Firm name must be at least 2 characters"),
  code: z.string().optional().or(z.literal("")),
  type: z.string().min(1, "Firm type is required"),
  contactPerson: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  territoryId: z.string().optional().or(z.literal("")),
  zoneId: z.string().optional().or(z.literal("")),
  creditLimit: z.number().optional(),
  outstandingAmount: z.number().optional(),
  status: z.enum(["active", "inactive"]),

  // New Fields
  date: z.string().optional().or(z.literal("")),
  addDate: z.string().optional().or(z.literal("")),
  zone: z.string().optional().or(z.literal("")),
  division: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  employeeAssigned: z.string().optional().or(z.literal("")),
  assignedFirm: z.string().optional().or(z.literal("")),
  distributorCode: z.string().optional().or(z.literal("")),
  stockistCode: z.string().optional().or(z.literal("")),
  customerCode: z.string().optional().or(z.literal("")),
  firstLevelManager: z.string().optional().or(z.literal("")),
  secondLevelManager: z.string().optional().or(z.literal("")),
  thirdLevelManager: z.string().optional().or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
  pan: z.string().optional().or(z.literal("")),
  drugLicense: z.string().optional().or(z.literal("")),
  foodLicense: z.string().optional().or(z.literal("")),
  approxBusiness: z.string().optional().or(z.literal("")),
  associatedDoctors: z.string().optional().or(z.literal("")),
  additionalDivision: z.string().optional().or(z.literal("")),
  attachments: z.array(z.string()).optional(),
});

export type StockistFormValues = z.infer<typeof stockistSchema>;

// ─── Primary Order Schema ───────────────────────────────────────────────────────
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  rate: z.number().positive("Rate must be greater than 0"),
  amount: z.number().min(0),
});

export const orderSchema = z.object({
  stockistId: z.string().min(1, "Stockist is required"),
  employeeId: z.string().optional(),
  orderDate: z.string().min(1, "Order date is required"),
  remarks: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "At least one order item is required"),
  discountAmount: z.number().min(0),
});

export type OrderFormValues = z.infer<typeof orderSchema>;

// ─── Secondary Sales Schema ─────────────────────────────────────────────────────
export const secondarySalesItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  openingStock: z.number().min(0, "Opening stock must be 0 or more"),
  receivedStock: z.number().min(0, "Received stock must be 0 or more"),
  salesQty: z.number().min(0, "Sales quantity must be 0 or more"),
  closingStock: z.number().min(0, "Closing stock must be 0 or more"),
  transitQty: z.number().min(0).optional(),
  value: z.number().optional(),
});

export const secondarySalesSchema = z.object({
  stockistId: z.string().min(1, "Stockist is required"),
  month: z.string().min(7, "Month is required (YYYY-MM)"),
  statementDate: z.string().min(1, "Statement date is required"),
  submittedByEmployeeId: z.string().min(1, "Employee is required"),
  remarks: z.string().optional(),
  items: z.array(secondarySalesItemSchema).min(1, "At least one item is required"),
});

export type SecondarySalesFormValues = z.infer<typeof secondarySalesSchema>;

// ─── Target Allocation Schema ───────────────────────────────────────────────────
export const productTargetSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  targetQuantity: z.number().int().nonnegative("Target quantity must be 0 or more"),
  targetAmount: z.number().nonnegative("Target amount must be 0 or more"),
});

export const salesTargetSchema = z.object({
  targetType: z.string().optional(),
  divisionId: z.string().optional(),
  zoneId: z.string().optional(),
  cityId: z.string().optional(),
  employeeId: z.string().min(1, "Employee is required"),
  month: z.string().min(7, "Month is required (YYYY-MM)"),
  productTargets: z.array(productTargetSchema).min(1, "At least one product target is required"),
  remarks: z.string().optional(),
  frequency: z.string().optional(),
  quarter: z.string().optional(),
  year: z.string().optional(),
  pobValue: z.number().optional(),
  secondarySales: z.number().optional(),
  doctorVisit: z.number().optional(),
  chemistVisit: z.number().optional(),
  newDoctorAddition: z.number().optional(),
  newChemistAddition: z.number().optional(),
  primarySalesValue: z.number().optional(),
  primarySalesQty: z.number().optional(),
});

export type SalesTargetFormValues = z.infer<typeof salesTargetSchema>;

// ─── Search / Filter Schemas ────────────────────────────────────────────────────
export const searchSalesSchema = z.object({
  query: z.string().optional(),
  stockistId: z.string().optional(),
  employeeId: z.string().optional(),
  status: z.string().optional(),
  month: z.string().optional(),
});

export type SearchSalesValues = z.infer<typeof searchSalesSchema>;

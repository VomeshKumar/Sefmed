// ─── Transport & Category Enums ────────────────────────────────────────────────
export type TransportType = "bike" | "car" | "bus" | "train" | "flight";

export type ExpenseCategory =
  | "travel"
  | "daily_allowance"
  | "hotel"
  | "food"
  | "local_conveyance"
  | "miscellaneous";

// ─── Expense Workflow Status ────────────────────────────────────────────────────
export type ExpenseStatus =
  | "draft"
  | "submitted"
  | "pending_approval"
  | "approved"
  | "partially_approved"
  | "rejected"
  | "returned"
  | "cancelled";

// ─── Approval Action ────────────────────────────────────────────────────────────
export type ApprovalAction =
  | "submitted"
  | "picked_up"
  | "approved"
  | "partially_approved"
  | "rejected"
  | "returned"
  | "resubmitted"
  | "cancelled";

// ─── Attachment ─────────────────────────────────────────────────────────────────
export interface ExpenseAttachment {
  id: string;
  lineItemId: string; // FK → ExpenseLineItem
  fileName: string;
  fileType: string; // "image/jpeg" | "application/pdf" | "image/png"
  fileSize: number; // bytes
  uploadedAt: string; // ISO timestamp
}

// ─── Line Item (enhanced) ───────────────────────────────────────────────────────
export interface ExpenseLineItem {
  id: string;
  expenseId: string;
  expenseHeadId: string;
  category: ExpenseCategory;
  date: string; // ISO date YYYY-MM-DD
  quantity?: number; // km, days, nights, units
  rate?: number; // per-km / per-day rate
  unit?: string; // "km" | "days" | "nights" | "units"
  amount: number; // always required (quantity × rate or manual)
  description?: string;
  attachments?: ExpenseAttachment[];
}

// ─── Approval Event (multi-level ready) ────────────────────────────────────────
export interface ApprovalEvent {
  id: string;
  expenseId: string;
  action: ApprovalAction;
  byEmployeeId: string;
  approvalLevel?: number; // 0=Employee, 1=Manager, 2=Zone Head, 3=Admin
  approvalRole?: string; // "Employee" | "Manager" | "Zone Head" | "Admin"
  remarks?: string;
  at: string; // ISO timestamp
}

// ─── Expense (root aggregate) ───────────────────────────────────────────────────
export interface Expense {
  id: string;
  expenseCode: string; // "EXP-2026-0042"
  employeeId: string;
  visitId?: string;
  linkedVisitType?: "doctor" | "firm";
  month: string; // "YYYY-MM"
  lineItems: ExpenseLineItem[];
  approvalHistory: ApprovalEvent[];
  status: ExpenseStatus;
  totalAmount: number; // sum of lineItems[].amount
  approvedAmount: number; // set on approval
  remarks?: string;
  submittedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── SFC (Standard Fare Chart, enhanced) ───────────────────────────────────────
export interface SFC {
  id: string;
  source: string;
  destination: string;
  distanceKm: number;
  transportType: TransportType;
  allowedFarePerKm?: number; // null when flatFare applies
  flatFare?: number; // null = use per-km rate
  isRoundTripAllowed: boolean;
  effectiveFrom: string; // ISO date
  effectiveTo?: string; // null = open-ended
  createdAt: string;
  routeId?: number;
  routeName?: string;
  citiesInRoute?: string;
  zone?: string;
  division?: string;
  employeeName?: string; // Route For
  designation?: string;
  fare?: number;
}

// ─── Dashboard Adapter Stats ────────────────────────────────────────────────────
export interface ExpenseDashboardStats {
  totalSubmitted: number;
  totalApproved: number;
  totalRejected: number;
  totalPending: number; // submitted + pending_approval
  approvedAmount: number;
  pendingAmount: number;
  averageExpensePerVisit: number; // approvedAmount / count(linked-visit approved)
  monthlyTrend: Array<{ month: string; amount: number }>;
}

/**
 * RBAC permission registry.
 *
 * Permissions follow `<resource>.<action>` notation. Roles are mapped to
 * permission sets in `roles.ts`. Components gate UI via <RequirePermission>
 * and server functions gate access via `requirePermission()` middleware
 * (added in Phase 3).
 */
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",

  // Visits
  VISIT_VIEW: "visit.view",
  VISIT_CREATE: "visit.create",
  VISIT_APPROVE: "visit.approve",

  // People
  DOCTOR_VIEW: "doctor.view",
  DOCTOR_MANAGE: "doctor.manage",
  EMPLOYEE_VIEW: "employee.view",
  EMPLOYEE_MANAGE: "employee.manage",

  // Calendar
  HOLIDAY_VIEW: "holiday.view",
  LEAVE_VIEW: "leave.view",
  LEAVE_APPROVE: "leave.approve",

  // Expense
  EXPENSE_VIEW: "expense.view",
  EXPENSE_CREATE: "expense.create",
  EXPENSE_APPROVE: "expense.approve",

  // Sales
  SALES_VIEW: "sales.view",
  SALES_MANAGE: "sales.manage",
  STOCKIST_MANAGE: "stockist.manage",
  SECONDARY_SALES_MANAGE: "secondary_sales.manage",

  // Reports (per bounded context)
  REPORT_LEAVE_VIEW: "report.leave.view",
  REPORT_SALES_VIEW: "report.sales.view",
  REPORT_VISIT_VIEW: "report.visit.view",
  REPORT_EXPENSE_VIEW: "report.expense.view",
  REPORT_EMPLOYEE_VIEW: "report.employee.view",
  REPORT_BUILDER_USE: "report.builder.use",

  // Master data
  MASTER_DATA_VIEW: "master_data.view",
  MASTER_DATA_MANAGE: "master_data.manage",

  // Workflow
  WORKFLOW_MANAGE: "workflow.manage",

  // Admin / settings
  SETTINGS_MANAGE: "settings.manage",
  AUDIT_VIEW: "audit.view",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
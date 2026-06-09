import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  Receipt,
  TrendingUp,
  BarChart3,
  Database,
  Workflow,
  Settings,
  ShieldCheck,
  FileText,
  Bell,
  Brain,
  Network,
  ShoppingCart,
  User,
  IndianRupee,
  UserCog,
  Target,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { PERMISSIONS, type Permission } from "@/lib/rbac/permissions";

export interface NavItem {
  label: string;
  to: string;
  icon?: LucideIcon;
  permission?: Permission;
  anyOf?: Permission[];
  children?: NavItem[];
}

export const NAV: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    label: "Visits",
    to: "/visits",
    icon: Stethoscope,
    anyOf: [PERMISSIONS.VISIT_VIEW, PERMISSIONS.VISIT_APPROVE],
    children: [
      { label: "Doctor Visits", to: "/visits/doctor", permission: PERMISSIONS.VISIT_VIEW },
      { label: "Firm Visits", to: "/visits/firm", permission: PERMISSIONS.VISIT_VIEW },
      { label: "Visit Planner", to: "/visits/planner", permission: PERMISSIONS.VISIT_VIEW },
    ],
  },
  {
    label: "People",
    to: "/people",
    icon: Users,
    anyOf: [PERMISSIONS.DOCTOR_VIEW, PERMISSIONS.EMPLOYEE_VIEW],
    children: [
      { label: "Doctors", to: "/people/doctors", permission: PERMISSIONS.DOCTOR_VIEW },
      { label: "Employees", to: "/people/employees", permission: PERMISSIONS.EMPLOYEE_VIEW },
      { label: "Administrators", to: "/people/administrators", permission: PERMISSIONS.EMPLOYEE_MANAGE },
    ],
  },
  {
    label: "Calendar",
    to: "/calendar",
    icon: CalendarDays,
    anyOf: [PERMISSIONS.HOLIDAY_VIEW, PERMISSIONS.LEAVE_VIEW],
    children: [
      { label: "Holiday & Work", to: "/calendar/holidays", permission: PERMISSIONS.HOLIDAY_VIEW },
      { label: "Leave Calendar", to: "/calendar/leaves", permission: PERMISSIONS.LEAVE_VIEW },
    ],
  },
  {
    label: "Expense",
    to: "/expense",
    icon: Receipt,
    permission: PERMISSIONS.EXPENSE_VIEW,
    children: [
      {
        label: "Designation Wise Expense",
        to: "/expense/designation",
        icon: Network,
        permission: PERMISSIONS.EXPENSE_VIEW,
      },
      {
        label: "Expenses",
        to: "/expense/list",
        icon: Receipt,
        permission: PERMISSIONS.EXPENSE_VIEW,
      },
      {
        label: "Day Wise Expense",
        to: "/expense/day-wise",
        icon: FileText,
        permission: PERMISSIONS.EXPENSE_VIEW,
      },
      {
        label: "Expense Head",
        to: "/master-data/expense-heads",
        icon: BarChart3,
        permission: PERMISSIONS.MASTER_DATA_VIEW,
      },
      {
        label: "Standard Fare Chart",
        to: "/expense/sfc",
        icon: TrendingUp,
        permission: PERMISSIONS.MASTER_DATA_MANAGE,
      },
      {
        label: "SFC Approval",
        to: "/expense/sfc-approval",
        permission: PERMISSIONS.EXPENSE_APPROVE,
      },
      {
        label: "Expense Month Maintenance",
        to: "/expense/month-maintenance",
        permission: PERMISSIONS.SETTINGS_MANAGE,
      },
    ],
  },
  {
    label: "Sales",
    to: "/sales",
    icon: TrendingUp,
    permission: PERMISSIONS.SALES_VIEW,
    children: [
      { label: "Firms", to: "/sales/stockists", icon: User, permission: PERMISSIONS.STOCKIST_MANAGE },
      { label: "Orders", to: "/sales/orders", icon: ShoppingCart, permission: PERMISSIONS.SALES_VIEW },
      { label: "Rate Master", to: "/sales/rate-master", icon: IndianRupee, permission: PERMISSIONS.SALES_VIEW },
      { label: "Secondary Sales (Stock Tally)", to: "/sales/secondary-sales", icon: UserCog, permission: PERMISSIONS.SECONDARY_SALES_MANAGE },
      { label: "Target", to: "/sales/targets", icon: Target, permission: PERMISSIONS.SALES_VIEW },
      { label: "Firm Monthly", to: "/sales/firm-monthly", icon: FileText, permission: PERMISSIONS.SALES_VIEW },
      { label: "Stock Month Maintenance", to: "/sales/stock-month-maintenance", icon: Wrench, permission: PERMISSIONS.SETTINGS_MANAGE },
    ],
  },
  {
    label: "Reports",
    to: "/reports",
    icon: BarChart3,
    anyOf: [
      PERMISSIONS.REPORT_LEAVE_VIEW,
      PERMISSIONS.REPORT_SALES_VIEW,
      PERMISSIONS.REPORT_VISIT_VIEW,
      PERMISSIONS.REPORT_EXPENSE_VIEW,
      PERMISSIONS.REPORT_EMPLOYEE_VIEW,
    ],
    children: [
      { label: "Leave Reports", to: "/reports/leave", permission: PERMISSIONS.REPORT_LEAVE_VIEW },
      { label: "Sales Reports", to: "/reports/sales", permission: PERMISSIONS.REPORT_SALES_VIEW },
      { label: "Visit Reports", to: "/reports/visit", permission: PERMISSIONS.REPORT_VISIT_VIEW },
      { label: "Expense Reports", to: "/reports/expense", permission: PERMISSIONS.REPORT_EXPENSE_VIEW },
      { label: "Employee Reports", to: "/reports/employee", permission: PERMISSIONS.REPORT_EMPLOYEE_VIEW },
      { label: "Report Builder", to: "/reports/builder", permission: PERMISSIONS.REPORT_BUILDER_USE },
    ],
  },
  {
    label: "Master Data",
    to: "/master-data",
    icon: Database,
    permission: PERMISSIONS.MASTER_DATA_VIEW,
    children: [
      { label: "Divisions", to: "/master-data/divisions" },
      { label: "Zones", to: "/master-data/zones" },
      { label: "Territories", to: "/master-data/territories" },
      { label: "Designations", to: "/master-data/designations" },
      { label: "Expense Heads", to: "/master-data/expense-heads" },
      { label: "Visit Types", to: "/master-data/visit-types" },
      { label: "Leave Types", to: "/master-data/leave-types" },
      { label: "Product Categories", to: "/master-data/product-categories" },
    ],
  },
  {
    label: "Modules",
    to: "/modules",
    icon: FileText,
    children: [
      { label: "Files", to: "/modules/files" },
      { label: "Reminders", to: "/modules/reminders" },
      { label: "HR Portal", to: "/modules/hr" },
      { label: "E-detailing", to: "/modules/edetailing" },
      { label: "Business", to: "/modules/business" },
      { label: "Insurance", to: "/modules/insurance" },
      { label: "Accounting & Inventory", to: "/modules/accounting" },
      { label: "Hiringlane", to: "/modules/hiringlane" },
    ],
  },
  {
    label: "Notifications",
    to: "/notifications",
    icon: Bell,
  },
  {
    label: "AI Assistant",
    to: "/ai",
    icon: Brain,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
    permission: PERMISSIONS.SETTINGS_MANAGE,
    children: [
      { label: "General", to: "/settings/general" },
      { label: "Workflows", to: "/settings/workflows", permission: PERMISSIONS.WORKFLOW_MANAGE },
      { label: "Roles & Permissions", to: "/settings/roles" },
    ],
  },
  {
    label: "Audit",
    to: "/audit",
    icon: ShieldCheck,
    permission: PERMISSIONS.AUDIT_VIEW,
  },
  {
    label: "Workflows",
    to: "/workflows",
    icon: Workflow,
    permission: PERMISSIONS.WORKFLOW_MANAGE,
  },
];
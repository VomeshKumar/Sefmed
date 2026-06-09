// ─── Holiday ───────────────────────────────────────────────────────────────────
export type HolidayType = "national" | "regional" | "optional" | "restricted";

export interface Holiday {
  id: string;
  name: string;
  date: string; // ISO date YYYY-MM-DD
  type: HolidayType;
  zone?: string;
  employeeName?: string;
  description?: string;
  applicableDivisions?: string[]; // Division IDs – empty means all
  year: number;
  createdAt: string;
}

export interface WorkCalendarEntry {
  id: string;
  name: string;
  date: string; // ISO date YYYY-MM-DD
  zone: string;
  createdAt: string;
}

// ─── Leave ─────────────────────────────────────────────────────────────────────
export type LeaveStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "withdrawn";

export type LeaveDayType = "full" | "half_first" | "half_second";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  fromDate: string; // ISO date
  toDate: string; // ISO date
  dayType: LeaveDayType;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approverId?: string; // Employee ID
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  attachmentUrl?: string;
  createdAt: string;
}

// ─── Leave Balance ─────────────────────────────────────────────────────────────
export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  allocated: number;
  used: number;
  pending: number; // days in pending/approved state not yet consumed
  remaining: number;
  carriedForward: number;
}

// ─── Leave Calendar Event (merged view) ────────────────────────────────────────
export interface CalendarEvent {
  date: string;
  type: "holiday" | "leave";
  label: string;
  tone: "info" | "success" | "warning" | "neutral" | "danger";
  meta?: Holiday | LeaveRequest;
}

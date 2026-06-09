import type { LeaveType } from "../types";

export const mockLeaveTypes: LeaveType[] = [
  {
    id: "leave-casual",
    name: "Casual Leave (CL)",
    code: "CL",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "leave-sick",
    name: "Sick Leave (SL)",
    code: "SL",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "leave-earned",
    name: "Earned Leave (EL)",
    code: "EL",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "leave-maternity",
    name: "Maternity Leave (ML)",
    code: "ML",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "leave-study",
    name: "Sabbatical/Study Leave",
    code: "SABBATICAL",
    status: "inactive",
    createdAt: "2026-02-15T00:00:00Z",
  },
];

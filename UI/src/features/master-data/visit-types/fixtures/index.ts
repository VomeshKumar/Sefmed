import type { VisitType } from "../types";

export const mockVisitTypes: VisitType[] = [
  {
    id: "visit-doctor",
    name: "Doctor Call",
    code: "DOCTOR_CALL",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "visit-chemist",
    name: "Chemist Call POB",
    code: "CHEMIST_CALL",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "visit-stockist",
    name: "Stockist Inventory Audit",
    code: "STOCKIST_AUDIT",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "visit-joint",
    name: "Joint Ridealong Call",
    code: "JOINT_CALL",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "visit-camp",
    name: "Health Camp/Seminar",
    code: "CAMP_SEMINAR",
    status: "inactive",
    createdAt: "2026-02-01T00:00:00Z",
  },
];

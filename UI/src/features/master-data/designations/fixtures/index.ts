import type { Designation } from "../types";

export const mockDesignations: Designation[] = [
  {
    id: "desig-mr",
    name: "Medical Representative (MR)",
    code: "MR",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "desig-abm",
    name: "Area Business Manager (ABM)",
    code: "ABM",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "desig-rbm",
    name: "Regional Business Manager (RBM)",
    code: "RBM",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "desig-zsm",
    name: "Zone Sales Manager (ZSM)",
    code: "ZSM",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "desig-nsh",
    name: "National Sales Head (NSH)",
    code: "NSH",
    status: "active",
    createdAt: "2026-01-20T00:00:00Z",
  },
];

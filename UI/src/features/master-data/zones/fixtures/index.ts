import type { Zone } from "../types";

export const mockZones: Zone[] = [
  {
    id: "zone-north",
    name: "North Zone",
    code: "NORTH",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "zone-south",
    name: "South Zone",
    code: "SOUTH",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "zone-east",
    name: "East Zone",
    code: "EAST",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "zone-west",
    name: "West Zone",
    code: "WEST",
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "zone-central",
    name: "Central Zone",
    code: "CENTRAL",
    status: "inactive",
    createdAt: "2026-03-01T00:00:00Z",
  },
];

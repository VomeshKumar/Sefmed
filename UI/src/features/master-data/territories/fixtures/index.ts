import type { Territory } from "../types";

export const mockTerritories: Territory[] = [
  {
    id: "terr-delhi-n",
    name: "Delhi North",
    code: "DELHI-N",
    zoneId: "zone-north",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "terr-delhi-s",
    name: "Delhi South",
    code: "DELHI-S",
    zoneId: "zone-north",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "terr-mumbai-w",
    name: "Mumbai West",
    code: "MUMBAI-W",
    zoneId: "zone-west",
    status: "active",
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "terr-chennai-c",
    name: "Chennai Central",
    code: "CHENNAI-C",
    zoneId: "zone-south",
    status: "active",
    createdAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "terr-kolkata-e",
    name: "Kolkata East",
    code: "KOLKATA-E",
    zoneId: "zone-east",
    status: "inactive",
    createdAt: "2026-02-10T00:00:00Z",
  },
];

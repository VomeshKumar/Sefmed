import type { Division } from "../types";

export const mockDivisions: Division[] = [
  {
    id: "div-pharma",
    name: "Pharma Division",
    code: "PHARMA",
    description: "Prescription drugs and clinical therapeutics",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "div-consumer",
    name: "Consumer Health",
    code: "CONSUMER",
    description: "Over-the-counter wellness and healthcare products",
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "div-otc",
    name: "OTC Division",
    code: "OTC",
    description: "Medical devices, vitamins, and general medical supplies",
    status: "active",
    createdAt: "2026-02-15T00:00:00Z",
  },
  {
    id: "div-gyn",
    name: "Gynecology Care",
    code: "GYN",
    description: "Women's healthcare therapeutics division",
    status: "active",
    createdAt: "2026-03-20T00:00:00Z",
  },
  {
    id: "div-cardio",
    name: "Cardiovascular Speciality",
    code: "CARDIO",
    description: "Cardiology targeted prescription drug line",
    status: "inactive",
    createdAt: "2026-04-10T00:00:00Z",
  },
];

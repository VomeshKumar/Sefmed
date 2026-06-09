import type { Expense, SFC, ExpenseLineItem, ApprovalEvent, TransportType } from "../types";

const Y = new Date().getFullYear();
const d = (m: number, day: number) => `${Y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
const ts = (m: number, day: number, h = 9) => `${d(m, day)}T${String(h).padStart(2, "0")}:00:00Z`;

// ─── SFC Fixtures ──────────────────────────────────────────────────────────────
const initialSFCs: SFC[] = [
  {
    id: "sfc-466",
    routeId: 466,
    routeName: "Amravati to Akola",
    source: "Amravati",
    destination: "Akola",
    citiesInRoute: "Akola",
    zone: "Maharashtra",
    division: "DERMA",
    employeeName: "AAKIB KHAN",
    designation: "All",
    transportType: "bike",
    distanceKm: 192,
    fare: 384,
    isRoundTripAllowed: true,
    effectiveFrom: "2026-01-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "sfc-466-2",
    routeId: 466,
    routeName: "Amravati to Pratwada",
    source: "Amravati",
    destination: "Pratwada",
    citiesInRoute: "Pratwada",
    zone: "Maharashtra",
    division: "DERMA",
    employeeName: "AAKIB KHAN",
    designation: "All",
    transportType: "bike",
    distanceKm: 96,
    fare: 192,
    isRoundTripAllowed: true,
    effectiveFrom: "2026-01-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "sfc-467",
    routeId: 467,
    routeName: "Amravati to Warud",
    source: "Amravati",
    destination: "Warud",
    citiesInRoute: "Warud",
    zone: "Maharashtra",
    division: "DERMA",
    employeeName: "AAKIB KHAN",
    designation: "All",
    transportType: "bike",
    distanceKm: 174,
    fare: 348,
    isRoundTripAllowed: true,
    effectiveFrom: "2026-01-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "sfc-518",
    routeId: 518,
    routeName: "Balasore To Baripada",
    source: "Balasore",
    destination: "Baripada",
    citiesInRoute: "Mayurbhanj Road",
    zone: "ODISHA",
    division: "DERMA",
    employeeName: "GAUTAM KUMAR ROUT",
    designation: "All",
    transportType: "bus",
    distanceKm: 500,
    fare: 1000,
    isRoundTripAllowed: false,
    effectiveFrom: "2026-01-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "sfc-519",
    routeId: 519,
    routeName: "Balasore To RairangPur",
    source: "Balasore",
    destination: "RairangPur",
    citiesInRoute: "Mayurbhanj Road",
    zone: "ODISHA",
    division: "DERMA",
    employeeName: "GAUTAM KUMAR ROUT",
    designation: "All",
    transportType: "bus",
    distanceKm: 550,
    fare: 1100,
    isRoundTripAllowed: false,
    effectiveFrom: "2026-01-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "sfc-535",
    routeId: 535,
    routeName: "BASAVANAGUDI",
    source: "BASAVANAGUDI",
    destination: "BASAVANAGUDI",
    citiesInRoute: "",
    zone: "Karnataka",
    division: "DERMA",
    employeeName: "Manoj S",
    designation: "All",
    transportType: "bike",
    distanceKm: 0,
    fare: 0,
    isRoundTripAllowed: true,
    effectiveFrom: "2026-01-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "sfc-539",
    routeId: 539,
    routeName: "BASAVANAGUDI TO CHENNAI",
    source: "BASAVANAGUDI",
    destination: "CHENNAI",
    citiesInRoute: "",
    zone: "Karnataka",
    division: "DERMA",
    employeeName: "Manoj S",
    designation: "All",
    transportType: "bus",
    distanceKm: 694,
    fare: 1388,
    isRoundTripAllowed: false,
    effectiveFrom: "2026-01-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "sfc-541",
    routeId: 541,
    routeName: "BASAVANAGUDI TO ELECTRONIC CITY",
    source: "BASAVANAGUDI",
    destination: "ELECTRONIC CITY",
    citiesInRoute: "CHANDAPURA, ELECTRONIC, BEGUR ROAD",
    zone: "Karnataka",
    division: "DERMA",
    employeeName: "Manoj S",
    designation: "All",
    transportType: "bike",
    distanceKm: 120,
    fare: 240,
    isRoundTripAllowed: true,
    effectiveFrom: "2026-01-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "sfc-537",
    routeId: 537,
    routeName: "BASAVANAGUDI to HSR",
    source: "BASAVANAGUDI",
    destination: "HSR",
    citiesInRoute: "Kormangala, HSR",
    zone: "Karnataka",
    division: "DERMA",
    employeeName: "Manoj S",
    designation: "All",
    transportType: "bike",
    distanceKm: 70,
    fare: 140,
    isRoundTripAllowed: true,
    effectiveFrom: "2026-01-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "sfc-536",
    routeId: 536,
    routeName: "BASAVANAGUDI TO JPNAGAR",
    source: "BASAVANAGUDI",
    destination: "JPNAGAR",
    citiesInRoute: ", bhannegatta, kanakpura road",
    zone: "Karnataka",
    division: "DERMA",
    employeeName: "Manoj S",
    designation: "All",
    transportType: "bike",
    distanceKm: 70,
    fare: 140,
    isRoundTripAllowed: true,
    effectiveFrom: "2026-01-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
];

const generateAdditionalSFCs = (): SFC[] => {
  const list: SFC[] = [];
  const zones = ["Maharashtra", "ODISHA", "Karnataka", "Chhattisgarh", "Gujarat", "Delhi"];
  const employees = ["AAKIB KHAN", "GAUTAM KUMAR ROUT", "Manoj S", "Rohan Mehta", "Priya Sharma"];
  const modes: TransportType[] = ["bike", "bus", "car", "train"];
  const divisions = ["DERMA", "CARDIO", "GYNAEC"];
  
  for (let i = 1; i <= 276; i++) {
    const routeId = 550 + i;
    const zone = zones[i % zones.length];
    const employeeName = employees[i % employees.length];
    const transportType = modes[i % modes.length];
    const division = divisions[i % divisions.length];
    const distanceKm = 50 + (i * 7) % 300;
    const fare = distanceKm * 2; // bike/bus rate approximation
    
    list.push({
      id: `sfc-gen-${i}`,
      routeId,
      source: `City-${routeId}`,
      destination: `Town-${routeId}`,
      routeName: `City-${routeId} to Town-${routeId}`,
      citiesInRoute: `Stop-${routeId}`,
      zone,
      division,
      employeeName,
      designation: i % 5 === 0 ? "MR" : "All",
      transportType,
      distanceKm,
      fare,
      isRoundTripAllowed: i % 2 === 0,
      effectiveFrom: "2026-01-01",
      createdAt: "2026-01-01T00:00:00Z",
    });
  }
  return list;
};

export const mockSFCs: SFC[] = [...initialSFCs, ...generateAdditionalSFCs()];


// ─── Helper: create line item ──────────────────────────────────────────────────
const li = (
  partial: Omit<ExpenseLineItem, "id" | "expenseId"> & { expenseId: string },
): ExpenseLineItem => ({ id: `li-${Math.random().toString(36).substring(2, 9)}`, ...partial });

const ev = (
  partial: Omit<ApprovalEvent, "id">,
): ApprovalEvent => ({ id: `ae-${Math.random().toString(36).substring(2, 9)}`, ...partial });

// ─── Expense Fixtures ──────────────────────────────────────────────────────────
export const mockExpenses: Expense[] = [
  // EXP-2026-0001 — emp-001 — TA + DA — approved — ₹4,200
  {
    id: "exp-001",
    expenseCode: "EXP-2026-0001",
    employeeId: "emp-001",
    visitId: "dv-001",
    linkedVisitType: "doctor",
    month: `${Y}-01`,
    lineItems: [
      li({ expenseId: "exp-001", expenseHeadId: "head-ta", category: "travel", date: d(1, 10), quantity: 240, rate: 8, unit: "km", amount: 1920, description: "Raipur → Bilaspur → Raipur (car, round trip)" }),
      li({ expenseId: "exp-001", expenseHeadId: "head-da", category: "daily_allowance", date: d(1, 10), quantity: 1, rate: 800, unit: "days", amount: 800, description: "Daily allowance - outstation" }),
      li({ expenseId: "exp-001", expenseHeadId: "head-da", category: "daily_allowance", date: d(1, 11), quantity: 1, rate: 800, unit: "days", amount: 800, description: "Daily allowance - outstation" }),
      li({ expenseId: "exp-001", expenseHeadId: "head-misc", category: "food", date: d(1, 10), amount: 680, description: "Lunch + Dinner" }),
    ],
    approvalHistory: [
      ev({ expenseId: "exp-001", action: "submitted", byEmployeeId: "emp-001", approvalLevel: 0, approvalRole: "Employee", at: ts(1, 12) }),
      ev({ expenseId: "exp-001", action: "picked_up", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", at: ts(1, 13) }),
      ev({ expenseId: "exp-001", action: "approved", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", remarks: "All receipts verified", at: ts(1, 14) }),
    ],
    status: "approved",
    totalAmount: 4200,
    approvedAmount: 4200,
    submittedAt: ts(1, 12),
    approvedAt: ts(1, 14),
    createdAt: ts(1, 11),
    updatedAt: ts(1, 14),
  },

  // EXP-2026-0002 — emp-001 — Hotel + DA — submitted — ₹7,800
  {
    id: "exp-002",
    expenseCode: "EXP-2026-0002",
    employeeId: "emp-001",
    month: `${Y}-02`,
    lineItems: [
      li({ expenseId: "exp-002", expenseHeadId: "head-hotel", category: "hotel", date: d(2, 5), quantity: 2, rate: 1800, unit: "nights", amount: 3600, description: "Hotel Rajhans, Bilaspur – 2 nights" }),
      li({ expenseId: "exp-002", expenseHeadId: "head-da", category: "daily_allowance", date: d(2, 5), quantity: 3, rate: 800, unit: "days", amount: 2400, description: "DA – outstation 3 days" }),
      li({ expenseId: "exp-002", expenseHeadId: "head-misc", category: "food", date: d(2, 6), amount: 1800, description: "Team dinner + breakfast" }),
    ],
    approvalHistory: [
      ev({ expenseId: "exp-002", action: "submitted", byEmployeeId: "emp-001", approvalLevel: 0, approvalRole: "Employee", at: ts(2, 9) }),
    ],
    status: "submitted",
    totalAmount: 7800,
    approvedAmount: 0,
    submittedAt: ts(2, 9),
    createdAt: ts(2, 8),
    updatedAt: ts(2, 9),
  },

  // EXP-2026-0003 — emp-002 — TA bike — approved — ₹1,920
  {
    id: "exp-003",
    expenseCode: "EXP-2026-0003",
    employeeId: "emp-002",
    visitId: "dv-002",
    linkedVisitType: "doctor",
    month: `${Y}-01`,
    lineItems: [
      li({ expenseId: "exp-003", expenseHeadId: "head-ta", category: "travel", date: d(1, 15), quantity: 240, rate: 4, unit: "km", amount: 960, description: "Nagpur → Wardha → Nagpur (bike, round trip)" }),
      li({ expenseId: "exp-003", expenseHeadId: "head-ta", category: "travel", date: d(1, 17), quantity: 240, rate: 4, unit: "km", amount: 960, description: "Nagpur → Wardha → Nagpur (bike)" }),
    ],
    approvalHistory: [
      ev({ expenseId: "exp-003", action: "submitted", byEmployeeId: "emp-002", approvalLevel: 0, approvalRole: "Employee", at: ts(1, 20) }),
      ev({ expenseId: "exp-003", action: "picked_up", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", at: ts(1, 21) }),
      ev({ expenseId: "exp-003", action: "approved", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", at: ts(1, 22) }),
    ],
    status: "approved",
    totalAmount: 1920,
    approvedAmount: 1920,
    submittedAt: ts(1, 20),
    approvedAt: ts(1, 22),
    createdAt: ts(1, 19),
    updatedAt: ts(1, 22),
  },

  // EXP-2026-0004 — emp-002 — Local Conveyance — pending_approval — ₹850
  {
    id: "exp-004",
    expenseCode: "EXP-2026-0004",
    employeeId: "emp-002",
    month: `${Y}-03`,
    lineItems: [
      li({ expenseId: "exp-004", expenseHeadId: "head-ta", category: "local_conveyance", date: d(3, 5), amount: 450, description: "Auto – 3 trips to chemist stockists (₹150 flat/trip × 3)" }),
      li({ expenseId: "exp-004", expenseHeadId: "head-misc", category: "miscellaneous", date: d(3, 5), amount: 400, description: "Stationery and printed materials" }),
    ],
    approvalHistory: [
      ev({ expenseId: "exp-004", action: "submitted", byEmployeeId: "emp-002", approvalLevel: 0, approvalRole: "Employee", at: ts(3, 7) }),
      ev({ expenseId: "exp-004", action: "picked_up", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", at: ts(3, 8) }),
    ],
    status: "pending_approval",
    totalAmount: 850,
    approvedAmount: 0,
    submittedAt: ts(3, 7),
    createdAt: ts(3, 6),
    updatedAt: ts(3, 8),
  },

  // EXP-2026-0005 — emp-003 — TA + Hotel + DA — approved — ₹12,400
  {
    id: "exp-005",
    expenseCode: "EXP-2026-0005",
    employeeId: "emp-003",
    visitId: "fv-001",
    linkedVisitType: "firm",
    month: `${Y}-02`,
    lineItems: [
      li({ expenseId: "exp-005", expenseHeadId: "head-ta", category: "travel", date: d(2, 15), amount: 1200, description: "Raipur → Bhopal (train) – SFC flat fare" }),
      li({ expenseId: "exp-005", expenseHeadId: "head-hotel", category: "hotel", date: d(2, 15), quantity: 3, rate: 2200, unit: "nights", amount: 6600, description: "Hotel Palash, Bhopal – 3 nights" }),
      li({ expenseId: "exp-005", expenseHeadId: "head-da", category: "daily_allowance", date: d(2, 15), quantity: 4, rate: 800, unit: "days", amount: 3200, description: "DA – Bhopal outstation 4 days" }),
      li({ expenseId: "exp-005", expenseHeadId: "head-misc", category: "food", date: d(2, 17), amount: 1400, description: "Client entertainment meals" }),
    ],
    approvalHistory: [
      ev({ expenseId: "exp-005", action: "submitted", byEmployeeId: "emp-003", approvalLevel: 0, approvalRole: "Employee", at: ts(2, 20) }),
      ev({ expenseId: "exp-005", action: "picked_up", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", at: ts(2, 21) }),
      ev({ expenseId: "exp-005", action: "approved", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", remarks: "Conference travel approved", at: ts(2, 22) }),
    ],
    status: "approved",
    totalAmount: 12400,
    approvedAmount: 12400,
    submittedAt: ts(2, 20),
    approvedAt: ts(2, 22),
    createdAt: ts(2, 19),
    updatedAt: ts(2, 22),
  },

  // EXP-2026-0006 — emp-003 — Miscellaneous — rejected — ₹3,200
  {
    id: "exp-006",
    expenseCode: "EXP-2026-0006",
    employeeId: "emp-003",
    month: `${Y}-03`,
    lineItems: [
      li({ expenseId: "exp-006", expenseHeadId: "head-misc", category: "miscellaneous", date: d(3, 10), amount: 2000, description: "Gift items for doctors (Diwali)" }),
      li({ expenseId: "exp-006", expenseHeadId: "head-misc", category: "miscellaneous", date: d(3, 11), amount: 1200, description: "Promotional print materials (external vendor)" }),
    ],
    approvalHistory: [
      ev({ expenseId: "exp-006", action: "submitted", byEmployeeId: "emp-003", approvalLevel: 0, approvalRole: "Employee", at: ts(3, 12) }),
      ev({ expenseId: "exp-006", action: "picked_up", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", at: ts(3, 13) }),
      ev({ expenseId: "exp-006", action: "rejected", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", remarks: "Gift items not permitted under company policy. Promotional materials require prior purchase order.", at: ts(3, 14) }),
    ],
    status: "rejected",
    totalAmount: 3200,
    approvedAmount: 0,
    submittedAt: ts(3, 12),
    createdAt: ts(3, 11),
    updatedAt: ts(3, 14),
  },

  // EXP-2026-0007 — emp-004 — TA car — draft — ₹6,000
  {
    id: "exp-007",
    expenseCode: "EXP-2026-0007",
    employeeId: "emp-004",
    month: `${Y}-04`,
    lineItems: [
      li({ expenseId: "exp-007", expenseHeadId: "head-ta", category: "travel", date: d(4, 3), quantity: 480, rate: 8, unit: "km", amount: 3840, description: "Raipur → Bilaspur → Raipur × 2 (car)" }),
      li({ expenseId: "exp-007", expenseHeadId: "head-telecom", category: "miscellaneous", date: d(4, 3), amount: 999, description: "Internet recharge – monthly" }),
      li({ expenseId: "exp-007", expenseHeadId: "head-misc", category: "food", date: d(4, 4), amount: 1161, description: "Team lunch – quarterly review" }),
    ],
    approvalHistory: [],
    status: "draft",
    totalAmount: 6000,
    approvedAmount: 0,
    createdAt: ts(4, 5),
    updatedAt: ts(4, 5),
  },

  // EXP-2026-0008 — emp-001 — DA only — returned — ₹2,400
  {
    id: "exp-008",
    expenseCode: "EXP-2026-0008",
    employeeId: "emp-001",
    month: `${Y}-03`,
    lineItems: [
      li({ expenseId: "exp-008", expenseHeadId: "head-da", category: "daily_allowance", date: d(3, 1), quantity: 3, rate: 800, unit: "days", amount: 2400, description: "DA claim – 3 outstation days" }),
    ],
    approvalHistory: [
      ev({ expenseId: "exp-008", action: "submitted", byEmployeeId: "emp-001", approvalLevel: 0, approvalRole: "Employee", at: ts(3, 5) }),
      ev({ expenseId: "exp-008", action: "picked_up", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", at: ts(3, 6) }),
      ev({ expenseId: "exp-008", action: "returned", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", remarks: "Please attach hotel bills or tour plan evidence for outstation claim.", at: ts(3, 7) }),
    ],
    status: "returned",
    totalAmount: 2400,
    approvedAmount: 0,
    submittedAt: ts(3, 5),
    createdAt: ts(3, 4),
    updatedAt: ts(3, 7),
  },

  // EXP-2026-0009 — emp-002 — Mixed TA+Food — approved — ₹5,600
  {
    id: "exp-009",
    expenseCode: "EXP-2026-0009",
    employeeId: "emp-002",
    visitId: "fv-002",
    linkedVisitType: "firm",
    month: `${Y}-04`,
    lineItems: [
      li({ expenseId: "exp-009", expenseHeadId: "head-ta", category: "travel", date: d(4, 8), quantity: 156, rate: 8, unit: "km", amount: 1248, description: "Nagpur city client visits (car)" }),
      li({ expenseId: "exp-009", expenseHeadId: "head-da", category: "daily_allowance", date: d(4, 8), quantity: 2, rate: 800, unit: "days", amount: 1600, description: "DA – 2 days outstation" }),
      li({ expenseId: "exp-009", expenseHeadId: "head-misc", category: "food", date: d(4, 9), amount: 1752, description: "Working meals – 3 days" }),
      li({ expenseId: "exp-009", expenseHeadId: "head-ta", category: "local_conveyance", date: d(4, 10), amount: 1000, description: "Auto/cab – local stockist visits" }),
    ],
    approvalHistory: [
      ev({ expenseId: "exp-009", action: "submitted", byEmployeeId: "emp-002", approvalLevel: 0, approvalRole: "Employee", at: ts(4, 12) }),
      ev({ expenseId: "exp-009", action: "picked_up", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", at: ts(4, 13) }),
      ev({ expenseId: "exp-009", action: "approved", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", at: ts(4, 14) }),
    ],
    status: "approved",
    totalAmount: 5600,
    approvedAmount: 5600,
    submittedAt: ts(4, 12),
    approvedAt: ts(4, 14),
    createdAt: ts(4, 11),
    updatedAt: ts(4, 14),
  },

  // EXP-2026-0010 — emp-004 — Hotel — partially_approved — ₹9,000
  {
    id: "exp-010",
    expenseCode: "EXP-2026-0010",
    employeeId: "emp-004",
    month: `${Y}-05`,
    lineItems: [
      li({ expenseId: "exp-010", expenseHeadId: "head-hotel", category: "hotel", date: d(5, 10), quantity: 3, rate: 2000, unit: "nights", amount: 6000, description: "Hotel Landmark, Raipur – 3 nights (conference)" }),
      li({ expenseId: "exp-010", expenseHeadId: "head-da", category: "daily_allowance", date: d(5, 10), quantity: 3, rate: 1000, unit: "days", amount: 3000, description: "DA – conference 3 days (senior rate)" }),
    ],
    approvalHistory: [
      ev({ expenseId: "exp-010", action: "submitted", byEmployeeId: "emp-004", approvalLevel: 0, approvalRole: "Employee", at: ts(5, 13) }),
      ev({ expenseId: "exp-010", action: "picked_up", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", at: ts(5, 14) }),
      ev({ expenseId: "exp-010", action: "partially_approved", byEmployeeId: "emp-004", approvalLevel: 1, approvalRole: "Manager", remarks: "Hotel capped at ₹1,500/night per policy. DA approved in full.", at: ts(5, 15) }),
    ],
    status: "partially_approved",
    totalAmount: 9000,
    approvedAmount: 7500, // 3 × 1500 + 3000
    submittedAt: ts(5, 13),
    approvedAt: ts(5, 15),
    createdAt: ts(5, 12),
    updatedAt: ts(5, 15),
  },
];

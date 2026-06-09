import type { ExpenseHead } from "../types";

export const mockExpenseHeads: ExpenseHead[] = [
  {
    id: "head-ta",
    name: "Travel Allowance (TA)",
    code: "TA",
    monthlyCap: 15000,
    editable: true,
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "head-da",
    name: "Daily Allowance (DA)",
    code: "DA",
    monthlyCap: 8000,
    editable: true,
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "head-hotel",
    name: "Hotel & Lodging",
    code: "HOTEL",
    monthlyCap: 25000,
    editable: true,
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "head-telecom",
    name: "Internet & Mobile",
    code: "TELECOM",
    monthlyCap: 2000,
    editable: true,
    status: "active",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "head-misc",
    name: "Miscellaneous Claims",
    code: "MISC",
    monthlyCap: 5000,
    editable: true,
    status: "active",
    createdAt: "2026-02-01T00:00:00Z",
  },
];

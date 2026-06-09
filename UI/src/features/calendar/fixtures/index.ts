import type { Holiday, LeaveRequest, LeaveBalance, WorkCalendarEntry } from "../types";

const CURRENT_YEAR = new Date().getFullYear();

// ─── Holiday Fixtures ──────────────────────────────────────────────────────────
const STATES = [
  "Chhattisgarh", "Jharkhand", "Maharashtra", "Karnataka", "Madhya Pradesh",
  "Bihar", "Uttarpradesh", "ODISHA", "West Bengal", "Gujarat",
  "Rajasthan", "Tamil Nadu", "Kerala", "Andhra Pradesh", "Telangana",
  "Punjab", "Haryana", "Delhi"
];

const makarStates = ["Chhattisgarh", "Jharkhand", "Maharashtra", "Karnataka", "Madhya Pradesh", "Bihar", "Uttarpradesh", "ODISHA"];
const republicStates = ["Chhattisgarh", "Jharkhand", ...STATES.filter(s => s !== "Chhattisgarh" && s !== "Jharkhand")];

const otherHolidays = [
  { name: "Maha Shivratri", date: "02-15", type: "regional" },
  { name: "Holi", date: "03-14", type: "national" },
  { name: "Good Friday", date: "04-03", type: "national" },
  { name: "Dr. Ambedkar Jayanti", date: "04-14", type: "national" },
  { name: "Ram Navami", date: "04-18", type: "optional" },
  { name: "Mahavir Jayanti", date: "05-02", type: "optional" },
  { name: "Id-ul-Fitr", date: "05-28", type: "national" },
  { name: "Bakrid / Eid al-Adha", date: "08-03", type: "national" },
  { name: "Independence Day", date: "08-15", type: "national" },
  { name: "Raksha Bandhan", date: "08-29", type: "optional" },
  { name: "Janmashtami", date: "09-05", type: "optional" },
  { name: "Ganesh Chaturthi", date: "09-17", type: "regional" },
  { name: "Milad-un-Nabi", date: "10-02", type: "national" },
  { name: "Gandhi Jayanti", date: "10-02", type: "national" },
  { name: "Dussehra", date: "10-22", type: "national" },
  { name: "Diwali", date: "11-10", type: "national" },
  { name: "Guru Nanak Jayanti", date: "11-25", type: "optional" },
  { name: "Christmas Day", date: "12-25", type: "national" }
];

const rawHolidaysList: Array<{ name: string; date: string; type: Holiday["type"]; zone: string }> = [];

// Makar Sankranti
makarStates.forEach((state) => {
  rawHolidaysList.push({
    name: "Makar Sankranti",
    date: "2026-01-14",
    type: "regional",
    zone: state
  });
});

// Republic Day
republicStates.forEach((state) => {
  rawHolidaysList.push({
    name: "Republic Day",
    date: "2026-01-26",
    type: "national",
    zone: state
  });
});

let stateIdx = 0;
let holidayIdx = 0;
const usedCombos = new Set<string>();

while (rawHolidaysList.length < 262) {
  const h = otherHolidays[holidayIdx];
  const state = STATES[stateIdx];
  const comboKey = `${h.name}-${state}`;

  if (!usedCombos.has(comboKey)) {
    usedCombos.add(comboKey);
    rawHolidaysList.push({
      name: h.name,
      date: `2026-${h.date}`,
      type: h.type as any,
      zone: state
    });
  }

  stateIdx = (stateIdx + 1) % STATES.length;
  if (stateIdx === 0) {
    holidayIdx = (holidayIdx + 1) % otherHolidays.length;
  }
}

export const mockHolidays: Holiday[] = rawHolidaysList.map((h, idx) => ({
  id: `hol-${String(idx + 1).padStart(3, "0")}`,
  name: h.name,
  date: h.date,
  type: h.type,
  zone: h.zone,
  description: `${h.name} in ${h.zone}`,
  applicableDivisions: [],
  year: 2026,
  createdAt: "2026-01-01T00:00:00Z"
})).sort((a, b) => a.date.localeCompare(b.date));

// ─── Work Calendar Fixtures ───────────────────────────────────────────────────
const rawWorkList: Array<{ name: string; date: string; zone: string }> = [];
const workOccasions = ["Saturday Working", "Special Working Day", "Compensatory Work Day"];

let workStateIdx = 0;
let workOccIdx = 0;
let workDay = 7; // Start Feb 7th, 2026

for (let i = 0; i < 80; i++) {
  const state = STATES[workStateIdx];
  const occasion = workOccasions[workOccIdx];
  const dateStr = `2026-02-${String(workDay).padStart(2, "0")}`;

  rawWorkList.push({
    name: occasion,
    date: dateStr,
    zone: state
  });

  workStateIdx = (workStateIdx + 1) % STATES.length;
  if (workStateIdx === 0) {
    workOccIdx = (workOccIdx + 1) % workOccasions.length;
    workDay += 7; // Next week Saturday
    if (workDay > 28) workDay = 7; // Keep it within Feb for mock simplicity
  }
}

export const mockWorkCalendar: WorkCalendarEntry[] = rawWorkList.map((w, idx) => ({
  id: `work-${String(idx + 1).padStart(3, "0")}`,
  name: w.name,
  date: w.date,
  zone: w.zone,
  createdAt: "2026-01-01T00:00:00Z"
})).sort((a, b) => a.date.localeCompare(b.date));


// ─── Employee IDs referenced from People domain fixtures ───────────────────────
const EMP_IDS = ["emp-001", "emp-002", "emp-003", "emp-004"];
const LEAVE_TYPE_IDS = ["lt-001", "lt-002", "lt-003"];

const pad = (n: number) => String(n).padStart(2, "0");
const dateStr = (y: number, m: number, d: number) =>
  `${y}-${pad(m)}-${pad(d)}`;

// ─── Leave Request Fixtures ────────────────────────────────────────────────────
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "lr-001",
    employeeId: EMP_IDS[0],
    leaveTypeId: LEAVE_TYPE_IDS[0],
    fromDate: dateStr(CURRENT_YEAR, 1, 15),
    toDate: dateStr(CURRENT_YEAR, 1, 17),
    dayType: "full",
    totalDays: 3,
    reason: "Personal work and family function",
    status: "approved",
    approverId: EMP_IDS[3],
    approvedAt: dateStr(CURRENT_YEAR, 1, 10) + "T09:00:00Z",
    createdAt: dateStr(CURRENT_YEAR, 1, 8) + "T08:00:00Z",
  },
  {
    id: "lr-002",
    employeeId: EMP_IDS[1],
    leaveTypeId: LEAVE_TYPE_IDS[1],
    fromDate: dateStr(CURRENT_YEAR, 2, 5),
    toDate: dateStr(CURRENT_YEAR, 2, 5),
    dayType: "half_first",
    totalDays: 0.5,
    reason: "Doctor appointment in the morning",
    status: "approved",
    approverId: EMP_IDS[3],
    approvedAt: dateStr(CURRENT_YEAR, 2, 4) + "T11:00:00Z",
    createdAt: dateStr(CURRENT_YEAR, 2, 3) + "T16:00:00Z",
  },
  {
    id: "lr-003",
    employeeId: EMP_IDS[2],
    leaveTypeId: LEAVE_TYPE_IDS[0],
    fromDate: dateStr(CURRENT_YEAR, 3, 10),
    toDate: dateStr(CURRENT_YEAR, 3, 12),
    dayType: "full",
    totalDays: 3,
    reason: "Annual leave – travel",
    status: "pending",
    createdAt: dateStr(CURRENT_YEAR, 3, 7) + "T10:00:00Z",
  },
  {
    id: "lr-004",
    employeeId: EMP_IDS[0],
    leaveTypeId: LEAVE_TYPE_IDS[2],
    fromDate: dateStr(CURRENT_YEAR, 4, 1),
    toDate: dateStr(CURRENT_YEAR, 4, 2),
    dayType: "full",
    totalDays: 2,
    reason: "Casual leave",
    status: "rejected",
    approverId: EMP_IDS[3],
    rejectedAt: dateStr(CURRENT_YEAR, 3, 30) + "T14:00:00Z",
    rejectionReason: "Peak season – cannot approve",
    createdAt: dateStr(CURRENT_YEAR, 3, 28) + "T09:00:00Z",
  },
  {
    id: "lr-005",
    employeeId: EMP_IDS[1],
    leaveTypeId: LEAVE_TYPE_IDS[0],
    fromDate: dateStr(CURRENT_YEAR, 5, 20),
    toDate: dateStr(CURRENT_YEAR, 5, 23),
    dayType: "full",
    totalDays: 4,
    reason: "Family vacation",
    status: "pending",
    createdAt: dateStr(CURRENT_YEAR, 5, 15) + "T08:00:00Z",
  },
  {
    id: "lr-006",
    employeeId: EMP_IDS[3],
    leaveTypeId: LEAVE_TYPE_IDS[1],
    fromDate: dateStr(CURRENT_YEAR, 6, 10),
    toDate: dateStr(CURRENT_YEAR, 6, 11),
    dayType: "full",
    totalDays: 2,
    reason: "Sick – fever and throat infection",
    status: "approved",
    approverId: EMP_IDS[3],
    approvedAt: dateStr(CURRENT_YEAR, 6, 9) + "T08:00:00Z",
    createdAt: dateStr(CURRENT_YEAR, 6, 9) + "T07:30:00Z",
  },
];

// ─── Leave Balance Fixtures ────────────────────────────────────────────────────
export const mockLeaveBalances: LeaveBalance[] = [
  // emp-001
  { id: "lb-001", employeeId: EMP_IDS[0], leaveTypeId: LEAVE_TYPE_IDS[0], year: CURRENT_YEAR, allocated: 18, used: 5, pending: 0, remaining: 13, carriedForward: 0 },
  { id: "lb-002", employeeId: EMP_IDS[0], leaveTypeId: LEAVE_TYPE_IDS[1], year: CURRENT_YEAR, allocated: 6, used: 0, pending: 0, remaining: 6, carriedForward: 0 },
  { id: "lb-003", employeeId: EMP_IDS[0], leaveTypeId: LEAVE_TYPE_IDS[2], year: CURRENT_YEAR, allocated: 8, used: 2, pending: 0, remaining: 6, carriedForward: 2 },
  // emp-002
  { id: "lb-004", employeeId: EMP_IDS[1], leaveTypeId: LEAVE_TYPE_IDS[0], year: CURRENT_YEAR, allocated: 18, used: 4, pending: 4, remaining: 10, carriedForward: 0 },
  { id: "lb-005", employeeId: EMP_IDS[1], leaveTypeId: LEAVE_TYPE_IDS[1], year: CURRENT_YEAR, allocated: 6, used: 0.5, pending: 0, remaining: 5.5, carriedForward: 0 },
  // emp-003
  { id: "lb-006", employeeId: EMP_IDS[2], leaveTypeId: LEAVE_TYPE_IDS[0], year: CURRENT_YEAR, allocated: 18, used: 0, pending: 3, remaining: 15, carriedForward: 0 },
  // emp-004
  { id: "lb-007", employeeId: EMP_IDS[3], leaveTypeId: LEAVE_TYPE_IDS[1], year: CURRENT_YEAR, allocated: 6, used: 2, pending: 0, remaining: 4, carriedForward: 0 },
];

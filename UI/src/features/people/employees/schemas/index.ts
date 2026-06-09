import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  contact: z.string().min(10, "Contact number must be at least 10 digits"),
  designationId: z.string().min(1, "Designation must be selected"),
  divisionId: z.string().min(1, "Division must be selected"),
  zoneId: z.string().min(1, "Zone must be selected"),
  territoryId: z.string().min(1, "Territory must be selected"),
  reportingTo: z.string().optional(),
  workType: z.enum(["onfield", "office"]),
  status: z.enum(["active", "inactive", "onhold"]),

  state: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  dateOfJoin: z.string().optional(),
  dateOfResignation: z.string().optional(),
  signUpDateTime: z.string().optional(),
  lastSyncDateTime: z.string().optional(),
  apkVersion: z.string().optional(),
  mobile: z.string().optional(),
  os: z.string().optional(),
  inactiveDate: z.string().optional(),
  inactiveReason: z.string().optional(),

  // Sefmed SPEC fields
  gender: z.enum(["male", "female"]).optional(),
  anniversary: z.string().optional(),
  alternateContact: z.string().optional(),
  country: z.string().optional(),
  currentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  ageAsOfDate: z.string().optional(),
  additionalDivision: z.string().optional(),

  exSystem: z.string().optional(),
  additionalApproverId: z.string().optional(),
  endProbationDate: z.string().optional(),
  dailyWorkingHourPolicy: z.string().optional(),
  showTourplanOption: z.boolean().optional(),
  managementEmployeeId: z.string().optional(),
  showInReports: z.boolean().optional(),
  workingDivisionId: z.string().optional(),

  qualification: z.string().optional(),
  aadharNumber: z.string().optional(),
  panNumber: z.string().optional(),
  pfaNumber: z.string().optional(),
  esicNumber: z.string().optional(),
  pranNumber: z.string().optional(),
  drivingLicenseNumber: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  bloodGroup: z.string().optional(),

  daHq: z.number().or(z.nan()).optional(),
  daEx: z.number().or(z.nan()).optional(),
  daOut: z.number().or(z.nan()).optional(),
  daHilly: z.number().or(z.nan()).optional(),
  daTransit: z.number().or(z.nan()).optional(),
  daSpecial: z.number().or(z.nan()).optional(),

  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscNumber: z.string().optional(),
  beneficiaryId: z.string().optional(),
  bankName: z.string().optional(),
  branchName: z.string().optional(),
  nomineeName: z.string().optional(),
  annualIncome: z.string().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const searchEmployeeSchema = z.object({
  query: z.string().optional(),
  designationId: z.string().optional(),
  divisionId: z.string().optional(),
  zoneId: z.string().optional(),
  status: z.enum(["active", "inactive", "onhold"]).optional(),
});

export type EmployeeFormValues = z.infer<typeof createEmployeeSchema>;

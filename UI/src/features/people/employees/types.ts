export interface Employee {
  id: string;
  code: string; // e.g. TEQEMP0001
  name: string;
  email: string;
  contact: string;
  designationId: string;
  divisionId: string;
  zoneId: string;
  territoryId: string;
  reportingTo?: string; // ID of another employee
  workType: "onfield" | "office";
  status: "active" | "inactive" | "onhold";
  createdAt: string;

  // Contact Info
  state?: string;
  address?: string;
  dateOfBirth?: string;
  dateOfJoin?: string;
  dateOfResignation?: string;
  signUpDateTime?: string;
  lastSyncDateTime?: string;
  apkVersion?: string;
  mobile?: string;
  os?: string;
  inactiveDate?: string;
  inactiveReason?: string;

  // Extended Sefmed Fields
  gender?: "male" | "female";
  anniversary?: string;
  alternateContact?: string;
  country?: string;
  currentAddress?: string;
  permanentAddress?: string;
  ageAsOfDate?: string;
  additionalDivision?: string;

  // Work Info
  exSystem?: string;
  additionalApproverId?: string;
  endProbationDate?: string;
  dailyWorkingHourPolicy?: string;
  showTourplanOption?: boolean;
  managementEmployeeId?: string;
  showInReports?: boolean;
  workingDivisionId?: string;

  // Other Info
  qualification?: string;
  aadharNumber?: string;
  panNumber?: string;
  pfaNumber?: string;
  esicNumber?: string;
  pranNumber?: string;
  drivingLicenseNumber?: string;
  licenseExpiryDate?: string;
  bloodGroup?: string;

  // Allowance Info
  daHq?: number;
  daEx?: number;
  daOut?: number;
  daHilly?: number;
  daTransit?: number;
  daSpecial?: number;

  // Account Info
  accountHolderName?: string;
  accountNumber?: string;
  ifscNumber?: string;
  beneficiaryId?: string;
  bankName?: string;
  branchName?: string;
  nomineeName?: string;
  annualIncome?: string;
}

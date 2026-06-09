export type GeoVerificationStatus = "Verified" | "Unverified" | "Outside Radius";

export type VisitWorkflowStatus =
  | "planned"
  | "open"
  | "closed"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "rescheduled"
  | "skipped"
  | "cancelled";

export interface DoctorVisit {
  id: string;
  date: string; // ISO date
  doctorId: string; // FK Doctor
  assignedEmployeeId: string; // FK Employee/Representative
  visitTypeId: string; // FK VisitType
  status: VisitWorkflowStatus;
  jointVisit: boolean;
  jointEmployeeId?: string; // FK Employee/Senior Manager
  discussionSummary?: string;
  productsDiscussion?: string[]; // discussed brands
  samplesDistributed?: Array<{ product: string; quantity: number }>;
  remarks?: string;
  latitude?: number;
  longitude?: number;
  geoAddress?: string;
  geoVerificationStatus?: GeoVerificationStatus;
  createdAt: string;
}

export interface FirmVisit {
  id: string;
  date: string; // ISO date
  firmName: string;
  firmType: "chemist" | "stockist" | "hospital";
  assignedEmployeeId: string; // FK Employee
  status: VisitWorkflowStatus;
  purpose: string;
  remarks?: string;
  latitude?: number;
  longitude?: number;
  geoAddress?: string;
  geoVerificationStatus?: GeoVerificationStatus;
  createdAt: string;
}

export interface VisitPlanner {
  id: string;
  plannedDate: string; // ISO date
  assignedEmployeeId: string; // FK Employee
  doctorId?: string; // FK Doctor
  firmName?: string;
  territoryId: string; // FK Territory
  visitTypeId: string; // FK VisitType
  status: "planned" | "rescheduled" | "cancelled";
  remarks?: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  registrationNumber: string;
  doctorCode: string;
  hospitalName: string;
  clinicAddress: string;
  speciality: string;
  category: string;
  assignedEmployeeId: string; // FK Employee
  contact: string;
  zoneId: string;
  territoryId: string;
  status: "active" | "inactive";
  createdAt: string;

  // Additional fields to match Sefmed exact system specs
  qualification?: string;
  divisionId?: string;
  email?: string;
  gender?: string;
  dob?: string;
  anniversary?: string;
  type?: string;
  firm?: string;
  approxBusiness?: number;
  country?: string;
}

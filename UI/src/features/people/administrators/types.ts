export interface Administrator {
  id: string;
  name: string;
  email: string;
  city: string;
  contact: string;
  divisionId: string;
  zoneId: string;
  role: "zonal" | "divisional" | "sales" | "hr" | "payroll" | "admin" | "superadmin" | "support";
  status: "active" | "inactive";
  createdAt: string;

  // Sefmed SPEC fields
  address?: string;
  state?: string;
  dcrEmail?: string;
  alias?: string;
}

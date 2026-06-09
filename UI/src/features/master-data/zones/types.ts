export interface Zone {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive";
  createdAt: string;
}

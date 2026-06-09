export interface Designation {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Division {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: "active" | "inactive";
  createdAt: string;
}

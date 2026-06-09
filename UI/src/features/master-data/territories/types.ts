export interface Territory {
  id: string;
  name: string;
  code: string;
  zoneId: string;
  status: "active" | "inactive";
  createdAt: string;
}

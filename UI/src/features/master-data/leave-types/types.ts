export interface LeaveType {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive";
  createdAt: string;
}

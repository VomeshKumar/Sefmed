export interface ExpenseHead {
  id: string;
  name: string;
  code: string;
  monthlyCap: number;
  editable: boolean;
  status: "active" | "inactive";
  createdAt: string;
}

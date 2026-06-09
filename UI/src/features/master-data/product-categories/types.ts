export interface ProductCategory {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive";
  createdAt: string;
}

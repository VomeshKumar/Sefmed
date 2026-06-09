export type ProductStatus = "active" | "inactive" | "discontinued";

export interface Product {
  id: string;
  name: string;
  code: string; // SKU code
  productCategoryId: string; // FK -> ProductCategory
  mrp: number; // Max Retail Price
  pts: number; // Price to Stockist (primary rate)
  ptr: number; // Price to Retailer (secondary rate)
  packSize: string; // e.g. "10x10 Tablets"
  status: ProductStatus;
  qrCode?: string; // Mocked URL or string payload
  qrGeneratedAt?: string; // ISO Timestamp
  createdAt: string;
  updatedAt: string;
}

export type StockistType = "super_stockist" | "stockist" | "sub_stockist" | "company";

export interface Stockist {
  id: string;
  name: string;
  code: string;
  type: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  territoryId?: string; // FK -> Territory
  zoneId?: string; // FK -> Zone
  creditLimit: number;
  outstandingAmount: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;

  // New Fields for Firms layout
  date?: string;
  addDate?: string;
  zone?: string;
  division?: string;
  category?: string;
  employeeAssigned?: string;
  assignedFirm?: string;
  distributorCode?: string;
  stockistCode?: string;
  customerCode?: string;
  firstLevelManager?: string;
  secondLevelManager?: string;
  thirdLevelManager?: string;
  dob?: string;
  pan?: string;
  drugLicense?: string;
  foodLicense?: string;
  approxBusiness?: string;
  associatedDoctors?: string;
  additionalDivision?: string;
  attachments?: string[];
}

export type OrderStatus =
  | "draft"
  | "submitted"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "dispatched"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "partially_paid" | "paid";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  rate: number; // Price to Stockist (PTS)
  amount: number; // quantity * rate
}

export interface Order {
  id: string;
  orderNumber: string; // ORD-2026-0001
  stockistId: string; // FK -> Stockist
  employeeId?: string; // FK -> Employee (representative booking the order)
  orderDate: string; // YYYY-MM-DD
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number; // Sum of items.amount
  discountAmount: number;
  netAmount: number; // totalAmount - discountAmount
  paymentStatus: PaymentStatus;
  isCreditLimitExceeded: boolean; // Flagged when booking > credit limit
  creditLimitOverrideApprovedBy?: string; // EmployeeId of manager who approved override
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecondarySalesItem {
  id: string;
  productId: string;
  openingStock: number;
  receivedStock: number;
  salesQty: number; // Sold to retailers
  closingStock: number; // Physical count
  expectedClosingStock: number; // openingStock + receivedStock - salesQty
  varianceQty: number; // closingStock - expectedClosingStock
  hasVariance: boolean; // true if closingStock != expectedClosingStock
  value: number; // salesQty * PTR (value based on PTR rate)
  freeQty?: number;
}

export interface SecondarySale {
  id: string;
  stockistId: string; // FK -> Stockist
  month: string; // YYYY-MM
  statementDate: string; // YYYY-MM-DD
  status: "draft" | "submitted" | "approved" | "rejected";
  items: SecondarySalesItem[];
  totalValue: number; // Sum of item values
  submittedByEmployeeId: string; // FK -> Employee (MR collecting statement)
  hasReconciliationWarnings: boolean; // True if any items have variance
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductTarget {
  productId: string;
  targetQuantity: number;
  targetAmount: number;
}

export interface SalesTarget {
  id: string;
  employeeId: string; // FK -> Employee
  month: string; // YYYY-MM
  targetAmount: number; // Total amount (sum of productTargets)
  productTargets: ProductTarget[];
  achievedPrimaryAmount: number; // Computed from approved orders
  achievedSecondaryAmount: number; // Computed from approved secondary sales
  status: "draft" | "submitted" | "pending_approval" | "approved" | "rejected";
  remarks?: string;
  createdAt: string;
  updatedAt: string;

  // New targets metrics to match Sefmed layout
  frequency?: string;
  quarter?: string;
  year?: string;
  pobValue?: number;
  secondarySales?: number;
  doctorVisit?: number;
  chemistVisit?: number;
  newDoctorAddition?: number;
  newChemistAddition?: number;
  primarySalesValue?: number;
}

// ─── Dashboard Stats & Analytics Metrics ───────────────────────────────────────

export interface PerformanceMetric {
  id: string;
  name: string;
  targetAmount: number;
  primaryAmount: number;
  secondaryAmount: number;
  achievementPrimaryPercent: number;
  achievementSecondaryPercent: number;
}

export interface SalesDashboardStats {
  totalPrimarySales: number;
  totalSecondarySales: number;
  totalTargetAmount: number;
  achievementPrimaryPercent: number;
  achievementSecondaryPercent: number;
  totalOutstanding: number;
  topProducts: PerformanceMetric[];
  topEmployees: PerformanceMetric[];
  topTerritories: PerformanceMetric[];
  monthlyTrend: Array<{
    month: string;
    target: number;
    primary: number;
    secondary: number;
  }>;
}

export interface DoctorOrder {
  id: string;
  orderNumber: string;
  doctorName: string;
  chemistName: string;
  date: string;
  productDetails: string;
  quantity: number;
  representativeName: string;
  status: "Pending" | "Completed" | "Cancelled";
  zone?: string;
  city?: string;
}

export interface RateMaster {
  id: string;
  productName: string;
  distributorPrice: number;
  stockistPrice: number;
  retailerPrice: number;
  doctorPrice: number;
  division: string;
}

export interface FirmRateMaster {
  id: string; // key "firmId_productId"
  firmId: string;
  productId: string;
  rate: number;
}

export interface DoctorRateMaster {
  id: string; // key "doctorId_productId"
  doctorId: string;
  productId: string;
  rate: number;
}


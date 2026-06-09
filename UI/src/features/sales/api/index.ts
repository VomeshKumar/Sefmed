import { mockProducts, mockStockists, mockOrders, mockTargets, mockSecondarySales, mockDoctorOrders, mockRateMasters } from "../fixtures";
import type { Product, Stockist, Order, SalesTarget, SecondarySale, DoctorOrder, RateMaster, FirmRateMaster, DoctorRateMaster } from "../types";

// ─── Storage Keys ──────────────────────────────────────────────────────────────
const PRODUCTS_KEY = "sefmed_sales_products";
const STOCKISTS_KEY = "sefmed_sales_stockists";
const ORDERS_KEY = "sefmed_sales_orders";
const TARGETS_KEY = "sefmed_sales_targets";
const SEC_SALES_KEY = "sefmed_sales_secondary";
const AUDIT_KEY = "sefmed_audit_logs"; // General audit logs key

// ─── LocalStorage Helpers ───────────────────────────────────────────────────────
export const getStoredProducts = (): Product[] => {
  if (typeof window === "undefined") return mockProducts;
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mockProducts));
    return mockProducts;
  }
  return JSON.parse(stored);
};

export const saveStoredProducts = (data: Product[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
  }
};

export const getStoredStockists = (): Stockist[] => {
  if (typeof window === "undefined") return mockStockists;
  const stored = localStorage.getItem(STOCKISTS_KEY);
  if (!stored) {
    localStorage.setItem(STOCKISTS_KEY, JSON.stringify(mockStockists));
    return mockStockists;
  }
  try {
    const parsed = JSON.parse(stored);
    if (parsed.length < 90) {
      localStorage.setItem(STOCKISTS_KEY, JSON.stringify(mockStockists));
      return mockStockists;
    }
    return parsed;
  } catch {
    localStorage.setItem(STOCKISTS_KEY, JSON.stringify(mockStockists));
    return mockStockists;
  }
};

export const saveStoredStockists = (data: Stockist[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STOCKISTS_KEY, JSON.stringify(data));
  }
};

export const getStoredOrders = (): Order[] => {
  if (typeof window === "undefined") return mockOrders;
  const stored = localStorage.getItem(ORDERS_KEY);
  if (!stored) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(mockOrders));
    return mockOrders;
  }
  try {
    const parsed = JSON.parse(stored) as Order[];
    if (parsed.some(o => o.employeeId === "emp-001" || o.employeeId === "emp-002" || o.employeeId === "emp-003")) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(mockOrders));
      return mockOrders;
    }
    return parsed;
  } catch {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(mockOrders));
    return mockOrders;
  }
};

export const saveStoredOrders = (data: Order[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(data));
  }
};

export const getStoredTargets = (): SalesTarget[] => {
  if (typeof window === "undefined") return mockTargets;
  const stored = localStorage.getItem(TARGETS_KEY);
  if (!stored) {
    localStorage.setItem(TARGETS_KEY, JSON.stringify(mockTargets));
    return mockTargets;
  }
  try {
    const parsed = JSON.parse(stored) as SalesTarget[];
    if (parsed.some(t => t.employeeId === "emp-001" || t.employeeId === "emp-002" || t.employeeId === "emp-003")) {
      localStorage.setItem(TARGETS_KEY, JSON.stringify(mockTargets));
      return mockTargets;
    }
    return parsed;
  } catch {
    localStorage.setItem(TARGETS_KEY, JSON.stringify(mockTargets));
    return mockTargets;
  }
};

export const saveStoredTargets = (data: SalesTarget[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TARGETS_KEY, JSON.stringify(data));
  }
};

export const getStoredSecondarySales = (): SecondarySale[] => {
  if (typeof window === "undefined") return mockSecondarySales;
  const stored = localStorage.getItem(SEC_SALES_KEY);
  if (!stored) {
    localStorage.setItem(SEC_SALES_KEY, JSON.stringify(mockSecondarySales));
    return mockSecondarySales;
  }
  try {
    const parsed = JSON.parse(stored) as SecondarySale[];
    if (parsed.some(s => s.submittedByEmployeeId === "emp-001" || s.submittedByEmployeeId === "emp-002" || s.submittedByEmployeeId === "emp-003")) {
      localStorage.setItem(SEC_SALES_KEY, JSON.stringify(mockSecondarySales));
      return mockSecondarySales;
    }
    return parsed;
  } catch {
    localStorage.setItem(SEC_SALES_KEY, JSON.stringify(mockSecondarySales));
    return mockSecondarySales;
  }
};

export const saveStoredSecondarySales = (data: SecondarySale[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(SEC_SALES_KEY, JSON.stringify(data));
  }
};

const DOC_ORDERS_KEY = "sefmed_sales_doctor_orders";

export const getStoredDoctorOrders = (): DoctorOrder[] => {
  if (typeof window === "undefined") return mockDoctorOrders;
  const stored = localStorage.getItem(DOC_ORDERS_KEY);
  if (!stored) {
    localStorage.setItem(DOC_ORDERS_KEY, JSON.stringify(mockDoctorOrders));
    return mockDoctorOrders;
  }
  return JSON.parse(stored);
};

export const saveStoredDoctorOrders = (data: DoctorOrder[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(DOC_ORDERS_KEY, JSON.stringify(data));
  }
};

const RATE_MASTERS_KEY = "sefmed_sales_rate_masters";

export const getStoredRateMasters = (): RateMaster[] => {
  if (typeof window === "undefined") return mockRateMasters;
  const stored = localStorage.getItem(RATE_MASTERS_KEY);
  if (!stored) {
    localStorage.setItem(RATE_MASTERS_KEY, JSON.stringify(mockRateMasters));
    return mockRateMasters;
  }
  return JSON.parse(stored);
};

export const saveStoredRateMasters = (data: RateMaster[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(RATE_MASTERS_KEY, JSON.stringify(data));
  }
};

const FIRM_RATE_MASTERS_KEY = "sefmed_sales_firm_rate_masters";
const DOC_RATE_MASTERS_KEY = "sefmed_sales_doc_rate_masters";

export const getStoredFirmRateMasters = (): FirmRateMaster[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(FIRM_RATE_MASTERS_KEY);
  if (!stored) {
    // Initial overrides
    const initial: FirmRateMaster[] = [
      { id: "1_rm-001", firmId: "1", productId: "rm-001", rate: 290.00 },
      { id: "4_rm-002", firmId: "4", productId: "rm-002", rate: 180.00 },
      { id: "5_rm-003", firmId: "5", productId: "rm-003", rate: 90.00 },
    ];
    localStorage.setItem(FIRM_RATE_MASTERS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const saveStoredFirmRateMasters = (data: FirmRateMaster[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(FIRM_RATE_MASTERS_KEY, JSON.stringify(data));
  }
};

export const getStoredDoctorRateMasters = (): DoctorRateMaster[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(DOC_RATE_MASTERS_KEY);
  if (!stored) {
    const initial: DoctorRateMaster[] = [
      { id: "doc-atul_rm-001", doctorId: "doc-atul", productId: "rm-001", rate: 0.00 },
      { id: "doc-atul_rm-002", doctorId: "doc-atul", productId: "rm-002", rate: 0.00 },
    ];
    localStorage.setItem(DOC_RATE_MASTERS_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const saveStoredDoctorRateMasters = (data: DoctorRateMaster[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(DOC_RATE_MASTERS_KEY, JSON.stringify(data));
  }
};


// ─── Audit Logger Helper ────────────────────────────────────────────────────────
export const logAuditEvent = (action: string, details: string, entityId: string, userId = "emp-004") => {
  if (typeof window === "undefined") return;
  const logs = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
  const logItem = {
    id: `audit-${Math.random().toString(36).substring(2, 9)}`,
    action,
    details,
    entityId,
    userId,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(logItem);
  localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
};

export const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Sales APIs ─────────────────────────────────────────────────────────────────
export const salesApi = {
  // ─── Products ───
  listProducts: async (filters?: { query?: string; categoryId?: string; status?: string }): Promise<Product[]> => {
    await delay(150);
    let list = getStoredProducts();
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
    }
    if (filters?.categoryId && filters.categoryId !== "all") {
      list = list.filter((p) => p.productCategoryId === filters.categoryId);
    }
    if (filters?.status && filters.status !== "all") {
      list = list.filter((p) => p.status === filters.status);
    }
    return list;
  },

  getProductById: async (id: string): Promise<Product | null> => {
    await delay(100);
    return getStoredProducts().find((p) => p.id === id) ?? null;
  },

  createProduct: async (data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> => {
    await delay(200);
    const list = getStoredProducts();
    const newProduct: Product = {
      ...data,
      id: `prod-${Math.random().toString(36).substring(2, 9)}`,
      qrCode: `https://sefmed.crm/qr/prod-${Math.random().toString(36).substring(2, 6)}`,
      qrGeneratedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newProduct);
    saveStoredProducts(list);
    logAuditEvent("product.created", `Product ${newProduct.name} (${newProduct.code}) created`, newProduct.id);
    return newProduct;
  },

  updateProduct: async (id: string, data: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product> => {
    await delay(200);
    const list = getStoredProducts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Product not found");
    const updated = {
      ...list[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredProducts(list);
    return updated;
  },

  // ─── Stockists ───
  listStockists: async (filters?: { query?: string; type?: string; status?: string }): Promise<Stockist[]> => {
    await delay(150);
    let list = getStoredStockists();
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.city.toLowerCase().includes(q));
    }
    if (filters?.type && filters.type !== "all") {
      list = list.filter((s) => s.type === filters.type);
    }
    if (filters?.status && filters.status !== "all") {
      list = list.filter((s) => s.status === filters.status);
    }
    return list;
  },

  getStockistById: async (id: string): Promise<Stockist | null> => {
    await delay(100);
    return getStoredStockists().find((s) => s.id === id) ?? null;
  },

  createStockist: async (data: Omit<Stockist, "id" | "createdAt" | "updatedAt">): Promise<Stockist> => {
    await delay(200);
    const list = getStoredStockists();
    const newStockist: Stockist = {
      ...data,
      id: `st-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newStockist);
    saveStoredStockists(list);
    logAuditEvent("stockist.created", `Stockist ${newStockist.name} registered`, newStockist.id);
    return newStockist;
  },

  updateStockist: async (id: string, data: Partial<Omit<Stockist, "id" | "createdAt">>): Promise<Stockist> => {
    await delay(200);
    const list = getStoredStockists();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Stockist not found");
    const oldLimit = list[idx].creditLimit;
    const updated = {
      ...list[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredStockists(list);
    if (data.creditLimit !== undefined && data.creditLimit !== oldLimit) {
      logAuditEvent("stockist.credit_limit_updated", `Credit limit updated from ₹${oldLimit} to ₹${data.creditLimit}`, id);
    }
    return updated;
  },

  // ─── Orders ───
  listOrders: async (filters?: { query?: string; stockistId?: string; status?: string }): Promise<Order[]> => {
    await delay(150);
    let list = getStoredOrders();
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter((o) => o.orderNumber.toLowerCase().includes(q) || (o.remarks && o.remarks.toLowerCase().includes(q)));
    }
    if (filters?.stockistId && filters.stockistId !== "all") {
      list = list.filter((o) => o.stockistId === filters.stockistId);
    }
    if (filters?.status && filters.status !== "all") {
      list = list.filter((o) => o.status === filters.status);
    }
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    await delay(100);
    return getStoredOrders().find((o) => o.id === id) ?? null;
  },

  createOrder: async (data: Omit<Order, "id" | "orderNumber" | "status" | "totalAmount" | "netAmount" | "isCreditLimitExceeded" | "createdAt" | "updatedAt">): Promise<Order> => {
    await delay(250);
    const list = getStoredOrders();
    const stockist = getStoredStockists().find((s) => s.id === data.stockistId);
    if (!stockist) throw new Error("Stockist not found");

    const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);
    const netAmount = totalAmount - data.discountAmount;

    // Credit Limit Check
    const isCreditLimitExceeded = stockist.outstandingAmount + netAmount > stockist.creditLimit;

    const seq = String(list.length + 1).padStart(4, "0");
    const year = new Date().getFullYear();

    const newOrder: Order = {
      ...data,
      id: `ord-${Math.random().toString(36).substring(2, 9)}`,
      orderNumber: `ORD-${year}-${seq}`,
      status: "draft",
      totalAmount,
      netAmount,
      isCreditLimitExceeded,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(newOrder);
    saveStoredOrders(list);
    logAuditEvent("order.created", `Order ${newOrder.orderNumber} booked in draft`, newOrder.id);
    return newOrder;
  },

  updateOrder: async (id: string, data: Partial<Omit<Order, "id" | "orderNumber" | "createdAt">>): Promise<Order> => {
    await delay(200);
    const list = getStoredOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found");

    const stockist = getStoredStockists().find((s) => s.id === (data.stockistId || list[idx].stockistId));
    if (!stockist) throw new Error("Stockist not found");

    const items = data.items || list[idx].items;
    const discountAmount = data.discountAmount !== undefined ? data.discountAmount : list[idx].discountAmount;
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const netAmount = totalAmount - discountAmount;

    const isCreditLimitExceeded = stockist.outstandingAmount + netAmount > stockist.creditLimit;

    const updated = {
      ...list[idx],
      ...data,
      items,
      discountAmount,
      totalAmount,
      netAmount,
      isCreditLimitExceeded,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredOrders(list);
    return updated;
  },

  submitOrder: async (id: string): Promise<Order> => {
    await delay(200);
    const list = getStoredOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found");

    const order = list[idx];
    const targetStatus = order.isCreditLimitExceeded ? "pending_approval" : "submitted";

    const updated: Order = {
      ...order,
      status: targetStatus,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredOrders(list);
    logAuditEvent("order.submitted", `Order ${order.orderNumber} submitted. Status: ${targetStatus}`, id);
    return updated;
  },

  approveOrder: async (id: string, approverId: string, remarks?: string): Promise<Order> => {
    await delay(200);
    const list = getStoredOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found");

    const order = list[idx];
    const updated: Order = {
      ...order,
      status: "approved",
      creditLimitOverrideApprovedBy: order.isCreditLimitExceeded ? approverId : undefined,
      remarks: remarks || order.remarks,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredOrders(list);
    logAuditEvent("order.approved", `Order ${order.orderNumber} approved by ${approverId}`, id);
    return updated;
  },

  rejectOrder: async (id: string, approverId: string, remarks: string): Promise<Order> => {
    await delay(200);
    const list = getStoredOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found");

    const order = list[idx];
    const updated: Order = {
      ...order,
      status: "rejected",
      remarks,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredOrders(list);
    logAuditEvent("order.rejected", `Order ${order.orderNumber} rejected by manager: ${remarks}`, id);
    return updated;
  },

  dispatchOrder: async (id: string): Promise<Order> => {
    await delay(200);
    const list = getStoredOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found");

    const order = list[idx];
    const updated: Order = {
      ...order,
      status: "dispatched",
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredOrders(list);
    logAuditEvent("order.dispatched", `Order ${order.orderNumber} dispatched for transit`, id);
    return updated;
  },

  deliverOrder: async (id: string): Promise<Order> => {
    await delay(200);
    const list = getStoredOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found");

    const order = list[idx];
    const updated: Order = {
      ...order,
      status: "delivered",
      paymentStatus: "unpaid", // Billed, outstanding incremented
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredOrders(list);

    // Increment Stockist Outstanding
    const stockists = getStoredStockists();
    const sIdx = stockists.findIndex((s) => s.id === order.stockistId);
    if (sIdx !== -1) {
      stockists[sIdx].outstandingAmount += order.netAmount;
      saveStoredStockists(stockists);
    }

    logAuditEvent("order.delivered", `Order ${order.orderNumber} delivered. Stockist outstanding incremented by ₹${order.netAmount}`, id);
    return updated;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    await delay(200);
    const list = getStoredOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error("Order not found");

    const order = list[idx];
    const updated: Order = {
      ...order,
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredOrders(list);
    logAuditEvent("order.cancelled", `Order ${order.orderNumber} cancelled`, id);
    return updated;
  },

  deleteOrder: async (id: string): Promise<void> => {
    await delay(150);
    const list = getStoredOrders();
    saveStoredOrders(list.filter((o) => o.id !== id));
  },

  // ─── Targets ───
  listTargets: async (filters?: { employeeId?: string; month?: string }): Promise<SalesTarget[]> => {
    await delay(150);
    let list = getStoredTargets();
    if (filters?.employeeId && filters.employeeId !== "all") {
      list = list.filter((t) => t.employeeId === filters.employeeId);
    }
    if (filters?.month) {
      list = list.filter((t) => t.month === filters.month);
    }
    return list;
  },

  getTargetById: async (id: string): Promise<SalesTarget | null> => {
    await delay(100);
    return getStoredTargets().find((t) => t.id === id) ?? null;
  },

  createTarget: async (data: Omit<SalesTarget, "id" | "achievedPrimaryAmount" | "achievedSecondaryAmount" | "status" | "createdAt" | "updatedAt">): Promise<SalesTarget> => {
    await delay(200);
    const list = getStoredTargets();
    const newTarget: SalesTarget = {
      ...data,
      id: `tar-${Math.random().toString(36).substring(2, 9)}`,
      achievedPrimaryAmount: 0,
      achievedSecondaryAmount: 0,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newTarget);
    saveStoredTargets(list);
    logAuditEvent("target.created", `Target created for employee ${newTarget.employeeId} in month ${newTarget.month}`, newTarget.id);
    return newTarget;
  },

  updateTarget: async (id: string, data: Partial<Omit<SalesTarget, "id" | "createdAt">>): Promise<SalesTarget> => {
    await delay(200);
    const list = getStoredTargets();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Target not found");
    const updated = {
      ...list[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredTargets(list);
    return updated;
  },

  submitTarget: async (id: string): Promise<SalesTarget> => {
    await delay(200);
    const list = getStoredTargets();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Target not found");
    const updated: SalesTarget = {
      ...list[idx],
      status: "submitted",
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredTargets(list);
    logAuditEvent("target.submitted", `Target submitted for review`, id);
    return updated;
  },

  approveTarget: async (id: string): Promise<SalesTarget> => {
    await delay(200);
    const list = getStoredTargets();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Target not found");
    const updated: SalesTarget = {
      ...list[idx],
      status: "approved",
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredTargets(list);
    logAuditEvent("target.approved", `Target approved by manager`, id);
    return updated;
  },

  rejectTarget: async (id: string, remarks: string): Promise<SalesTarget> => {
    await delay(200);
    const list = getStoredTargets();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Target not found");
    const updated: SalesTarget = {
      ...list[idx],
      status: "rejected",
      remarks,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredTargets(list);
    logAuditEvent("target.rejected", `Target rejected: ${remarks}`, id);
    return updated;
  },

  deleteTarget: async (id: string): Promise<void> => {
    await delay(150);
    const list = getStoredTargets();
    saveStoredTargets(list.filter((t) => t.id !== id));
  },

  // ─── Secondary Sales ───
  listSecondarySales: async (filters?: { stockistId?: string; month?: string; status?: string }): Promise<SecondarySale[]> => {
    await delay(150);
    let list = getStoredSecondarySales();
    if (filters?.stockistId && filters.stockistId !== "all") {
      list = list.filter((s) => s.stockistId === filters.stockistId);
    }
    if (filters?.month) {
      list = list.filter((s) => s.month === filters.month);
    }
    if (filters?.status && filters.status !== "all") {
      list = list.filter((s) => s.status === filters.status);
    }
    return list;
  },

  getSecondarySaleById: async (id: string): Promise<SecondarySale | null> => {
    await delay(100);
    return getStoredSecondarySales().find((s) => s.id === id) ?? null;
  },

  createSecondarySale: async (data: Omit<SecondarySale, "id" | "status" | "totalValue" | "hasReconciliationWarnings" | "createdAt" | "updatedAt">): Promise<SecondarySale> => {
    await delay(250);
    const list = getStoredSecondarySales();

    const items = data.items.map((item) => {
      const expectedClosingStock = item.openingStock + item.receivedStock - item.salesQty;
      const varianceQty = item.closingStock - expectedClosingStock;
      const hasVariance = item.closingStock !== expectedClosingStock;
      return {
        ...item,
        expectedClosingStock,
        varianceQty,
        hasVariance,
      };
    });

    const hasReconciliationWarnings = items.some((item) => item.hasVariance);
    const totalValue = items.reduce((sum, item) => sum + item.value, 0);

    const newStatement: SecondarySale = {
      ...data,
      id: `ss-${Math.random().toString(36).substring(2, 9)}`,
      status: "draft",
      items,
      totalValue,
      hasReconciliationWarnings,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.unshift(newStatement);
    saveStoredSecondarySales(list);
    logAuditEvent("secondary_sale.submitted", `Secondary Sale statement saved as draft (warning-based warning: ${hasReconciliationWarnings})`, newStatement.id);
    return newStatement;
  },

  updateSecondarySale: async (id: string, data: Partial<Omit<SecondarySale, "id" | "createdAt">>): Promise<SecondarySale> => {
    await delay(200);
    const list = getStoredSecondarySales();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Statement not found");

    let items = list[idx].items;
    if (data.items) {
      items = data.items.map((item) => {
        const expectedClosingStock = item.openingStock + item.receivedStock - item.salesQty;
        const varianceQty = item.closingStock - expectedClosingStock;
        const hasVariance = item.closingStock !== expectedClosingStock;
        return {
          ...item,
          expectedClosingStock,
          varianceQty,
          hasVariance,
        };
      });
    }

    const hasReconciliationWarnings = items.some((item) => item.hasVariance);
    const totalValue = items.reduce((sum, item) => sum + item.value, 0);

    const updated = {
      ...list[idx],
      ...data,
      items,
      totalValue,
      hasReconciliationWarnings,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredSecondarySales(list);
    return updated;
  },

  submitSecondarySale: async (id: string): Promise<SecondarySale> => {
    await delay(200);
    const list = getStoredSecondarySales();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Statement not found");

    const statement = list[idx];
    const updated: SecondarySale = {
      ...statement,
      status: "submitted",
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredSecondarySales(list);
    logAuditEvent("secondary_sale.submitted", `Secondary Sale statement for stockist ${statement.stockistId} submitted`, id);
    return updated;
  },

  approveSecondarySale: async (id: string): Promise<SecondarySale> => {
    await delay(200);
    const list = getStoredSecondarySales();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Statement not found");

    const statement = list[idx];
    const updated: SecondarySale = {
      ...statement,
      status: "approved",
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredSecondarySales(list);
    logAuditEvent("secondary_sale.approved", `Secondary Sale statement approved`, id);
    return updated;
  },

  rejectSecondarySale: async (id: string, remarks: string): Promise<SecondarySale> => {
    await delay(200);
    const list = getStoredSecondarySales();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Statement not found");

    const statement = list[idx];
    const updated: SecondarySale = {
      ...statement,
      status: "rejected",
      remarks,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    saveStoredSecondarySales(list);
    logAuditEvent("secondary_sale.rejected", `Secondary Sale statement rejected: ${remarks}`, id);
    return updated;
  },

  deleteSecondarySale: async (id: string): Promise<void> => {
    await delay(150);
    const list = getStoredSecondarySales();
    saveStoredSecondarySales(list.filter((s) => s.id !== id));
  },

  listDoctorOrders: async (filters?: { zone?: string; chemistName?: string; city?: string; status?: string; date?: string; representativeName?: string }): Promise<DoctorOrder[]> => {
    await delay(150);
    let list = getStoredDoctorOrders();
    if (filters?.zone && filters.zone !== "all") {
      list = list.filter((doOrd) => doOrd.zone === filters.zone);
    }
    if (filters?.chemistName && filters.chemistName !== "all") {
      list = list.filter((doOrd) => doOrd.chemistName === filters.chemistName);
    }
    if (filters?.city && filters.city !== "all") {
      list = list.filter((doOrd) => doOrd.city === filters.city);
    }
    if (filters?.status && filters.status !== "all") {
      list = list.filter((doOrd) => doOrd.status === filters.status);
    }
    if (filters?.representativeName && filters.representativeName !== "all") {
      list = list.filter((doOrd) => doOrd.representativeName === filters.representativeName);
    }
    if (filters?.date) {
      list = list.filter((doOrd) => doOrd.date.startsWith(filters.date!));
    }
    return list;
  },

  listRateMasters: async (filters?: { division?: string }): Promise<RateMaster[]> => {
    await delay(100);
    let list = getStoredRateMasters();
    if (filters?.division && filters.division !== "all") {
      list = list.filter((rm) => rm.division === filters.division);
    }
    return list;
  },

  updateRateMaster: async (id: string, data: Partial<Omit<RateMaster, "id">>): Promise<RateMaster> => {
    await delay(100);
    const list = getStoredRateMasters();
    const idx = list.findIndex((rm) => rm.id === id);
    if (idx === -1) throw new Error("Rate master entry not found");
    const updated = {
      ...list[idx],
      ...data,
    };
    list[idx] = updated;
    saveStoredRateMasters(list);
    return updated;
  },

  listFirmRateOverrides: async (firmId: string): Promise<FirmRateMaster[]> => {
    await delay(100);
    const list = getStoredFirmRateMasters();
    return list.filter((x) => x.firmId === firmId);
  },

  updateFirmRateOverride: async (firmId: string, productId: string, rate: number): Promise<FirmRateMaster> => {
    await delay(100);
    const list = getStoredFirmRateMasters();
    const id = `${firmId}_${productId}`;
    const idx = list.findIndex((x) => x.id === id);
    const updated: FirmRateMaster = { id, firmId, productId, rate };
    if (idx === -1) {
      list.push(updated);
    } else {
      list[idx] = updated;
    }
    saveStoredFirmRateMasters(list);
    return updated;
  },

  listDoctorRateOverrides: async (doctorId: string): Promise<DoctorRateMaster[]> => {
    await delay(100);
    const list = getStoredDoctorRateMasters();
    return list.filter((x) => x.doctorId === doctorId);
  },

  updateDoctorRateOverride: async (doctorId: string, productId: string, rate: number): Promise<DoctorRateMaster> => {
    await delay(100);
    const list = getStoredDoctorRateMasters();
    const id = `${doctorId}_${productId}`;
    const idx = list.findIndex((x) => x.id === id);
    const updated: DoctorRateMaster = { id, doctorId, productId, rate };
    if (idx === -1) {
      list.push(updated);
    } else {
      list[idx] = updated;
    }
    saveStoredDoctorRateMasters(list);
    return updated;
  },
};

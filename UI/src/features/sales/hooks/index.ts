import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesApi } from "../api";
import type { RateMaster, FirmRateMaster, DoctorRateMaster } from "../types";

export const salesKeys = {
  all: ["sales"] as const,
  products: ["sales", "products"] as const,
  productList: (filters?: object) => ["sales", "products", "list", filters] as const,
  productDetail: (id: string) => ["sales", "products", "detail", id] as const,

  stockists: ["sales", "stockists"] as const,
  stockistList: (filters?: object) => ["sales", "stockists", "list", filters] as const,
  stockistDetail: (id: string) => ["sales", "stockists", "detail", id] as const,

  orders: ["sales", "orders"] as const,
  orderList: (filters?: object) => ["sales", "orders", "list", filters] as const,
  orderDetail: (id: string) => ["sales", "orders", "detail", id] as const,

  targets: ["sales", "targets"] as const,
  targetList: (filters?: object) => ["sales", "targets", "list", filters] as const,
  targetDetail: (id: string) => ["sales", "targets", "detail", id] as const,

  secondarySales: ["sales", "secondarySales"] as const,
  secondarySalesList: (filters?: object) => ["sales", "secondarySales", "list", filters] as const,
  secondarySalesDetail: (id: string) => ["sales", "secondarySales", "detail", id] as const,
  doctorOrders: ["sales", "doctorOrders"] as const,
  doctorOrderList: (filters?: object) => ["sales", "doctorOrders", "list", filters] as const,
  rateMasters: ["sales", "rateMasters"] as const,
  rateMasterList: (filters?: object) => ["sales", "rateMasters", "list", filters] as const,
  firmRateOverrides: (firmId: string) => ["sales", "firmRateOverrides", firmId] as const,
  doctorRateOverrides: (doctorId: string) => ["sales", "doctorRateOverrides", doctorId] as const,
};

// ─── Products Hooks ─────────────────────────────────────────────────────────────
export function useProductsList(filters?: Parameters<typeof salesApi.listProducts>[0]) {
  return useQuery({
    queryKey: salesKeys.productList(filters),
    queryFn: () => salesApi.listProducts(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: salesKeys.productDetail(id),
    queryFn: () => salesApi.getProductById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: salesKeys.products }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof salesApi.updateProduct>[1] }) =>
      salesApi.updateProduct(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: salesKeys.products });
      qc.invalidateQueries({ queryKey: salesKeys.productDetail(variables.id) });
    },
  });
}

// ─── Stockists Hooks ────────────────────────────────────────────────────────────
export function useStockistsList(filters?: Parameters<typeof salesApi.listStockists>[0]) {
  return useQuery({
    queryKey: salesKeys.stockistList(filters),
    queryFn: () => salesApi.listStockists(filters),
  });
}

export function useStockist(id: string) {
  return useQuery({
    queryKey: salesKeys.stockistDetail(id),
    queryFn: () => salesApi.getStockistById(id),
    enabled: !!id,
  });
}

export function useCreateStockist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.createStockist,
    onSuccess: () => qc.invalidateQueries({ queryKey: salesKeys.stockists }),
  });
}

export function useUpdateStockist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof salesApi.updateStockist>[1] }) =>
      salesApi.updateStockist(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: salesKeys.stockists });
      qc.invalidateQueries({ queryKey: salesKeys.stockistDetail(variables.id) });
    },
  });
}

// ─── Orders Hooks ───────────────────────────────────────────────────────────────
export function useOrdersList(filters?: Parameters<typeof salesApi.listOrders>[0]) {
  return useQuery({
    queryKey: salesKeys.orderList(filters),
    queryFn: () => salesApi.listOrders(filters),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: salesKeys.orderDetail(id),
    queryFn: () => salesApi.getOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.createOrder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: salesKeys.orders });
      qc.invalidateQueries({ queryKey: salesKeys.stockists });
    },
  });
}

export function useUpdateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof salesApi.updateOrder>[1] }) =>
      salesApi.updateOrder(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: salesKeys.orders });
      qc.invalidateQueries({ queryKey: salesKeys.orderDetail(variables.id) });
      qc.invalidateQueries({ queryKey: salesKeys.stockists });
    },
  });
}

export function useSubmitOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.submitOrder,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: salesKeys.orders });
      qc.invalidateQueries({ queryKey: salesKeys.orderDetail(id) });
    },
  });
}

export function useApproveOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approverId, remarks }: { id: string; approverId: string; remarks?: string }) =>
      salesApi.approveOrder(id, approverId, remarks),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: salesKeys.orders });
      qc.invalidateQueries({ queryKey: salesKeys.orderDetail(variables.id) });
    },
  });
}

export function useRejectOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approverId, remarks }: { id: string; approverId: string; remarks: string }) =>
      salesApi.rejectOrder(id, approverId, remarks),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: salesKeys.orders });
      qc.invalidateQueries({ queryKey: salesKeys.orderDetail(variables.id) });
    },
  });
}

export function useDispatchOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.dispatchOrder,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: salesKeys.orders });
      qc.invalidateQueries({ queryKey: salesKeys.orderDetail(id) });
    },
  });
}

export function useDeliverOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.deliverOrder,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: salesKeys.orders });
      qc.invalidateQueries({ queryKey: salesKeys.orderDetail(id) });
      qc.invalidateQueries({ queryKey: salesKeys.stockists });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.cancelOrder,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: salesKeys.orders });
      qc.invalidateQueries({ queryKey: salesKeys.orderDetail(id) });
    },
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.deleteOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: salesKeys.orders }),
  });
}

// ─── Targets Hooks ──────────────────────────────────────────────────────────────
export function useTargetsList(filters?: Parameters<typeof salesApi.listTargets>[0]) {
  return useQuery({
    queryKey: salesKeys.targetList(filters),
    queryFn: () => salesApi.listTargets(filters),
  });
}

export function useTarget(id: string) {
  return useQuery({
    queryKey: salesKeys.targetDetail(id),
    queryFn: () => salesApi.getTargetById(id),
    enabled: !!id,
  });
}

export function useCreateTarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.createTarget,
    onSuccess: () => qc.invalidateQueries({ queryKey: salesKeys.targets }),
  });
}

export function useUpdateTarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof salesApi.updateTarget>[1] }) =>
      salesApi.updateTarget(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: salesKeys.targets });
      qc.invalidateQueries({ queryKey: salesKeys.targetDetail(variables.id) });
    },
  });
}

export function useSubmitTarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.submitTarget,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: salesKeys.targets });
      qc.invalidateQueries({ queryKey: salesKeys.targetDetail(id) });
    },
  });
}

export function useApproveTarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.approveTarget,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: salesKeys.targets });
      qc.invalidateQueries({ queryKey: salesKeys.targetDetail(id) });
    },
  });
}

export function useRejectTarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) => salesApi.rejectTarget(id, remarks),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: salesKeys.targets });
      qc.invalidateQueries({ queryKey: salesKeys.targetDetail(variables.id) });
    },
  });
}

export function useDeleteTarget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.deleteTarget,
    onSuccess: () => qc.invalidateQueries({ queryKey: salesKeys.targets }),
  });
}

// ─── Secondary Sales Hooks ──────────────────────────────────────────────────────
export function useSecondarySalesList(filters?: Parameters<typeof salesApi.listSecondarySales>[0]) {
  return useQuery({
    queryKey: salesKeys.secondarySalesList(filters),
    queryFn: () => salesApi.listSecondarySales(filters),
  });
}

export function useSecondarySale(id: string) {
  return useQuery({
    queryKey: salesKeys.secondarySalesDetail(id),
    queryFn: () => salesApi.getSecondarySaleById(id),
    enabled: !!id,
  });
}

export function useCreateSecondarySale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.createSecondarySale,
    onSuccess: () => qc.invalidateQueries({ queryKey: salesKeys.secondarySales }),
  });
}

export function useUpdateSecondarySale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof salesApi.updateSecondarySale>[1] }) =>
      salesApi.updateSecondarySale(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: salesKeys.secondarySales });
      qc.invalidateQueries({ queryKey: salesKeys.secondarySalesDetail(variables.id) });
    },
  });
}

export function useSubmitSecondarySale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.submitSecondarySale,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: salesKeys.secondarySales });
      qc.invalidateQueries({ queryKey: salesKeys.secondarySalesDetail(id) });
    },
  });
}

export function useApproveSecondarySale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.approveSecondarySale,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: salesKeys.secondarySales });
      qc.invalidateQueries({ queryKey: salesKeys.secondarySalesDetail(id) });
    },
  });
}

export function useRejectSecondarySale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) => salesApi.rejectSecondarySale(id, remarks),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: salesKeys.secondarySales });
      qc.invalidateQueries({ queryKey: salesKeys.secondarySalesDetail(variables.id) });
    },
  });
}

export function useDeleteSecondarySale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: salesApi.deleteSecondarySale,
    onSuccess: () => qc.invalidateQueries({ queryKey: salesKeys.secondarySales }),
  });
}

export function useDoctorOrdersList(filters?: Parameters<typeof salesApi.listDoctorOrders>[0]) {
  return useQuery({
    queryKey: salesKeys.doctorOrderList(filters),
    queryFn: () => salesApi.listDoctorOrders(filters),
  });
}

export function useRateMastersList(filters?: Parameters<typeof salesApi.listRateMasters>[0]) {
  return useQuery({
    queryKey: salesKeys.rateMasterList(filters),
    queryFn: () => salesApi.listRateMasters(filters),
  });
}

export function useUpdateRateMaster() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<RateMaster, "id">> }) =>
      salesApi.updateRateMaster(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: salesKeys.rateMasters });
    },
  });
}

export function useFirmRateOverrides(firmId: string) {
  return useQuery({
    queryKey: salesKeys.firmRateOverrides(firmId),
    queryFn: () => salesApi.listFirmRateOverrides(firmId),
    enabled: !!firmId,
  });
}

export function useUpdateFirmRateOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ firmId, productId, rate }: { firmId: string; productId: string; rate: number }) =>
      salesApi.updateFirmRateOverride(firmId, productId, rate),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: salesKeys.firmRateOverrides(variables.firmId) });
    },
  });
}

export function useDoctorRateOverrides(doctorId: string) {
  return useQuery({
    queryKey: salesKeys.doctorRateOverrides(doctorId),
    queryFn: () => salesApi.listDoctorRateOverrides(doctorId),
    enabled: !!doctorId,
  });
}

export function useUpdateDoctorRateOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorId, productId, rate }: { doctorId: string; productId: string; rate: number }) =>
      salesApi.updateDoctorRateOverride(doctorId, productId, rate),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: salesKeys.doctorRateOverrides(variables.doctorId) });
    },
  });
}

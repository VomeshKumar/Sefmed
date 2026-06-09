import * as React from "react";
import { Plus, Edit, Trash2, Eye, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/data/DataTable";
import { FilterBar } from "@/components/data/FilterBar";
import { StatusBadge } from "@/components/data/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RequirePermission } from "@/lib/rbac/RequirePermission";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { toast } from "sonner";
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import {
  useAdministratorsList,
  useCreateAdministrator,
  useUpdateAdministrator,
  useDeleteAdministrator,
} from "../hooks";
import { createAdministratorSchema, type AdministratorFormValues } from "../schemas";
import type { Administrator } from "../types";

export function AdministratorsPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingAdmin, setEditingAdmin] = React.useState<Administrator | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Queries
  const { data: divisions = [] } = useDivisionsList();
  const { data: zones = [] } = useZonesList();
  const { data: administrators = [], isLoading } = useAdministratorsList({
    query: search,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Mutations
  const createMutation = useCreateAdministrator();
  const updateMutation = useUpdateAdministrator();
  const deleteMutation = useDeleteAdministrator();

  const divisionMap = React.useMemo(() => new Map(divisions.map((d) => [d.id, d])), [divisions]);
  const zoneMap = React.useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);

  // Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdministratorFormValues>({
    resolver: zodResolver(createAdministratorSchema),
    defaultValues: {
      name: "",
      email: "",
      city: "",
      contact: "",
      divisionId: "",
      zoneId: "",
      role: "zonal",
      status: "active",
      address: "",
      state: "",
      dcrEmail: "",
      alias: "",
    },
  });

  const watchDivision = watch("divisionId");
  const watchZone = watch("zoneId");
  const watchRole = watch("role");
  const watchStatus = watch("status");
  const watchState = watch("state");
  const watchCity = watch("city");

  React.useEffect(() => {
    if (editingAdmin) {
      reset({
        name: editingAdmin.name,
        email: editingAdmin.email,
        city: editingAdmin.city,
        contact: editingAdmin.contact,
        divisionId: editingAdmin.divisionId,
        zoneId: editingAdmin.zoneId,
        role: editingAdmin.role,
        status: editingAdmin.status,
        address: editingAdmin.address || "",
        state: editingAdmin.state || "",
        dcrEmail: editingAdmin.dcrEmail || "",
        alias: editingAdmin.alias || "",
      });
    } else {
      reset({
        name: "",
        email: "",
        city: "",
        contact: "",
        divisionId: "",
        zoneId: "",
        role: "zonal",
        status: "active",
        address: "",
        state: "",
        dcrEmail: "",
        alias: "",
      });
    }
  }, [editingAdmin, reset]);

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (admin: Administrator) => {
    setEditingAdmin(admin);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const onSubmit = async (values: AdministratorFormValues) => {
    try {
      if (editingAdmin) {
        await updateMutation.mutateAsync({
          id: editingAdmin.id,
          data: values,
        });
        toast.success("Administrator updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Administrator created successfully");
      }
      setIsFormOpen(false);
      setEditingAdmin(null);
    } catch (err) {
      toast.error("Failed to save administrator");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Administrator deleted successfully");
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete administrator");
    }
  };

  const columns: Column<Administrator>[] = [
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/people/administrators/$id" params={{ id: item.id }}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>
            <RequirePermission permission={PERMISSIONS.EMPLOYEE_MANAGE}>
              <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenDelete(item.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </RequirePermission>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      sortable: true,
      cell: (item) => <span className="font-semibold">{item.name}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "city",
      header: "City",
      cell: (item) => <span>{item.city || "—"}</span>,
    },
    {
      accessorKey: "contact",
      header: "Contact",
      cell: (item) => <span className="nums-tabular">{item.contact}</span>,
    },
    {
      accessorKey: "divisionId",
      header: "Division",
      cell: (item) => {
        const div = divisionMap.get(item.divisionId);
        return <span>{div ? div.code : "—"}</span>;
      },
    },
    {
      accessorKey: "zoneId",
      header: "Zone",
      cell: (item) => {
        const zone = zoneMap.get(item.zoneId);
        return <span>{zone ? zone.name : "—"}</span>;
      },
    },
    {
      accessorKey: "role",
      header: "Admin Type",
      cell: (item) => (
        <span className="uppercase text-xs font-semibold text-muted-foreground">
          {item.role}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      sortable: true,
      cell: (item) => (
        <StatusBadge tone={item.status === "active" ? "success" : "neutral"}>
          {item.status === "active" ? "Active" : "Inactive"}
        </StatusBadge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Administrators"
        description="Configure admin access, portal managers, and support credentials."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "People" },
          { label: "Administrators" },
        ]}
        actions={
          <RequirePermission permission={PERMISSIONS.EMPLOYEE_MANAGE}>
            <Button onClick={handleOpenCreate} className="gap-1.5 h-9">
              <Plus className="h-4 w-4" />
              <span>Add Administrator</span>
            </Button>
          </RequirePermission>
        }
      />

      <div className="space-y-4">
        <FilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search administrators..."
          showClearButton={statusFilter !== "all" || !!search}
          onClearFilters={() => {
            setSearch("");
            setStatusFilter("all");
          }}
        >
          <UiSelect value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-background h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </UiSelect>
        </FilterBar>

        <DataTable
          columns={columns}
          data={administrators}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <DialogHeader className="px-6 pt-5 pb-3">
              <DialogTitle className="text-lg font-bold text-slate-800">
                {editingAdmin ? "Edit Administrator" : "Add Administrator"}
              </DialogTitle>
            </DialogHeader>

            {/* Radio options at the top */}
            <div className="px-6 py-2 border-b border-slate-100 flex items-center justify-center gap-5">
              {[
                { label: "Zonal", value: "zonal" },
                { label: "Divisional", value: "divisional" },
                { label: "Sales", value: "sales" },
                { label: "HR", value: "hr" },
                { label: "PayRoll", value: "payroll" },
              ].map((r) => (
                <label
                  key={r.value}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    value={r.value}
                    checked={watchRole === r.value}
                    onChange={() => setValue("role", r.value as any)}
                    className="h-3.5 w-3.5 border-slate-300 text-[#008b8b] focus:ring-[#008b8b] checked:bg-[#008b8b]"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>

            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Name */}
              <div className="grid grid-cols-[140px_1fr] items-center gap-x-4">
                <label htmlFor="name" className="text-right text-sm font-semibold text-slate-700">
                  Name<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <Input
                    id="name"
                    placeholder="Enter Name"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-[140px_1fr] items-center gap-x-4">
                <label htmlFor="address" className="text-right text-sm font-semibold text-slate-700">
                  Address
                </label>
                <div className="space-y-1">
                  <Input
                    id="address"
                    placeholder="Enter Address"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("address")}
                  />
                  {errors.address && <p className="text-[11px] text-destructive">{errors.address.message}</p>}
                </div>
              </div>

              {/* Contact Number */}
              <div className="grid grid-cols-[140px_1fr] items-center gap-x-4">
                <label htmlFor="contact" className="text-right text-sm font-semibold text-slate-700">
                  Contact Number<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <Input
                    id="contact"
                    placeholder="Enter Contact Number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("contact")}
                  />
                  {errors.contact && <p className="text-[11px] text-destructive">{errors.contact.message}</p>}
                </div>
              </div>

              {/* State (Zonal only) */}
              {watchRole === "zonal" && (
                <div className="grid grid-cols-[140px_1fr] items-center gap-x-4">
                  <label htmlFor="state" className="text-right text-sm font-semibold text-slate-700">
                    State
                  </label>
                  <div className="space-y-1">
                    <UiSelect value={watchState || ""} onValueChange={(val) => setValue("state", val)}>
                      <SelectTrigger className="h-9 border-slate-300 bg-white">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Bihar", "Chhattisgarh", "Jharkhand", "Karnataka", "Madhya Pradesh", "Maharashtra", "ODISHA", "Uttarpradesh"].map((st) => (
                          <SelectItem key={st} value={st}>
                            {st}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </UiSelect>
                  </div>
                </div>
              )}

              {/* City (Zonal only) */}
              {watchRole === "zonal" && (
                <div className="grid grid-cols-[140px_1fr] items-center gap-x-4">
                  <label htmlFor="city" className="text-right text-sm font-semibold text-slate-700">
                    City<span className="text-destructive"> *</span>
                  </label>
                  <div className="space-y-1">
                    <UiSelect value={watchCity || ""} onValueChange={(val) => setValue("city", val)}>
                      <SelectTrigger className="h-9 border-slate-300 bg-white">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Bhilai", "Raipur", "Bilaspur", "Patna", "Ranchi", "Pune", "Lucknow", "Bengaluru"].map((ct) => (
                          <SelectItem key={ct} value={ct}>
                            {ct}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </UiSelect>
                    {errors.city && <p className="text-[11px] text-destructive">{errors.city.message}</p>}
                  </div>
                </div>
              )}

              {/* Division (Zonal, Divisional, Sales only) */}
              {(watchRole === "zonal" || watchRole === "divisional" || watchRole === "sales") && (
                <div className="grid grid-cols-[140px_1fr] items-center gap-x-4">
                  <label htmlFor="divisionId" className="text-right text-sm font-semibold text-slate-700">
                    Division<span className="text-destructive"> *</span>
                  </label>
                  <div className="space-y-1">
                    <UiSelect
                      value={watchDivision}
                      onValueChange={(val) => setValue("divisionId", val)}
                    >
                      <SelectTrigger className="h-9 border-slate-300 bg-white">
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>
                      <SelectContent>
                        {divisions.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </UiSelect>
                    {errors.divisionId && <p className="text-[11px] text-destructive">{errors.divisionId.message}</p>}
                  </div>
                </div>
              )}

              {/* Zone (Zonal and Sales) */}
              {(watchRole === "zonal" || watchRole === "sales") && (
                <div className="grid grid-cols-[140px_1fr] items-center gap-x-4">
                  <label htmlFor="zoneId" className="text-right text-sm font-semibold text-slate-700">
                    Zone<span className="text-destructive"> *</span>
                  </label>
                  <div className="space-y-1">
                    <UiSelect value={watchZone} onValueChange={(val) => setValue("zoneId", val)}>
                      <SelectTrigger className="h-9 border-slate-300 bg-white">
                        <SelectValue placeholder="Select Zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((z) => (
                          <SelectItem key={z.id} value={z.id}>
                            {z.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </UiSelect>
                    {errors.zoneId && <p className="text-[11px] text-destructive">{errors.zoneId.message}</p>}
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="grid grid-cols-[140px_1fr] items-center gap-x-4">
                <label htmlFor="email" className="text-right text-sm font-semibold text-slate-700">
                  Email<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              {/* DCR Email (Zonal and Divisional only) */}
              {(watchRole === "zonal" || watchRole === "divisional") && (
                <div className="grid grid-cols-[140px_1fr] items-center gap-x-4">
                  <label htmlFor="dcrEmail" className="text-right text-sm font-semibold text-slate-700">
                    DCR Email<span className="text-destructive"> *</span>
                  </label>
                  <div className="space-y-1">
                    <Input
                      id="dcrEmail"
                      type="email"
                      placeholder="Enter DCR Email"
                      className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                      {...register("dcrEmail")}
                    />
                    {errors.dcrEmail && <p className="text-[11px] text-destructive">{errors.dcrEmail.message}</p>}
                  </div>
                </div>
              )}

              {/* Alias (Hidden for Sales) */}
              {watchRole !== "sales" && (
                <div className="grid grid-cols-[140px_1fr] items-center gap-x-4">
                  <label htmlFor="alias" className="text-right text-sm font-semibold text-slate-700">
                    Alias
                  </label>
                  <div className="space-y-1">
                    <Input
                      id="alias"
                      placeholder="Enter Alias"
                      className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                      {...register("alias")}
                    />
                    {errors.alias && <p className="text-[11px] text-destructive">{errors.alias.message}</p>}
                  </div>
                </div>
              )}

              {/* Status (Edit mode only) */}
              {editingAdmin && (
                <div className="grid grid-cols-[140px_1fr] items-center gap-x-4">
                  <label htmlFor="status" className="text-right text-sm font-semibold text-slate-700">
                    Status
                  </label>
                  <div className="space-y-1">
                    <UiSelect
                      value={watchStatus}
                      onValueChange={(val: "active" | "inactive") => setValue("status", val)}
                    >
                      <SelectTrigger className="h-9 border-slate-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </UiSelect>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-end gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#008b8b] hover:bg-[#008b8b]/90 text-white px-5 h-9 text-sm font-medium"
              >
                {isSubmitting ? "Saving..." : editingAdmin ? "Save" : "Add"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="h-9 px-5 text-sm font-medium border-slate-300 text-slate-700 hover:bg-slate-100 bg-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Remove Administrator</DialogTitle>
            <DialogDescription>
              Are you sure? This administrator will lose all access rights immediately.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

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
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingAdmin ? "Edit Administrator" : "Add Administrator"}</DialogTitle>
              <DialogDescription>
                Assign administrative roles and department scopes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-2 max-h-[60vh] overflow-y-auto px-1">
              {/* Radio options at the top */}
              <div className="space-y-1.5">
                <Label>Admin Type</Label>
                <div className="flex flex-wrap items-center gap-4 py-1">
                  {[
                    { label: "Zonal", value: "zonal" },
                    { label: "Divisional", value: "divisional" },
                    { label: "Sales", value: "sales" },
                    { label: "HR", value: "hr" },
                    { label: "PayRoll", value: "payroll" },
                  ].map((r) => (
                    <label key={r.value} className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        value={r.value}
                        checked={watchRole === r.value}
                        onChange={() => setValue("role", r.value as any)}
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" placeholder="Enter Name" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter Address" {...register("address")} />
                {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact">Contact Number *</Label>
                <Input id="contact" placeholder="Enter Contact Number" {...register("contact")} />
                {errors.contact && <p className="text-xs text-destructive">{errors.contact.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <UiSelect value={watchState || ""} onValueChange={(val) => setValue("state", val)}>
                    <SelectTrigger className="bg-background">
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

                <div className="space-y-1.5">
                  <Label htmlFor="city">City *</Label>
                  <UiSelect value={watchCity || ""} onValueChange={(val) => setValue("city", val)}>
                    <SelectTrigger className="bg-background">
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
                  {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="divisionId">Division *</Label>
                  <UiSelect
                    value={watchDivision}
                    onValueChange={(val) => setValue("divisionId", val)}
                  >
                    <SelectTrigger className="bg-background">
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
                  {errors.divisionId && <p className="text-xs text-destructive">{errors.divisionId.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="zoneId">Zone *</Label>
                  <UiSelect value={watchZone} onValueChange={(val) => setValue("zoneId", val)}>
                    <SelectTrigger className="bg-background">
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
                  {errors.zoneId && <p className="text-xs text-destructive">{errors.zoneId.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="Enter Email" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dcrEmail">DCR Email *</Label>
                <Input id="dcrEmail" type="email" placeholder="Enter DCR Email" {...register("dcrEmail")} />
                {errors.dcrEmail && <p className="text-xs text-destructive">{errors.dcrEmail.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="alias">Alias</Label>
                  <Input id="alias" placeholder="Enter Alias" {...register("alias")} />
                  {errors.alias && <p className="text-xs text-destructive">{errors.alias.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <UiSelect
                    value={watchStatus}
                    onValueChange={(val: "active" | "inactive") => setValue("status", val)}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Admin"}
              </Button>
            </DialogFooter>
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

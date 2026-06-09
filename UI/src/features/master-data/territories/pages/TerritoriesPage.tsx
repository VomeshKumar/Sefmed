import * as React from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/data/DataTable";
import { FilterBar } from "@/components/data/FilterBar";
import { StatusBadge } from "@/components/data/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { RequirePermission } from "@/lib/rbac/RequirePermission";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { toast } from "sonner";
import { useZonesList } from "@/features/master-data/zones/hooks";
import {
  useTerritoriesList,
  useCreateTerritory,
  useUpdateTerritory,
  useDeleteTerritory,
} from "../hooks";
import { createTerritorySchema, type TerritoryFormValues } from "../schemas";
import type { Territory } from "../types";

export function TerritoriesPage() {
  const [search, setSearch] = React.useState("");
  const [zoneFilter, setZoneFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTerritory, setEditingTerritory] = React.useState<Territory | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Queries
  const { data: zones = [] } = useZonesList();
  const { data: territories = [], isLoading } = useTerritoriesList({
    query: search,
    zoneId: zoneFilter === "all" ? undefined : zoneFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Mutations
  const createMutation = useCreateTerritory();
  const updateMutation = useUpdateTerritory();
  const deleteMutation = useDeleteTerritory();

  const zoneMap = React.useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);

  // Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TerritoryFormValues>({
    resolver: zodResolver(createTerritorySchema),
    defaultValues: {
      name: "",
      code: "",
      zoneId: "",
      status: "active",
    },
  });

  const watchZoneId = watch("zoneId");
  const watchStatus = watch("status");

  React.useEffect(() => {
    if (editingTerritory) {
      reset({
        name: editingTerritory.name,
        code: editingTerritory.code,
        zoneId: editingTerritory.zoneId,
        status: editingTerritory.status,
      });
    } else {
      reset({
        name: "",
        code: "",
        zoneId: "",
        status: "active",
      });
    }
  }, [editingTerritory, reset]);

  const handleOpenCreate = () => {
    setEditingTerritory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (territory: Territory) => {
    setEditingTerritory(territory);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const onSubmit = async (values: TerritoryFormValues) => {
    try {
      if (editingTerritory) {
        await updateMutation.mutateAsync({
          id: editingTerritory.id,
          data: values,
        });
        toast.success("Territory updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Territory created successfully");
      }
      setIsFormOpen(false);
      setEditingTerritory(null);
    } catch (err) {
      toast.error("Failed to save territory");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Territory deleted successfully");
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete territory");
    }
  };

  const columns: Column<Territory>[] = [
    {
      accessorKey: "code",
      header: "Code",
      sortable: true,
      cell: (item) => <span className="font-semibold tracking-wider">{item.code}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      sortable: true,
    },
    {
      accessorKey: "zoneId",
      header: "Zone",
      sortable: true,
      cell: (item) => {
        const zone = zoneMap.get(item.zoneId);
        return <span>{zone ? zone.name : "Unknown"}</span>;
      },
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
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center gap-1">
          <RequirePermission permission={PERMISSIONS.MASTER_DATA_MANAGE}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => handleOpenEdit(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleOpenDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </RequirePermission>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Territories"
        description="Configure specific operational field territories grouped by zones."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Master Data" },
          { label: "Territories" },
        ]}
        actions={
          <RequirePermission permission={PERMISSIONS.MASTER_DATA_MANAGE}>
            <Button onClick={handleOpenCreate} className="gap-1.5 h-9">
              <Plus className="h-4 w-4" />
              <span>Add Territory</span>
            </Button>
          </RequirePermission>
        }
      />

      <div className="space-y-4">
        <FilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search territories..."
          showClearButton={zoneFilter !== "all" || statusFilter !== "all" || !!search}
          onClearFilters={() => {
            setSearch("");
            setZoneFilter("all");
            setStatusFilter("all");
          }}
        >
          <UiSelect value={zoneFilter} onValueChange={setZoneFilter}>
            <SelectTrigger className="w-[160px] bg-background h-10">
              <SelectValue placeholder="Filter by Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {zones.map((z) => (
                <SelectItem key={z.id} value={z.id}>
                  {z.name}
                </SelectItem>
              ))}
            </SelectContent>
          </UiSelect>

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
          data={territories}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingTerritory ? "Edit Territory" : "Add Territory"}</DialogTitle>
              <DialogDescription>
                A territory must be linked to a zone for dynamic workflow assignment.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="code">Territory Code</Label>
                <Input
                  id="code"
                  placeholder="e.g. DELHI-N"
                  className="uppercase"
                  disabled={!!editingTerritory}
                  {...register("code")}
                />
                {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Territory Name</Label>
                <Input id="name" placeholder="e.g. Delhi North" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="zoneId">Assigned Zone</Label>
                <UiSelect
                  value={watchZoneId}
                  onValueChange={(val) => setValue("zoneId", val)}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select a zone" />
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

              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <UiSelect
                  value={watchStatus}
                  onValueChange={(val: "active" | "inactive") => setValue("status", val)}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Territory"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Territory</DialogTitle>
            <DialogDescription>
              Delete this territory? Representative target mappings to this territory will be orphaned.
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

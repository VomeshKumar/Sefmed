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
import {
  useDesignationsList,
  useCreateDesignation,
  useUpdateDesignation,
  useDeleteDesignation,
} from "../hooks";
import { createDesignationSchema, type DesignationFormValues } from "../schemas";
import type { Designation } from "../types";

export function DesignationsPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingDesignation, setEditingDesignation] = React.useState<Designation | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const { data: designations = [], isLoading } = useDesignationsList({
    query: search,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const createMutation = useCreateDesignation();
  const updateMutation = useUpdateDesignation();
  const deleteMutation = useDeleteDesignation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DesignationFormValues>({
    resolver: zodResolver(createDesignationSchema),
    defaultValues: {
      name: "",
      code: "",
      status: "active",
    },
  });

  const watchStatus = watch("status");

  React.useEffect(() => {
    if (editingDesignation) {
      reset({
        name: editingDesignation.name,
        code: editingDesignation.code,
        status: editingDesignation.status,
      });
    } else {
      reset({
        name: "",
        code: "",
        status: "active",
      });
    }
  }, [editingDesignation, reset]);

  const handleOpenCreate = () => {
    setEditingDesignation(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (designation: Designation) => {
    setEditingDesignation(designation);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const onSubmit = async (values: DesignationFormValues) => {
    try {
      if (editingDesignation) {
        await updateMutation.mutateAsync({
          id: editingDesignation.id,
          data: values,
        });
        toast.success("Designation updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Designation created successfully");
      }
      setIsFormOpen(false);
      setEditingDesignation(null);
    } catch (err) {
      toast.error("Failed to save designation");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Designation deleted successfully");
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete designation");
    }
  };

  const columns: Column<Designation>[] = [
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
        title="Designations"
        description="Configure roles and organizational designations for representatives and employees."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Master Data" },
          { label: "Designations" },
        ]}
        actions={
          <RequirePermission permission={PERMISSIONS.MASTER_DATA_MANAGE}>
            <Button onClick={handleOpenCreate} className="gap-1.5 h-9">
              <Plus className="h-4 w-4" />
              <span>Add Designation</span>
            </Button>
          </RequirePermission>
        }
      />

      <div className="space-y-4">
        <FilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search designations..."
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
          data={designations}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingDesignation ? "Edit Designation" : "Add Designation"}</DialogTitle>
              <DialogDescription>
                Designation code maps directly to workflow approvals and field hierarchy.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="code">Designation Code</Label>
                <Input
                  id="code"
                  placeholder="e.g. MR"
                  className="uppercase"
                  disabled={!!editingDesignation}
                  {...register("code")}
                />
                {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Designation Name</Label>
                <Input id="name" placeholder="e.g. Medical Representative" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
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
                {isSubmitting ? "Saving..." : "Save Designation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Designation</DialogTitle>
            <DialogDescription>
              Are you sure? Employees assigned this designation will be affected.
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

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
import { Textarea } from "@/components/ui/textarea";
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
  useDivisionsList,
  useCreateDivision,
  useUpdateDivision,
  useDeleteDivision,
} from "../hooks";
import { createDivisionSchema, type DivisionFormValues } from "../schemas";
import type { Division } from "../types";

export function DivisionsPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  
  // Dialog States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingDivision, setEditingDivision] = React.useState<Division | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Queries & Mutations
  const { data: divisions = [], isLoading } = useDivisionsList({
    query: search,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const createMutation = useCreateDivision();
  const updateMutation = useUpdateDivision();
  const deleteMutation = useDeleteDivision();

  // Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DivisionFormValues>({
    resolver: zodResolver(createDivisionSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      status: "active",
    },
  });

  const watchStatus = watch("status");

  // Sync Form when editing changes
  React.useEffect(() => {
    if (editingDivision) {
      reset({
        name: editingDivision.name,
        code: editingDivision.code,
        description: editingDivision.description || "",
        status: editingDivision.status,
      });
    } else {
      reset({
        name: "",
        code: "",
        description: "",
        status: "active",
      });
    }
  }, [editingDivision, reset]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingDivision(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (division: Division) => {
    setEditingDivision(division);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const onSubmit = async (values: DivisionFormValues) => {
    try {
      if (editingDivision) {
        await updateMutation.mutateAsync({
          id: editingDivision.id,
          data: values,
        });
        toast.success("Division updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Division created successfully");
      }
      setIsFormOpen(false);
      setEditingDivision(null);
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Division deleted successfully");
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete division");
    }
  };

  const columns: Column<Division>[] = [
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
      accessorKey: "description",
      header: "Description",
      cell: (item) => (
        <span className="text-muted-foreground block max-w-xs truncate">
          {item.description || "—"}
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
        title="Divisions"
        description="Configure and manage the pharmaceutical and product divisions of Sefmed."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Master Data" },
          { label: "Divisions" },
        ]}
        actions={
          <RequirePermission permission={PERMISSIONS.MASTER_DATA_MANAGE}>
            <Button onClick={handleOpenCreate} className="gap-1.5 h-9">
              <Plus className="h-4 w-4" />
              <span>Add Division</span>
            </Button>
          </RequirePermission>
        }
      />

      <div className="space-y-4">
        {/* Filters */}
        <FilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search divisions by code or name..."
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

        {/* Data Grid */}
        <DataTable
          columns={columns}
          data={divisions}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingDivision ? "Edit Division" : "Add Division"}</DialogTitle>
              <DialogDescription>
                Reference codes are used globally for target mapping and workflows.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  placeholder="e.g. PHARMA"
                  className="uppercase"
                  disabled={!!editingDivision}
                  {...register("code")}
                />
                {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="e.g. Pharma Division" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the division focus..."
                  className="resize-none"
                  rows={3}
                  {...register("description")}
                />
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
                {isSubmitting ? "Saving..." : "Save Division"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Division</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this division? This action cannot be undone and may affect associated representatives.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
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

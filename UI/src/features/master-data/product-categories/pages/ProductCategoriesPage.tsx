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
  useProductCategoriesList,
  useCreateProductCategory,
  useUpdateProductCategory,
  useDeleteProductCategory,
} from "../hooks";
import { createProductCategorySchema, type ProductCategoryFormValues } from "../schemas";
import type { ProductCategory } from "../types";

export function ProductCategoriesPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<ProductCategory | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const { data: categories = [], isLoading } = useProductCategoriesList({
    query: search,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const createMutation = useCreateProductCategory();
  const updateMutation = useUpdateProductCategory();
  const deleteMutation = useDeleteProductCategory();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(createProductCategorySchema),
    defaultValues: {
      name: "",
      code: "",
      status: "active",
    },
  });

  const watchStatus = watch("status");

  React.useEffect(() => {
    if (editingCategory) {
      reset({
        name: editingCategory.name,
        code: editingCategory.code,
        status: editingCategory.status,
      });
    } else {
      reset({
        name: "",
        code: "",
        status: "active",
      });
    }
  }, [editingCategory, reset]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const onSubmit = async (values: ProductCategoryFormValues) => {
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          data: values,
        });
        toast.success("Product category updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Product category created successfully");
      }
      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (err) {
      toast.error("Failed to save product category");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Product category deleted successfully");
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete product category");
    }
  };

  const columns: Column<ProductCategory>[] = [
    {
      accessorKey: "code",
      header: "Code",
      sortable: true,
      cell: (item) => <span className="font-semibold tracking-wider">{item.code}</span>,
    },
    {
      accessorKey: "name",
      header: "Category Name",
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
        title="Product Categories"
        description="Configure product classifications and therapeutic segments for the catalog."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Master Data" },
          { label: "Product Categories" },
        ]}
        actions={
          <RequirePermission permission={PERMISSIONS.MASTER_DATA_MANAGE}>
            <Button onClick={handleOpenCreate} className="gap-1.5 h-9">
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </Button>
          </RequirePermission>
        }
      />

      <div className="space-y-4">
        <FilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search product categories..."
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
          data={categories}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
              <DialogDescription>
                Category code groups products in target configurations and orders.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="code">Category Code</Label>
                <Input
                  id="code"
                  placeholder="e.g. CARDIO"
                  className="uppercase"
                  disabled={!!editingCategory}
                  {...register("code")}
                />
                {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" placeholder="e.g. Cardiovascular Therapeutics" {...register("name")} />
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
                {isSubmitting ? "Saving..." : "Save Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure? Products assigned to this category will be orphaned.
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

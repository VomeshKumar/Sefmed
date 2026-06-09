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
import { Checkbox } from "@/components/ui/checkbox";
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
  useExpenseHeadsList,
  useCreateExpenseHead,
  useUpdateExpenseHead,
  useDeleteExpenseHead,
} from "../hooks";
import { createExpenseHeadSchema, type ExpenseHeadFormValues } from "../schemas";
import type { ExpenseHead } from "../types";

export function ExpenseHeadsPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingHead, setEditingHead] = React.useState<ExpenseHead | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const { data: expenseHeads = [], isLoading } = useExpenseHeadsList({
    query: search,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const createMutation = useCreateExpenseHead();
  const updateMutation = useUpdateExpenseHead();
  const deleteMutation = useDeleteExpenseHead();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseHeadFormValues>({
    resolver: zodResolver(createExpenseHeadSchema),
    defaultValues: {
      name: "",
      code: "",
      monthlyCap: 0,
      editable: true,
      status: "active",
    },
  });

  const watchStatus = watch("status");
  const watchEditable = watch("editable");

  React.useEffect(() => {
    if (editingHead) {
      reset({
        name: editingHead.name,
        code: editingHead.code,
        monthlyCap: editingHead.monthlyCap,
        editable: editingHead.editable,
        status: editingHead.status,
      });
    } else {
      reset({
        name: "",
        code: "",
        monthlyCap: 0,
        editable: true,
        status: "active",
      });
    }
  }, [editingHead, reset]);

  const handleOpenCreate = () => {
    setEditingHead(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (head: ExpenseHead) => {
    setEditingHead(head);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const onSubmit = async (values: ExpenseHeadFormValues) => {
    try {
      if (editingHead) {
        await updateMutation.mutateAsync({
          id: editingHead.id,
          data: values,
        });
        toast.success("Expense head updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Expense head created successfully");
      }
      setIsFormOpen(false);
      setEditingHead(null);
    } catch (err) {
      toast.error("Failed to save expense head");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Expense head deleted successfully");
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete expense head");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const columns: Column<ExpenseHead>[] = [
    {
      accessorKey: "code",
      header: "Code",
      sortable: true,
      cell: (item) => <span className="font-semibold tracking-wider">{item.code}</span>,
    },
    {
      accessorKey: "name",
      header: "Head Name",
      sortable: true,
    },
    {
      accessorKey: "monthlyCap",
      header: "Monthly Cap",
      sortable: true,
      cell: (item) => <span className="nums-tabular">{formatCurrency(item.monthlyCap)}</span>,
    },
    {
      accessorKey: "editable",
      header: "Editable",
      sortable: true,
      cell: (item) => (
        <StatusBadge tone={item.editable ? "success" : "neutral"}>
          {item.editable ? "Yes" : "No"}
        </StatusBadge>
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
        title="Expense Heads"
        description="Define expense types, claim structures, and monthly caps for field reps."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Master Data" },
          { label: "Expense Heads" },
        ]}
        actions={
          <RequirePermission permission={PERMISSIONS.MASTER_DATA_MANAGE}>
            <Button onClick={handleOpenCreate} className="gap-1.5 h-9">
              <Plus className="h-4 w-4" />
              <span>Add Expense Head</span>
            </Button>
          </RequirePermission>
        }
      />

      <div className="space-y-4">
        <FilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search expense heads..."
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
          data={expenseHeads}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingHead ? "Edit Expense Head" : "Add Expense Head"}</DialogTitle>
              <DialogDescription>
                Expense heads define caps for automated claims processing.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="code">Expense Code</Label>
                <Input
                  id="code"
                  placeholder="e.g. TA"
                  className="uppercase"
                  disabled={!!editingHead}
                  {...register("code")}
                />
                {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Head Name</Label>
                <Input id="name" placeholder="e.g. Travel Allowance" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="monthlyCap">Monthly Cap (₹)</Label>
                <Input
                  id="monthlyCap"
                  type="number"
                  placeholder="e.g. 15000"
                  {...register("monthlyCap")}
                />
                {errors.monthlyCap && (
                  <p className="text-xs text-destructive">{errors.monthlyCap.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="editable"
                  checked={watchEditable}
                  onCheckedChange={(checked) => setValue("editable", !!checked)}
                />
                <Label htmlFor="editable" className="text-sm font-medium leading-none cursor-pointer">
                  Allow Reps to Edit Claim Amount (within cap)
                </Label>
              </div>

              <div className="space-y-1.5 pt-1">
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
                {isSubmitting ? "Saving..." : "Save Expense Head"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Expense Head</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense head? Active claims for this head may be disrupted.
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

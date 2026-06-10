import * as React from "react";
import { Plus, Edit, Trash2, Eye, HeartPulse, User, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/data/DataTable";
import { FilterBar } from "@/components/data/FilterBar";
import { StatusBadge, type StatusTone } from "@/components/data/StatusBadge";
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
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import {
  useDoctorsList,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
} from "../hooks";
import { createDoctorSchema, type DoctorFormValues } from "../schemas";
import type { Doctor } from "../types";

export function DoctorsPage() {
  const [search, setSearch] = React.useState("");
  const [specialityFilter, setSpecialityFilter] = React.useState("all");
  const [zoneFilter, setZoneFilter] = React.useState("all");
  const [territoryFilter, setTerritoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Dialog States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingDoctor, setEditingDoctor] = React.useState<Doctor | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Queries
  const { data: zones = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: employees = [] } = useEmployeesList();
  const { data: divisions = [] } = useDivisionsList();
  const { data: doctors = [], isLoading } = useDoctorsList({
    query: search,
    speciality: specialityFilter === "all" ? undefined : specialityFilter,
    zoneId: zoneFilter === "all" ? undefined : zoneFilter,
    territoryId: territoryFilter === "all" ? undefined : territoryFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Mutations
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const deleteMutation = useDeleteDoctor();

  // Maps
  const zoneMap = React.useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);
  const territoryMap = React.useMemo(() => new Map(territories.map((t) => [t.id, t])), [territories]);
  const employeeMap = React.useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);
  const divisionMap = React.useMemo(() => new Map(divisions.map((d) => [d.id, d])), [divisions]);

  // Specialities list extracted from mock data
  const specialities = ["GYN", "CARDIO", "GP", "CHEST", "PEDIATRIC", "DERMA", "ORTHO"];
  const categories = ["Specialist", "Super Specialist", "General Practitioner"];

  // Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      name: "",
      registrationNumber: "",
      doctorCode: "",
      hospitalName: "",
      clinicAddress: "",
      speciality: "",
      category: "",
      assignedEmployeeId: "",
      contact: "",
      zoneId: "",
      territoryId: "",
      status: "active",
    },
  });

  const watchSpeciality = watch("speciality");
  const watchCategory = watch("category");
  const watchEmployee = watch("assignedEmployeeId");
  const watchZone = watch("zoneId");
  const watchTerritory = watch("territoryId");
  const watchStatus = watch("status");

  // Filter territories to matching Zone ID
  const filteredTerritories = React.useMemo(() => {
    if (!watchZone) return territories;
    return territories.filter((t) => t.zoneId === watchZone);
  }, [watchZone, territories]);

  React.useEffect(() => {
    if (editingDoctor) {
      reset({
        name: editingDoctor.name,
        registrationNumber: editingDoctor.registrationNumber,
        doctorCode: editingDoctor.doctorCode,
        hospitalName: editingDoctor.hospitalName,
        clinicAddress: editingDoctor.clinicAddress,
        speciality: editingDoctor.speciality,
        category: editingDoctor.category,
        assignedEmployeeId: editingDoctor.assignedEmployeeId,
        contact: editingDoctor.contact,
        zoneId: editingDoctor.zoneId,
        territoryId: editingDoctor.territoryId,
        status: editingDoctor.status,
      });
    } else {
      reset({
        name: "",
        registrationNumber: "",
        doctorCode: "",
        hospitalName: "",
        clinicAddress: "",
        speciality: "",
        category: "",
        assignedEmployeeId: "",
        contact: "",
        zoneId: "",
        territoryId: "",
        status: "active",
      });
    }
  }, [editingDoctor, reset]);

  const handleOpenCreate = () => {
    setEditingDoctor(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const onSubmit = async (values: DoctorFormValues) => {
    try {
      const dataToSave = {
        ...values,
        registrationNumber: values.registrationNumber || "",
        doctorCode: values.doctorCode || "",
        hospitalName: values.hospitalName || "",
        clinicAddress: values.clinicAddress || "",
        speciality: values.speciality || "",
        category: values.category || "",
        assignedEmployeeId: values.assignedEmployeeId || "",
        contact: values.contact || "",
      };
      if (editingDoctor) {
        await updateMutation.mutateAsync({
          id: editingDoctor.id,
          data: dataToSave,
        });
        toast.success("Doctor updated successfully");
      } else {
        await createMutation.mutateAsync(dataToSave);
        toast.success("Doctor created successfully");
      }
      setIsFormOpen(false);
      setEditingDoctor(null);
    } catch (err) {
      toast.error("Failed to save doctor");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Doctor deleted successfully");
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete doctor");
    }
  };

  const getStatusTone = (status: string): StatusTone => {
    if (status === "active") return "success";
    return "neutral";
  };

  const columns: Column<Doctor>[] = [
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
              <Link to="/people/doctors/$id" params={{ id: item.id }}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>
            <RequirePermission permission={PERMISSIONS.DOCTOR_MANAGE}>
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
      accessorKey: "id",
      header: "Id",
      cell: (item) => <span className="font-medium text-muted-foreground">{item.id.substring(0, 9).toUpperCase()}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Doctor Add Date",
      cell: (item) => <span className="nums-tabular">{new Date(item.createdAt).toLocaleDateString()}</span>,
    },
    {
      accessorKey: "registrationNumber",
      header: "Registration Number",
      sortable: true,
      cell: (item) => <span className="font-mono text-xs font-semibold">{item.registrationNumber}</span>,
    },
    {
      accessorKey: "doctorCode",
      header: "Doctor Code",
      sortable: true,
      cell: (item) => <span className="font-semibold tracking-wider">{item.doctorCode}</span>,
    },
    {
      accessorKey: "name",
      header: "Doctor Name",
      sortable: true,
      cell: (item) => <span className="font-semibold text-foreground">{item.name}</span>,
    },
    {
      accessorKey: "territoryId",
      header: "City",
      cell: (item) => {
        const terr = territoryMap.get(item.territoryId);
        return <span>{terr ? terr.name : "—"}</span>;
      },
    },
    {
      accessorKey: "hospitalName",
      header: "Hospital Name",
      cell: (item) => <span>{item.hospitalName}</span>,
    },
    {
      accessorKey: "assignedEmployeeId",
      header: "Employee Name",
      cell: (item) => {
        const emp = employeeMap.get(item.assignedEmployeeId);
        return <span className="font-medium text-foreground">{emp ? emp.name : "—"}</span>;
      },
    },
    {
      accessorKey: "immediateSenior",
      header: "Immediate Senior",
      cell: (item) => {
        const emp = employeeMap.get(item.assignedEmployeeId);
        const senior = emp?.reportingTo ? employeeMap.get(emp.reportingTo) : null;
        return <span>{senior ? senior.name : "—"}</span>;
      },
    },
    {
      accessorKey: "contact",
      header: "Contact No",
      cell: (item) => <span className="nums-tabular">{item.contact}</span>,
    },
    {
      accessorKey: "speciality",
      header: "Speciality",
      cell: (item) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
          {item.speciality}
        </span>
      ),
    },
    {
      accessorKey: "qualification",
      header: "Qualification",
      cell: (item) => <span>{item.qualification || "—"}</span>,
    },
    {
      accessorKey: "divisionId",
      header: "Division",
      cell: (item) => {
        const div = item.divisionId ? divisionMap.get(item.divisionId) : null;
        return <span>{div ? div.code : "—"}</span>;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (item) => <span>{item.category || "—"}</span>,
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
      accessorKey: "email",
      header: "Email",
      cell: (item) => <span>{item.email || "—"}</span>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: (item) => <span>{item.gender || "—"}</span>,
    },
    {
      accessorKey: "dob",
      header: "DOB",
      cell: (item) => <span className="nums-tabular">{item.dob || "—"}</span>,
    },
    {
      accessorKey: "anniversary",
      header: "Anniversary",
      cell: (item) => <span className="nums-tabular">{item.anniversary || "—"}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: (item) => <span>{item.type || "—"}</span>,
    },
    {
      accessorKey: "firm",
      header: "Firm",
      cell: (item) => <span className="truncate max-w-[150px] block" title={item.firm}>{item.firm || "—"}</span>,
    },
    {
      accessorKey: "approxBusiness",
      header: "Approx Buisness",
      cell: (item) => <span className="nums-tabular">{item.approxBusiness ? `₹${item.approxBusiness.toLocaleString()}` : "—"}</span>,
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: (item) => <span>{item.country || "—"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      sortable: true,
      cell: (item) => (
        <StatusBadge tone={getStatusTone(item.status)}>
          {item.status === "active" ? "Active" : "Inactive"}
        </StatusBadge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Doctors Master"
        description="Manage clinical contacts, registration numbers, and assigned field representatives."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "People" },
          { label: "Doctors" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <RequirePermission permission={PERMISSIONS.DOCTOR_MANAGE}>
              <Button asChild className="gap-1.5 h-9">
                <Link to="/people/doctors/add">
                  <Plus className="h-4 w-4" />
                  <span>Add Doctor</span>
                </Link>
              </Button>
            </RequirePermission>
          </div>
        }
      />

      {/* Sefmed PDF Status Counters */}
      <div className="mb-4 grid grid-cols-3 gap-4 max-w-md bg-card border rounded-lg p-3.5 shadow-sm text-sm">
        <div className="text-center border-r">
          <div className="text-muted-foreground font-medium text-xs uppercase">Active</div>
          <div className="text-lg font-bold text-success nums-tabular mt-0.5">6362</div>
        </div>
        <div className="text-center border-r">
          <div className="text-muted-foreground font-medium text-xs uppercase">Inactive</div>
          <div className="text-lg font-bold text-muted-foreground nums-tabular mt-0.5">0</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground font-medium text-xs uppercase">Deleted</div>
          <div className="text-lg font-bold text-destructive nums-tabular mt-0.5">4497</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Filters */}
        <FilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search doctors by name, code, hospital or registration no..."
          showClearButton={
            specialityFilter !== "all" ||
            zoneFilter !== "all" ||
            territoryFilter !== "all" ||
            statusFilter !== "all" ||
            !!search
          }
          onClearFilters={() => {
            setSearch("");
            setSpecialityFilter("all");
            setZoneFilter("all");
            setTerritoryFilter("all");
            setStatusFilter("all");
          }}
        >
          <UiSelect value={specialityFilter} onValueChange={setSpecialityFilter}>
            <SelectTrigger className="w-[150px] bg-background h-10">
              <SelectValue placeholder="Speciality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialities</SelectItem>
              {specialities.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </UiSelect>

          <UiSelect value={zoneFilter} onValueChange={setZoneFilter}>
            <SelectTrigger className="w-[130px] bg-background h-10">
              <SelectValue placeholder="Zone" />
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

          <UiSelect value={territoryFilter} onValueChange={setTerritoryFilter}>
            <SelectTrigger className="w-[140px] bg-background h-10" disabled={zoneFilter === "all"}>
              <SelectValue placeholder="Territory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Territories</SelectItem>
              {territories
                .filter((t) => zoneFilter === "all" || t.zoneId === zoneFilter)
                .map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </UiSelect>

          <UiSelect value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-background h-10">
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
          data={doctors}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Edit Doctor Profile" : "Add Doctor Profile"}</DialogTitle>
              <DialogDescription>
                Assign clinical parameters and map field representatives.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  placeholder="e.g. 100138701"
                  {...register("registrationNumber")}
                />
                {errors.registrationNumber && (
                  <p className="text-xs text-destructive">{errors.registrationNumber.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doctorCode">Doctor Code</Label>
                <Input
                  id="doctorCode"
                  placeholder="e.g. TEQDOC001"
                  disabled={!!editingDoctor}
                  {...register("doctorCode")}
                />
                {errors.doctorCode && <p className="text-xs text-destructive">{errors.doctorCode.message}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="name">Doctor Name</Label>
                <Input id="name" placeholder="e.g. Dr S K Sinha" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="speciality">Speciality</Label>
                <UiSelect
                  value={watchSpeciality}
                  onValueChange={(val) => setValue("speciality", val)}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select speciality" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialities.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
                {errors.speciality && <p className="text-xs text-destructive">{errors.speciality.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <UiSelect
                  value={watchCategory}
                  onValueChange={(val) => setValue("category", val)}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
                {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact">Contact Number</Label>
                <Input id="contact" placeholder="e.g. 9425897458" {...register("contact")} />
                {errors.contact && <p className="text-xs text-destructive">{errors.contact.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hospitalName">Hospital Name</Label>
                <Input id="hospitalName" placeholder="e.g. Sinha Clinic" {...register("hospitalName")} />
                {errors.hospitalName && <p className="text-xs text-destructive">{errors.hospitalName.message}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="clinicAddress">Clinic Address</Label>
                <Input id="clinicAddress" placeholder="e.g. Rajim, Chhattisgarh, India" {...register("clinicAddress")} />
                {errors.clinicAddress && <p className="text-xs text-destructive">{errors.clinicAddress.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="zoneId">Zone</Label>
                <UiSelect
                  value={watchZone}
                  onValueChange={(val) => {
                    setValue("zoneId", val);
                    setValue("territoryId", ""); // Reset territory on zone change
                  }}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select zone" />
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
                <Label htmlFor="territoryId">Territory / HQ</Label>
                <UiSelect
                  value={watchTerritory}
                  onValueChange={(val) => setValue("territoryId", val)}
                  disabled={!watchZone}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select territory" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTerritories.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
                {errors.territoryId && <p className="text-xs text-destructive">{errors.territoryId.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="assignedEmployeeId">Assigned Field Representative</Label>
                <UiSelect
                  value={watchEmployee}
                  onValueChange={(val) => setValue("assignedEmployeeId", val)}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select field rep" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
                {errors.assignedEmployeeId && (
                  <p className="text-xs text-destructive">{errors.assignedEmployeeId.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <UiSelect
                  value={watchStatus}
                  onValueChange={(val: "active" | "inactive") => setValue("status", val)}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Doctor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Doctor Profile</DialogTitle>
            <DialogDescription>
              Delete this doctor profile? The assigned representatives will no longer have this doctor on their visiting lists.
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

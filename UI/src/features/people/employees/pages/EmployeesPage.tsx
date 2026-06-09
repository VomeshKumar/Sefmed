import * as React from "react";
import { Plus, Edit, Trash2, Eye, FileSpreadsheet, Users, Key, Settings } from "lucide-react";
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
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import { useDesignationsList } from "@/features/master-data/designations/hooks";
import {
  useEmployeesList,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "../hooks";
import { createEmployeeSchema, type EmployeeFormValues } from "../schemas";
import type { Employee } from "../types";

export function EmployeesPage() {
  const [search, setSearch] = React.useState("");
  const [designationFilter, setDesignationFilter] = React.useState("all");
  const [divisionFilter, setDivisionFilter] = React.useState("all");
  const [zoneFilter, setZoneFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Dialog States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingEmployee, setEditingEmployee] = React.useState<Employee | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Queries
  const { data: divisions = [] } = useDivisionsList();
  const { data: zones = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: designations = [] } = useDesignationsList();
  const { data: employees = [], isLoading } = useEmployeesList({
    query: search,
    designationId: designationFilter === "all" ? undefined : designationFilter,
    divisionId: divisionFilter === "all" ? undefined : divisionFilter,
    zoneId: zoneFilter === "all" ? undefined : zoneFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Mutations
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  // Reference Maps for display names
  const divisionMap = React.useMemo(() => new Map(divisions.map((d) => [d.id, d])), [divisions]);
  const zoneMap = React.useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);
  const territoryMap = React.useMemo(() => new Map(territories.map((t) => [t.id, t])), [territories]);
  const designationMap = React.useMemo(() => new Map(designations.map((d) => [d.id, d])), [designations]);
  const employeeMap = React.useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);

  // Sefmed PDF KPI summary stats
  const metrics = React.useMemo(() => {
    const active = employees.filter((e) => e.status === "active").length;
    const inactive = employees.filter((e) => e.status === "inactive").length;
    const onhold = employees.filter((e) => e.status === "onhold").length;
    return { active, inactive, onhold };
  }, [employees]);

  // Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      name: "",
      code: "",
      email: "",
      contact: "",
      designationId: "",
      divisionId: "",
      zoneId: "",
      territoryId: "",
      reportingTo: "",
      workType: "onfield",
      status: "active",
      state: "",
      address: "",
      dateOfBirth: "",
      dateOfJoin: "",
      dateOfResignation: "",
      signUpDateTime: "",
      lastSyncDateTime: "",
      apkVersion: "",
      mobile: "",
      os: "",
      inactiveDate: "",
      inactiveReason: "",
      gender: "male",
      anniversary: "",
      alternateContact: "",
      country: "India",
      currentAddress: "",
      permanentAddress: "",
      ageAsOfDate: "",
      additionalDivision: "",
      exSystem: "",
      additionalApproverId: "",
      endProbationDate: "",
      dailyWorkingHourPolicy: "Standard 8 Hours",
      showTourplanOption: false,
      managementEmployeeId: "",
      showInReports: true,
      workingDivisionId: "",
      qualification: "",
      aadharNumber: "",
      panNumber: "",
      pfaNumber: "",
      esicNumber: "",
      pranNumber: "",
      drivingLicenseNumber: "",
      licenseExpiryDate: "",
      bloodGroup: "",
      daHq: 0,
      daEx: 0,
      daOut: 0,
      daHilly: 0,
      daTransit: 0,
      daSpecial: 0,
      accountHolderName: "",
      accountNumber: "",
      ifscNumber: "",
      beneficiaryId: "",
      bankName: "",
      branchName: "",
      nomineeName: "",
      annualIncome: "",
    },
  });

  const watchDesignation = watch("designationId");
  const watchDivision = watch("divisionId");
  const watchZone = watch("zoneId");
  const watchTerritory = watch("territoryId");
  const watchReportingTo = watch("reportingTo");
  const watchWorkType = watch("workType");
  const watchStatus = watch("status");
  const watchGender = watch("gender");
  const watchCountry = watch("country");
  const watchState = watch("state");
  const watchShowTourplanOption = watch("showTourplanOption");
  const watchShowInReports = watch("showInReports");
  const watchBloodGroup = watch("bloodGroup");
  const watchAdditionalApproverId = watch("additionalApproverId");
  const watchManagementEmployeeId = watch("managementEmployeeId");
  const watchWorkingDivisionId = watch("workingDivisionId");

  // Filter territories to matching Zone ID
  const filteredTerritories = React.useMemo(() => {
    if (!watchZone) return territories;
    return territories.filter((t) => t.zoneId === watchZone);
  }, [watchZone, territories]);

  React.useEffect(() => {
    if (editingEmployee) {
      reset({
        name: editingEmployee.name,
        code: editingEmployee.code,
        email: editingEmployee.email,
        contact: editingEmployee.contact,
        designationId: editingEmployee.designationId,
        divisionId: editingEmployee.divisionId,
        zoneId: editingEmployee.zoneId,
        territoryId: editingEmployee.territoryId,
        reportingTo: editingEmployee.reportingTo || "",
        workType: editingEmployee.workType,
        status: editingEmployee.status,
        state: editingEmployee.state || "",
        address: editingEmployee.address || "",
        dateOfBirth: editingEmployee.dateOfBirth || "",
        dateOfJoin: editingEmployee.dateOfJoin || "",
        dateOfResignation: editingEmployee.dateOfResignation || "",
        signUpDateTime: editingEmployee.signUpDateTime || "",
        lastSyncDateTime: editingEmployee.lastSyncDateTime || "",
        apkVersion: editingEmployee.apkVersion || "",
        mobile: editingEmployee.mobile || "",
        os: editingEmployee.os || "",
        inactiveDate: editingEmployee.inactiveDate || "",
        inactiveReason: editingEmployee.inactiveReason || "",
        gender: editingEmployee.gender || "male",
        anniversary: editingEmployee.anniversary || "",
        alternateContact: editingEmployee.alternateContact || "",
        country: editingEmployee.country || "India",
        currentAddress: editingEmployee.currentAddress || "",
        permanentAddress: editingEmployee.permanentAddress || "",
        ageAsOfDate: editingEmployee.ageAsOfDate || "",
        additionalDivision: editingEmployee.additionalDivision || "",
        exSystem: editingEmployee.exSystem || "",
        additionalApproverId: editingEmployee.additionalApproverId || "",
        endProbationDate: editingEmployee.endProbationDate || "",
        dailyWorkingHourPolicy: editingEmployee.dailyWorkingHourPolicy || "Standard 8 Hours",
        showTourplanOption: editingEmployee.showTourplanOption || false,
        managementEmployeeId: editingEmployee.managementEmployeeId || "",
        showInReports: editingEmployee.showInReports !== undefined ? editingEmployee.showInReports : true,
        workingDivisionId: editingEmployee.workingDivisionId || "",
        qualification: editingEmployee.qualification || "",
        aadharNumber: editingEmployee.aadharNumber || "",
        panNumber: editingEmployee.panNumber || "",
        pfaNumber: editingEmployee.pfaNumber || "",
        esicNumber: editingEmployee.esicNumber || "",
        pranNumber: editingEmployee.pranNumber || "",
        drivingLicenseNumber: editingEmployee.drivingLicenseNumber || "",
        licenseExpiryDate: editingEmployee.licenseExpiryDate || "",
        bloodGroup: editingEmployee.bloodGroup || "",
        daHq: editingEmployee.daHq || 0,
        daEx: editingEmployee.daEx || 0,
        daOut: editingEmployee.daOut || 0,
        daHilly: editingEmployee.daHilly || 0,
        daTransit: editingEmployee.daTransit || 0,
        daSpecial: editingEmployee.daSpecial || 0,
        accountHolderName: editingEmployee.accountHolderName || "",
        accountNumber: editingEmployee.accountNumber || "",
        ifscNumber: editingEmployee.ifscNumber || "",
        beneficiaryId: editingEmployee.beneficiaryId || "",
        bankName: editingEmployee.bankName || "",
        branchName: editingEmployee.branchName || "",
        nomineeName: editingEmployee.nomineeName || "",
        annualIncome: editingEmployee.annualIncome || "",
      });
    } else {
      reset({
        name: "",
        code: "",
        email: "",
        contact: "",
        designationId: "",
        divisionId: "",
        zoneId: "",
        territoryId: "",
        reportingTo: "",
        workType: "onfield",
        status: "active",
        state: "",
        address: "",
        dateOfBirth: "",
        dateOfJoin: "",
        dateOfResignation: "",
        signUpDateTime: "",
        lastSyncDateTime: "",
        apkVersion: "",
        mobile: "",
        os: "",
        inactiveDate: "",
        inactiveReason: "",
        gender: "male",
        anniversary: "",
        alternateContact: "",
        country: "India",
        currentAddress: "",
        permanentAddress: "",
        ageAsOfDate: "",
        additionalDivision: "",
        exSystem: "",
        additionalApproverId: "",
        endProbationDate: "",
        dailyWorkingHourPolicy: "Standard 8 Hours",
        showTourplanOption: false,
        managementEmployeeId: "",
        showInReports: true,
        workingDivisionId: "",
        qualification: "",
        aadharNumber: "",
        panNumber: "",
        pfaNumber: "",
        esicNumber: "",
        pranNumber: "",
        drivingLicenseNumber: "",
        licenseExpiryDate: "",
        bloodGroup: "",
        daHq: 0,
        daEx: 0,
        daOut: 0,
        daHilly: 0,
        daTransit: 0,
        daSpecial: 0,
        accountHolderName: "",
        accountNumber: "",
        ifscNumber: "",
        beneficiaryId: "",
        bankName: "",
        branchName: "",
        nomineeName: "",
        annualIncome: "",
      });
    }
  }, [editingEmployee, reset]);

  // Actions
  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      if (editingEmployee) {
        await updateMutation.mutateAsync({
          id: editingEmployee.id,
          data: { ...values, reportingTo: values.reportingTo || undefined },
        });
        toast.success("Employee updated successfully");
      } else {
        await createMutation.mutateAsync({
          ...values,
          reportingTo: values.reportingTo || undefined,
        });
        toast.success("Employee created successfully");
      }
      setIsFormOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      toast.error("Failed to save employee");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Employee deleted successfully");
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete employee");
    }
  };

  const getStatusTone = (status: string): StatusTone => {
    if (status === "active") return "success";
    if (status === "onhold") return "warning";
    return "neutral";
  };

  const columns: Column<Employee>[] = [
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
              <Link to="/people/employees/$id" params={{ id: item.id }}>
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
      accessorKey: "code",
      header: "Code",
      sortable: true,
      cell: (item) => <span className="font-semibold tracking-wider">{item.code}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      sortable: true,
      cell: (item) => <span className="font-semibold text-foreground">{item.name}</span>,
    },
    {
      accessorKey: "workType",
      header: "Work Type",
      cell: (item) => <span className="uppercase text-xs font-semibold">{item.workType}</span>,
    },
    {
      accessorKey: "reportingTo",
      header: "Assign To",
      cell: (item) => {
        const mgr = item.reportingTo ? employeeMap.get(item.reportingTo) : null;
        return <span>{mgr ? mgr.name : "NA"}</span>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
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
      accessorKey: "contact",
      header: "Contact",
      cell: (item) => <span className="nums-tabular">{item.contact}</span>,
    },
    {
      accessorKey: "divisionId",
      header: "Division/Department",
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
      accessorKey: "state",
      header: "State",
      cell: (item) => <span>{item.state || "—"}</span>,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: (item) => <span className="text-xs truncate max-w-[150px] block" title={item.address}>{item.address || "—"}</span>,
    },
    {
      accessorKey: "designationId",
      header: "Designation",
      cell: (item) => {
        const desig = designationMap.get(item.designationId);
        return <span>{desig ? desig.name : "—"}</span>;
      },
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date Of Birth",
      cell: (item) => <span className="nums-tabular">{item.dateOfBirth || "—"}</span>,
    },
    {
      accessorKey: "dateOfJoin",
      header: "Date Of Join",
      cell: (item) => <span className="nums-tabular">{item.dateOfJoin || "—"}</span>,
    },
    {
      accessorKey: "dateOfResignation",
      header: "Date Of Resignation",
      cell: (item) => <span className="nums-tabular">{item.dateOfResignation || "—"}</span>,
    },
    {
      accessorKey: "signUpDateTime",
      header: "Sign Up Date And Time",
      cell: (item) => <span className="nums-tabular">{item.signUpDateTime ? new Date(item.signUpDateTime).toLocaleString() : "—"}</span>,
    },
    {
      accessorKey: "lastSyncDateTime",
      header: "Last Sync DateTime",
      cell: (item) => <span className="nums-tabular">{item.lastSyncDateTime ? new Date(item.lastSyncDateTime).toLocaleString() : "—"}</span>,
    },
    {
      accessorKey: "apkVersion",
      header: "APK Version",
      cell: (item) => <span className="font-mono text-xs">{item.apkVersion || "—"}</span>,
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      cell: (item) => <span>{item.mobile || "—"}</span>,
    },
    {
      accessorKey: "os",
      header: "OS",
      cell: (item) => <span>{item.os || "—"}</span>,
    },
    {
      accessorKey: "inactiveDate",
      header: "Inactive Date",
      cell: (item) => <span className="nums-tabular">{item.inactiveDate || "—"}</span>,
    },
    {
      accessorKey: "inactiveReason",
      header: "Inactive Reason",
      cell: (item) => <span className="text-xs truncate max-w-[150px] block" title={item.inactiveReason}>{item.inactiveReason || "—"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      sortable: true,
      cell: (item) => (
        <StatusBadge tone={getStatusTone(item.status)}>
          {item.status === "active" ? "Active" : item.status === "onhold" ? "On Hold" : "Inactive"}
        </StatusBadge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Employees"
        description="Manage corporate workforce, representative hierarchies, and zone targets."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "People" },
          { label: "Employees" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <RequirePermission permission={PERMISSIONS.EMPLOYEE_MANAGE}>
              <Button onClick={handleOpenCreate} className="gap-1.5 h-9">
                <Plus className="h-4 w-4" />
                <span>Add Employee</span>
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-1 text-xs">
                <Users className="h-3.5 w-3.5" />
                <span>Hierarchy</span>
              </Button>
            </RequirePermission>
          </div>
        }
      />

      {/* Sefmed PDF Status Counters */}
      <div className="mb-4 grid grid-cols-3 gap-4 max-w-md bg-card border rounded-lg p-3.5 shadow-sm text-sm">
        <div className="text-center border-r">
          <div className="text-muted-foreground font-medium text-xs uppercase">Active</div>
          <div className="text-lg font-bold text-success nums-tabular mt-0.5">{metrics.active}</div>
        </div>
        <div className="text-center border-r">
          <div className="text-muted-foreground font-medium text-xs uppercase">Inactive</div>
          <div className="text-lg font-bold text-muted-foreground nums-tabular mt-0.5">{metrics.inactive}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground font-medium text-xs uppercase">On Hold</div>
          <div className="text-lg font-bold text-warning nums-tabular mt-0.5">{metrics.onhold}</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Filters */}
        <FilterBar
          searchQuery={search}
          onSearchQueryChange={setSearch}
          searchPlaceholder="Search employees by name, code, contact or email..."
          showClearButton={
            designationFilter !== "all" ||
            divisionFilter !== "all" ||
            zoneFilter !== "all" ||
            statusFilter !== "all" ||
            !!search
          }
          onClearFilters={() => {
            setSearch("");
            setDesignationFilter("all");
            setDivisionFilter("all");
            setZoneFilter("all");
            setStatusFilter("all");
          }}
        >
          <UiSelect value={designationFilter} onValueChange={setDesignationFilter}>
            <SelectTrigger className="w-[150px] bg-background h-10">
              <SelectValue placeholder="Designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Designations</SelectItem>
              {designations.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </UiSelect>

          <UiSelect value={divisionFilter} onValueChange={setDivisionFilter}>
            <SelectTrigger className="w-[140px] bg-background h-10">
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              {divisions.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.code}
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

          <UiSelect value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-background h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="onhold">On Hold</SelectItem>
            </SelectContent>
          </UiSelect>
        </FilterBar>

        {/* Data Grid */}
        <DataTable
          columns={columns}
          data={employees}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{editingEmployee ? "Edit Employee Profile" : "Add Employees"}</DialogTitle>
              <DialogDescription>
                Assign designations, contact info, allowances, and banking scopes.
              </DialogDescription>
            </DialogHeader>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b pb-1">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-3">
                  <Label>Profile Image</Label>
                  <div className="flex items-center gap-4 p-3 border rounded bg-muted/20">
                    <div className="h-16 w-16 rounded border bg-muted flex items-center justify-center text-muted-foreground text-2xl font-bold">
                      👤
                    </div>
                    <div className="space-y-1">
                      <Input type="file" className="h-8 text-xs max-w-xs" />
                      <p className="text-[10px] text-muted-foreground">Select file to upload (Max 2MB)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="code">Employee Code *</Label>
                  <Input id="code" placeholder="e.g. TEQEMP0011" {...register("code")} disabled={!!editingEmployee} />
                  {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="name">Employee Name *</Label>
                  <Input id="name" placeholder="Enter Employee Name" {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Gender *</Label>
                  <div className="flex items-center gap-4 py-2">
                    <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        value="male"
                        checked={watchGender === "male"}
                        onChange={() => setValue("gender", "male")}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        value="female"
                        checked={watchGender === "female"}
                        onChange={() => setValue("gender", "female")}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Work Type *</Label>
                  <div className="flex items-center gap-4 py-2">
                    <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        value="onfield"
                        checked={watchWorkType === "onfield"}
                        onChange={() => setValue("workType", "onfield")}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <span>Onfield</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        value="office"
                        checked={watchWorkType === "office"}
                        onChange={() => setValue("workType", "office")}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <span>Office</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dateOfJoin">Date of Joining *</Label>
                  <Input id="dateOfJoin" type="date" {...register("dateOfJoin")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="anniversary">Anniversary</Label>
                  <Input id="anniversary" type="date" {...register("anniversary")} />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b pb-1">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contact">Primary Contact Number *</Label>
                  <Input id="contact" placeholder="Enter Mobile Number" {...register("contact")} />
                  {errors.contact && <p className="text-xs text-destructive">{errors.contact.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="alternateContact">Alternate Contact Number</Label>
                  <Input id="alternateContact" placeholder="Enter Alt Contact Number" {...register("alternateContact")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="Enter Email" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="country">Country *</Label>
                  <UiSelect value={watchCountry} onValueChange={(val) => setValue("country", val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Nepal">Nepal</SelectItem>
                    </SelectContent>
                  </UiSelect>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="state">State *</Label>
                  <UiSelect value={watchState} onValueChange={(val) => setValue("state", val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Delhi", "Chhattisgarh", "Tamil Nadu", "Maharashtra", "Karnataka", "Uttar Pradesh", "Bihar"].map((st) => (
                        <SelectItem key={st} value={st}>
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="territoryId">HQ / City *</Label>
                  <UiSelect value={watchTerritory} onValueChange={(val) => setValue("territoryId", val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select City/Territory" />
                    </SelectTrigger>
                    <SelectContent>
                      {territories.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="divisionId">Division *</Label>
                  <UiSelect value={watchDivision} onValueChange={(val) => setValue("divisionId", val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
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
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ageAsOfDate">Age As Of Date</Label>
                  <Input id="ageAsOfDate" placeholder="Enter Age" {...register("ageAsOfDate")} />
                </div>

                <div className="space-y-1.5 md:col-span-3">
                  <Label htmlFor="currentAddress">Current Address</Label>
                  <Input id="currentAddress" placeholder="Enter Current Address" {...register("currentAddress")} />
                </div>

                <div className="space-y-1.5 md:col-span-3">
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Input id="permanentAddress" placeholder="Enter Permanent Address" {...register("permanentAddress")} />
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b pb-1">Work Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="exSystem">Ex-System</Label>
                  <Input id="exSystem" placeholder="Select Ex-System" {...register("exSystem")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="status">User Status *</Label>
                  <UiSelect value={watchStatus} onValueChange={(val: "active" | "inactive" | "onhold") => setValue("status", val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="onhold">On Hold</SelectItem>
                    </SelectContent>
                  </UiSelect>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="designationId">Designation *</Label>
                  <UiSelect value={watchDesignation} onValueChange={(val) => setValue("designationId", val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reportingTo">Assign To (Reporting Manager)</Label>
                  <UiSelect value={watchReportingTo} onValueChange={(val) => setValue("reportingTo", val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {employees
                        .filter((e) => e.id !== editingEmployee?.id)
                        .map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </UiSelect>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="additionalApproverId">Additional Approver</Label>
                  <UiSelect value={watchAdditionalApproverId} onValueChange={(val) => setValue("additionalApproverId", val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Approver" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="endProbationDate">End Probation Date</Label>
                  <Input id="endProbationDate" type="date" {...register("endProbationDate")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dateOfResignation">Date of Resignation</Label>
                  <Input id="dateOfResignation" type="date" {...register("dateOfResignation")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dailyWorkingHourPolicy">Daily Working Hour Policy *</Label>
                  <Input id="dailyWorkingHourPolicy" placeholder="e.g. Standard 8 Hours" {...register("dailyWorkingHourPolicy")} />
                </div>

                <div className="space-y-1.5 flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="showTourplanOption"
                    checked={!!watchShowTourplanOption}
                    onChange={(e) => setValue("showTourplanOption", e.target.checked)}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary rounded"
                  />
                  <Label htmlFor="showTourplanOption" className="cursor-pointer">Show Tourplan Option</Label>
                </div>

                <div className="space-y-1.5 flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="showInReports"
                    checked={!!watchShowInReports}
                    onChange={(e) => setValue("showInReports", e.target.checked)}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary rounded"
                  />
                  <Label htmlFor="showInReports" className="cursor-pointer">Show In Reports</Label>
                </div>
              </div>
            </div>

            {/* Other Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b pb-1">Other Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="qualification">Employee Qualification</Label>
                  <Input id="qualification" placeholder="Enter Qualification" {...register("qualification")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="aadharNumber">Aadhar Number</Label>
                  <Input id="aadharNumber" placeholder="Enter Aadhar Number" {...register("aadharNumber")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input id="panNumber" placeholder="Enter PAN Number" {...register("panNumber")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pfaNumber">PFA Number</Label>
                  <Input id="pfaNumber" placeholder="Enter PFA Number" {...register("pfaNumber")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="esicNumber">ESIC Number</Label>
                  <Input id="esicNumber" placeholder="Enter ESIC Number" {...register("esicNumber")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pranNumber">PRAN Number</Label>
                  <Input id="pranNumber" placeholder="Enter PRAN Number" {...register("pranNumber")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="drivingLicenseNumber">Driving License Number</Label>
                  <Input id="drivingLicenseNumber" placeholder="Enter License Number" {...register("drivingLicenseNumber")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
                  <Input id="licenseExpiryDate" type="date" {...register("licenseExpiryDate")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <UiSelect value={watchBloodGroup} onValueChange={(val) => setValue("bloodGroup", val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>
            </div>

            {/* Daily Allowance Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b pb-1">Daily Allowance Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { id: "daHq", label: "DA HQ" },
                  { id: "daEx", label: "DA EX" },
                  { id: "daOut", label: "DA OUT" },
                  { id: "daHilly", label: "DA Hilly" },
                  { id: "daTransit", label: "DA Transit" },
                  { id: "daSpecial", label: "DA Special" },
                ].map((da) => (
                  <div key={da.id} className="space-y-1.5">
                    <Label htmlFor={da.id}>{da.label}</Label>
                    <Input
                      id={da.id}
                      type="number"
                      defaultValue={0}
                      {...register(da.id as any, { valueAsNumber: true })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-primary border-b pb-1">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input id="accountHolderName" placeholder="Enter Account Holder Name" {...register("accountHolderName")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" placeholder="Enter Account Number" {...register("accountNumber")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ifscNumber">IFSC Number</Label>
                  <Input id="ifscNumber" placeholder="Enter IFSC Number" {...register("ifscNumber")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="beneficiaryId">Beneficiary ID</Label>
                  <Input id="beneficiaryId" placeholder="Enter Beneficiary ID" {...register("beneficiaryId")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" placeholder="Enter Bank Name" {...register("bankName")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="branchName">Branch Name</Label>
                  <Input id="branchName" placeholder="Enter Branch Name" {...register("branchName")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="nomineeName">Nominee Name</Label>
                  <Input id="nomineeName" placeholder="Enter Nominee Name" {...register("nomineeName")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="annualIncome">Annual Income</Label>
                  <Input id="annualIncome" placeholder="Enter Annual Income" {...register("annualIncome")} />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingEmployee ? "Save Changes" : "Add Employee"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Employee Profile</DialogTitle>
            <DialogDescription>
              Delete this profile? Representative records, logs, and visit plans linked to this profile will lose their reporter association.
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

import * as React from "react";
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  ChevronDown,
  FileSpreadsheet,
  Filter,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DataTable, type Column } from "@/components/data/DataTable";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { RequirePermission } from "@/lib/rbac/RequirePermission";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { toast } from "sonner";
import { useSFCList, useCreateSFC, useUpdateSFC, useDeleteSFC } from "../hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { sfcSchema, type SFCFormValues } from "../schemas";
import type { SFC, TransportType } from "../types";

export function SFCPage() {
  // Search & Filter States
  const [selectedMode, setSelectedMode] = React.useState("");
  const [selectedDivision, setSelectedDivision] = React.useState("");
  const [selectedZone, setSelectedZone] = React.useState("");
  const [selectedEmployee, setSelectedEmployee] = React.useState("");
  const [searchVal, setSearchVal] = React.useState("");
  const [activeSearch, setActiveSearch] = React.useState("");

  // Add/Edit Dialog States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingSFC, setEditingSFC] = React.useState<SFC | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Master Data API hooks
  const { data: zones = [] } = useZonesList({ status: "active" });
  const { data: divisions = [] } = useDivisionsList();
  const { data: employees = [] } = useEmployeesList({});
  const { data: sfcs = [], isLoading } = useSFCList({ transportType: "all", query: "" });

  const createMutation = useCreateSFC();
  const updateMutation = useUpdateSFC();
  const deleteMutation = useDeleteSFC();

  // Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SFCFormValues>({
    resolver: zodResolver(sfcSchema),
    defaultValues: {
      source: "",
      destination: "",
      distanceKm: 0,
      transportType: "bike",
      isRoundTripAllowed: false,
      effectiveFrom: new Date().toISOString().slice(0, 10),
      routeName: "",
      citiesInRoute: "",
      zone: "Maharashtra",
      division: "DERMA",
      employeeName: "",
      designation: "All",
      fare: 0,
    },
  });

  const watchTransport = watch("transportType");

  // Sync Form values when editing SFC changes
  React.useEffect(() => {
    if (editingSFC) {
      reset({
        source: editingSFC.source,
        destination: editingSFC.destination,
        distanceKm: editingSFC.distanceKm,
        transportType: editingSFC.transportType,
        allowedFarePerKm: editingSFC.allowedFarePerKm,
        flatFare: editingSFC.flatFare,
        isRoundTripAllowed: editingSFC.isRoundTripAllowed,
        effectiveFrom: editingSFC.effectiveFrom,
        effectiveTo: editingSFC.effectiveTo ?? "",
        routeName: editingSFC.routeName ?? `${editingSFC.source} to ${editingSFC.destination}`,
        citiesInRoute: editingSFC.citiesInRoute ?? "",
        zone: editingSFC.zone ?? "Maharashtra",
        division: editingSFC.division ?? "DERMA",
        employeeName: editingSFC.employeeName ?? "",
        designation: editingSFC.designation ?? "All",
        fare: editingSFC.fare ?? editingSFC.flatFare ?? 0,
      });
    } else {
      reset({
        source: "",
        destination: "",
        distanceKm: 0,
        transportType: "bike",
        isRoundTripAllowed: false,
        effectiveFrom: new Date().toISOString().slice(0, 10),
        routeName: "",
        citiesInRoute: "",
        zone: "Maharashtra",
        division: "DERMA",
        employeeName: "",
        designation: "All",
        fare: 0,
      });
    }
  }, [editingSFC, reset]);

  // Handle dialog save
  const onSubmit = async (values: SFCFormValues) => {
    try {
      const payload = {
        ...values,
        routeName: values.routeName || `${values.source} to ${values.destination}`,
        effectiveTo: values.effectiveTo || undefined,
        allowedFarePerKm: values.allowedFarePerKm || undefined,
        flatFare: values.flatFare || values.fare || undefined,
      };
      if (editingSFC) {
        await updateMutation.mutateAsync({ id: editingSFC.id, data: payload });
        toast.success("SFC route updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("SFC route added");
      }
      setIsFormOpen(false);
      setEditingSFC(null);
    } catch {
      toast.error("Failed to save SFC route");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("SFC route deleted");
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete SFC route");
    }
  };

  // Trigger search on "Go" click
  const handleGoSearch = () => {
    setActiveSearch(searchVal);
  };

  // Handle CSV Export
  const handleExport = () => {
    if (filteredSFCs.length === 0) {
      toast.error("No records found to export");
      return;
    }

    const headers = [
      "Route Id",
      "Route Name",
      "Cities In Route",
      "Zone",
      "Division",
      "Route For",
      "Designation",
      "Mode",
      "Distance (Km)",
      "Fare",
    ];

    const csvRows = [headers.join(",")];

    filteredSFCs.forEach((item) => {
      const row = [
        item.routeId || "",
        `"${item.routeName || `${item.source} to ${item.destination}`}"`,
        `"${item.citiesInRoute || ""}"`,
        `"${item.zone || ""}"`,
        `"${item.division || ""}"`,
        `"${item.employeeName || ""}"`,
        `"${item.designation || "All"}"`,
        `"${item.transportType.toUpperCase()}"`,
        item.distanceKm,
        item.fare ?? item.flatFare ?? (item.distanceKm * (item.allowedFarePerKm || 2)),
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "standard_fare_chart.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Standard Fare Chart exported successfully");
  };

  // Filter routes locally matching the screenshot filters
  const filteredSFCs = React.useMemo(() => {
    return sfcs.filter((sfc) => {
      // Mode Filter
      if (selectedMode && selectedMode !== "all" && sfc.transportType !== selectedMode) {
        return false;
      }
      // Division Filter
      if (selectedDivision && selectedDivision !== "all" && sfc.division !== selectedDivision) {
        return false;
      }
      // Zone Filter
      if (selectedZone && selectedZone !== "all" && sfc.zone !== selectedZone) {
        return false;
      }
      // Employee Filter
      if (selectedEmployee && selectedEmployee !== "all" && sfc.employeeName !== selectedEmployee) {
        return false;
      }

      // Query Search matching Route Name, Source, Destination, Cities, or Route For
      if (activeSearch) {
        const query = activeSearch.toLowerCase();
        const routeIdStr = sfc.routeId ? String(sfc.routeId) : "";
        const routeName = (sfc.routeName || "").toLowerCase();
        const source = (sfc.source || "").toLowerCase();
        const dest = (sfc.destination || "").toLowerCase();
        const cities = (sfc.citiesInRoute || "").toLowerCase();
        const emp = (sfc.employeeName || "").toLowerCase();

        const matches =
          routeIdStr.includes(query) ||
          routeName.includes(query) ||
          source.includes(query) ||
          dest.includes(query) ||
          cities.includes(query) ||
          emp.includes(query);

        if (!matches) return false;
      }

      return true;
    });
  }, [sfcs, selectedMode, selectedDivision, selectedZone, selectedEmployee, activeSearch]);

  const columns: Column<SFC>[] = [
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-[#008272] hover:bg-[#006e60] text-white flex items-center gap-1.5 h-7 px-2.5 rounded text-xs cursor-pointer font-semibold transition-colors">
              <Settings className="h-3.5 w-3.5" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-white border border-slate-100 shadow-md rounded-md p-1 min-w-[100px]">
            <DropdownMenuItem
              className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded cursor-pointer"
              onClick={() => {
                setEditingSFC(item);
                setIsFormOpen(true);
              }}
            >
              <Edit className="h-3.5 w-3.5 text-slate-400" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 px-2 py-1.5 text-xs text-destructive hover:bg-destructive/5 rounded cursor-pointer"
              onClick={() => {
                setDeletingId(item.id);
                setIsDeleteOpen(true);
              }}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      accessorKey: "routeId",
      header: "Route Id",
      sortable: true,
      cell: (item) => <span className="nums-tabular text-sm font-semibold text-slate-600">{item.routeId || "—"}</span>,
    },
    {
      accessorKey: "routeName",
      header: "Route Name",
      sortable: true,
      cell: (item) => (
        <span className="font-semibold text-[#008272]">
          {item.routeName || `${item.source} to ${item.destination}`}
        </span>
      ),
    },
    {
      accessorKey: "citiesInRoute",
      header: "Cities In Route",
      cell: (item) => <span className="text-slate-600 text-xs">{item.citiesInRoute || "—"}</span>,
    },
    {
      accessorKey: "zone",
      header: "Zone",
      cell: (item) => <span className="text-slate-600 text-xs">{item.zone || "—"}</span>,
    },
    {
      accessorKey: "division",
      header: "Division",
      cell: (item) => <span className="text-slate-600 text-xs">{item.division || "—"}</span>,
    },
    {
      accessorKey: "employeeName",
      header: "Route For",
      cell: (item) => <span className="text-slate-600 text-xs font-semibold">{item.employeeName || "—"}</span>,
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: (item) => <span className="text-slate-600 text-xs">{item.designation || "All"}</span>,
    },
    {
      accessorKey: "transportType",
      header: "Mode",
      cell: (item) => (
        <span className="text-xs uppercase font-bold tracking-wide text-slate-600">
          {item.transportType}
        </span>
      ),
    },
    {
      accessorKey: "distanceKm",
      header: "Distance (Km)",
      sortable: true,
      cell: (item) => <span className="nums-tabular text-sm">{item.distanceKm}</span>,
    },
    {
      accessorKey: "fare",
      header: "Fare",
      sortable: true,
      cell: (item) => (
        <span className="nums-tabular text-sm font-bold text-slate-700">
          {item.fare ?? item.flatFare ?? (item.distanceKm * (item.allowedFarePerKm || 2))}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      <div>
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">
          Standard Fare Chart
        </h1>

        {/* Top Actions Row */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => {
              setEditingSFC(null);
              setIsFormOpen(true);
            }}
            className="bg-[#008272] hover:bg-[#006e60] text-white px-3.5 h-9 font-semibold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="h-4.5 w-4.5" />
            Add
          </Button>
          <Button
            onClick={handleExport}
            className="bg-[#008272] hover:bg-[#006e60] text-white px-3.5 h-9 font-semibold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FileSpreadsheet className="h-4.5 w-4.5" />
            Download
          </Button>
          <Button className="bg-[#008272] hover:bg-[#006e60] text-white px-3.5 h-9 font-semibold text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5">
            <Filter className="h-4.5 w-4.5" />
            Advance Filters
          </Button>
        </div>

        {/* Card Body */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 mb-6">
          {/* Filters Toolbar Row */}
          <div className="flex flex-wrap gap-2.5 items-center pb-4 border-b border-slate-100 mb-4">
            {/* Mode selector */}
            <UiSelect value={selectedMode} onValueChange={setSelectedMode}>
              <SelectTrigger className="w-36 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Mode</SelectItem>
                <SelectItem value="bike">BIKE</SelectItem>
                <SelectItem value="bus">BUS</SelectItem>
                <SelectItem value="car">CAR</SelectItem>
                <SelectItem value="train">TRAIN</SelectItem>
                <SelectItem value="flight">FLIGHT</SelectItem>
              </SelectContent>
            </UiSelect>

            {/* Division selector */}
            <UiSelect value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger className="w-36 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="All Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Division</SelectItem>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Zone selector */}
            <UiSelect value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="w-36 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="All Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zone</SelectItem>
                {zones.map((z) => (
                  <SelectItem key={z.id} value={z.name}>
                    {z.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Employee selector */}
            <UiSelect value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-38 bg-white border-slate-200 text-slate-500 text-xs h-9 cursor-pointer">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select Employee</SelectItem>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.name}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </UiSelect>

            {/* Search toolbar right-aligned */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-slate-500 text-xs font-semibold">Search :</span>
              <Input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGoSearch();
                  }
                }}
                className="w-40 bg-white border-slate-200 text-slate-700 text-xs h-9"
              />
              <Button
                onClick={handleGoSearch}
                className="bg-[#008272] hover:bg-[#006e60] text-white px-3.5 h-9 font-semibold text-xs rounded transition-colors cursor-pointer"
              >
                Go
              </Button>
            </div>
          </div>

          {/* Results Table */}
          <DataTable
            columns={columns}
            data={filteredSFCs}
            isLoading={isLoading}
            getRowId={(item) => item.id}
          />
        </div>
      </div>

      {/* Sefmed Premium Footer */}
      <footer className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-semibold">
        <div>2026 &copy; Sefmed &amp; Powered by Cuztomise</div>
      </footer>

      {/* Add/Edit Dialog Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingSFC ? "Edit SFC Route" : "Add SFC Route"}</DialogTitle>
              <DialogDescription>
                Define a travel route with fare rates for field force expense validation.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-1">
              {/* Route Name & Cities In Route */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Route Name</Label>
                  <Input placeholder="e.g. Amravati to Akola" {...register("routeName")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Cities In Route</Label>
                  <Input placeholder="e.g. Akola" {...register("citiesInRoute")} />
                </div>
              </div>

              {/* Source & Destination */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Source City</Label>
                  <Input placeholder="e.g. Amravati" {...register("source")} />
                  {errors.source && <p className="text-xs text-destructive">{errors.source.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Destination City</Label>
                  <Input placeholder="e.g. Akola" {...register("destination")} />
                  {errors.destination && <p className="text-xs text-destructive">{errors.destination.message}</p>}
                </div>
              </div>

              {/* Zone & Division */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Zone</Label>
                  <Input placeholder="e.g. Maharashtra" {...register("zone")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Division</Label>
                  <Input placeholder="e.g. DERMA" {...register("division")} />
                </div>
              </div>

              {/* Route For (Employee) & Designation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Route For (Employee)</Label>
                  <Input placeholder="e.g. AAKIB KHAN" {...register("employeeName")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Designation</Label>
                  <Input placeholder="e.g. All" {...register("designation")} />
                </div>
              </div>

              {/* Mode & Distance */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Transport Mode</Label>
                  <UiSelect value={watchTransport} onValueChange={(v) => setValue("transportType", v as TransportType)}>
                    <SelectTrigger className="w-full bg-background h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["bike", "car", "bus", "train", "flight"] as TransportType[]).map((t) => (
                        <SelectItem key={t} value={t}>
                          <span className="flex items-center gap-2 capitalize">{t}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
                <div className="space-y-1.5">
                  <Label>Distance (km)</Label>
                  <Input type="number" placeholder="0" {...register("distanceKm", { valueAsNumber: true })} />
                  {errors.distanceKm && <p className="text-xs text-destructive">{errors.distanceKm.message}</p>}
                </div>
              </div>

              {/* Fare & Effective From */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Fare (₹)</Label>
                  <Input type="number" placeholder="e.g. 384" {...register("fare", { valueAsNumber: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Effective From</Label>
                  <Input type="date" {...register("effectiveFrom")} />
                  {errors.effectiveFrom && <p className="text-xs text-destructive">{errors.effectiveFrom.message}</p>}
                </div>
              </div>
            </div>

            <DialogFooter className="bg-slate-50 border-t px-6 py-4 -mx-6 -mb-6 rounded-b-lg">
              <Button type="button" variant="outline" className="cursor-pointer" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#008272] hover:bg-[#006e60] text-white cursor-pointer">
                {isSubmitting ? "Saving..." : "Save Route"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Delete SFC Route</DialogTitle>
            <DialogDescription>
              This route will be removed from the Standard Fare Chart. Existing approved expenses will not be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-slate-50 border-t px-6 py-4 -mx-6 -mb-6 rounded-b-lg">
            <Button variant="outline" className="cursor-pointer" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="cursor-pointer" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

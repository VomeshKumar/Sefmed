import * as React from "react";
import {
  Plus,
  Edit,
  Trash,
  Settings,
  Search,
  Eye,
  Download,
  Upload,
  FileSpreadsheet,
  FileUp,
  X,
  Layers,
  Users,
  CreditCard,
  Calendar,
  Sparkles
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/PageHeader";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RequirePermission } from "@/lib/rbac/RequirePermission";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { toast } from "sonner";
import { useStockistsList, useCreateStockist, useUpdateStockist } from "../hooks";
import { stockistSchema, type StockistFormValues } from "../schemas";
import type { Stockist } from "../types";

export function StockistsPage() {
  // Filters state
  const [searchExactCity, setSearchExactCity] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [selectedDivision, setSelectedDivision] = React.useState("all");
  const [selectedZone, setSelectedZone] = React.useState("all");
  const [selectedCity, setSelectedCity] = React.useState("all");
  const [selectedEmployee, setSelectedEmployee] = React.useState("all");
  const [selectedManager, setSelectedManager] = React.useState("all");
  const [selectedAssignedFirm, setSelectedAssignedFirm] = React.useState("all");

  const [typedSearch, setTypedSearch] = React.useState("");
  const [searchVal, setSearchVal] = React.useState("");

  // Dialog / Modal state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingStockist, setEditingStockist] = React.useState<Stockist | null>(null);
  const [activeTab, setActiveTab] = React.useState("general");

  // File import state
  const [selectedFileName, setSelectedFileName] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load firms/stockists
  const { data: stockists = [], isLoading, refetch } = useStockistsList({});

  const createMutation = useCreateStockist();
  const updateMutation = useUpdateStockist();

  // Populate dynamic filter options from loaded data
  const uniqueTypes = React.useMemo(() => {
    return Array.from(new Set(stockists.map((s) => s.type).filter((x): x is string => !!x)));
  }, [stockists]);

  const uniqueDivisions = React.useMemo(() => {
    return Array.from(new Set(stockists.map((s) => s.division).filter((x): x is string => !!x)));
  }, [stockists]);

  const uniqueZones = React.useMemo(() => {
    return Array.from(new Set(stockists.map((s) => s.zone).filter((x): x is string => !!x)));
  }, [stockists]);

  const uniqueCities = React.useMemo(() => {
    return Array.from(new Set(stockists.map((s) => s.city).filter((x): x is string => !!x)));
  }, [stockists]);

  const uniqueEmployees = React.useMemo(() => {
    return Array.from(new Set(stockists.map((s) => s.employeeAssigned).filter((x): x is string => !!x)));
  }, [stockists]);

  const uniqueManagers = React.useMemo(() => {
    const managers = new Set<string>();
    stockists.forEach((s) => {
      if (s.firstLevelManager) managers.add(s.firstLevelManager);
      if (s.secondLevelManager) managers.add(s.secondLevelManager);
      if (s.thirdLevelManager) managers.add(s.thirdLevelManager);
    });
    return Array.from(managers);
  }, [stockists]);

  const uniqueAssignedFirms = React.useMemo(() => {
    return Array.from(new Set(stockists.map((s) => s.assignedFirm).filter((x): x is string => !!x)));
  }, [stockists]);

  // Handle Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StockistFormValues>({
    resolver: zodResolver(stockistSchema),
    defaultValues: {
      name: "",
      code: "",
      type: "Stockist",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      territoryId: "",
      zoneId: "",
      creditLimit: 0,
      outstandingAmount: 0,
      status: "active",
      date: "",
      addDate: "",
      zone: "",
      division: "",
      category: "",
      employeeAssigned: "",
      assignedFirm: "NA",
      distributorCode: "",
      stockistCode: "",
      customerCode: "",
      firstLevelManager: "",
      secondLevelManager: "",
      thirdLevelManager: "",
      dob: "NA",
      pan: "",
      drugLicense: "",
      foodLicense: "",
      approxBusiness: "",
      associatedDoctors: "NA",
      additionalDivision: "",
      attachments: ["View"],
    },
  });

  const watchType = watch("type");
  const watchStatus = watch("status");

  // Effect to load editing stockist values into form
  React.useEffect(() => {
    if (editingStockist) {
      reset({
        name: editingStockist.name || "",
        code: editingStockist.code || "",
        type: editingStockist.type || "Stockist",
        contactPerson: editingStockist.contactPerson || "",
        email: editingStockist.email || "",
        phone: editingStockist.phone || "",
        address: editingStockist.address || "",
        city: editingStockist.city || "",
        territoryId: editingStockist.territoryId || "",
        zoneId: editingStockist.zoneId || "",
        creditLimit: editingStockist.creditLimit || 0,
        outstandingAmount: editingStockist.outstandingAmount || 0,
        status: editingStockist.status || "active",
        date: editingStockist.date || "",
        addDate: editingStockist.addDate || "",
        zone: editingStockist.zone || "",
        division: editingStockist.division || "",
        category: editingStockist.category || "",
        employeeAssigned: editingStockist.employeeAssigned || "",
        assignedFirm: editingStockist.assignedFirm || "NA",
        distributorCode: editingStockist.distributorCode || "",
        stockistCode: editingStockist.stockistCode || "",
        customerCode: editingStockist.customerCode || "",
        firstLevelManager: editingStockist.firstLevelManager || "",
        secondLevelManager: editingStockist.secondLevelManager || "",
        thirdLevelManager: editingStockist.thirdLevelManager || "",
        dob: editingStockist.dob || "NA",
        pan: editingStockist.pan || "",
        drugLicense: editingStockist.drugLicense || "",
        foodLicense: editingStockist.foodLicense || "",
        approxBusiness: editingStockist.approxBusiness || "",
        associatedDoctors: editingStockist.associatedDoctors || "NA",
        additionalDivision: editingStockist.additionalDivision || "",
        attachments: editingStockist.attachments || ["View"],
      });
    } else {
      reset({
        name: "",
        code: "",
        type: "Stockist",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        territoryId: "",
        zoneId: "",
        creditLimit: 0,
        outstandingAmount: 0,
        status: "active",
        date: "",
        addDate: "",
        zone: "",
        division: "",
        category: "",
        employeeAssigned: "",
        assignedFirm: "NA",
        distributorCode: "",
        stockistCode: "",
        customerCode: "",
        firstLevelManager: "",
        secondLevelManager: "",
        thirdLevelManager: "",
        dob: "NA",
        pan: "",
        drugLicense: "",
        foodLicense: "",
        approxBusiness: "",
        associatedDoctors: "NA",
        additionalDivision: "",
        attachments: ["View"],
      });
    }
  }, [editingStockist, reset]);

  const onSubmit = async (values: StockistFormValues) => {
    const dataToSave = {
      ...values,
      code: values.code || "",
      contactPerson: values.contactPerson || "",
      email: values.email || "",
      phone: values.phone || "",
      address: values.address || "",
      city: values.city || "",
      creditLimit: values.creditLimit || 0,
      outstandingAmount: values.outstandingAmount || 0,
      attachments: values.attachments || ["View"],
    };
    try {
      if (editingStockist) {
        await updateMutation.mutateAsync({ id: editingStockist.id, data: dataToSave });
        toast.success("Firm updated successfully");
      } else {
        await createMutation.mutateAsync(dataToSave);
        toast.success("Firm registered successfully");
      }
      setIsFormOpen(false);
      setEditingStockist(null);
      refetch();
    } catch {
      toast.error("Failed to save Firm details");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Firm?")) {
      // Typically we'd have a delete mutation, but since it is mock we can just simulate it or update stored local storage.
      const list = JSON.parse(localStorage.getItem("sefmed_sales_stockists") || "[]");
      const filtered = list.filter((s: any) => s.id !== id);
      localStorage.setItem("sefmed_sales_stockists", JSON.stringify(filtered));
      toast.success("Firm deleted successfully");
      refetch();
    }
  };

  // Perform client-side filtering matching the custom search controls row
  const filteredStockists = React.useMemo(() => {
    return stockists.filter((item) => {
      // 1. Search Query
      if (searchVal) {
        const q = searchVal.toLowerCase();
        // Exact city checkbox check
        if (searchExactCity) {
          if (item.city?.toLowerCase() !== q) return false;
        } else {
          const matchesQuery =
            item.name?.toLowerCase().includes(q) ||
            item.code?.toLowerCase().includes(q) ||
            item.contactPerson?.toLowerCase().includes(q) ||
            item.city?.toLowerCase().includes(q) ||
            item.id?.toLowerCase().includes(q);
          if (!matchesQuery) return false;
        }
      }

      // 2. Search exact city option when city filter is selected and checkbox checked
      if (searchExactCity && selectedCity && selectedCity !== "all") {
        if (item.city !== selectedCity) return false;
      }

      // 3. Dropdown Filters
      if (selectedType && selectedType !== "all" && item.type !== selectedType) return false;
      if (selectedStatus && selectedStatus !== "all") {
        // active maps to Approved, inactive maps to Unapproved
        const mappedStatus = selectedStatus === "active" ? "active" : "inactive";
        if (item.status !== mappedStatus) return false;
      }
      if (selectedDivision && selectedDivision !== "all" && item.division !== selectedDivision) return false;
      if (selectedZone && selectedZone !== "all" && item.zone !== selectedZone) return false;
      if (selectedCity && selectedCity !== "all" && !searchExactCity && item.city !== selectedCity) return false;
      if (selectedEmployee && selectedEmployee !== "all" && item.employeeAssigned !== selectedEmployee) return false;
      if (selectedManager && selectedManager !== "all") {
        if (
          item.firstLevelManager !== selectedManager &&
          item.secondLevelManager !== selectedManager &&
          item.thirdLevelManager !== selectedManager
        ) {
          return false;
        }
      }
      if (selectedAssignedFirm && selectedAssignedFirm !== "all" && item.assignedFirm !== selectedAssignedFirm) return false;

      return true;
    });
  }, [
    stockists,
    searchVal,
    searchExactCity,
    selectedType,
    selectedStatus,
    selectedDivision,
    selectedZone,
    selectedCity,
    selectedEmployee,
    selectedManager,
    selectedAssignedFirm,
  ]);

  // Compute counters
  const approvedCount = React.useMemo(() => {
    return stockists.filter((s) => s.status === "active").length;
  }, [stockists]);

  const unapprovedCount = React.useMemo(() => {
    return stockists.filter((s) => s.status === "inactive").length;
  }, [stockists]);

  // Export to CSV
  const handleExport = () => {
    if (filteredStockists.length === 0) {
      toast.error("No data available to export");
      return;
    }
    const headers = [
      "Firm Id",
      "Date",
      "Firm Code",
      "Firm Add Date",
      "Firm Name",
      "Firm Type",
      "Contact Number",
      "Name of contact person",
      "City",
      "Zone",
      "Division",
      "Firm Category",
      "Employee Assigned",
      "Assigned Firm",
      "Email",
      "Distributor Code",
      "Stockist Code",
      "Customer Code",
      "Address",
      "First Level Manager",
      "Second Level Manager",
      "Third Level Manager",
      "Date Of Birth",
      "PAN Number",
      "Drug License Number",
      "Food License Number",
      "Approx Business",
      "Associated Doctors",
      "Additional Division",
      "Status",
    ];

    const rows = filteredStockists.map((f) => [
      f.id,
      f.date || "",
      f.code || "",
      f.addDate || "",
      f.name || "",
      f.type || "",
      f.phone || "",
      f.contactPerson || "",
      f.city || "",
      f.zone || "",
      f.division || "",
      f.category || "",
      f.employeeAssigned || "",
      f.assignedFirm || "",
      f.email || "",
      f.distributorCode || "",
      f.stockistCode || "",
      f.customerCode || "",
      f.address || "",
      f.firstLevelManager || "",
      f.secondLevelManager || "",
      f.thirdLevelManager || "",
      f.dob || "",
      f.pan || "",
      f.drugLicense || "",
      f.foodLicense || "",
      f.approxBusiness || "",
      f.associatedDoctors || "",
      f.additionalDivision || "",
      f.status === "active" ? "Approved" : "Unapproved",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Firms_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully");
  };

  // Import mock handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      toast.info(`Selected file: ${file.name}`);
    }
  };

  const handleImport = () => {
    if (!selectedFileName) {
      toast.error("Please select a file to import");
      return;
    }
    toast.success(`Successfully imported firms from ${selectedFileName}`);
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Top Breadcrumb and Header Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Home</span>
            <span>/</span>
            <span>Sales</span>
            <span>/</span>
            <span className="text-foreground font-semibold">Firms</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
            Firms <Settings className="h-5 w-5 text-slate-400 cursor-pointer hover:text-slate-600 spin-on-hover" />
          </h1>
        </div>

        {/* Counter strip */}
        <div className="flex items-center gap-3 bg-slate-50 border rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
          <span>Approved : <span className="text-emerald-600 font-bold">{approvedCount}</span></span>
          <span className="text-slate-300">|</span>
          <span>Unapproved : <span className="text-orange-500 font-bold">{unapprovedCount}</span></span>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg border shadow-sm">
        <RequirePermission permission={PERMISSIONS.STOCKIST_MANAGE}>
          <Button
            onClick={() => {
              setEditingStockist(null);
              setActiveTab("general");
              setIsFormOpen(true);
            }}
            className="bg-[#008272] hover:bg-[#006e60] text-white gap-1.5 h-9 font-semibold"
          >
            <Plus className="h-4 w-4" /> Add Firm
          </Button>
        </RequirePermission>

        <Button
          variant="outline"
          onClick={() => toast.info("Advanced filters toggled. Use the secondary filter bar below.")}
          className="border-[#008272] text-[#008272] hover:bg-[#008272]/5 gap-1.5 h-9 font-semibold"
        >
          Advance Filters
        </Button>

        <Button
          onClick={() => toast.info("Opening Add Visit Form...")}
          className="bg-[#008272] hover:bg-[#006e60] text-white gap-1.5 h-9 font-semibold"
        >
          <Plus className="h-4 w-4" /> Add Visit
        </Button>

        <Button
          onClick={handleExport}
          className="bg-[#008272] hover:bg-[#006e60] text-white gap-1.5 h-9 font-semibold"
        >
          <Download className="h-4 w-4" /> Export
        </Button>

        {/* File Import elements */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="flex items-center justify-center h-9 border border-slate-300 px-3 py-1.5 rounded-md cursor-pointer hover:bg-slate-50 text-xs font-semibold text-slate-600 gap-1.5">
            <FileUp className="h-4 w-4 text-[#008272]" />
            <span>{selectedFileName ? selectedFileName : "Select file"}</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.xlsx"
              className="hidden"
            />
          </label>
          <Button
            onClick={handleImport}
            className="bg-[#008272] hover:bg-[#006e60] text-white text-xs h-9 px-3 font-semibold"
          >
            Import
          </Button>

          {/* Green download/upload button icons */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => toast.info("Downloading file template...")}
            className="border-emerald-500 hover:bg-emerald-50 text-emerald-600 h-9 w-9"
            title="Download Import Template"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => toast.info("Verifying sheet formats...")}
            className="border-emerald-500 hover:bg-emerald-50 text-emerald-600 h-9 w-9"
            title="Upload Sheet Validation"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Dropdowns Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2 lg:col-span-1 border-r pr-2 h-10">
          <Checkbox
            id="exactCity"
            checked={searchExactCity}
            onCheckedChange={(c) => setSearchExactCity(!!c)}
          />
          <Label htmlFor="exactCity" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
            Search Exact City
          </Label>
        </div>

        {/* Type select */}
        <UiSelect value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-xs">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select Type</SelectItem>
            <SelectItem value="Company">Company</SelectItem>
            <SelectItem value="Stockist">Stockist</SelectItem>
            <SelectItem value="Super Stockist">Super Stockist</SelectItem>
            <SelectItem value="Sub Stockist">Sub Stockist</SelectItem>
            {uniqueTypes.filter(t => !["Company", "Stockist", "Super Stockist", "Sub Stockist"].includes(t)).map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </UiSelect>

        {/* Status select */}
        <UiSelect value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-xs">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select Status</SelectItem>
            <SelectItem value="active">Approved</SelectItem>
            <SelectItem value="inactive">Unapproved</SelectItem>
          </SelectContent>
        </UiSelect>

        {/* Division select */}
        <UiSelect value={selectedDivision} onValueChange={setSelectedDivision}>
          <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-xs">
            <SelectValue placeholder="Select Division" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select Division</SelectItem>
            {uniqueDivisions.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </UiSelect>

        {/* Zone select */}
        <UiSelect value={selectedZone} onValueChange={setSelectedZone}>
          <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-xs">
            <SelectValue placeholder="Select Zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select Zone</SelectItem>
            {uniqueZones.map((z) => (
              <SelectItem key={z} value={z}>{z}</SelectItem>
            ))}
          </SelectContent>
        </UiSelect>

        {/* City select */}
        <UiSelect value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-xs">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select City</SelectItem>
            {uniqueCities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </UiSelect>

        {/* Employee select */}
        <UiSelect value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-xs">
            <SelectValue placeholder="Select Employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select Employee</SelectItem>
            {uniqueEmployees.map((e) => (
              <SelectItem key={e} value={e}>{e}</SelectItem>
            ))}
          </SelectContent>
        </UiSelect>

        {/* Manager select */}
        <UiSelect value={selectedManager} onValueChange={setSelectedManager}>
          <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-xs">
            <SelectValue placeholder="Select Manager" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select Manager</SelectItem>
            {uniqueManagers.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </UiSelect>

        {/* Assigned Firm select */}
        <UiSelect value={selectedAssignedFirm} onValueChange={setSelectedAssignedFirm}>
          <SelectTrigger className="h-10 bg-slate-50 border-slate-200 text-xs">
            <SelectValue placeholder="Select Assigned..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Select Assigned...</SelectItem>
            {uniqueAssignedFirms.map((af) => (
              <SelectItem key={af} value={af}>{af}</SelectItem>
            ))}
          </SelectContent>
        </UiSelect>

        {/* Search Input and Go Button */}
        <div className="flex gap-2 lg:col-span-2">
          <Input
            value={typedSearch}
            onChange={(e) => setTypedSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setSearchVal(typedSearch);
            }}
            placeholder="Search..."
            className="h-10 bg-white border-slate-200 text-xs"
          />
          <Button
            onClick={() => setSearchVal(typedSearch)}
            className="bg-[#008272] hover:bg-[#006e60] text-white h-10 px-4 font-bold"
          >
            Go
          </Button>
        </div>
      </div>

      {/* Main Table View Container */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
        {/* Scroll wrapper */}
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left border-collapse min-w-[3200px]">
            <thead>
              <tr className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b">
                <th className="py-3.5 px-4 sticky left-0 bg-slate-50 border-r w-20 text-center z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">Actions</th>
                <th className="py-3.5 px-4 border-r w-20">Firm Id</th>
                <th className="py-3.5 px-4 border-r">Date</th>
                <th className="py-3.5 px-4 border-r">Firm Code</th>
                <th className="py-3.5 px-4 border-r">Firm Add Date</th>
                <th className="py-3.5 px-4 border-r">Firm Name</th>
                <th className="py-3.5 px-4 border-r">Firm Type</th>
                <th className="py-3.5 px-4 border-r">Contact Number</th>
                <th className="py-3.5 px-4 border-r">Name of contact person</th>
                <th className="py-3.5 px-4 border-r">City</th>
                <th className="py-3.5 px-4 border-r">Zone</th>
                <th className="py-3.5 px-4 border-r">Division</th>
                <th className="py-3.5 px-4 border-r">Firm Category</th>
                <th className="py-3.5 px-4 border-r">Employee Assigned</th>
                <th className="py-3.5 px-4 border-r">Assigned Firm</th>
                <th className="py-3.5 px-4 border-r">Email</th>
                <th className="py-3.5 px-4 border-r">Distributor Code</th>
                <th className="py-3.5 px-4 border-r">Stockist Code</th>
                <th className="py-3.5 px-4 border-r">Customer Code</th>
                <th className="py-3.5 px-4 border-r">Address</th>
                <th className="py-3.5 px-4 border-r">First Level Manager</th>
                <th className="py-3.5 px-4 border-r">Second Level Manager</th>
                <th className="py-3.5 px-4 border-r">Third Level Manager</th>
                <th className="py-3.5 px-4 border-r">Date Of Birth</th>
                <th className="py-3.5 px-4 border-r">PAN Number</th>
                <th className="py-3.5 px-4 border-r">Drug License Number</th>
                <th className="py-3.5 px-4 border-r">Food License Number</th>
                <th className="py-3.5 px-4 border-r">Approx Business</th>
                <th className="py-3.5 px-4 border-r">Associated Doctors</th>
                <th className="py-3.5 px-4 border-r">Additional Division</th>
                <th className="py-3.5 px-4 border-r w-28 text-center">Status</th>
                <th className="py-3.5 px-4 w-32 text-center">Attachments</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={32} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/50">
                    <div className="flex flex-col items-center gap-2 justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#008272] border-t-transparent" />
                      <span>Loading Firms directory data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStockists.length === 0 ? (
                <tr>
                  <td colSpan={32} className="py-16 text-center text-slate-400 font-semibold bg-slate-50/50">
                    No Firms matching your filter options were found.
                  </td>
                </tr>
              ) : (
                filteredStockists.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 border-b align-middle transition-colors">
                    {/* Actions Column */}
                    <td className="py-2.5 px-4 border-r sticky left-0 bg-white group-hover:bg-slate-50 border-b text-center z-10 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-[#008272] hover:bg-[#006e60] text-white h-7 px-2 font-medium flex items-center gap-1 text-[10px] rounded"
                          >
                            <Settings className="h-3 w-3" />
                            <span>▼</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-28 bg-white border shadow-md rounded">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingStockist(item);
                              setIsFormOpen(true);
                            }}
                            className="cursor-pointer hover:bg-slate-100 flex items-center gap-1.5 py-1.5 px-2.5 text-xs text-slate-700"
                          >
                            <Edit className="h-3.5 w-3.5 text-slate-500" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="cursor-pointer hover:bg-red-50 text-red-600 flex items-center gap-1.5 py-1.5 px-2.5 text-xs"
                          >
                            <Trash className="h-3.5 w-3.5 text-red-500" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>

                    {/* Meta Columns */}
                    <td className="py-2.5 px-4 border-r font-semibold text-slate-800">{item.id}</td>
                    <td className="py-2.5 px-4 border-r text-slate-500">{item.date || "-"}</td>
                    <td className="py-2.5 px-4 border-r font-mono font-medium text-slate-700">{item.code || "-"}</td>
                    <td className="py-2.5 px-4 border-r text-slate-500">{item.addDate || "-"}</td>
                    <td className="py-2.5 px-4 border-r font-semibold text-slate-900 min-w-[180px]">{item.name}</td>
                    <td className="py-2.5 px-4 border-r text-slate-800 font-medium">{item.type}</td>
                    <td className="py-2.5 px-4 border-r">{item.phone || "-"}</td>
                    <td className="py-2.5 px-4 border-r text-slate-800">{item.contactPerson || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.city || "-"}</td>
                    <td className="py-2.5 px-4 border-r min-w-[120px]">{item.zone || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.division || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.category || "-"}</td>
                    <td className="py-2.5 px-4 border-r font-medium text-slate-700">{item.employeeAssigned || "-"}</td>
                    <td className="py-2.5 px-4 border-r text-slate-700">{item.assignedFirm || "-"}</td>
                    <td className="py-2.5 px-4 border-r text-slate-500">{item.email || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.distributorCode || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.stockistCode || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.customerCode || "-"}</td>
                    <td className="py-2.5 px-4 border-r min-w-[200px] truncate max-w-xs">{item.address || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.firstLevelManager || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.secondLevelManager || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.thirdLevelManager || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.dob || "-"}</td>
                    <td className="py-2.5 px-4 border-r font-mono">{item.pan || "-"}</td>
                    <td className="py-2.5 px-4 border-r font-mono">{item.drugLicense || "-"}</td>
                    <td className="py-2.5 px-4 border-r font-mono">{item.foodLicense || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.approxBusiness || "-"}</td>
                    <td className="py-2.5 px-4 border-r min-w-[150px] truncate max-w-xs">{item.associatedDoctors || "-"}</td>
                    <td className="py-2.5 px-4 border-r">{item.additionalDivision || "-"}</td>

                    {/* Status badge */}
                    <td className="py-2.5 px-4 border-r text-center">
                      {item.status === "active" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#10b981] text-white">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500 text-white">
                          Unapprove
                        </span>
                      )}
                    </td>

                    {/* Attachments view */}
                    <td className="py-2.5 px-4 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.info(`Viewing attachments for ${item.name}`)}
                        className="h-7 text-xs bg-[#008272] text-white hover:bg-[#006e60] hover:text-white px-2.5 py-1 rounded inline-flex items-center gap-1 font-semibold"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[92vh] overflow-y-auto bg-white p-6 rounded-lg shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader className="border-b pb-3">
              <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#008272]" />
                {editingStockist ? `Edit Firm: ${editingStockist.name}` : "Register New Firm"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Configure basic profiles, categories, licensing credentials, and management assignments.
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 bg-slate-100 rounded-md p-1 mb-5">
                <TabsTrigger value="general" className="text-xs font-semibold py-1.5 flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" /> Profile
                </TabsTrigger>
                <TabsTrigger value="contact" className="text-xs font-semibold py-1.5 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> Contacts
                </TabsTrigger>
                <TabsTrigger value="accounting" className="text-xs font-semibold py-1.5 flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5" /> Accounts
                </TabsTrigger>
                <TabsTrigger value="extra" className="text-xs font-semibold py-1.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Licensing
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: General Info */}
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Firm Name *</Label>
                    <Input placeholder="e.g. Apex Drug House" {...register("name")} className="text-xs h-9 bg-slate-50/50" />
                    {errors.name && <p className="text-[10px] text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Firm Code</Label>
                    <Input placeholder="e.g. APEX01" {...register("code")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Firm Type *</Label>
                    <UiSelect value={watchType} onValueChange={(v) => setValue("type", v)}>
                      <SelectTrigger className="h-9 bg-slate-50/50 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Company">Company</SelectItem>
                        <SelectItem value="Stockist">Stockist</SelectItem>
                        <SelectItem value="Super Stockist">Super Stockist</SelectItem>
                        <SelectItem value="Sub Stockist">Sub Stockist</SelectItem>
                      </SelectContent>
                    </UiSelect>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Status *</Label>
                    <UiSelect value={watchStatus} onValueChange={(v) => setValue("status", v as "active" | "inactive")}>
                      <SelectTrigger className="h-9 bg-slate-50/50 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Approved</SelectItem>
                        <SelectItem value="inactive">Unapproved</SelectItem>
                      </SelectContent>
                    </UiSelect>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Approx Business</Label>
                    <Input placeholder="e.g. 50,000" {...register("approxBusiness")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Registration Date</Label>
                    <Input type="date" {...register("date")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Firm Add Date</Label>
                    <Input type="date" {...register("addDate")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Contact Info */}
              <TabsContent value="contact" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold">Contact Person Name</Label>
                    <Input placeholder="e.g. Rajesh Kumar" {...register("contactPerson")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Contact Number</Label>
                    <Input placeholder="10-digit number" {...register("phone")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Email Address</Label>
                  <Input type="email" placeholder="email@stockist.com" {...register("email")} className="text-xs h-9 bg-slate-50/50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Address</Label>
                    <Input placeholder="Street/building" {...register("address")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">City</Label>
                    <Input placeholder="e.g. Raipur" {...register("city")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Zone</Label>
                    <Input placeholder="e.g. Chhattisgarh" {...register("zone")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Division</Label>
                    <Input placeholder="e.g. DERMA" {...register("division")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Additional Division</Label>
                    <Input placeholder="e.g. CARDIO" {...register("additionalDivision")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 3: Accounting & Management */}
              <TabsContent value="accounting" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Distributor Code</Label>
                    <Input placeholder="DIST-01" {...register("distributorCode")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Stockist Code</Label>
                    <Input placeholder="ST-01" {...register("stockistCode")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Customer Code</Label>
                    <Input placeholder="CUST-01" {...register("customerCode")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Firm Category</Label>
                    <Input placeholder="e.g. General" {...register("category")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Employee Assigned</Label>
                    <Input placeholder="e.g. Amarjeet Singh" {...register("employeeAssigned")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Assigned Firm</Label>
                    <Input placeholder="e.g. Teqmed Pharma LLP" {...register("assignedFirm")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t pt-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">First Level Manager</Label>
                    <Input placeholder="Level 1 Manager" {...register("firstLevelManager")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Second Level Manager</Label>
                    <Input placeholder="Level 2 Manager" {...register("secondLevelManager")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Third Level Manager</Label>
                    <Input placeholder="Level 3 Manager" {...register("thirdLevelManager")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Credit Limit (₹)</Label>
                    <Input type="number" {...register("creditLimit", { valueAsNumber: true })} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Opening/Outstanding Balance (₹)</Label>
                    <Input type="number" disabled={!!editingStockist} {...register("outstandingAmount", { valueAsNumber: true })} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 4: Licensing & Dates */}
              <TabsContent value="extra" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">PAN Number</Label>
                    <Input placeholder="ABCDE1234F" {...register("pan")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Date Of Birth</Label>
                    <Input placeholder="YYYY-MM-DD or NA" {...register("dob")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Drug License Number</Label>
                    <Input placeholder="DL-12345" {...register("drugLicense")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Food License Number</Label>
                    <Input placeholder="FL-12345" {...register("foodLicense")} className="text-xs h-9 bg-slate-50/50" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Associated Doctors</Label>
                  <Input placeholder="Dr. A, Dr. B (comma separated) or NA" {...register("associatedDoctors")} className="text-xs h-9 bg-slate-50/50" />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="border-t pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="h-9 text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#008272] hover:bg-[#006e60] text-white h-9 px-5 text-xs font-bold"
              >
                {editingStockist ? "Save Changes" : "Register Firm"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

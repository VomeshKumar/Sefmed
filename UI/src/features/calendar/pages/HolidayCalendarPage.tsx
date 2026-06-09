import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Plus,
  Edit,
  Trash2,
  Download,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  useHolidaysList,
  useCreateHoliday,
  useUpdateHoliday,
  useDeleteHoliday,
} from "../hooks";
import { createHolidaySchema, type HolidayFormValues } from "../schemas";
import type { Holiday, HolidayType } from "../types";
import { cn } from "@/lib/utils";

// Format date to DD/MM/YYYY
const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
};

// Beautiful vector illustration for "No Record Found"
function NoRecordFoundIllustration() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 w-full">
      <div className="relative w-full max-w-[400px] h-[240px]">
        <svg viewBox="0 0 400 240" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Floating Warning Sign */}
          <g transform="translate(320, 160)">
            <path d="M12 2 L22 20 L2 20 Z" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" />
            <text x="12" y="17" fill="#d97706" fontSize="11" fontWeight="bold" textAnchor="middle">!</text>
          </g>
          {/* Floating Document */}
          <g transform="translate(60, 40)">
            <rect width="20" height="26" rx="2" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="4" y1="6" x2="16" y2="6" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="4" y1="11" x2="12" y2="11" stroke="#3b82f6" strokeWidth="1.5" />
            <line x1="4" y1="16" x2="16" y2="16" stroke="#3b82f6" strokeWidth="1.5" />
          </g>
          {/* Floating Checkbox */}
          <g transform="translate(300, 40)">
            <rect width="18" height="18" rx="3" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
            <path d="M4 9 L8 12 L14 5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {/* Floating Folder */}
          <g transform="translate(190, 40)">
            <rect x="0" y="3" width="24" height="18" rx="2" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M0 3 L8 3 L11 6 L24 6" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
          </g>
          {/* Floating Cancel Symbol */}
          <g transform="translate(150, 120)">
            <circle cx="10" cy="10" r="9" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5" />
            <line x1="7" y1="7" x2="13" y2="13" stroke="#ef4444" strokeWidth="1.5" />
            <line x1="13" y1="7" x2="7" y2="13" stroke="#ef4444" strokeWidth="1.5" />
          </g>
          {/* Floating Hashtag */}
          <g transform="translate(270, 100)">
            <text x="0" y="15" fill="#cbd5e1" fontSize="20" fontWeight="bold">#</text>
          </g>
          
          {/* Plants */}
          <g transform="translate(35, 140)">
            <path d="M10 45 C5 25, 2 15, 10 0 C18 15, 15 25, 10 45 Z" fill="#34d399" />
            <path d="M20 45 C16 30, 13 20, 18 8 C23 20, 20 30, 20 45 Z" fill="#10b981" />
            <path d="M-2 45 C-5 30, -8 20, -5 12 C-2 20, -2 30, -2 45 Z" fill="#059669" />
            <ellipse cx="10" cy="46" rx="12" ry="3" fill="#a7f3d0" />
          </g>
          <g transform="translate(345, 150)">
            <path d="M8 35 C4 20, 2 12, 8 0 C14 12, 12 20, 8 35 Z" fill="#34d399" />
            <path d="M16 35 C13 24, 10 16, 14 6 C18 16, 15 24, 16 35 Z" fill="#10b981" />
            <ellipse cx="8" cy="36" rx="10" ry="2" fill="#a7f3d0" />
          </g>
          
          {/* Desk */}
          <rect x="110" y="170" width="180" height="5" rx="2" fill="#cbd5e1" />
          <line x1="135" y1="175" x2="135" y2="230" stroke="#94a3b8" strokeWidth="4" />
          <line x1="265" y1="175" x2="265" y2="230" stroke="#94a3b8" strokeWidth="4" />
          
          {/* Laptop / Monitor */}
          <rect x="220" y="120" width="54" height="38" rx="2" fill="#64748b" />
          <rect x="223" y="123" width="48" height="28" fill="#f1f5f9" />
          {/* Screen lines */}
          <line x1="227" y1="129" x2="245" y2="129" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="227" y1="134" x2="255" y2="134" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="227" y="139" width="8" height="8" fill="#93c5fd" />
          <line x1="239" y1="141" x2="261" y2="141" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="239" y1="145" x2="253" y2="145" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Monitor stand */}
          <path d="M243 158 L251 158 L256 170 L238 170 Z" fill="#475569" />
          
          {/* Mug & Keyboard */}
          <rect x="165" y="162" width="7" height="8" rx="1" fill="#fca5a5" />
          <path d="M165 164 C163 164, 163 168, 165 168" stroke="#fca5a5" strokeWidth="1.5" fill="none" />
          <rect x="180" y="167" width="30" height="3" rx="1" fill="#94a3b8" />
          
          {/* Person */}
          <g transform="translate(130, 110)">
            {/* Chair back */}
            <path d="M12 60 L2 30 C0 25, 4 18, 12 22 L16 26 Z" fill="#1e293b" />
            {/* Body */}
            <path d="M28 60 C24 40, 28 32, 42 32 C56 32, 60 40, 56 60 Z" fill="#475569" />
            {/* Shirt */}
            <path d="M26 60 L58 60 L52 38 C48 34, 38 34, 34 38 Z" fill="#64748b" />
            {/* Head */}
            <circle cx="43" cy="20" r="10" fill="#fed7aa" />
            <path d="M33 16 C33 8, 53 8, 53 16" fill="#1e293b" stroke="#1e293b" strokeWidth="2" />
            {/* Shrugging Arms */}
            <path d="M30 38 Q10 35, -4 48 Q-8 52, -1 56 Q8 48, 28 41" fill="#64748b" />
            <circle cx="-4" cy="48" r="3" fill="#fed7aa" />
            
            <path d="M54 38 Q74 35, 88 48 Q92 52, 85 56 Q76 48, 56 41" fill="#64748b" />
            <circle cx="88" cy="48" r="3" fill="#fed7aa" />
          </g>
          
          {/* Speech Bubble */}
          <g transform="translate(220, 70)">
            <rect width="84" height="40" rx="8" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M15 40 L20 46 L25 40 Z" fill="white" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M16 39.5 L24 39.5" stroke="white" strokeWidth="2" />
            <text x="42" y="16" fill="#0f172a" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">No Record!</text>
            <text x="42" y="29" fill="#0f172a" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Found</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

export function HolidayCalendarPage() {
  const [activeTab, setActiveTab] = React.useState<"holiday" | "work" | "restricted">("holiday");
  const [zoneFilter, setZoneFilter] = React.useState<string>("All");
  const [search, setSearch] = React.useState("");
  
  // Sorting state
  const [sortField, setSortField] = React.useState<"zone" | "date" | "name">("date");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  // File import state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Holiday mutations & data
  const { data: holidays = [], refetch } = useHolidaysList({
    year: 2026,
    type: "all",
  });
  const createMutation = useCreateHoliday();
  const updateMutation = useUpdateHoliday();
  const deleteMutation = useDeleteHoliday();

  // Modal Dialogs state
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingHoliday, setEditingHoliday] = React.useState<Holiday | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Form setup for Holiday
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HolidayFormValues>({
    resolver: zodResolver(createHolidaySchema),
    defaultValues: {
      name: "",
      date: "",
      type: "regional",
      zone: "Chhattisgarh",
      employeeName: "",
      description: "",
      year: 2026,
    },
  });

  const watchType = watch("type");
  const watchZone = watch("zone");

  // Reset form when editing changes
  React.useEffect(() => {
    if (editingHoliday) {
      reset({
        name: editingHoliday.name,
        date: editingHoliday.date,
        type: editingHoliday.type,
        zone: editingHoliday.zone || "Chhattisgarh",
        employeeName: editingHoliday.employeeName ?? "",
        description: editingHoliday.description ?? "",
        year: editingHoliday.year,
        applicableDivisions: editingHoliday.applicableDivisions ?? [],
      });
    } else {
      reset({
        name: "",
        date: "",
        type: activeTab === "restricted" ? "restricted" : "regional",
        zone: "Chhattisgarh",
        employeeName: "",
        description: "",
        year: 2026,
      });
    }
  }, [editingHoliday, isFormOpen, reset, activeTab]);

  // Handle Add/Edit Form submit
  const onSubmitForm = async (values: HolidayFormValues) => {
    try {
      const payload = {
        ...values,
        type: activeTab === "restricted" ? "restricted" : values.type,
        year: new Date(values.date).getFullYear(),
        applicableDivisions: values.applicableDivisions ?? [],
      };
      if (editingHoliday) {
        await updateMutation.mutateAsync({ id: editingHoliday.id, data: payload });
        toast.success("Calendar entry updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Calendar entry added");
      }
      refetch();
      setIsFormOpen(false);
      setEditingHoliday(null);
    } catch {
      toast.error("Failed to save entry");
    }
  };

  // Handle delete click
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync(deletingId);
      toast.success("Calendar entry deleted");
      refetch();
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  // Filter datasets
  const activeDataset = React.useMemo(() => {
    if (activeTab === "restricted") {
      return holidays.filter((h) => h.type === "restricted");
    } else {
      // Holiday Calendar displays non-restricted holidays (national, regional, optional)
      return holidays.filter((h) => h.type !== "restricted");
    }
  }, [activeTab, holidays]);

  // Unique zones present in the active dataset for filtering
  const uniqueZones = React.useMemo(() => {
    const zones = new Set<string>();
    activeDataset.forEach((item) => {
      if (item.zone) zones.add(item.zone);
    });
    // Add default states if none found
    if (zones.size === 0) {
      ["Chhattisgarh", "Jharkhand", "Maharashtra", "Karnataka", "Madhya Pradesh", "Bihar", "Uttarpradesh", "ODISHA"].forEach(z => zones.add(z));
    }
    return Array.from(zones).sort();
  }, [activeDataset]);

  // Apply filters: Zone & Search text
  const filteredData = React.useMemo(() => {
    let result = [...activeDataset];

    // Zone Filter
    if (zoneFilter !== "All") {
      result = result.filter((item) => item.zone === zoneFilter);
    }

    // Search query (only used under Holiday tab)
    if (activeTab === "holiday" && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.zone && item.zone.toLowerCase().includes(q))
      );
    }

    // Sort result
    result.sort((a, b) => {
      if (sortField === "date") {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      }

      const valA = (a[sortField] || "").toString().toLowerCase();
      const valB = (b[sortField] || "").toString().toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [activeDataset, zoneFilter, search, sortField, sortOrder, activeTab]);

  // Paginated data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  // Sorting Handler
  const handleSort = (field: "zone" | "date" | "name") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // CSV Export Handler
  const handleCSVExport = () => {
    const filename =
      activeTab === "restricted"
        ? "restricted_holidays.csv"
        : "holiday_calendar.csv";

    const headers = activeTab === "restricted"
      ? ["Employee Name", "Zone", "Date", "Occasion"]
      : ["Zone", "Date", "Occasion"];

    const csvRows = [headers.join(",")];

    filteredData.forEach((item) => {
      const zone = `"${item.zone || ""}"`;
      const dateVal = formatDate(item.date);
      const name = `"${item.name || ""}"`;
      if (activeTab === "restricted") {
        const empName = `"${item.employeeName || ""}"`;
        csvRows.push([empName, zone, dateVal, name].join(","));
      } else {
        csvRows.push([zone, dateVal, name].join(","));
      }
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file exported successfully");
  };

  // CSV Import Handler
  const handleCSVImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        toast.error("CSV is empty or invalid");
        return;
      }

      const newItems: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
        if (parts.length >= 3) {
          // Determine indexes based on activeTab (Restricted has Employee Name column first)
          let zone = "";
          let rawDate = "";
          let occasion = "";
          let empName = "";

          if (activeTab === "restricted" && parts.length >= 4) {
            empName = parts[0];
            zone = parts[1];
            rawDate = parts[2];
            occasion = parts[3];
          } else {
            zone = parts[0];
            rawDate = parts[1];
            occasion = parts[2];
          }

          let isoDate = "";
          if (rawDate.includes("/")) {
            const [d, m, y] = rawDate.split("/");
            if (d && m && y) {
              isoDate = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
            }
          } else if (rawDate.includes("-")) {
            isoDate = rawDate;
          }

          if (zone && isoDate && occasion) {
            newItems.push({
              name: occasion,
              date: isoDate,
              zone,
              employeeName: empName,
              type: activeTab === "restricted" ? "restricted" : "regional",
              year: new Date(isoDate).getFullYear(),
            });
          }
        }
      }

      if (newItems.length === 0) {
        toast.error("No valid entries found in CSV");
        return;
      }

      for (const item of newItems) {
        await createMutation.mutateAsync({
          name: item.name,
          date: item.date,
          type: item.type,
          zone: item.zone,
          employeeName: item.employeeName,
          year: item.year,
          description: "Imported via CSV",
        });
      }
      refetch();
      toast.success(`Successfully imported ${newItems.length} entries`);

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  // Tour plan cards for Work Calendar
  const tourPlanCards = [
    {
      title: "Approve Tour Plan",
      description: "Approve & unlock tour plans of employees for the selected month.",
    },
    {
      title: "Add Tour Plan (Monthly)",
      description: "Add monthly tour plan for employee.",
    },
    {
      title: "Modify Tour Plan",
      description: "Revised Tour Plan worked only in case of Approved or Not Submitted.",
    },
    {
      title: "Deviation Approval",
      description: "Approve & deny tour plans deviation request of employee.",
    },
    {
      title: "View Tour Plan",
      description: "View the tour plans of the employees.",
    },
    {
      title: "Tour Plan Block/Unblock",
      description: "List of blocked employees Who have not submitted next month's tour plan before the submission day.",
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      <div>
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight mb-6">
          Holiday & Work Calendar
        </h1>

        {/* Tab Selection */}
        <div className="flex gap-6 border-b border-slate-200 mb-6">
          {["holiday", "work", "restricted"].map((tab) => {
            const isActive = activeTab === tab;
            const labels = {
              holiday: "Holiday Calendar",
              work: "Work Calendar",
              restricted: "Restricted holiday",
            };
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as any);
                  setZoneFilter("All");
                  setSearch("");
                  setCurrentPage(1);
                }}
                className={cn(
                  "pb-2.5 text-sm font-semibold transition-all relative outline-none cursor-pointer",
                  isActive
                    ? "text-[#008272] border-b-2 border-[#008272]"
                    : "text-[#008272]/70 hover:text-[#008272] hover:border-b-2 hover:border-[#008272]/30"
                )}
              >
                {labels[tab as keyof typeof labels]}
              </button>
            );
          })}
        </div>

        {/* Action Row */}
        {activeTab !== "work" && (
          <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
            {/* Add Button */}
            <RequirePermission permission={PERMISSIONS.MASTER_DATA_MANAGE}>
              <Button
                onClick={() => {
                  setEditingHoliday(null);
                  setIsFormOpen(true);
                }}
                className="bg-[#008272] hover:bg-[#006e60] text-white flex items-center gap-1.5 h-9 px-4 rounded-md font-semibold text-sm transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </RequirePermission>

            {/* Import / Export Controls (Only for Holiday Calendar tab) */}
            {activeTab === "holiday" && (
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md overflow-hidden h-9">
                  <input
                    type="text"
                    readOnly
                    value={selectedFile ? selectedFile.name : ""}
                    placeholder=""
                    className="px-3 py-1.5 text-xs text-slate-500 bg-transparent w-48 focus:outline-none placeholder-slate-400"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border-l border-slate-200 transition-colors h-full cursor-pointer"
                  >
                    Select file
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".csv"
                  className="hidden"
                />
                <Button
                  onClick={() => selectedFile && handleCSVImport(selectedFile)}
                  disabled={!selectedFile}
                  className={cn(
                    "h-9 px-4 text-sm font-semibold rounded-md transition-colors cursor-pointer",
                    selectedFile
                      ? "bg-[#008272] hover:bg-[#006e60] text-white"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  )}
                >
                  Import
                </Button>
                <Button
                  onClick={handleCSVExport}
                  className="bg-[#008272] hover:bg-[#006e60] text-white h-9 w-9 p-0 flex items-center justify-center rounded-md transition-colors cursor-pointer"
                  title="Export CSV"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Dynamic content area based on tab selection */}
        {activeTab === "work" ? (
          /* WORK CALENDAR: Tour Plan Cards */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {tourPlanCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-150 rounded-xl shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] transition-all overflow-hidden flex flex-col min-h-[145px]"
              >
                <div className="px-5 py-3.5 border-b border-slate-100 bg-[#f8fafc]">
                  <h3 className="font-bold text-base text-[#1e40af]">{card.title}</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* HOLIDAY & RESTRICTED HOLIDAY LIST VIEW */
          <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden mb-6">
            {/* Card Filters Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 flex-wrap gap-4">
              <div className="w-48">
                <UiSelect value={zoneFilter} onValueChange={(val) => { setZoneFilter(val); setCurrentPage(1); }}>
                  <SelectTrigger className="h-9 bg-white border-slate-200 text-slate-700 text-sm">
                    <SelectValue placeholder="All Zones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {uniqueZones.map((z) => (
                      <SelectItem key={z} value={z}>{z}</SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
              </div>
              {activeTab === "holiday" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 font-semibold">Search:</span>
                  <Input
                    type="search"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-48 h-9 bg-white border-slate-200 text-sm focus-visible:ring-1 focus-visible:ring-[#008272]"
                  />
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-50/50">
                    <th className="px-6 py-3 font-semibold text-slate-700 text-sm w-24">
                      <div className="flex items-center gap-1 cursor-pointer select-none">
                        Actions
                        <Filter className="h-3 w-3 text-blue-600" />
                      </div>
                    </th>
                    {activeTab === "restricted" && (
                      <th className="px-6 py-3 font-semibold text-slate-700 text-sm">
                        Employee Name
                      </th>
                    )}
                    <th className="px-6 py-3 font-semibold text-slate-700 text-sm">
                      <div
                        onClick={() => handleSort("zone")}
                        className="flex items-center gap-1 cursor-pointer select-none"
                      >
                        Zone
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-700 text-sm">
                      <div
                        onClick={() => handleSort("date")}
                        className="flex items-center gap-1 cursor-pointer select-none"
                      >
                        Date
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-700 text-sm">
                      <div
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 cursor-pointer select-none"
                      >
                        Occasion
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === "restricted" ? 5 : 4} className="p-0">
                        <NoRecordFoundIllustration />
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={cn(
                          "border-b border-slate-100 hover:bg-slate-50/40 transition-colors",
                          idx % 2 === 1 ? "bg-slate-50/20" : "bg-white"
                        )}
                      >
                        <td className="px-6 py-3">
                          <RequirePermission permission={PERMISSIONS.MASTER_DATA_MANAGE}>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingHoliday(item);
                                  setIsFormOpen(true);
                                }}
                                className="text-slate-400 hover:text-[#008272] transition-colors p-1"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeletingId(item.id);
                                  setIsDeleteOpen(true);
                                }}
                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </RequirePermission>
                        </td>
                        {activeTab === "restricted" && (
                          <td className="px-6 py-3 font-medium text-slate-800">
                            {item.employeeName || "All"}
                          </td>
                        )}
                        <td className="px-6 py-3 font-medium text-slate-800">{item.zone || "All"}</td>
                        <td className="px-6 py-3 font-medium text-slate-800">{formatDate(item.date)}</td>
                        <td className="px-6 py-3 font-medium text-slate-800">{item.name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            {filteredData.length > 0 && (
              <div className="flex justify-between items-center px-4 py-3.5 border-t border-slate-100 flex-wrap gap-4 text-xs font-semibold text-slate-500">
                <div>
                  Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
                </div>

                <div className="flex items-center gap-1 border border-slate-200 rounded overflow-hidden">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={cn(
                      "px-3 py-1.5 border-r border-slate-200 transition-colors cursor-pointer",
                      currentPage === 1
                        ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    &larr; Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, idx, arr) => {
                      const isCurrent = currentPage === p;
                      const showDots = idx > 0 && p - arr[idx - 1] > 1;
                      return (
                        <React.Fragment key={p}>
                          {showDots && <span className="px-2 text-slate-400 select-none">...</span>}
                          <button
                            onClick={() => setCurrentPage(p)}
                            className={cn(
                              "px-3 py-1.5 transition-colors cursor-pointer",
                              idx < arr.length - 1 ? "border-r border-slate-200" : "",
                              isCurrent
                                ? "bg-slate-100 text-slate-800 font-bold"
                                : "bg-white text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    })}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={cn(
                      "px-3 py-1.5 border-l border-slate-200 transition-colors cursor-pointer",
                      currentPage === totalPages
                        ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sefmed Premium Footer */}
      <footer className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-semibold">
        <div>2026 &copy; Sefmed &amp; Powered by Cuztomise</div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="h-8 w-8 bg-slate-600 hover:bg-slate-700 text-white flex items-center justify-center rounded shadow-sm transition-colors cursor-pointer"
          title="Scroll to Top"
        >
          <ChevronUp className="h-4.5 w-4.5" />
        </button>
      </footer>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {editingHoliday
                  ? `Edit ${activeTab === "restricted" ? "Restricted Holiday" : "Holiday"}`
                  : `Add ${activeTab === "restricted" ? "Restricted Holiday" : "Holiday"}`}
              </DialogTitle>
              <DialogDescription>
                Configure the calendar details for scheduling.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-1">
              {activeTab === "restricted" && (
                <div className="space-y-1.5">
                  <Label htmlFor="entry-emp-name">Employee Name</Label>
                  <Input id="entry-emp-name" placeholder="e.g. Rahul Sharma" {...register("employeeName")} />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="entry-name">Occasion / Name</Label>
                <Input id="entry-name" placeholder="e.g. Diwali" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="entry-date">Date</Label>
                  <Input id="entry-date" type="date" {...register("date")} />
                  {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="entry-zone">Zone</Label>
                  <UiSelect
                    value={watchZone}
                    onValueChange={(v) => setValue("zone", v)}
                  >
                    <SelectTrigger id="entry-zone" className="w-full bg-background border-slate-200">
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Chhattisgarh", "Jharkhand", "Maharashtra", "Karnataka", "Madhya Pradesh", "Bihar", "Uttarpradesh", "ODISHA", "West Bengal", "Gujarat", "Rajasthan", "Tamil Nadu", "Kerala", "Andhra Pradesh", "Telangana", "Punjab", "Haryana", "Delhi"].map((z) => (
                        <SelectItem key={z} value={z}>{z}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {activeTab !== "restricted" && (
                <div className="space-y-1.5">
                  <Label htmlFor="entry-type">Type</Label>
                  <UiSelect
                    value={watchType}
                    onValueChange={(v) => setValue("type", v as HolidayType)}
                  >
                    <SelectTrigger id="entry-type" className="w-full bg-background border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="regional">Regional</SelectItem>
                      <SelectItem value="optional">Optional</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </UiSelect>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="entry-desc">Description (optional)</Label>
                <Input id="entry-desc" placeholder="Brief description..." {...register("description")} />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#008272] hover:bg-[#006e60] text-white">
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this entry from the calendar? Field force planning will update accordingly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

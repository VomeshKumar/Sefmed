import * as React from "react";
import {
  Settings,
  ChevronDown,
  Check,
  Ban,
  Edit,
  Trash2,
} from "lucide-react";
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
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export interface SFCApproval {
  id: string;
  employeeName: string;
  routeName: string;
  city: string;
  distance: number;
  mode: string;
  fare: number;
  zone: string;
  division: string;
  status: "approved" | "unapproved";
}

const initialMockSfcApprovals: SFCApproval[] = [
  {
    id: "sfca-1",
    employeeName: "Anil Kumar Acharya",
    routeName: "KALINGANAGAR",
    city: "Khordha",
    distance: 60,
    mode: "BIKE",
    fare: 120,
    zone: "ODISHA",
    division: "DERMA",
    status: "unapproved",
  },
  {
    id: "sfca-2",
    employeeName: "Anil Kumar Acharya",
    routeName: "PATRAPADA",
    city: "Khordha",
    distance: 70,
    mode: "BIKE",
    fare: 140,
    zone: "ODISHA",
    division: "DERMA",
    status: "unapproved",
  },
  {
    id: "sfca-3",
    employeeName: "Anil Kumar Acharya",
    routeName: "RAGHUNATHPUR",
    city: "Khordha",
    distance: 70,
    mode: "BIKE",
    fare: 140,
    zone: "ODISHA",
    division: "DERMA",
    status: "unapproved",
  },
  {
    id: "sfca-4",
    employeeName: "Anil Kumar Acharya",
    routeName: "KHORDHA",
    city: "KHORDHA",
    distance: 90,
    mode: "BIKE",
    fare: 180,
    zone: "ODISHA",
    division: "DERMA",
    status: "unapproved",
  },
  {
    id: "sfca-5",
    employeeName: "Anil Kumar Acharya",
    routeName: "BALAKATI",
    city: "KHORDHA",
    distance: 120,
    mode: "BIKE",
    fare: 240,
    zone: "ODISHA",
    division: "DERMA",
    status: "unapproved",
  },
  {
    id: "sfca-6",
    employeeName: "Anil Kumar Acharya",
    routeName: "Cuttack Route",
    city: "Cuttack",
    distance: 50,
    mode: "CAR",
    fare: 400,
    zone: "ODISHA",
    division: "DERMA",
    status: "approved",
  },
  {
    id: "sfca-7",
    employeeName: "Bimal Patnaik",
    routeName: "Bhubaneswar Local",
    city: "Bhubaneswar",
    distance: 30,
    mode: "BIKE",
    fare: 60,
    zone: "ODISHA",
    division: "CARDIO",
    status: "unapproved",
  },
  {
    id: "sfca-8",
    employeeName: "Bimal Patnaik",
    routeName: "Puri Highway",
    city: "Puri",
    distance: 120,
    mode: "CAR",
    fare: 960,
    zone: "ODISHA",
    division: "CARDIO",
    status: "approved",
  },
  {
    id: "sfca-9",
    employeeName: "Sujit Das",
    routeName: "Balasore Local",
    city: "Balasore",
    distance: 40,
    mode: "BIKE",
    fare: 80,
    zone: "ODISHA",
    division: "GYNAEC",
    status: "unapproved",
  },
  {
    id: "sfca-10",
    employeeName: "Sujit Das",
    routeName: "Bhadrak Route",
    city: "Bhadrak",
    distance: 150,
    mode: "TRAIN",
    fare: 300,
    zone: "ODISHA",
    division: "GYNAEC",
    status: "approved",
  },
  {
    id: "sfca-11",
    employeeName: "Anil Kumar Acharya",
    routeName: "Puri Local",
    city: "Puri",
    distance: 80,
    mode: "BIKE",
    fare: 160,
    zone: "ODISHA",
    division: "DERMA",
    status: "unapproved",
  },
];

export function SFCApprovalPage() {
  // SFC Approvals List (persistent in localStorage)
  const [approvals, setApprovals] = React.useState<SFCApproval[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sefmed_sfc_approvals");
      return saved ? JSON.parse(saved) : initialMockSfcApprovals;
    }
    return initialMockSfcApprovals;
  });

  React.useEffect(() => {
    localStorage.setItem("sefmed_sfc_approvals", JSON.stringify(approvals));
  }, [approvals]);

  // Page Size & Search States
  const [pageSize, setPageSize] = React.useState("5");
  const [searchVal, setSearchVal] = React.useState("");

  // Edit / Delete Dialog States
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingApproval, setEditingApproval] = React.useState<SFCApproval | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // React Hook Form for Edit Route
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Omit<SFCApproval, "id" | "status">>({
    defaultValues: {
      employeeName: "",
      routeName: "",
      city: "",
      distance: 0,
      mode: "BIKE",
      fare: 0,
      zone: "ODISHA",
      division: "DERMA",
    },
  });

  React.useEffect(() => {
    if (editingApproval) {
      reset({
        employeeName: editingApproval.employeeName,
        routeName: editingApproval.routeName,
        city: editingApproval.city,
        distance: editingApproval.distance,
        mode: editingApproval.mode,
        fare: editingApproval.fare,
        zone: editingApproval.zone,
        division: editingApproval.division,
      });
    }
  }, [editingApproval, reset]);

  // Handle Edit Submit
  const onSubmitEdit = (values: Omit<SFCApproval, "id" | "status">) => {
    if (!editingApproval) return;
    setApprovals((prev) =>
      prev.map((app) =>
        app.id === editingApproval.id
          ? { ...app, ...values }
          : app
      )
    );
    toast.success("SFC approval route updated");
    setIsFormOpen(false);
    setEditingApproval(null);
  };

  // Toggle approval state
  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          toast.success(`SFC route approved for ${app.employeeName}`);
          return { ...app, status: "approved" };
        }
        return app;
      })
    );
  };

  const handleUnapprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          toast.success(`SFC route unapproved for ${app.employeeName}`);
          return { ...app, status: "unapproved" };
        }
        return app;
      })
    );
  };

  // Handle Delete
  const handleDelete = () => {
    if (!deletingId) return;
    setApprovals((prev) => prev.filter((app) => app.id !== deletingId));
    toast.success("SFC approval route deleted");
    setIsDeleteOpen(false);
    setDeletingId(null);
  };

  // Filter list matching the search text
  const filteredApprovals = React.useMemo(() => {
    return approvals.filter((app) => {
      if (!searchVal) return true;
      const query = searchVal.toLowerCase();
      return (
        app.employeeName.toLowerCase().includes(query) ||
        app.routeName.toLowerCase().includes(query) ||
        app.city.toLowerCase().includes(query) ||
        app.zone.toLowerCase().includes(query) ||
        app.division.toLowerCase().includes(query) ||
        app.mode.toLowerCase().includes(query)
      );
    });
  }, [approvals, searchVal]);

  const columns: Column<SFCApproval>[] = [
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
          <DropdownMenuContent align="start" className="bg-white border border-slate-100 shadow-md rounded-md p-1 min-w-[110px]">
            {item.status === "unapproved" ? (
              <DropdownMenuItem
                className="flex items-center gap-2 px-2 py-1.5 text-xs text-emerald-600 hover:bg-slate-50 rounded cursor-pointer"
                onClick={() => handleApprove(item.id)}
              >
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Approve
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="flex items-center gap-2 px-2 py-1.5 text-xs text-amber-600 hover:bg-slate-50 rounded cursor-pointer"
                onClick={() => handleUnapprove(item.id)}
              >
                <Ban className="h-3.5 w-3.5 text-amber-600" />
                Unapprove
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded cursor-pointer"
              onClick={() => {
                setEditingApproval(item);
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
      accessorKey: "employeeName",
      header: "Employee Name",
      sortable: true,
      cell: (item) => <span className="font-semibold text-slate-700">{item.employeeName}</span>,
    },
    {
      accessorKey: "routeName",
      header: "Route Name",
      sortable: true,
      cell: (item) => <span className="font-semibold text-slate-600">{item.routeName}</span>,
    },
    {
      accessorKey: "city",
      header: "City",
      cell: (item) => <span className="text-slate-600 text-xs">{item.city}</span>,
    },
    {
      accessorKey: "distance",
      header: "Distance",
      sortable: true,
      cell: (item) => <span className="nums-tabular text-sm text-slate-600">{item.distance}</span>,
    },
    {
      accessorKey: "mode",
      header: "Mode",
      cell: (item) => <span className="text-xs font-bold tracking-wide text-slate-500">{item.mode}</span>,
    },
    {
      accessorKey: "fare",
      header: "Fare",
      sortable: true,
      cell: (item) => <span className="nums-tabular text-sm font-semibold text-slate-600">{item.fare}</span>,
    },
    {
      accessorKey: "zone",
      header: "Zone",
      cell: (item) => <span className="text-slate-600 text-xs">{item.zone}</span>,
    },
    {
      accessorKey: "division",
      header: "Division",
      cell: (item) => <span className="text-slate-600 text-xs">{item.division}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      sortable: true,
      cell: (item) => (
        <span
          className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded border transition-colors ${
            item.status === "approved"
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "bg-amber-500 border-amber-500 text-white"
          }`}
        >
          {item.status === "approved" ? "Approved" : "Unapprove"}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      <div>
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">
          SFC Approval
        </h1>

        {/* Card Container */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 mb-6">
          {/* Card Toolbar Row */}
          <div className="flex flex-wrap gap-2.5 items-center pb-4 border-b border-slate-100 mb-4">
            
            {/* Page Size Select */}
            <div className="flex items-center gap-1.5">
              <UiSelect value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="w-18 bg-white border-slate-200 text-slate-700 text-xs h-9 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </UiSelect>
              <span className="text-slate-500 text-xs font-semibold">per page</span>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-slate-500 text-xs font-semibold">Search:</span>
              <Input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-44 bg-white border-slate-200 text-slate-700 text-xs h-9"
              />
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={filteredApprovals}
            getRowId={(item) => item.id}
          />
        </div>
      </div>

      {/* Sefmed Premium Footer */}
      <footer className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-semibold">
        <div>2026 &copy; Sefmed &amp; Powered by Cuztomise</div>
      </footer>

      {/* Edit Dialog Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit SFC Route Details</DialogTitle>
              <DialogDescription>
                Modify details of the employee's standard fare route for reimbursement.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-1">
              <div className="space-y-1.5">
                <Label>Employee Name</Label>
                <Input {...register("employeeName")} />
              </div>
              <div className="space-y-1.5">
                <Label>Route Name</Label>
                <Input {...register("routeName")} />
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input {...register("city")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Distance (km)</Label>
                  <Input type="number" {...register("distance", { valueAsNumber: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Mode</Label>
                  <Input {...register("mode")} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Fare (₹)</Label>
                  <Input type="number" {...register("fare", { valueAsNumber: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Zone</Label>
                  <Input {...register("zone")} />
                </div>
                <div className="space-y-1.5">
                  <Label>Division</Label>
                  <Input {...register("division")} />
                </div>
              </div>
            </div>

            <DialogFooter className="bg-slate-50 border-t px-6 py-4 -mx-6 -mb-6 rounded-b-lg">
              <Button type="button" variant="outline" className="cursor-pointer" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#008272] hover:bg-[#006e60] text-white cursor-pointer">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Delete SFC Approval Route</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this approval route from the table? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-slate-50 border-t px-6 py-4 -mx-6 -mb-6 rounded-b-lg">
            <Button variant="outline" className="cursor-pointer" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="cursor-pointer" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

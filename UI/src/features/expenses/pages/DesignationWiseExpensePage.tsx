import * as React from "react";
import { Plus, Edit, Trash2, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TravelAllowanceItem {
  id: string;
  title: string;
  min: number;
  max: number;
}

interface OtherAllowanceRow {
  role: string;
  daMin: number;
  daMax: number;
  exMin: number;
  exMax: number;
  outMin: number;
  outMax: number;
}

const DEFAULT_OTHER_ALLOWANCES: OtherAllowanceRow[] = [
  { role: "AGM", daMin: 0, daMax: 0, exMin: 0, exMax: 0, outMin: 0, outMax: 0 },
  { role: "NSM", daMin: 0, daMax: 0, exMin: 0, exMax: 0, outMin: 0, outMax: 0 },
  { role: "Sr. RSM", daMin: 1000, daMax: 1000, exMin: 0, exMax: 0, outMin: 0, outMax: 0 },
  { role: "RSM", daMin: 0, daMax: 0, exMin: 0, exMax: 0, outMin: 0, outMax: 0 },
  { role: "DM", daMin: 0, daMax: 0, exMin: 0, exMax: 0, outMin: 0, outMax: 0 },
  { role: "Sr.ASM", daMin: 100, daMax: 200, exMin: 0, exMax: 0, outMin: 0, outMax: 0 },
  { role: "ASM", daMin: 0, daMax: 0, exMin: 0, exMax: 0, outMin: 0, outMax: 0 },
  { role: "MR", daMin: 0, daMax: 0, exMin: 0, exMax: 0, outMin: 0, outMax: 0 },
];

export function DesignationWiseExpensePage() {
  const [activeTab, setActiveTab] = React.useState<"travel" | "other">("travel");

  // Local storage state for travel allowances
  const [travelItems, setTravelItems] = React.useState<TravelAllowanceItem[]>(() => {
    const defaultItems = [{ id: "1", title: "Travel", min: 50, max: 150 }];
    if (typeof window === "undefined") return defaultItems;
    const stored = localStorage.getItem("sefmed_allowances_travel_items");
    if (!stored) {
      localStorage.setItem("sefmed_allowances_travel_items", JSON.stringify(defaultItems));
      return defaultItems;
    }
    return JSON.parse(stored);
  });

  // Local storage state for other allowances table
  const [otherAllowances, setOtherAllowances] = React.useState<OtherAllowanceRow[]>(() => {
    if (typeof window === "undefined") return DEFAULT_OTHER_ALLOWANCES;
    const stored = localStorage.getItem("sefmed_allowances_other_table");
    if (!stored) {
      localStorage.setItem("sefmed_allowances_other_table", JSON.stringify(DEFAULT_OTHER_ALLOWANCES));
      return DEFAULT_OTHER_ALLOWANCES;
    }
    return JSON.parse(stored);
  });

  // Modal Dialogs state for Travel Allowance
  const [isTravelFormOpen, setIsTravelFormOpen] = React.useState(false);
  const [editingTravelItem, setEditingTravelItem] = React.useState<TravelAllowanceItem | null>(null);
  
  // Travel Allowance Form Fields
  const [travelTitle, setTravelTitle] = React.useState("");
  const [travelMin, setTravelMin] = React.useState(0);
  const [travelMax, setTravelMax] = React.useState(0);

  // Modal Dialogs state for Other Allowance
  const [isOtherFormOpen, setIsOtherFormOpen] = React.useState(false);
  const [editingOtherRow, setEditingOtherRow] = React.useState<OtherAllowanceRow | null>(null);
  
  // Other Allowance Form Fields
  const [selectedRole, setSelectedRole] = React.useState("AGM");
  const [daMin, setDaMin] = React.useState(0);
  const [daMax, setDaMax] = React.useState(0);
  const [exMin, setExMin] = React.useState(0);
  const [exMax, setExMax] = React.useState(0);
  const [outMin, setOutMin] = React.useState(0);
  const [outMax, setOutMax] = React.useState(0);

  // Sync Travel Form when editing changes
  React.useEffect(() => {
    if (editingTravelItem) {
      setTravelTitle(editingTravelItem.title);
      setTravelMin(editingTravelItem.min);
      setTravelMax(editingTravelItem.max);
    } else {
      setTravelTitle("");
      setTravelMin(0);
      setTravelMax(0);
    }
  }, [editingTravelItem, isTravelFormOpen]);

  // Sync Other Form when editing changes
  React.useEffect(() => {
    if (editingOtherRow) {
      setSelectedRole(editingOtherRow.role);
      setDaMin(editingOtherRow.daMin);
      setDaMax(editingOtherRow.daMax);
      setExMin(editingOtherRow.exMin);
      setExMax(editingOtherRow.exMax);
      setOutMin(editingOtherRow.outMin);
      setOutMax(editingOtherRow.outMax);
    } else {
      setSelectedRole("AGM");
      setDaMin(0);
      setDaMax(0);
      setExMin(0);
      setExMax(0);
      setOutMin(0);
      setOutMax(0);
    }
  }, [editingOtherRow, isOtherFormOpen]);

  // Handle Travel Save
  const handleSaveTravel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    if (travelMin <= 0 || travelMax <= 0) {
      toast.error("Min and Max values must be greater than 0");
      return;
    }
    if (travelMax < travelMin) {
      toast.error("Max value cannot be less than Min value");
      return;
    }

    let updated: TravelAllowanceItem[];
    if (editingTravelItem) {
      updated = travelItems.map(item => 
        item.id === editingTravelItem.id 
          ? { ...item, title: travelTitle, min: travelMin, max: travelMax } 
          : item
      );
      toast.success("Travel allowance updated");
    } else {
      updated = [...travelItems, { 
        id: `travel-${Math.random().toString(36).substring(2, 9)}`, 
        title: travelTitle, 
        min: travelMin, 
        max: travelMax 
      }];
      toast.success("Travel allowance added");
    }
    setTravelItems(updated);
    localStorage.setItem("sefmed_allowances_travel_items", JSON.stringify(updated));
    setIsTravelFormOpen(false);
    setEditingTravelItem(null);
  };

  // Handle Travel Delete
  const handleDeleteTravel = (id: string) => {
    const updated = travelItems.filter(item => item.id !== id);
    setTravelItems(updated);
    localStorage.setItem("sefmed_allowances_travel_items", JSON.stringify(updated));
    toast.success("Travel allowance deleted");
  };

  // Handle Other Save
  const handleSaveOther = (e: React.FormEvent) => {
    e.preventDefault();
    
    let updated: OtherAllowanceRow[];
    if (editingOtherRow) {
      updated = otherAllowances.map(row => 
        row.role === editingOtherRow.role 
          ? { role: selectedRole, daMin, daMax, exMin, exMax, outMin, outMax } 
          : row
      );
      toast.success(`Allowance for ${selectedRole} updated`);
    } else {
      if (otherAllowances.some(row => row.role === selectedRole)) {
        toast.error(`Allowance settings for ${selectedRole} already exist. Please edit the existing entry instead.`);
        return;
      }
      updated = [...otherAllowances, { role: selectedRole, daMin, daMax, exMin, exMax, outMin, outMax }];
      toast.success(`Allowance settings added for ${selectedRole}`);
    }

    setOtherAllowances(updated);
    localStorage.setItem("sefmed_allowances_other_table", JSON.stringify(updated));
    setIsOtherFormOpen(false);
    setEditingOtherRow(null);
  };

  // Handle Other Delete
  const handleDeleteOther = (role: string) => {
    const updated = otherAllowances.filter(row => row.role !== role);
    setOtherAllowances(updated);
    localStorage.setItem("sefmed_allowances_other_table", JSON.stringify(updated));
    toast.success(`Allowance settings for ${role} deleted`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      <div>
        <div className="flex flex-col md:flex-row gap-8 mt-4">
          
          {/* Left Sidebar: Allowance Settings Panel */}
          <div className="w-full md:w-60 shrink-0">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
              Allowance Settings
            </h2>
            <div className="flex flex-col rounded-md overflow-hidden border border-slate-100 shadow-sm">
              {/* Tab 1: Travel Allowance */}
              <button
                onClick={() => setActiveTab("travel")}
                className={cn(
                  "relative py-3.5 px-4 flex items-center gap-3 text-sm font-semibold text-left transition-all duration-150 cursor-pointer border-b border-slate-100",
                  activeTab === "travel"
                    ? "bg-[#008272] text-white font-bold"
                    : "bg-[#e0f7fa] text-[#006064] hover:bg-[#b2ebf2]"
                )}
              >
                <Banknote className="h-4.5 w-4.5 shrink-0" />
                <span className="flex-1">Travel Allowance</span>
                {activeTab === "travel" && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-white z-10" />
                )}
              </button>

              {/* Tab 2: Other Allowances */}
              <button
                onClick={() => setActiveTab("other")}
                className={cn(
                  "relative py-3.5 px-4 flex items-center gap-3 text-sm font-semibold text-left transition-all duration-150 cursor-pointer",
                  activeTab === "other"
                    ? "bg-[#008272] text-white font-bold"
                    : "bg-[#e0f7fa] text-[#006064] hover:bg-[#b2ebf2]"
                )}
              >
                <Banknote className="h-4.5 w-4.5 shrink-0" />
                <span className="flex-1">Other Allowances</span>
                {activeTab === "other" && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-white z-10" />
                )}
              </button>
            </div>
          </div>

          {/* Right Main Content Panel */}
          <div className="flex-1">
            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-4">
              {activeTab === "travel" ? "Travel Allowance" : "Other Allowances"}
            </h1>

            {/* Add Button */}
            {activeTab === "travel" ? (
              <Button
                onClick={() => {
                  setEditingTravelItem(null);
                  setIsTravelFormOpen(true);
                }}
                className="bg-[#008272] hover:bg-[#006e60] text-white flex items-center gap-1.5 h-9 px-4 rounded-md font-semibold text-sm transition-colors cursor-pointer mb-5"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setEditingOtherRow(null);
                  setIsOtherFormOpen(true);
                }}
                className="bg-[#008272] hover:bg-[#006e60] text-white flex items-center gap-1.5 h-9 px-4 rounded-md font-semibold text-sm transition-colors cursor-pointer mb-5"
              >
                <Plus className="h-4 w-4" />
                Add Allowance
              </Button>
            )}

            {/* Container Card */}
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden mb-6">
              
              {activeTab === "travel" ? (
                /* TRAVEL ALLOWANCE VIEW */
                <div className="p-6">
                  {travelItems.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm font-semibold">
                      No allowance settings defined.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {travelItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-[#f1f5f9] border border-slate-200 rounded-lg py-2 px-4 shadow-sm"
                        >
                          <span className="text-sm font-semibold text-slate-700 tracking-wide">
                            &lt; {item.title} {item.min} - {item.max}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingTravelItem(item);
                                setIsTravelFormOpen(true);
                              }}
                              className="bg-[#008272] hover:bg-[#006e60] text-white p-1.5 rounded transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTravel(item.id)}
                              className="bg-[#008272] hover:bg-[#006e60] text-white p-1.5 rounded transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* OTHER ALLOWANCE VIEW: Table Layout */
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-600 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-350 bg-slate-50/50">
                        <th className="px-6 py-4.5 font-bold text-slate-700 text-sm w-44">Role</th>
                        <th className="px-6 py-4.5 font-bold text-slate-700 text-sm">DA (Min/Max)</th>
                        <th className="px-6 py-4.5 font-bold text-slate-700 text-sm">EX (Min/Max)</th>
                        <th className="px-6 py-4.5 font-bold text-slate-700 text-sm">OUT (Min/Max)</th>
                        <th className="px-6 py-4.5 font-bold text-slate-700 text-sm text-right w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherAllowances.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-slate-400 font-semibold">
                            No allowances configured.
                          </td>
                        </tr>
                      ) : (
                        otherAllowances.map((row) => (
                          <tr
                            key={row.role}
                            className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="px-6 py-3.5 font-bold text-slate-700 text-sm">{row.role}</td>
                            <td className="px-6 py-3.5 font-semibold text-blue-600">
                              {row.daMin} / {row.daMax}
                            </td>
                            <td className="px-6 py-3.5 font-semibold text-blue-600">
                              {row.exMin} / {row.exMax}
                            </td>
                            <td className="px-6 py-3.5 font-semibold text-blue-600">
                              {row.outMin} / {row.outMax}
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingOtherRow(row);
                                    setIsOtherFormOpen(true);
                                  }}
                                  className="text-slate-400 hover:text-[#008272] transition-colors p-1"
                                  title="Edit"
                                >
                                  <Edit className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteOther(row.role)}
                                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Sefmed Premium Footer */}
      <footer className="mt-12 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-semibold">
        <div>2026 &copy; Sefmed &amp; Powered by Cuztomise</div>
      </footer>

      {/* Travel Allowance Modal */}
      <Dialog open={isTravelFormOpen} onOpenChange={setIsTravelFormOpen}>
        <DialogContent className="sm:max-w-[420px] p-6">
          <form onSubmit={handleSaveTravel}>
            <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
              <DialogTitle className="text-xl font-bold text-slate-800">Allowance</DialogTitle>
            </DialogHeader>

            {/* Form Fields matching the screenshot */}
            <div className="space-y-4 py-4 max-w-[340px] mx-auto">
              <div className="flex items-center gap-4">
                <Label className="w-20 text-right font-medium text-slate-700 text-sm">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={travelTitle}
                  onChange={(e) => setTravelTitle(e.target.value)}
                  className="flex-1 bg-white border-slate-200 h-9"
                  placeholder=""
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-20 text-right font-medium text-slate-700 text-sm">
                  Min <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={travelMin || ""}
                  onChange={(e) => setTravelMin(Number(e.target.value))}
                  className="flex-1 bg-white border-slate-200 h-9"
                  placeholder=""
                />
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-20 text-right font-medium text-slate-700 text-sm">
                  Max <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={travelMax || ""}
                  onChange={(e) => setTravelMax(Number(e.target.value))}
                  className="flex-1 bg-white border-slate-200 h-9"
                  placeholder=""
                />
              </div>
            </div>

            {/* Separated Dialog Footer with grey background */}
            <DialogFooter className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end gap-2 -mx-6 -mb-6 rounded-b-lg">
              <Button
                type="submit"
                className="bg-[#008272] hover:bg-[#006e60] text-white px-4 h-9 font-semibold text-sm rounded cursor-pointer transition-colors"
              >
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTravelFormOpen(false)}
                className="bg-slate-200 hover:bg-slate-350 text-slate-700 border-none px-4 h-9 font-semibold text-sm rounded cursor-pointer transition-colors"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Other Allowance Modal */}
      <Dialog open={isOtherFormOpen} onOpenChange={setIsOtherFormOpen}>
        <DialogContent className="sm:max-w-[480px] p-6">
          <form onSubmit={handleSaveOther} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {editingOtherRow ? `Edit Allowance settings for ${editingOtherRow.role}` : "Add Allowance Settings"}
              </DialogTitle>
              <DialogDescription>
                Configure allowance limits for designation roles.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-1">
              {!editingOtherRow && (
                <div className="space-y-1.5">
                  <Label htmlFor="other-role">Role / Designation</Label>
                  <UiSelect value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger id="other-role" className="w-full bg-background border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["AGM", "NSM", "Sr. RSM", "RSM", "DM", "Sr.ASM", "ASM", "MR"].map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="da-min">DA Min</Label>
                  <Input
                    id="da-min"
                    type="number"
                    value={daMin}
                    onChange={(e) => setDaMin(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="da-max">DA Max</Label>
                  <Input
                    id="da-max"
                    type="number"
                    value={daMax}
                    onChange={(e) => setDaMax(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ex-min">EX Min</Label>
                  <Input
                    id="ex-min"
                    type="number"
                    value={exMin}
                    onChange={(e) => setExMin(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ex-max">EX Max</Label>
                  <Input
                    id="ex-max"
                    type="number"
                    value={exMax}
                    onChange={(e) => setExMax(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="out-min">OUT Min</Label>
                  <Input
                    id="out-min"
                    type="number"
                    value={outMin}
                    onChange={(e) => setOutMin(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="out-max">OUT Max</Label>
                  <Input
                    id="out-max"
                    type="number"
                    value={outMax}
                    onChange={(e) => setOutMax(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsOtherFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#008272] hover:bg-[#006e60] text-white">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

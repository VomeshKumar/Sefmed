import * as React from "react";
import {
  Calendar,
  Lock,
  Unlock,
  Wrench,
  RefreshCw,
  Save,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Sliders,
  Clock,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { toast } from "sonner";

export interface StockMonthConfig {
  month: string;             // January, February, etc.
  submitDeadline: string;    // "0" or "YYYY-MM-DD"
  approvalDeadline: string;  // "0" or "YYYY-MM-DD"
  isLocked: boolean;         // true = locked, false = unlocked
}

const defaultMonthsData: Omit<StockMonthConfig, "month">[] = Array.from({ length: 12 }, () => ({
  submitDeadline: "0",
  approvalDeadline: "0",
  isLocked: false,
}));

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function StockMonthMaintenancePage() {
  // Filter states
  const [selectedYear, setSelectedYear] = React.useState("2026");
  const [selectedDivision, setSelectedDivision] = React.useState("DERMA");
  const [activeYear, setActiveYear] = React.useState("2026");
  const [activeDivision, setActiveDivision] = React.useState("DERMA");

  // Bulk parameters
  const [bulkSubmitDay, setBulkSubmitDay] = React.useState("05");
  const [bulkApprovalDay, setBulkApprovalDay] = React.useState("10");

  // Load Divisions
  const { data: divisions = [], isLoading: isDivisionsLoading } = useDivisionsList();

  // Storage key based on Year and Division
  const storageKey = `sefmed_stock_month_maintenance_${activeYear}_${activeDivision}`;

  // Month configurations state
  const [monthConfigs, setMonthConfigs] = React.useState<StockMonthConfig[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    }
    return MONTH_NAMES.map((name, index) => ({
      month: name,
      ...defaultMonthsData[index],
    }));
  });

  // Reload config when filters are applied
  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setMonthConfigs(JSON.parse(saved));
    } else {
      setMonthConfigs(
        MONTH_NAMES.map((name, index) => ({
          month: name,
          ...defaultMonthsData[index],
        }))
      );
    }
  }, [activeYear, activeDivision, storageKey]);

  // Persist configurations
  const saveConfigs = (newConfigs: StockMonthConfig[]) => {
    setMonthConfigs(newConfigs);
    localStorage.setItem(storageKey, JSON.stringify(newConfigs));
  };

  // Filter apply action
  const handleGo = () => {
    setActiveYear(selectedYear);
    setActiveDivision(selectedDivision);
    toast.success(`Loaded stock month configurations for ${selectedDivision} (${selectedYear})`);
  };

  // Row update handlers
  const handleConfigChange = (monthName: string, field: keyof StockMonthConfig, val: any) => {
    const updated = monthConfigs.map((cfg) => {
      if (cfg.month === monthName) {
        return { ...cfg, [field]: val };
      }
      return cfg;
    });
    saveConfigs(updated);
  };

  const handleRowSave = (monthName: string) => {
    const cfg = monthConfigs.find(c => c.month === monthName);
    if (cfg) {
      toast.success(`Configuration saved for ${monthName}`, {
        description: `Submit: ${cfg.submitDeadline} | Approval: ${cfg.approvalDeadline} | Lock: ${cfg.isLocked ? "Yes" : "No"}`
      });
    }
  };

  // Toggle lock status
  const handleToggleLock = (monthName: string, checked: boolean) => {
    const updated = monthConfigs.map((cfg) => {
      if (cfg.month === monthName) {
        return { ...cfg, isLocked: checked };
      }
      return cfg;
    });
    saveConfigs(updated);
    toast.info(`${monthName} is now ${checked ? "Locked 🔒" : "Unlocked 🔓"}`);
  };

  // Bulk Apply deadlines
  const handleBulkApplyDeadlines = () => {
    const updated = monthConfigs.map((cfg, idx) => {
      const monthNum = String(idx + 1).padStart(2, "0");
      const subDate = `${activeYear}-${monthNum}-${bulkSubmitDay.padStart(2, "0")}`;
      const appDate = `${activeYear}-${monthNum}-${bulkApprovalDay.padStart(2, "0")}`;
      return {
        ...cfg,
        submitDeadline: subDate,
        approvalDeadline: appDate,
      };
    });
    saveConfigs(updated);
    toast.success(`Bulk applied deadlines to all months of ${activeYear}!`, {
      description: `Submission: ${bulkSubmitDay}th | Approval: ${bulkApprovalDay}th`
    });
  };

  // Bulk Lock / Unlock all
  const handleBulkLockToggle = (lockAll: boolean) => {
    const updated = monthConfigs.map((cfg) => ({
      ...cfg,
      isLocked: lockAll,
    }));
    saveConfigs(updated);
    toast.success(`All months have been ${lockAll ? "LOCKED 🔒" : "UNLOCKED 🔓"}`);
  };

  // Reset to default "0" values
  const handleResetToDefaults = () => {
    const updated = MONTH_NAMES.map((name, index) => ({
      month: name,
      ...defaultMonthsData[index],
    }));
    saveConfigs(updated);
    toast.warning(`Configuration reset to defaults for ${activeDivision} (${activeYear})`);
  };

  // Count metrics
  const lockedCount = monthConfigs.filter(c => c.isLocked).length;
  const configuredCount = monthConfigs.filter(c => c.submitDeadline !== "0" && c.approvalDeadline !== "0").length;

  return (
    <div className="flex flex-col space-y-6 p-6 animate-fade-in">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="h-6 w-6 text-[#008272]" />
            Stock Month Maintenance
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-1">
            Configure submission deadlines, approval windows, and reporting locks for secondary stock statements.
          </p>
        </div>
      </div>

      {/* Filter Row Panel */}
      <div className="bg-white p-4 border rounded-xl shadow-sm space-y-3 border-slate-100">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Year select */}
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Year</span>
            <UiSelect value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-36 h-9 bg-slate-50/50 border-slate-200 text-slate-700 text-xs focus:ring-[#008272]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
              </SelectContent>
            </UiSelect>
          </div>

          {/* Division select */}
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Division</span>
            <UiSelect value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger className="w-44 h-9 bg-slate-50/50 border-slate-200 text-slate-700 text-xs focus:ring-[#008272]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DERMA">DERMA</SelectItem>
                {divisions
                  .filter((d) => d.name !== "DERMA")
                  .map((d) => (
                    <SelectItem key={d.id} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </UiSelect>
          </div>

          {/* Go Action */}
          <Button
            onClick={handleGo}
            className="bg-[#008272] hover:bg-[#006e60] text-white px-5 h-9 font-bold text-xs rounded shadow-sm transition-all mt-4"
          >
            Go
          </Button>
        </div>
      </div>

      {/* Overview Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Active configurations */}
        <Card className="border border-slate-100 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Configured Deadlines</span>
              <div className="text-xl font-extrabold text-slate-800">{configuredCount} / 12</div>
              <p className="text-[10px] text-slate-400">Months with set deadline dates</p>
            </div>
            <div className="p-2.5 bg-teal-50 text-teal-500 rounded-xl">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Locked status */}
        <Card className="border border-slate-100 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Locked Periods</span>
              <div className="text-xl font-extrabold text-slate-800">{lockedCount} / 12</div>
              <p className="text-[10px] text-slate-400">Reporting locked for stockists</p>
            </div>
            <div className={`p-2.5 rounded-xl ${lockedCount > 0 ? "bg-amber-50 text-amber-500" : "bg-slate-50 text-slate-400"}`}>
              <Lock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Current Context */}
        <Card className="border border-slate-100 shadow-sm bg-gradient-to-br from-slate-50 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Division Context</span>
              <div className="text-lg font-bold text-slate-800">{activeDivision}</div>
              <Badge className="bg-[#008272]/5 text-[#008272] border border-[#008272]/10 font-bold text-[9px] px-1.5 py-0.5">
                Year: {activeYear}
              </Badge>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
              <LayoutGrid className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Deadlines Board and Bulk Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Main Deadlines Grid Table */}
        <Card className="border border-slate-100 shadow-sm lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-4">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="h-4.5 w-4.5 text-[#008272]" /> Month-wise Deadlines & Locks
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Input dates in <code className="text-slate-500 font-mono text-[10px]">YYYY-MM-DD</code> format or set to <code className="text-slate-500 font-mono text-[10px]">0</code> to leave unlimited.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/20 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b">
                    <th className="py-3 px-4 w-1/4">Month</th>
                    <th className="py-3 px-4 w-1/3">Submit Deadline</th>
                    <th className="py-3 px-4 w-1/3">Approval Deadline</th>
                    <th className="py-3 px-4 text-center">Lock</th>
                    <th className="py-3 px-4 text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 text-xs">
                  {monthConfigs.map((cfg) => (
                    <tr
                      key={cfg.month}
                      className={`hover:bg-slate-50/40 transition-colors align-middle ${
                        cfg.isLocked ? "bg-rose-50/10" : ""
                      }`}
                    >
                      {/* Month Name & Lock indicator */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          {cfg.month}
                          {cfg.isLocked ? (
                            <Badge className="bg-rose-50 text-rose-600 hover:bg-rose-50 border border-rose-100 text-[8px] font-extrabold px-1.5 py-0">
                              🔒 LOCKED
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border border-emerald-100 text-[8px] font-extrabold px-1.5 py-0">
                              🔓 OPEN
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Submit Deadline input */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="text"
                            value={cfg.submitDeadline}
                            onChange={(e) => handleConfigChange(cfg.month, "submitDeadline", e.target.value)}
                            onBlur={() => handleRowSave(cfg.month)}
                            className="bg-white border-slate-200 text-xs h-8.5 font-mono"
                            placeholder="yyyy-mm-dd"
                          />
                        </div>
                      </td>

                      {/* Approval Deadline input */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="text"
                            value={cfg.approvalDeadline}
                            onChange={(e) => handleConfigChange(cfg.month, "approvalDeadline", e.target.value)}
                            onBlur={() => handleRowSave(cfg.month)}
                            className="bg-white border-slate-200 text-xs h-8.5 font-mono"
                            placeholder="yyyy-mm-dd"
                          />
                        </div>
                      </td>

                      {/* Lock status checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <Checkbox
                          checked={cfg.isLocked}
                          onCheckedChange={(checked) => handleToggleLock(cfg.month, !!checked)}
                          className="h-4 w-4 rounded text-[#008272] border-slate-300 focus:ring-[#008272]"
                        />
                      </td>

                      {/* Manual Action buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <Button
                          onClick={() => handleRowSave(cfg.month)}
                          variant="ghost"
                          className="h-7 w-7 p-0 text-[#008272] hover:text-[#006e60] hover:bg-[#008272]/5 rounded-full"
                          title="Save changes"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Bulk Operations Control Board */}
        <div className="space-y-6">
          {/* Card: Bulk Deadline Setter */}
          <Card className="border border-slate-100 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="h-4.5 w-4.5 text-[#008272]" /> Bulk Apply Deadlines
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Instantly populate deadlines for all months of {activeYear} (e.g. setting standard 5th/10th schedule).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Submit Day (DD)</span>
                  <Input
                    type="number"
                    min="1"
                    max="28"
                    value={bulkSubmitDay}
                    onChange={(e) => setBulkSubmitDay(e.target.value)}
                    className="h-9 bg-slate-50 border-slate-200 text-xs font-mono font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Approval Day (DD)</span>
                  <Input
                    type="number"
                    min="1"
                    max="28"
                    value={bulkApprovalDay}
                    onChange={(e) => setBulkApprovalDay(e.target.value)}
                    className="h-9 bg-slate-50 border-slate-200 text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              <Button
                onClick={handleBulkApplyDeadlines}
                className="w-full bg-[#008272] hover:bg-[#006e60] text-white h-9 font-bold text-xs gap-1.5 transition-all shadow-sm active:scale-95"
              >
                Bulk Set Deadlines
              </Button>
            </CardContent>
          </Card>

          {/* Card: Bulk Lock Actions */}
          <Card className="border border-slate-100 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="h-4.5 w-4.5 text-[#008272]" /> Bulk Lock / Unlock
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Unlock or freeze secondary sales submissions across all months for division {activeDivision}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 pt-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBulkLockToggle(true)}
                  variant="outline"
                  className="flex-1 hover:bg-slate-50 h-9 font-bold text-xs text-rose-600 border-rose-100 hover:text-rose-700 hover:border-rose-200 bg-rose-50/10 gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" /> Lock All
                </Button>
                <Button
                  onClick={() => handleBulkLockToggle(false)}
                  variant="outline"
                  className="flex-1 hover:bg-slate-50 h-9 font-bold text-xs text-emerald-600 border-emerald-100 hover:text-emerald-700 hover:border-emerald-200 bg-emerald-50/10 gap-1.5"
                >
                  <Unlock className="h-3.5 w-3.5" /> Unlock All
                </Button>
              </div>

              <div className="pt-2 border-t border-slate-50">
                <Button
                  onClick={handleResetToDefaults}
                  variant="ghost"
                  className="w-full h-8 font-semibold text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100/30"
                >
                  Reset configs to "0" (empty)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sefmed Help Box */}
          <Card className="border border-slate-100 bg-slate-50/50">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Lock Restrictions</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Locking a month prevents representatives from creating, modifying, or uploading new secondary statements tally details for that period. Keep deadlines updated to enforce automated audit locking.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Sefmed Premium Footer */}
      <footer className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-semibold">
        <div>2026 &copy; Sefmed &amp; Powered by Cuztomise</div>
      </footer>
    </div>
  );
}

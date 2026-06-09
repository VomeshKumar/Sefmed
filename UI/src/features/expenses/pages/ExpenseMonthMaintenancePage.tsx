import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { toast } from "sonner";

export interface MonthConfig {
  month: string; // January, February, etc.
  deadline: string; // "0" or date string
  isHidden: boolean; // true = hidden for employee, false = visible
  hasVisibilityButton: boolean; // Jan-Apr false, May-Dec true
}

const defaultMonths: Omit<MonthConfig, "month">[] = [
  { deadline: "0", isHidden: false, hasVisibilityButton: false }, // January
  { deadline: "0", isHidden: false, hasVisibilityButton: false }, // February
  { deadline: "0", isHidden: false, hasVisibilityButton: false }, // March
  { deadline: "0", isHidden: false, hasVisibilityButton: false }, // April
  { deadline: "0", isHidden: false, hasVisibilityButton: true },  // May
  { deadline: "0", isHidden: false, hasVisibilityButton: true },  // June
  { deadline: "0", isHidden: false, hasVisibilityButton: true },  // July
  { deadline: "0", isHidden: false, hasVisibilityButton: true },  // August
  { deadline: "0", isHidden: false, hasVisibilityButton: true },  // September
  { deadline: "0", isHidden: false, hasVisibilityButton: true },  // October
  { deadline: "0", isHidden: false, hasVisibilityButton: true },  // November
  { deadline: "0", isHidden: false, hasVisibilityButton: true },  // December
];

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

export function ExpenseMonthMaintenancePage() {
  // Filter States
  const [selectedYear, setSelectedYear] = React.useState("2026");
  const [selectedDivision, setSelectedDivision] = React.useState("DERMA");
  const [activeYear, setActiveYear] = React.useState("2026");
  const [activeDivision, setActiveDivision] = React.useState("DERMA");

  // Load Divisions
  const { data: divisions = [] } = useDivisionsList();

  // Load Month Configurations from localStorage based on year + division
  const storageKey = `sefmed_month_maintenance_${activeYear}_${activeDivision}`;

  const [monthConfigs, setMonthConfigs] = React.useState<MonthConfig[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    }
    return MONTH_NAMES.map((name, index) => ({
      month: name,
      ...defaultMonths[index],
    }));
  });

  // Reload state when active filters change
  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setMonthConfigs(JSON.parse(saved));
    } else {
      setMonthConfigs(
        MONTH_NAMES.map((name, index) => ({
          month: name,
          ...defaultMonths[index],
        }))
      );
    }
  }, [activeYear, activeDivision, storageKey]);

  // Persist state when configs change
  const saveConfigs = (newConfigs: MonthConfig[]) => {
    setMonthConfigs(newConfigs);
    localStorage.setItem(storageKey, JSON.stringify(newConfigs));
  };

  // Handle Go search click
  const handleGo = () => {
    setActiveYear(selectedYear);
    setActiveDivision(selectedDivision);
    toast.success(`Loaded configuration for ${selectedYear} - ${selectedDivision}`);
  };

  // Toggle visibility status
  const handleToggleVisibility = (monthName: string) => {
    const newConfigs = monthConfigs.map((cfg) => {
      if (cfg.month === monthName) {
        const nextState = !cfg.isHidden;
        toast.success(
          `${monthName} is now ${nextState ? "hidden" : "visible"} for employees`
        );
        return { ...cfg, isHidden: nextState };
      }
      return cfg;
    });
    saveConfigs(newConfigs);
  };

  // Update deadline value
  const handleDeadlineChange = (monthName: string, val: string) => {
    const newConfigs = monthConfigs.map((cfg) => {
      if (cfg.month === monthName) {
        return { ...cfg, deadline: val };
      }
      return cfg;
    });
    saveConfigs(newConfigs);
  };

  const handleDeadlineBlur = (monthName: string, val: string) => {
    toast.success(`Deadline updated for ${monthName} to "${val}"`);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] justify-between">
      <div>
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-6">
          Expense Month Maintenance
        </h1>

        {/* Filters Toolbar Row */}
        <div className="flex flex-wrap gap-2.5 items-center mb-6">
          {/* Year selector */}
          <UiSelect value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32 bg-white border-slate-200 text-slate-700 text-xs h-9 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </UiSelect>

          {/* Division selector */}
          <UiSelect value={selectedDivision} onValueChange={setSelectedDivision}>
            <SelectTrigger className="w-40 bg-white border-slate-200 text-slate-700 text-xs h-9 cursor-pointer">
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

          {/* Go Button */}
          <Button
            onClick={handleGo}
            className="bg-[#008272] hover:bg-[#006e60] text-white px-4 h-9 font-semibold text-xs rounded transition-colors cursor-pointer"
          >
            Go
          </Button>
        </div>

        {/* Card Body */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-1/4">Month</th>
                <th className="py-3.5 px-4 w-1/3">Submit Deadline (yyyy-mm-dd)</th>
                <th className="py-3.5 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {monthConfigs.map((cfg) => (
                <tr key={cfg.month} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {cfg.month}
                  </td>
                  <td className="py-3 px-4">
                    <Input
                      type="text"
                      value={cfg.deadline}
                      onChange={(e) => handleDeadlineChange(cfg.month, e.target.value)}
                      onBlur={(e) => handleDeadlineBlur(cfg.month, e.target.value)}
                      className="w-48 bg-white border-slate-200 text-slate-700 text-xs h-8.5 focus-visible:ring-1 focus-visible:ring-[#008272]"
                    />
                  </td>
                  <td className="py-3 px-4">
                    {cfg.hasVisibilityButton && (
                      <Button
                        onClick={() => handleToggleVisibility(cfg.month)}
                        className={`text-xs font-semibold px-3 h-8.5 rounded cursor-pointer transition-colors ${
                          cfg.isHidden
                            ? "bg-slate-200 hover:bg-slate-300 text-slate-700"
                            : "bg-[#008272] hover:bg-[#006e60] text-white"
                        }`}
                      >
                        {cfg.isHidden ? "Show For Employee" : "Hide For Employee"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sefmed Premium Footer */}
      <footer className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-semibold">
        <div>2026 &copy; Sefmed &amp; Powered by Cuztomise</div>
      </footer>
    </div>
  );
}

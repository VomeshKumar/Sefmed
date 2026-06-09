import * as React from "react";
import { TrendingUp, Award, Activity, IndianRupee, ShieldAlert, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSalesDashboardStats, useSalesAnalyticsMetrics } from "../api/analyticsAdapters";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function SalesAnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const { data: stats, isLoading: isStatsLoading } = useSalesDashboardStats(selectedMonth);
  const { data: metrics, isLoading: isMetricsLoading } = useSalesAnalyticsMetrics(selectedMonth);

  const isLoading = isStatsLoading || isMetricsLoading;

  return (
    <>
      <PageHeader
        title="Sales Executive Dashboard"
        description="Executive metrics monitoring targets, primary sales, secondary sales, and regional allocations."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Sales" },
          { label: "Analytics" },
        ]}
      />

      {/* Date Filter Bar */}
      <div className="mb-5 bg-card border rounded-lg p-4 flex items-center justify-between gap-4 flex-wrap shadow-sm">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-semibold text-muted-foreground uppercase">Analysis Period:</Label>
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-[180px] bg-background h-9"
          />
        </div>
        <div className="text-xs text-muted-foreground italic">
          * Dynamic aggregates derived from verified primary bills & approved secondary statements.
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-16">Loading executive dashboard metrics...</div>
      ) : !stats ? (
        <div className="text-center text-muted-foreground py-16">No sales analytics data found for this period.</div>
      ) : (
        <div className="space-y-6">
          {/* Dual Achievements KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Primary Achievement */}
            <div className="bg-card border rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Primary Achievement</span>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold nums-tabular">{stats.achievementPrimaryPercent}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Primary: <span className="font-semibold text-foreground">{fmt(stats.totalPrimarySales)}</span>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-1 bg-primary" />
            </div>

            {/* Secondary Achievement */}
            <div className="bg-card border rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Secondary Achievement</span>
                <Award className="h-4 w-4 text-success" />
              </div>
              <div className="text-2xl font-bold nums-tabular text-success">{stats.achievementSecondaryPercent}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Secondary: <span className="font-semibold text-foreground">{fmt(stats.totalSecondarySales)}</span>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-1 bg-success" />
            </div>

            {/* Total Target */}
            <div className="bg-card border rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Active Targets</span>
                <Activity className="h-4 w-4 text-info" />
              </div>
              <div className="text-2xl font-bold nums-tabular">{fmt(stats.totalTargetAmount)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Current month target allocation
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-1 bg-info" />
            </div>

            {/* Total Outstanding */}
            <div className="bg-card border rounded-xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Distributor Debt</span>
                <ShieldAlert className="h-4 w-4 text-destructive" />
              </div>
              <div className="text-2xl font-bold nums-tabular text-destructive">{fmt(stats.totalOutstanding)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Outstanding balance across stockists
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-1 bg-destructive" />
            </div>
          </div>

          {/* Monthly Trend Grid */}
          <div className="bg-card border rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-sm uppercase text-muted-foreground flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" /> 6-Month Trend Overview (Primary vs Secondary vs Target)
            </h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/20 text-xs font-semibold uppercase text-muted-foreground">
                    <th className="px-4 py-2.5 text-left">Period</th>
                    <th className="px-4 py-2.5 text-right">Target Value</th>
                    <th className="px-4 py-2.5 text-right">Primary Sales (PTS)</th>
                    <th className="px-4 py-2.5 text-right">Secondary Sales (PTR)</th>
                    <th className="px-4 py-2.5 text-right">Pri. Ach.</th>
                    <th className="px-4 py-2.5 text-right">Sec. Ach.</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.monthlyTrend.map((t) => {
                    const priAch = t.target > 0 ? Math.round((t.primary / t.target) * 100) : 0;
                    const secAch = t.target > 0 ? Math.round((t.secondary / t.target) * 100) : 0;
                    return (
                      <tr key={t.month} className="border-b last:border-0 hover:bg-muted/10">
                        <td className="px-4 py-3 font-semibold">{t.month}</td>
                        <td className="px-4 py-3 text-right nums-tabular">{fmt(t.target)}</td>
                        <td className="px-4 py-3 text-right nums-tabular font-medium">{fmt(t.primary)}</td>
                        <td className="px-4 py-3 text-right nums-tabular text-success font-medium">{fmt(t.secondary)}</td>
                        <td className="px-4 py-3 text-right nums-tabular font-bold text-xs">{priAch}%</td>
                        <td className="px-4 py-3 text-right nums-tabular font-bold text-xs text-success">{secAch}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional & Segment performance tables (Revision 8: Sales Analytics Expansion) */}
          {metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Zone Performance */}
              <div className="bg-card border rounded-xl shadow-sm p-4 space-y-3">
                <h3 className="font-semibold text-xs uppercase text-muted-foreground border-b pb-1.5">Zone Performance</h3>
                <div className="overflow-hidden border rounded-lg text-xs">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/20 border-b font-semibold text-muted-foreground text-[10px] uppercase">
                        <th className="px-3 py-2 text-left">Zone</th>
                        <th className="px-3 py-2 text-right">Primary</th>
                        <th className="px-3 py-2 text-right">Secondary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.zonePerformance.map((z) => (
                        <tr key={z.id} className="border-b last:border-0 hover:bg-muted/10">
                          <td className="px-3 py-2">
                            <div className="font-semibold">{z.name}</div>
                            <div className="text-[10px] text-muted-foreground">Target: {fmt(z.targetAmount)}</div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="nums-tabular font-medium">{fmt(z.primaryAmount)}</div>
                            <div className="text-[10px] text-muted-foreground">{z.achievementPrimaryPercent}% Ach.</div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="nums-tabular font-medium text-success">{fmt(z.secondaryAmount)}</div>
                            <div className="text-[10px] text-success font-medium">{z.achievementSecondaryPercent}% Ach.</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Territory Performance */}
              <div className="bg-card border rounded-xl shadow-sm p-4 space-y-3">
                <h3 className="font-semibold text-xs uppercase text-muted-foreground border-b pb-1.5">Territory Performance</h3>
                <div className="overflow-hidden border rounded-lg text-xs">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/20 border-b font-semibold text-muted-foreground text-[10px] uppercase">
                        <th className="px-3 py-2 text-left">Territory</th>
                        <th className="px-3 py-2 text-right">Primary</th>
                        <th className="px-3 py-2 text-right">Secondary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.territoryPerformance.map((t) => (
                        <tr key={t.id} className="border-b last:border-0 hover:bg-muted/10">
                          <td className="px-3 py-2">
                            <div className="font-semibold">{t.name}</div>
                            <div className="text-[10px] text-muted-foreground">Target: {fmt(t.targetAmount)}</div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="nums-tabular font-medium">{fmt(t.primaryAmount)}</div>
                            <div className="text-[10px] text-muted-foreground">{t.achievementPrimaryPercent}% Ach.</div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="nums-tabular font-medium text-success">{fmt(t.secondaryAmount)}</div>
                            <div className="text-[10px] text-success font-medium">{t.achievementSecondaryPercent}% Ach.</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Division Performance */}
              <div className="bg-card border rounded-xl shadow-sm p-4 space-y-3">
                <h3 className="font-semibold text-xs uppercase text-muted-foreground border-b pb-1.5">Division Performance</h3>
                <div className="overflow-hidden border rounded-lg text-xs">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/20 border-b font-semibold text-muted-foreground text-[10px] uppercase">
                        <th className="px-3 py-2 text-left">Division</th>
                        <th className="px-3 py-2 text-right">Primary</th>
                        <th className="px-3 py-2 text-right">Secondary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.divisionPerformance.map((d) => (
                        <tr key={d.id} className="border-b last:border-0 hover:bg-muted/10">
                          <td className="px-3 py-2">
                            <div className="font-semibold">{d.name}</div>
                            <div className="text-[10px] text-muted-foreground">Target: {fmt(d.targetAmount)}</div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="nums-tabular font-medium">{fmt(d.primaryAmount)}</div>
                            <div className="text-[10px] text-muted-foreground">{d.achievementPrimaryPercent}% Ach.</div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="nums-tabular font-medium text-success">{fmt(d.secondaryAmount)}</div>
                            <div className="text-[10px] text-success font-medium">{d.achievementSecondaryPercent}% Ach.</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Leaders board (Top Products, Employees, Territories) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Products */}
            <div className="bg-card border rounded-xl p-4 shadow-sm space-y-3 text-sm">
              <h4 className="font-bold text-xs uppercase text-muted-foreground border-b pb-1.5">Top Products by Primary</h4>
              <div className="space-y-3">
                {stats.topProducts.map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <div className="font-semibold text-xs">{idx + 1}. {p.name}</div>
                      <div className="text-[10px] text-muted-foreground">Target: {fmt(p.targetAmount)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs nums-tabular">{fmt(p.primaryAmount)}</div>
                      <div className="text-[10px] text-success">{p.achievementSecondaryPercent}% Sec Ach.</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Employees */}
            <div className="bg-card border rounded-xl p-4 shadow-sm space-y-3 text-sm">
              <h4 className="font-bold text-xs uppercase text-muted-foreground border-b pb-1.5">Top Representatives</h4>
              <div className="space-y-3">
                {stats.topEmployees.map((e, idx) => (
                  <div key={e.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <div className="font-semibold text-xs">{idx + 1}. {e.name}</div>
                      <div className="text-[10px] text-muted-foreground">Target: {fmt(e.targetAmount)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs nums-tabular">{fmt(e.primaryAmount)}</div>
                      <div className="text-[10px] text-success">{e.achievementSecondaryPercent}% Sec Ach.</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Territories */}
            <div className="bg-card border rounded-xl p-4 shadow-sm space-y-3 text-sm">
              <h4 className="font-bold text-xs uppercase text-muted-foreground border-b pb-1.5">Top Territories</h4>
              <div className="space-y-3">
                {stats.topTerritories.map((t, idx) => (
                  <div key={t.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <div className="font-semibold text-xs">{idx + 1}. {t.name}</div>
                      <div className="text-[10px] text-muted-foreground">Target: {fmt(t.targetAmount)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs nums-tabular">{fmt(t.primaryAmount)}</div>
                      <div className="text-[10px] text-success">{t.achievementSecondaryPercent}% Sec Ach.</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

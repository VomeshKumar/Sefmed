import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  TrendingUp,
  Clock,
  Receipt,
  Search,
  Plus,
  Play,
  Trash2,
  Share2,
  Lock,
  FileBarChart2,
  Settings,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSavedReportsList, useDeleteSavedReport } from "../hooks";
import { DataTable, type Column } from "@/components/data/DataTable";
import { RequirePermission } from "@/lib/rbac/RequirePermission";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { toast } from "sonner";
import type { SavedReport } from "../types";
import { PREPACKAGED_REPORTS } from "../fixtures";

export function ReportsHubPage() {
  const { data: savedReports = [], isLoading } = useSavedReportsList();
  const deleteMutation = useDeleteSavedReport();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success(`Report "${name}" deleted successfully`);
    } catch {
      toast.error("Failed to delete report");
    }
  };

  // Filter prepackaged reports dynamically based on search term
  const filteredCategories = React.useMemo(() => {
    if (!searchTerm.trim()) return PREPACKAGED_REPORTS;
    return PREPACKAGED_REPORTS.map((cat) => {
      const matched = cat.reports.filter(
        (r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...cat, reports: matched };
    }).filter((cat) => cat.reports.length > 0);
  }, [searchTerm]);

  const columns: Column<SavedReport>[] = [
    {
      accessorKey: "name",
      header: "Report Name",
      cell: (item) => (
        <div>
          <div className="font-semibold text-sm">{item.name}</div>
          <div className="text-xs text-muted-foreground">
            {item.reportDefinition.description || "No description provided"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "reportDefinition.module",
      header: "Source Module",
      cell: (item) => (
        <span className="text-xs font-semibold uppercase text-muted-foreground">
          {item.reportDefinition.module.replace("_", " ")}
        </span>
      ),
    },
    {
      accessorKey: "reportDefinition.sharingScope",
      header: "Scope",
      cell: (item) => (
        <span className="flex items-center gap-1 text-xs">
          {item.reportDefinition.sharingScope === "shared" ? (
            <>
              <Share2 className="h-3 w-3 text-primary" /> Shared
            </>
          ) : (
            <>
              <Lock className="h-3 w-3 text-muted-foreground" /> Private
            </>
          )}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Saved Date",
      cell: (item) => (
        <span className="text-xs text-muted-foreground nums-tabular">
          {new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: "",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button variant="ghost" size="sm" className="h-8 gap-1" asChild>
            <Link to="/reports/builder" search={{ savedReportId: item.id }}>
              <Play className="h-3.5 w-3.5 text-primary" /> Run
            </Link>
          </Button>
          <RequirePermission permission={PERMISSIONS.REPORT_BUILDER_USE}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(item.id, item.name)}
              title="Delete Report"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </RequirePermission>
        </div>
      ),
    },
  ];

  // Helper to resolve Category icon and color scheme
  const getCategoryHeaderStyle = (key: string) => {
    switch (key) {
      case "work":
        return {
          icon: Briefcase,
          accent: "border-blue-500/30 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20",
        };
      case "productivity":
        return {
          icon: TrendingUp,
          accent: "border-emerald-500/30 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20",
        };
      case "attendance":
        return {
          icon: Clock,
          accent: "border-amber-500/30 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20",
        };
      case "expense_leave":
        return {
          icon: Receipt,
          accent: "border-purple-500/30 text-purple-600 bg-purple-50/50 dark:bg-purple-950/20",
        };
      default:
        return {
          icon: FileBarChart2,
          accent: "border-muted text-muted-foreground bg-muted/20",
        };
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports Hub"
        description="Access central reporting dashboards and design custom self-service reports using the query builder."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Reports" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <RequirePermission permission={PERMISSIONS.REPORT_BUILDER_USE}>
              <Button variant="outline" size="sm" className="gap-1.5 h-9" asChild>
                <Link to="/reports/builder">
                  <Settings className="h-4 w-4" /> Custom Report Builder
                </Link>
              </Button>
            </RequirePermission>
            <RequirePermission permission={PERMISSIONS.REPORT_BUILDER_USE}>
              <Button size="sm" className="gap-1.5 h-9" asChild>
                <Link to="/reports/builder">
                  <Plus className="h-4 w-4" /> Design Custom Report
                </Link>
              </Button>
            </RequirePermission>
          </div>
        }
      />

      {/* Real-time search bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search 82+ prepackaged reports..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-10 w-full bg-background"
        />
      </div>

      {/* 4-column Prepackaged Reports layout matching Page 34 of the PDF */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredCategories.map((cat) => {
          const style = getCategoryHeaderStyle(cat.key);
          const CatIcon = style.icon;
          return (
            <div key={cat.title} className="flex flex-col space-y-3 bg-muted/10 border rounded-xl p-3.5 shadow-sm">
              <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg font-semibold text-sm ${style.accent}`}>
                <CatIcon className="h-4 w-4" />
                <span>{cat.title}</span>
                <span className="ml-auto bg-background/80 text-xs px-2 py-0.5 rounded-full border">
                  {cat.reports.length}
                </span>
              </div>
              <div className="space-y-2.5 overflow-y-auto max-h-[520px] pr-1.5 scrollbar-thin">
                {cat.reports.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No matching reports
                  </div>
                ) : (
                  cat.reports.map((report) => {
                    const isCallReport = report.title === "Call Report";
                    const isHospitalCallReport = report.title === "Hospital Call Report";
                    const isPobReport = report.title === "POB Report";
                    const isPobCallReport = report.title === "Call Report With POB";
                    return (
                      <Link
                        key={report.id}
                        to={
                          isCallReport
                            ? "/reports/dailycallreports"
                            : isHospitalCallReport
                            ? "/reports/hospitalcallreports"
                            : isPobReport
                            ? "/reports/pobreports"
                            : isPobCallReport
                            ? "/reports/callreportswithpob"
                            : "/reports/builder"
                        }
                        search={
                          (isCallReport || isHospitalCallReport || isPobReport || isPobCallReport)
                            ? undefined
                            : {
                                module: report.module,
                                templateName: report.title,
                              }
                        }
                        className="block group bg-card hover:bg-muted/10 border hover:border-primary hover:shadow-xs p-3.5 rounded-lg transition-all duration-150 cursor-pointer"
                      >
                        <div className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors mb-1">
                          {report.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground leading-relaxed">
                          {report.description}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Saved Reports Section */}
      <div className="bg-card border rounded-lg p-5 shadow-sm mt-8">
        <div className="flex items-center gap-2 mb-4">
          <FileBarChart2 className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold">Saved Custom Reports</h2>
        </div>

        <DataTable
          columns={columns}
          data={savedReports}
          isLoading={isLoading}
          getRowId={(item) => item.id}
        />
      </div>
    </div>
  );
}

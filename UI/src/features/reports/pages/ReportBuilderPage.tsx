import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/_authenticated.reports.builder";
import {
  FileText,
  FileSpreadsheet,
  Save,
  Play,
  Plus,
  Trash2,
  Settings2,
  FileSearch,
  Filter,
  ArrowUpDown,
  CornerDownRight,
  HelpCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { MODULE_CATALOGS } from "../fixtures";
import type { ReportModule, ReportColumn, ReportFilter, ReportSort, ReportDefinition } from "../types";
import {
  useSavedReport,
  useCreateSavedReport,
  useGenerateReport,
} from "../hooks";
import { exportToCSV, exportToExcel } from "../api/export";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";

export function ReportBuilderPage() {
  const { savedReportId, module: paramModule, templateName: paramTemplateName } = Route.useSearch();
  const queryClient = useCreateSavedReport();

  // Load Saved Report if specified in search query params
  const { data: loadedReport } = useSavedReport(savedReportId || "");

  // Builder States
  const [selectedModule, setSelectedModule] = React.useState<ReportModule>("employees");
  const [selectedColumns, setSelectedColumns] = React.useState<Record<string, boolean>>({});
  const [filters, setFilters] = React.useState<ReportFilter[]>([]);
  const [sortField, setSortField] = React.useState<string>("");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  // Save Modal States
  const [isSaveOpen, setIsSaveOpen] = React.useState(false);
  const [saveName, setSaveName] = React.useState("");
  const [saveDescription, setSaveDescription] = React.useState("");
  const [saveScope, setSaveScope] = React.useState<"private" | "shared">("private");

  // Catalog fields for active module
  const activeFields = React.useMemo(() => MODULE_CATALOGS[selectedModule] || [], [selectedModule]);

  // Load configuration from Saved Report or search parameters when retrieved
  React.useEffect(() => {
    if (loadedReport) {
      const def = loadedReport.reportDefinition;
      setSelectedModule(def.module);
      
      const cols: Record<string, boolean> = {};
      def.columns.forEach((c) => {
        cols[c.fieldName] = c.isVisible;
      });
      setSelectedColumns(cols);
      setFilters(def.filters);
      
      if (def.sorts && def.sorts.length > 0) {
        setSortField(def.sorts[0].fieldName);
        setSortDirection(def.sorts[0].direction);
      }
      setSaveName(loadedReport.name);
      setSaveDescription(def.description || "");
      setSaveScope(def.sharingScope);
    } else if (paramModule) {
      const targetMod = paramModule as ReportModule;
      setSelectedModule(targetMod);
      
      const fields = MODULE_CATALOGS[targetMod] || [];
      const cols: Record<string, boolean> = {};
      fields.forEach((f) => {
        cols[f.fieldName] = true;
      });
      setSelectedColumns(cols);
      setFilters([]);
      setSortField(fields[0]?.fieldName || "");
      setSortDirection("asc");
      
      if (paramTemplateName) {
        setSaveName(paramTemplateName);
        setSaveDescription(`Prepackaged ${paramTemplateName} report template.`);
      } else {
        setSaveName("");
        setSaveDescription("");
      }
    } else {
      // Default initializations
      const cols: Record<string, boolean> = {};
      activeFields.forEach((f) => {
        cols[f.fieldName] = true;
      });
      setSelectedColumns(cols);
      setFilters([]);
      setSortField(activeFields[0]?.fieldName || "");
      setSortDirection("asc");
      setSaveName("");
      setSaveDescription("");
    }
  }, [loadedReport, paramModule, paramTemplateName, activeFields, selectedModule]);

  // Reset columns & filters when module is switched manually
  const handleModuleChange = (mod: ReportModule) => {
    setSelectedModule(mod);
    const fields = MODULE_CATALOGS[mod] || [];
    const cols: Record<string, boolean> = {};
    fields.forEach((f) => {
      cols[f.fieldName] = true;
    });
    setSelectedColumns(cols);
    setFilters([]);
    setSortField(fields[0]?.fieldName || "");
    setSortDirection("asc");
  };

  const toggleColumn = (fieldName: string) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const addFilter = () => {
    const defaultField = activeFields[0]?.fieldName || "";
    setFilters((prev) => [
      ...prev,
      { fieldName: defaultField, operator: "equals", value: "" },
    ]);
  };

  const removeFilter = (idx: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateFilter = (idx: number, updates: Partial<ReportFilter>) => {
    setFilters((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, ...updates } : f))
    );
  };

  // Compile active configuration into a ReportDefinition
  const compiledDefinition = React.useMemo((): ReportDefinition => {
    const colsList: ReportColumn[] = activeFields.map((f, idx) => ({
      fieldName: f.fieldName,
      label: f.label,
      dataType: f.dataType,
      isVisible: !!selectedColumns[f.fieldName],
      sequenceOrder: idx,
    }));

    const sortsList: ReportSort[] = sortField
      ? [{ fieldName: sortField, direction: sortDirection }]
      : [];

    return {
      id: loadedReport?.reportDefinition.id || "draft-def",
      name: saveName || "Unsaved Custom Report",
      module: selectedModule,
      columns: colsList,
      filters,
      sorts: sortsList,
      sharingScope: saveScope,
      createdByEmployeeId: "emp-004", // Seeded user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [
    selectedModule,
    activeFields,
    selectedColumns,
    filters,
    sortField,
    sortDirection,
    saveName,
    saveScope,
    loadedReport,
  ]);

  // Execute Dynamic Reporting engine query
  const { data: previewData, isLoading, refetch } = useGenerateReport(compiledDefinition, true);

  const visibleHeaders = React.useMemo(() => {
    return compiledDefinition.columns.filter((c) => c.isVisible);
  }, [compiledDefinition]);

  const handleSaveReport = async () => {
    if (!saveName.trim()) {
      toast.error("Please specify a report name");
      return;
    }

    try {
      await queryClient.mutateAsync({
        ...compiledDefinition,
        name: saveName,
        description: saveDescription,
        sharingScope: saveScope,
      });
      toast.success(`Report "${saveName}" saved successfully`);
      setIsSaveOpen(false);
    } catch {
      toast.error("Failed to save custom report configuration");
    }
  };

  const triggerExport = (format: "csv" | "excel") => {
    if (!previewData || previewData.rows.length === 0) return;
    const headers = visibleHeaders.map((c) => ({ label: c.label, fieldName: c.fieldName }));
    const filename = `custom_report_${selectedModule}`;

    if (format === "csv") {
      exportToCSV(headers, previewData.rows, filename);
    } else {
      exportToExcel(headers, previewData.rows, filename);
    }
    toast.success(`Exporting ${previewData.rows.length} rows to ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custom Report Builder"
        description="Build multi-module tabular layouts, customize search filters, audit results, and execute spreadsheet downloads."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Reports", to: "/reports" },
          { label: "Report Builder" },
        ]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left Settings Panel */}
        <div className="xl:col-span-4 space-y-4">
          <Card className="border shadow-sm bg-card">
            <CardHeader className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-bold">Query Designer</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Select Module */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground uppercase">1. Select Data Source</Label>
                <UiSelect value={selectedModule} onValueChange={(v) => handleModuleChange(v as ReportModule)}>
                  <SelectTrigger className="w-full bg-background h-10">
                    <SelectValue placeholder="Select Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employees">Employees Registry</SelectItem>
                    <SelectItem value="doctors">Doctors Registry</SelectItem>
                    <SelectItem value="visits">Visits Ledger</SelectItem>
                    <SelectItem value="leaves">Leaves Calendar</SelectItem>
                    <SelectItem value="expenses">Expense Claims</SelectItem>
                    <SelectItem value="orders">Primary Orders</SelectItem>
                    <SelectItem value="targets">Sales Targets</SelectItem>
                    <SelectItem value="stockists">Stockist Profiles</SelectItem>
                    <SelectItem value="secondary_sales">Secondary Sales</SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>

              {/* Select Columns */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">2. Select Visible Fields</Label>
                <div className="border rounded-md p-3 max-h-[160px] overflow-y-auto bg-muted/20 grid grid-cols-2 gap-2">
                  {activeFields.map((f) => (
                    <div key={f.fieldName} className="flex items-center gap-2">
                      <Checkbox
                        id={`col-${f.fieldName}`}
                        checked={!!selectedColumns[f.fieldName]}
                        onCheckedChange={() => toggleColumn(f.fieldName)}
                      />
                      <label
                        htmlFor={`col-${f.fieldName}`}
                        className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {f.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configure Filters */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Filter className="h-3 w-3" /> 3. Filter Criteria
                  </Label>
                  <Button type="button" variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addFilter}>
                    <Plus className="h-3 w-3" /> Add Rule
                  </Button>
                </div>

                {filters.length === 0 ? (
                  <div className="text-center py-4 border border-dashed rounded-md bg-muted/10 text-xs text-muted-foreground">
                    No active filter rules. Showing all records.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {filters.map((filter, idx) => {
                      const activeFieldMeta = activeFields.find((f) => f.fieldName === filter.fieldName);
                      return (
                        <div key={idx} className="flex flex-col gap-2 border rounded-md p-2 bg-muted/10">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground">Filter Rule #{idx + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => removeFilter(idx)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            <UiSelect
                              value={filter.fieldName}
                              onValueChange={(v) => updateFilter(idx, { fieldName: v, value: "" })}
                            >
                              <SelectTrigger className="h-8 text-xs bg-background">
                                <SelectValue placeholder="Field" />
                              </SelectTrigger>
                              <SelectContent>
                                {activeFields.map((f) => (
                                  <SelectItem key={f.fieldName} value={f.fieldName}>{f.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </UiSelect>

                            <UiSelect
                              value={filter.operator}
                              onValueChange={(v) => updateFilter(idx, { operator: v as any })}
                            >
                              <SelectTrigger className="h-8 text-xs bg-background">
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                                {activeFieldMeta?.dataType === "number" && (
                                  <>
                                    <SelectItem value="gt">Greater Than</SelectItem>
                                    <SelectItem value="lt">Less Than</SelectItem>
                                  </>
                                )}
                                <SelectItem value="between">Between (Range)</SelectItem>
                                <SelectItem value="in">In (List)</SelectItem>
                              </SelectContent>
                            </UiSelect>
                          </div>

                          {filter.operator === "between" ? (
                            <div className="space-y-1">
                              <Input
                                placeholder="Min, Max (e.g. 100,500)"
                                className="h-8 text-xs bg-background"
                                value={filter.value}
                                onChange={(e) => updateFilter(idx, { value: e.target.value })}
                              />
                              <p className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                                <CornerDownRight className="h-2 w-2" /> Comma separated min, max range
                              </p>
                            </div>
                          ) : filter.operator === "in" ? (
                            <div className="space-y-1">
                              <Input
                                placeholder="Val1, Val2, Val3"
                                className="h-8 text-xs bg-background"
                                value={filter.value}
                                onChange={(e) => updateFilter(idx, { value: e.target.value })}
                              />
                              <p className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                                <CornerDownRight className="h-2 w-2" /> Comma separated select items
                              </p>
                            </div>
                          ) : activeFieldMeta?.dataType === "select" && activeFieldMeta.selectOptions ? (
                            <UiSelect value={filter.value} onValueChange={(v) => updateFilter(idx, { value: v })}>
                              <SelectTrigger className="h-8 text-xs bg-background">
                                <SelectValue placeholder="Select Option" />
                              </SelectTrigger>
                              <SelectContent>
                                {activeFieldMeta.selectOptions.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </UiSelect>
                          ) : (
                            <Input
                              type={activeFieldMeta?.dataType === "number" ? "number" : activeFieldMeta?.dataType === "date" ? "date" : "text"}
                              placeholder="Search value..."
                              className="h-8 text-xs bg-background"
                              value={filter.value}
                              onChange={(e) => updateFilter(idx, { value: e.target.value })}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sorting */}
              <div className="space-y-1.5 pt-2 border-t">
                <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                  <ArrowUpDown className="h-3 w-3" /> 4. Sort Results
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <UiSelect value={sortField} onValueChange={setSortField}>
                    <SelectTrigger className="h-10 bg-background">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeFields.map((f) => (
                        <SelectItem key={f.fieldName} value={f.fieldName}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>

                  <UiSelect value={sortDirection} onValueChange={(v) => setSortDirection(v as any)}>
                    <SelectTrigger className="h-10 bg-background">
                      <SelectValue placeholder="Direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Output Preview Panel */}
        <div className="xl:col-span-8 space-y-4">
          <Card className="border shadow-sm">
            <CardHeader className="p-4 border-b flex flex-row items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-bold">Preview Dataset</CardTitle>
                {previewData && (
                  <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                    {previewData.rowCount} Rows
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => refetch()}>
                  <Play className="h-3.5 w-3.5" /> Run
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => setIsSaveOpen(true)}>
                  <Save className="h-3.5 w-3.5 text-primary" /> Save
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  disabled={!previewData || previewData.rows.length === 0}
                  onClick={() => triggerExport("csv")}
                  title="Download CSV"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  disabled={!previewData || previewData.rows.length === 0}
                  onClick={() => triggerExport("excel")}
                  title="Download Excel"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto min-h-[300px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-sm gap-2">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                  Generating tabular report...
                </div>
              ) : !previewData || previewData.rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground text-sm gap-2">
                  <HelpCircle className="h-10 w-10 text-muted-foreground/40" />
                  No matching records found. Adjust your filter criteria.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b bg-muted/30 font-semibold uppercase text-muted-foreground">
                      {visibleHeaders.map((header) => (
                        <th key={header.fieldName} className="px-4 py-2.5">
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b last:border-0 hover:bg-muted/10">
                        {visibleHeaders.map((header) => {
                          const val = row[header.fieldName];
                          let formattedVal = val !== undefined && val !== null ? String(val) : "—";
                          if (typeof val === "boolean") {
                            formattedVal = val ? "True" : "False";
                          }
                          return (
                            <td key={header.fieldName} className="px-4 py-3 font-medium">
                              {formattedVal}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Report Definition Modal Dialog */}
      <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Save Report Configuration</DialogTitle>
            <DialogDescription>
              Persist your module fields, rules, and sorting settings to the dashboard hub.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="rep-name">Report Title *</Label>
              <Input
                id="rep-name"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Active MR Calls Analysis"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rep-desc">Description</Label>
              <Textarea
                id="rep-desc"
                rows={2}
                value={saveDescription}
                onChange={(e) => setSaveDescription(e.target.value)}
                placeholder="Lists doctor and firm visits with geo verification..."
              />
            </div>
            <div className="space-y-1">
              <Label>Sharing Scope</Label>
              <UiSelect value={saveScope} onValueChange={(v) => setSaveScope(v as any)}>
                <SelectTrigger className="w-full bg-background h-10">
                  <SelectValue placeholder="Scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private (Only Me)</SelectItem>
                  <SelectItem value="shared">Shared (All Roles)</SelectItem>
                </SelectContent>
              </UiSelect>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveReport} disabled={!saveName.trim()}>Save Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

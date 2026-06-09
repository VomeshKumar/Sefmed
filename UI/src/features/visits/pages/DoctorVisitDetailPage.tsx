import * as React from "react";
import { Printer, CheckCircle, XCircle, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDoctorsList } from "@/features/people/doctors/hooks";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import { useVisitTypesList } from "@/features/master-data/visit-types/hooks";
import { useDoctorVisitDetail, useDoctorVisits, useUpdateDoctorVisit } from "../hooks";
import { RequirePermission } from "@/lib/rbac/RequirePermission";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import type { DoctorVisit, VisitWorkflowStatus } from "../types";

interface DoctorVisitDetailPageProps {
  id: string;
}

type TabId = "details" | "history" | "feedback" | "images" | "presentation";
type SortDir = "asc" | "desc" | null;

const TABS: { id: TabId; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "history", label: "History" },
  { id: "feedback", label: "Feedback Form" },
  { id: "images", label: "Images" },
  { id: "presentation", label: "Visit Presentation" },
];

// ─── Status badge colours matching the screenshot ────────────────────────────
function HistoryStatusBadge({ status }: { status: VisitWorkflowStatus }) {
  const cfg: Record<string, string> = {
    approved: "bg-[#5b8a5b] text-white",
    closed:   "bg-[#6b7280] text-white",
    skipped:  "bg-[#dc4f25] text-white",
    cancelled:"bg-[#dc4f25] text-white",
    rejected: "bg-[#dc4f25] text-white",
    planned:  "bg-[#2563eb] text-white",
    open:     "bg-[#d97706] text-white",
    pending_approval: "bg-[#d97706] text-white",
    rescheduled: "bg-[#0891b2] text-white",
  };
  const label = status.replace("_", " ");
  const cls = cfg[status] ?? "bg-slate-200 text-slate-700";
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold capitalize ${cls}`}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
}

// ─── Details tab row ──────────────────────────────────────────────────────────
function DetailRow({
  label,
  value,
  shaded,
}: {
  label: string;
  value?: string | null;
  shaded: boolean;
}) {
  return (
    <div
      className={`flex items-start border-b border-slate-200 last:border-b-0 ${
        shaded ? "bg-slate-50" : "bg-white"
      }`}
    >
      <div className="w-[220px] shrink-0 px-4 py-2.5 text-sm font-medium text-[#008b8b] border-r border-slate-200">
        {label} :
      </div>
      <div className="flex-1 px-4 py-2.5 text-sm text-slate-800 break-words">
        {value || ""}
      </div>
    </div>
  );
}

// ─── Sortable column header ───────────────────────────────────────────────────
function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc")  return <ChevronUp   className="inline h-3.5 w-3.5 ml-1 shrink-0" />;
  if (dir === "desc") return <ChevronDown className="inline h-3.5 w-3.5 ml-1 shrink-0" />;
  return <ChevronsUpDown className="inline h-3.5 w-3.5 ml-1 shrink-0 text-slate-400" />;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function DoctorVisitDetailPage({ id }: DoctorVisitDetailPageProps) {
  const [activeTab, setActiveTab] = React.useState<TabId>("details");

  // ── History table state ──
  const [histSearch, setHistSearch] = React.useState("");
  const [histPage,   setHistPage]   = React.useState(1);
  const [histPer,    setHistPer]    = React.useState(5);
  const [sortCol,    setSortCol]    = React.useState<keyof DoctorVisit | "doctorName" | "city" | "employeeName" | null>(null);
  const [sortDir,    setSortDir]    = React.useState<SortDir>(null);

  const { data: visit, isLoading, error } = useDoctorVisitDetail(id);
  const { data: doctors    = [] } = useDoctorsList();
  const { data: employees  = [] } = useEmployeesList();
  const { data: zones      = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: visitTypes = [] } = useVisitTypesList();

  // History: all visits for the same doctor
  const { data: allDoctorVisits = [] } = useDoctorVisits(
    visit ? { doctorId: visit.doctorId } : undefined
  );

  const updateMutation = useUpdateDoctorVisit();

  const doctorMap    = React.useMemo(() => new Map(doctors.map   ((d) => [d.id, d])), [doctors]);
  const employeeMap  = React.useMemo(() => new Map(employees.map ((e) => [e.id, e])), [employees]);
  const zoneMap      = React.useMemo(() => new Map(zones.map     ((z) => [z.id, z])), [zones]);
  const territoryMap = React.useMemo(() => new Map(territories.map((t) => [t.id, t])), [territories]);
  const visitTypeMap = React.useMemo(() => new Map(visitTypes.map ((v) => [v.id, v])), [visitTypes]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleApprove = async () => {
    try {
      await updateMutation.mutateAsync({ id, data: { status: "approved" } });
      toast.success("Doctor visit approved successfully");
    } catch { toast.error("Failed to approve visit"); }
  };

  const handleReject = async () => {
    try {
      await updateMutation.mutateAsync({ id, data: { status: "rejected" } });
      toast.warning("Doctor visit marked as Rejected");
    } catch { toast.error("Failed to reject visit"); }
  };

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol !== col) { setSortCol(col); setSortDir("asc"); }
    else if (sortDir === "asc")  setSortDir("desc");
    else if (sortDir === "desc") { setSortCol(null); setSortDir(null); }
    setHistPage(1);
  };

  // ── Loading / error states ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading visit details...</span>
        </div>
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <h3 className="font-semibold text-lg">Visit details not found</h3>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // ── Derived data ──────────────────────────────────────────────────────────
  const doctor       = doctorMap.get(visit.doctorId);
  const employee     = employeeMap.get(visit.assignedEmployeeId);
  const jointEmployee= visit.jointEmployeeId ? employeeMap.get(visit.jointEmployeeId) : null;
  const visitType    = visitTypeMap.get(visit.visitTypeId);
  const territory    = doctor?.territoryId ? territoryMap.get(doctor.territoryId) : null;

  const visitIdDisplay = visit.id.replace(/-/g, "").substring(0, 9).toUpperCase();
  const formattedDate  = new Date(visit.date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  }).replace(/ /g, "-");

  const detailRows: { label: string; value?: string | null }[] = [
    { label: "Visit ID",                  value: visitIdDisplay },
    { label: "Date",                      value: formattedDate },
    { label: "Doctor Name",               value: doctor?.name?.toUpperCase() },
    { label: "Doctor Email",              value: doctor?.email },
    { label: "Doctor Phone",              value: doctor?.contact },
    { label: "Reported Clinic Address",   value: visit.geoAddress || doctor?.clinicAddress },
    { label: "Employee Name",             value: employee?.name },
    { label: "Accompanied By",            value: jointEmployee?.name },
    { label: "Reported From",             value: visit.geoAddress },
    { label: "Extra Info",                value: visitType?.name },
    { label: "Skipped Reason",            value: (visit.status === "skipped" || visit.status === "cancelled") ? visit.remarks : undefined },
    { label: "Info (Filled by Employee)", value: visit.discussionSummary },
  ];

  // ── History table ────────────────────────────────────────────────────────
  // Build enriched rows for searching / sorting
  type HistRow = {
    v: DoctorVisit;
    visitIdDisplay: string;
    doctorName: string;
    clinicAddress: string;
    city: string;
    employeeName: string;
    dateStr: string;
    dateMs: number;
  };

  const histRows: HistRow[] = allDoctorVisits.map((v) => {
    const doc  = doctorMap.get(v.doctorId);
    const emp  = employeeMap.get(v.assignedEmployeeId);
    const terr = doc?.territoryId ? territoryMap.get(doc.territoryId) : null;
    return {
      v,
      visitIdDisplay: v.id.replace(/-/g, "").substring(0, 9).toUpperCase(),
      doctorName:     doc?.name || "—",
      clinicAddress:  v.geoAddress || doc?.clinicAddress || "—",
      city:           terr?.name || "—",
      employeeName:   emp?.name || "—",
      dateStr:        new Date(v.date).toLocaleDateString("en-GB", { day:"2-digit", month:"2-digit", year:"numeric" }),
      dateMs:         new Date(v.date).getTime(),
    };
  });

  // Search filter
  const q = histSearch.trim().toLowerCase();
  const filtered = q
    ? histRows.filter((r) =>
        r.visitIdDisplay.toLowerCase().includes(q) ||
        r.doctorName.toLowerCase().includes(q) ||
        r.clinicAddress.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.employeeName.toLowerCase().includes(q) ||
        r.v.status.includes(q)
      )
    : histRows;

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol || !sortDir) return 0;
    let aVal: string | number = "";
    let bVal: string | number = "";
    if (sortCol === "date")         { aVal = a.dateMs;        bVal = b.dateMs; }
    else if (sortCol === "doctorName")   { aVal = a.doctorName;   bVal = b.doctorName; }
    else if (sortCol === "city")         { aVal = a.city;          bVal = b.city; }
    else if (sortCol === "employeeName") { aVal = a.employeeName;  bVal = b.employeeName; }
    else if (sortCol === "status")       { aVal = a.v.status;      bVal = b.v.status; }

    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ?  1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / histPer));
  const safePage   = Math.min(histPage, totalPages);
  const paginated  = sorted.slice((safePage - 1) * histPer, safePage * histPer);

  const ColHeader = ({
    label,
    col,
  }: {
    label: string;
    col: typeof sortCol;
  }) => (
    <th
      className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600 cursor-pointer select-none whitespace-nowrap border-b border-slate-200 bg-slate-50 hover:bg-slate-100"
      onClick={() => toggleSort(col)}
    >
      {label}
      <SortIcon dir={sortCol === col ? sortDir : null} />
    </th>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Page heading */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-bold text-slate-800">Visit Details</h1>
      </div>

      <div className="p-6">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">

          {/* Tab bar + action buttons */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 bg-white">
            <div className="flex items-center">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-[#008b8b]"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008b8b]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 py-2">
              {visit.status === "pending_approval" && (
                <RequirePermission permission={PERMISSIONS.VISIT_APPROVE}>
                  <Button onClick={handleApprove} size="sm" className="bg-success hover:bg-success/90 h-8 gap-1 text-xs">
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button onClick={handleReject} variant="destructive" size="sm" className="h-8 gap-1 text-xs">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                </RequirePermission>
              )}
              <Button
                onClick={() => window.print()}
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-white h-8 w-8 p-0"
                title="Print"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ── DETAILS TAB ── */}
          {activeTab === "details" && (
            <div>
              {detailRows.map((row, idx) => (
                <DetailRow key={row.label} label={row.label} value={row.value} shaded={idx % 2 === 0} />
              ))}
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {activeTab === "history" && (
            <div className="p-4">
              {/* Controls row */}
              <div className="flex items-center justify-between mb-3 gap-3">
                {/* Per-page */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <UiSelect
                    value={String(histPer)}
                    onValueChange={(v) => { setHistPer(Number(v)); setHistPage(1); }}
                  >
                    <SelectTrigger className="h-8 w-[70px] text-xs bg-white border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 25, 50].map((n) => (
                        <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  <span>per page</span>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="shrink-0">Search:</span>
                  <Input
                    className="h-8 w-48 text-xs bg-white border-slate-300"
                    value={histSearch}
                    onChange={(e) => { setHistSearch(e.target.value); setHistPage(1); }}
                    placeholder=""
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <ColHeader label="Visit ID"      col="id" />
                      <ColHeader label="Doctor Name"   col="doctorName" />
                      <ColHeader label="Clinic Address" col={null} />
                      <ColHeader label="City"          col="city" />
                      <ColHeader label="Employee Name" col="employeeName" />
                      <ColHeader label="Date"          col="date" />
                      <ColHeader label="Status"        col="status" />
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-8 text-center text-xs text-muted-foreground italic">
                          No visit history found.
                        </td>
                      </tr>
                    ) : (
                      paginated.map((row, idx) => (
                        <tr
                          key={row.v.id}
                          className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        >
                          {/* Visit ID — clickable teal link */}
                          <td className="px-3 py-2.5 border-b border-slate-100">
                            <Link
                              to="/visits/doctor/$id"
                              params={{ id: row.v.id }}
                              className="text-[#008b8b] hover:underline font-medium text-xs"
                            >
                              {row.visitIdDisplay}
                            </Link>
                          </td>

                          {/* Doctor Name */}
                          <td className="px-3 py-2.5 border-b border-slate-100 text-slate-700">
                            {row.doctorName}
                          </td>

                          {/* Clinic Address — multi-line, constrained width */}
                          <td className="px-3 py-2.5 border-b border-slate-100 max-w-[220px]">
                            <span
                              className="block text-xs text-slate-600 leading-relaxed"
                              style={{ wordBreak: "break-word" }}
                            >
                              {row.clinicAddress}
                            </span>
                          </td>

                          {/* City */}
                          <td className="px-3 py-2.5 border-b border-slate-100 text-slate-700 whitespace-nowrap">
                            {row.city}
                          </td>

                          {/* Employee Name */}
                          <td className="px-3 py-2.5 border-b border-slate-100 text-slate-700 whitespace-nowrap">
                            {row.employeeName}
                          </td>

                          {/* Date */}
                          <td className="px-3 py-2.5 border-b border-slate-100 text-slate-700 whitespace-nowrap nums-tabular">
                            {row.dateStr}
                          </td>

                          {/* Status */}
                          <td className="px-3 py-2.5 border-b border-slate-100">
                            <HistoryStatusBadge status={row.v.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
                  <span>
                    Showing {(safePage - 1) * histPer + 1}–
                    {Math.min(safePage * histPer, sorted.length)} of {sorted.length} entries
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={safePage === 1}
                      onClick={() => setHistPage(safePage - 1)}
                      className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                      .reduce<(number | "…")[]>((acc, p, i, arr) => {
                        if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === "…" ? (
                          <span key={`ellipsis-${i}`} className="px-2">…</span>
                        ) : (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setHistPage(p as number)}
                            className={`px-2.5 py-1 rounded border ${
                              safePage === p
                                ? "bg-[#008b8b] text-white border-[#008b8b]"
                                : "border-slate-300 bg-white hover:bg-slate-50"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    <button
                      type="button"
                      disabled={safePage === totalPages}
                      onClick={() => setHistPage(safePage + 1)}
                      className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── FEEDBACK FORM TAB ── */}
          {activeTab === "feedback" && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <p className="italic">No feedback form submitted.</p>
            </div>
          )}

          {/* ── IMAGES TAB ── */}
          {activeTab === "images" && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <p className="italic">No images attached.</p>
            </div>
          )}

          {/* ── VISIT PRESENTATION TAB ── */}
          {activeTab === "presentation" && (
            <div className="p-6">
              {visit.productsDiscussion && visit.productsDiscussion.length > 0 ? (
                <>
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                    Detailed Brands
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {visit.productsDiscussion.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  {visit.samplesDistributed && visit.samplesDistributed.length > 0 && (
                    <>
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                        Sample Distributions
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {visit.samplesDistributed.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between border p-2.5 rounded-md text-sm bg-card">
                            <span className="font-semibold text-foreground">{item.product}</span>
                            <span className="text-xs font-medium text-muted-foreground">Qty: {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="text-center text-sm text-muted-foreground italic">
                  No visit presentation recorded.
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

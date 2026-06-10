import { createFileRoute, redirect } from "@tanstack/react-router";
import { Activity, CheckCircle2, Receipt, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/data/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/data/EmptyState";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SEFMED CRM" }] }),
  beforeLoad: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) throw redirect({ to: "/login" });
    
    let user;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      throw redirect({ to: "/login" });
    }
    
    if (user.role !== "admin") {
      throw redirect({ to: "/reports" });
    }
  },
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="Today's field force performance, approvals and pipeline."
        breadcrumbs={[{ label: "Home", to: "/dashboard" }, { label: "Overview" }]}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Doctor visits today" value={128} delta={{ value: "12%", positive: true }} icon={Stethoscope} />
        <KpiCard label="Pending approvals" value={17} delta={{ value: "3 new", positive: false }} icon={CheckCircle2} />
        <KpiCard label="Expenses this month" value="₹4,82,300" delta={{ value: "8%", positive: true }} icon={Receipt} />
        <KpiCard label="Active reps" value={94} delta={{ value: "2%", positive: true }} icon={Activity} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Sales vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState title="Chart placeholder" description="Recharts widget lands in Phase 3." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState title="No activity yet" description="Audit-backed feed lands in Phase 3." />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
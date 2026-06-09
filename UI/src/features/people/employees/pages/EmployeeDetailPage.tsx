import * as React from "react";
import { ArrowLeft, User, Phone, Mail, Building, MapPin, Shield, Calendar, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge, type StatusTone } from "@/components/data/StatusBadge";
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import { useDesignationsList } from "@/features/master-data/designations/hooks";
import { useEmployeeDetail, useEmployeesList } from "../hooks";

interface EmployeeDetailPageProps {
  id: string;
}

export function EmployeeDetailPage({ id }: EmployeeDetailPageProps) {
  const { data: employee, isLoading, error } = useEmployeeDetail(id);
  const { data: allEmployees = [] } = useEmployeesList();

  const { data: divisions = [] } = useDivisionsList();
  const { data: zones = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: designations = [] } = useDesignationsList();

  const divisionMap = React.useMemo(() => new Map(divisions.map((d) => [d.id, d])), [divisions]);
  const zoneMap = React.useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);
  const territoryMap = React.useMemo(() => new Map(territories.map((t) => [t.id, t])), [territories]);
  const designationMap = React.useMemo(() => new Map(designations.map((d) => [d.id, d])), [designations]);
  const employeeMap = React.useMemo(() => new Map(allEmployees.map((e) => [e.id, e])), [allEmployees]);

  const directReports = React.useMemo(() => {
    return allEmployees.filter((e) => e.reportingTo === id);
  }, [allEmployees, id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading profile details...</span>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <h3 className="font-semibold text-lg">Employee profile not found</h3>
        <Button variant="outline" asChild>
          <Link to="/people/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Link>
        </Button>
      </div>
    );
  }

  const getStatusTone = (status: string): StatusTone => {
    if (status === "active") return "success";
    if (status === "onhold") return "warning";
    return "neutral";
  };

  const designation = designationMap.get(employee.designationId);
  const division = divisionMap.get(employee.divisionId);
  const zone = zoneMap.get(employee.zoneId);
  const territory = territoryMap.get(employee.territoryId);
  const manager = employee.reportingTo ? employeeMap.get(employee.reportingTo) : null;

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2.5 h-8">
          <Link to="/people/employees">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Employees
          </Link>
        </Button>
      </div>

      <PageHeader
        title={employee.name}
        description={`Profile details and reporting structures for ${designation ? designation.name : "Representative"}`}
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "People", to: "/people/employees" },
          { label: "Employees", to: "/people/employees" },
          { label: employee.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Info Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center pb-4 text-center border-b">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-10 w-10" />
            </div>
            <h3 className="mt-4 font-bold text-lg">{employee.name}</h3>
            <span className="text-xs uppercase font-semibold text-muted-foreground mt-0.5">
              {designation ? designation.name : "Representative"} ({employee.code})
            </span>
            <div className="mt-3">
              <StatusBadge tone={getStatusTone(employee.status)}>
                {employee.status === "active" ? "Active" : employee.status === "onhold" ? "On Hold" : "Inactive"}
              </StatusBadge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground nums-tabular">{employee.contact}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground uppercase text-xs font-semibold">
                Work Type: {employee.workType}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground text-xs">
                Added: {new Date(employee.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Bounded Context Maps */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Territory & Division parameters</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Building className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase">Division</div>
                  <div className="font-semibold text-sm mt-0.5">
                    {division ? `${division.name} (${division.code})` : "—"}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase">HQ / Territory</div>
                  <div className="font-semibold text-sm mt-0.5">
                    {territory ? `${territory.name} (${territory.code})` : "—"}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase">Zone</div>
                  <div className="font-semibold text-sm mt-0.5">
                    {zone ? `${zone.name} (${zone.code})` : "—"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting Line Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Corporate Hierarchy & Line Reporting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reporting manager */}
              <div className="border-b pb-4">
                <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Direct Report Manager</div>
                {manager ? (
                  <Link
                    to="/people/employees/$id"
                    params={{ id: manager.id }}
                    className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground truncate">{manager.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {designationMap.get(manager.designationId)?.name || "Manager"} ({manager.code})
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">This employee reports directly to corporate leadership.</span>
                )}
              </div>

              {/* Direct Reports */}
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
                  Direct Reports ({directReports.length})
                </div>
                {directReports.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {directReports.map((report) => (
                      <Link
                        key={report.id}
                        to="/people/employees/$id"
                        params={{ id: report.id }}
                        className="flex items-center gap-2.5 rounded-md border p-2.5 hover:bg-muted/50 transition-colors text-sm"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-foreground truncate">{report.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {designationMap.get(report.designationId)?.code || "MR"}
                          </div>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">No reporting field representatives assigned.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

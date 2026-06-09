import * as React from "react";
import { ArrowLeft, User, Phone, MapPin, Building, Shield, Calendar, ArrowUpRight, Stethoscope } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge, type StatusTone } from "@/components/data/StatusBadge";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useDoctorDetail } from "../hooks";

interface DoctorDetailPageProps {
  id: string;
}

export function DoctorDetailPage({ id }: DoctorDetailPageProps) {
  const { data: doctor, isLoading, error } = useDoctorDetail(id);
  const { data: employees = [] } = useEmployeesList();

  const { data: zones = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();

  const zoneMap = React.useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);
  const territoryMap = React.useMemo(() => new Map(territories.map((t) => [t.id, t])), [territories]);
  const employeeMap = React.useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading doctor details...</span>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <h3 className="font-semibold text-lg">Doctor profile not found</h3>
        <Button variant="outline" asChild>
          <Link to="/people/doctors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Doctors
          </Link>
        </Button>
      </div>
    );
  }

  const getStatusTone = (status: string): StatusTone => {
    if (status === "active") return "success";
    return "neutral";
  };

  const zone = zoneMap.get(doctor.zoneId);
  const territory = territoryMap.get(doctor.territoryId);
  const employee = employeeMap.get(doctor.assignedEmployeeId);
  const senior = employee?.reportingTo ? employeeMap.get(employee.reportingTo) : null;

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2.5 h-8">
          <Link to="/people/doctors">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Doctors
          </Link>
        </Button>
      </div>

      <PageHeader
        title={doctor.name}
        description={`Clinical profile and field assignments for ${doctor.name}`}
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "People", to: "/people/doctors" },
          { label: "Doctors", to: "/people/doctors" },
          { label: doctor.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Info Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center pb-4 text-center border-b">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Stethoscope className="h-10 w-10" />
            </div>
            <h3 className="mt-4 font-bold text-lg">{doctor.name}</h3>
            <span className="text-xs uppercase font-semibold text-muted-foreground mt-0.5">
              {doctor.speciality} ({doctor.doctorCode})
            </span>
            <div className="mt-3">
              <StatusBadge tone={getStatusTone(doctor.status)}>
                {doctor.status === "active" ? "Active" : "Inactive"}
              </StatusBadge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase">Reg No</div>
                <div className="font-semibold text-foreground font-mono">{doctor.registrationNumber}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase">Category</div>
                <div className="font-semibold text-foreground">{doctor.category}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase">Contact Number</div>
                <div className="font-semibold text-foreground nums-tabular">{doctor.contact}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase">Created At</div>
                <div className="font-semibold text-foreground">
                  {new Date(doctor.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Territory & assigned rep details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hospital & Location Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Building className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase">Hospital / Clinic</div>
                  <div className="font-semibold text-sm mt-0.5">{doctor.hospitalName || "—"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase">Address</div>
                  <div className="font-semibold text-sm mt-0.5">{doctor.clinicAddress || "—"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase">HQ / Territory (City)</div>
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

          {/* Assigned Representative & Manager Hierarchy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Representative Assignment & Reporting Hierarchy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
                  Assigned Field Representative (MR)
                </div>
                {employee ? (
                  <Link
                    to="/people/employees/$id"
                    params={{ id: employee.id }}
                    className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground truncate">{employee.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Code: {employee.code} | Contact: {employee.contact}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">No field representative assigned to this doctor.</span>
                )}
              </div>

              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
                  Immediate Reporting Manager
                </div>
                {senior ? (
                  <Link
                    to="/people/employees/$id"
                    params={{ id: senior.id }}
                    className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground truncate">{senior.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Code: {senior.code} | Contact: {senior.contact}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">No manager/senior representative link found.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

import * as React from "react";
import { ArrowLeft, User, Phone, MapPin, Building, Shield, Calendar, ArrowUpRight, Stethoscope, CheckCircle, XCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge, type StatusTone } from "@/components/data/StatusBadge";
import { toast } from "sonner";
import { useDoctorsList } from "@/features/people/doctors/hooks";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useVisitTypesList } from "@/features/master-data/visit-types/hooks";
import { useDoctorVisitDetail, useUpdateDoctorVisit } from "../hooks";
import type { VisitWorkflowStatus, GeoVerificationStatus } from "../types";

interface DoctorVisitDetailPageProps {
  id: string;
}

export function DoctorVisitDetailPage({ id }: DoctorVisitDetailPageProps) {
  const { data: visit, isLoading, error } = useDoctorVisitDetail(id);
  const { data: doctors = [] } = useDoctorsList();
  const { data: employees = [] } = useEmployeesList();
  const { data: visitTypes = [] } = useVisitTypesList();

  const updateMutation = useUpdateDoctorVisit();

  const doctorMap = React.useMemo(() => new Map(doctors.map((d) => [d.id, d])), [doctors]);
  const employeeMap = React.useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);
  const visitTypeMap = React.useMemo(() => new Map(visitTypes.map((v) => [v.id, v])), [visitTypes]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading call details...</span>
        </div>
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <h3 className="font-semibold text-lg">Call report details not found</h3>
        <Button variant="outline" asChild>
          <Link to="/visits/doctor">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Doctor Calls
          </Link>
        </Button>
      </div>
    );
  }

  const handleApprove = async () => {
    try {
      await updateMutation.mutateAsync({
        id: visit.id,
        data: { status: "approved" },
      });
      toast.success("Doctor visit approved successfully");
    } catch (err) {
      toast.error("Failed to approve visit");
    }
  };

  const handleReject = async () => {
    try {
      await updateMutation.mutateAsync({
        id: visit.id,
        data: { status: "rejected" },
      });
      toast.warning("Doctor visit marked as Rejected");
    } catch (err) {
      toast.error("Failed to reject visit");
    }
  };

  const getGeoTone = (status?: GeoVerificationStatus): StatusTone => {
    if (status === "Verified") return "success";
    if (status === "Outside Radius") return "warning";
    return "neutral";
  };

  const getWorkflowTone = (status: VisitWorkflowStatus): StatusTone => {
    switch (status) {
      case "approved":
      case "closed":
        return "success";
      case "pending_approval":
      case "open":
        return "warning";
      case "rejected":
      case "cancelled":
        return "danger";
      case "rescheduled":
        return "info";
      default:
        return "neutral";
    }
  };

  const formatWorkflowName = (status: VisitWorkflowStatus) => {
    return status.replace("_", " ").toUpperCase();
  };

  const doctor = doctorMap.get(visit.doctorId);
  const employee = employeeMap.get(visit.assignedEmployeeId);
  const jointEmployee = visit.jointEmployeeId ? employeeMap.get(visit.jointEmployeeId) : null;
  const visitType = visitTypeMap.get(visit.visitTypeId);

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2.5 h-8">
          <Link to="/visits/doctor">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Doctor Calls
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`Call Report Detail`}
        description={`GPS Geolocation and brand detailing logs for representative call.`}
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Visits", to: "/visits/doctor" },
          { label: "Doctor Calls", to: "/visits/doctor" },
          { label: `Call Detail` },
        ]}
        actions={
          visit.status === "pending_approval" && (
            <div className="flex items-center gap-2">
              <Button onClick={handleApprove} className="bg-success hover:bg-success/90 h-9 gap-1 text-xs">
                <CheckCircle className="h-4 w-4" />
                <span>Approve Visit</span>
              </Button>
              <Button onClick={handleReject} variant="destructive" className="h-9 gap-1 text-xs">
                <XCircle className="h-4 w-4" />
                <span>Reject Visit</span>
              </Button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Verification Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center pb-4 text-center border-b">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Stethoscope className="h-10 w-10" />
            </div>
            <h3 className="mt-4 font-bold text-lg">{doctor ? doctor.name : "Unknown Doctor"}</h3>
            <span className="text-xs uppercase font-semibold text-muted-foreground mt-0.5">
              Call ID: {visit.id}
            </span>
            <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
              <StatusBadge tone={getWorkflowTone(visit.status)}>
                {formatWorkflowName(visit.status)}
              </StatusBadge>
              <StatusBadge tone={getGeoTone(visit.geoVerificationStatus)}>
                GPS: {visit.geoVerificationStatus || "Unverified"}
              </StatusBadge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase">Scheduled Call Date</div>
                <div className="font-semibold text-foreground">{new Date(visit.date).toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase">Visit Config</div>
                <div className="font-semibold text-foreground">{visitType ? visitType.name : "Regular Call"}</div>
              </div>
            </div>
            {visit.geoAddress && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-medium text-muted-foreground uppercase">GPS Verified Address</div>
                  <div className="font-semibold text-foreground leading-normal">{visit.geoAddress}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 nums-tabular">
                    Lat/Long: {visit.latitude}, {visit.longitude}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Brand Detailing & Sample Distribution */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Brand Detailing & Discussion logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase">Discussion Summary</div>
                <p className="mt-1.5 text-sm text-foreground leading-relaxed bg-muted/30 p-3 rounded-md border">
                  {visit.discussionSummary || "No discussion summary logged."}
                </p>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Detailed Brands</div>
                {visit.productsDiscussion && visit.productsDiscussion.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {visit.productsDiscussion.map((p) => (
                      <span
                        key={p}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">No products detailed during call.</span>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Sample Distributions</div>
                {visit.samplesDistributed && visit.samplesDistributed.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {visit.samplesDistributed.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border p-2.5 rounded-md text-sm bg-card"
                      >
                        <span className="font-semibold text-foreground">{item.product}</span>
                        <span className="text-xs font-medium text-muted-foreground">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">No samples distributed.</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Representative & Ridealong Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Representative & Joint Ridealong Setup</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Reporting Field Representative</div>
                {employee ? (
                  <Link
                    to="/people/employees/$id"
                    params={{ id: employee.id }}
                    className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-foreground truncate">{employee.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Code: {employee.code}</div>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>

              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Accompanying Senior (Joint Visit)</div>
                {jointEmployee ? (
                  <Link
                    to="/people/employees/$id"
                    params={{ id: jointEmployee.id }}
                    className="flex items-center gap-3 rounded-md border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-700 shrink-0">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-foreground truncate">{jointEmployee.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">Code: {jointEmployee.code}</div>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground italic leading-10">Regular single-rep visit. No accompanying senior.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

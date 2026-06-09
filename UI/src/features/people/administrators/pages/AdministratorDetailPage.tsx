import * as React from "react";
import { ArrowLeft, User, Phone, Mail, Building, MapPin, Shield, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/data/StatusBadge";
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useAdministratorDetail } from "../hooks";

interface Props {
  id: string;
}

export function AdministratorDetailPage({ id }: Props) {
  const { data: admin, isLoading, error } = useAdministratorDetail(id);

  const { data: divisions = [] } = useDivisionsList();
  const { data: zones = [] } = useZonesList();

  const divisionMap = React.useMemo(() => new Map(divisions.map((d) => [d.id, d])), [divisions]);
  const zoneMap = React.useMemo(() => new Map(zones.map((z) => [z.id, z])), [zones]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading admin profile...</span>
        </div>
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <h3 className="font-semibold text-lg">Administrator not found</h3>
        <Button variant="outline" asChild>
          <Link to="/people/administrators">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Administrators
          </Link>
        </Button>
      </div>
    );
  }

  const division = divisionMap.get(admin.divisionId);
  const zone = zoneMap.get(admin.zoneId);

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2.5 h-8">
          <Link to="/people/administrators">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Administrators
          </Link>
        </Button>
      </div>

      <PageHeader
        title={admin.name}
        description={`Administrator profile settings and scopes.`}
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "People", to: "/people/administrators" },
          { label: "Administrators", to: "/people/administrators" },
          { label: admin.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center pb-4 text-center border-b">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-10 w-10" />
            </div>
            <h3 className="mt-4 font-bold text-lg">{admin.name}</h3>
            <span className="text-xs uppercase font-semibold text-muted-foreground mt-0.5">
              Role: {admin.role}
            </span>
            <div className="mt-3">
              <StatusBadge tone={admin.status === "active" ? "success" : "neutral"}>
                {admin.status === "active" ? "Active" : "Inactive"}
              </StatusBadge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{admin.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="nums-tabular">{admin.contact}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="capitalize">Admin Type: {admin.role}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Added: {new Date(admin.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <h3 className="text-base font-semibold">Scoped Security Parameters</h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 text-sm">
            <div className="flex items-start gap-3">
              <Building className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase">Assigned Division</div>
                <div className="font-semibold mt-0.5">{division ? division.name : "Global"}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase">Assigned Zone Scope</div>
                <div className="font-semibold mt-0.5">{zone ? zone.name : "Global"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

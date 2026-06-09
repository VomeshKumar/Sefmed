import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
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
import { useCreateDoctorVisit } from "../hooks";
import { createDoctorVisitSchema, type DoctorVisitFormValues } from "../schemas";

export function AddDoctorVisitPage() {
  const navigate = useNavigate();

  // Cascading Selection States
  const [selectedZone, setSelectedZone] = React.useState<string>("");
  const [selectedTerritory, setSelectedTerritory] = React.useState<string>("");

  // Queries
  const { data: zones = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: doctors = [] } = useDoctorsList();
  const { data: employees = [] } = useEmployeesList();

  // Mutation
  const createMutation = useCreateDoctorVisit();

  // Form Setup
  const form = useForm<DoctorVisitFormValues>({
    resolver: zodResolver(createDoctorVisitSchema),
    defaultValues: {
      date: "",
      doctorId: "",
      assignedEmployeeId: "",
      visitTypeId: "visit-doctor",
      status: "planned",
      jointVisit: false,
      jointEmployeeId: "",
      discussionSummary: "",
      productsDiscussion: [],
      samplesDistributed: [],
      remarks: "",
      latitude: 21.1904,
      longitude: 81.2849,
      geoAddress: "Sefmed Headquarters, Raipur, India",
      geoVerificationStatus: "Verified",
    },
  });

  const watchDoctorId = form.watch("doctorId");
  const watchEmployeeId = form.watch("assignedEmployeeId");

  // Filtering Territories based on Zone
  const filteredTerritories = React.useMemo(() => {
    if (!selectedZone) return [];
    return territories.filter((t) => t.zoneId === selectedZone);
  }, [selectedZone, territories]);

  // Filtering Doctors based on Territory (City)
  const filteredDoctors = React.useMemo(() => {
    if (!selectedTerritory) return [];
    return doctors.filter((d) => d.territoryId === selectedTerritory);
  }, [selectedTerritory, doctors]);

  // Auto-fill representative employee when a doctor is selected
  React.useEffect(() => {
    if (watchDoctorId) {
      const selectedDoc = doctors.find((d) => d.id === watchDoctorId);
      if (selectedDoc?.assignedEmployeeId) {
        form.setValue("assignedEmployeeId", selectedDoc.assignedEmployeeId);
      }
    }
  }, [watchDoctorId, doctors, form]);

  const handleZoneChange = (val: string) => {
    setSelectedZone(val);
    setSelectedTerritory("");
    form.setValue("doctorId", "");
    form.setValue("assignedEmployeeId", "");
  };

  const handleTerritoryChange = (val: string) => {
    setSelectedTerritory(val);
    form.setValue("doctorId", "");
    form.setValue("assignedEmployeeId", "");
  };

  const onSubmit = async (values: DoctorVisitFormValues) => {
    try {
      // Ensure the date is formatted as ISO
      const isoDate = new Date(values.date).toISOString();
      await createMutation.mutateAsync({
        ...values,
        date: isoDate,
      });
      toast.success("Doctor visit planned successfully");
      navigate({ to: "/visits/doctor" });
    } catch (err) {
      toast.error("Failed to plan doctor visit");
    }
  };

  const handleCancel = () => {
    navigate({ to: "/visits/doctor" });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 flex flex-col items-center justify-start">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mt-4">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-800">Add Visits</h1>
        </div>

        {/* Card Body & Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
          <div className="w-full max-w-xl mx-auto space-y-5 py-4">
            {/* Zone Select */}
            <div className="flex items-center">
              <div className="w-[180px] text-right pr-6 shrink-0 text-sm font-semibold text-slate-700">
                Zone <span className="text-destructive font-bold">*</span>
              </div>
              <div className="flex-1 max-w-[420px]">
                <UiSelect value={selectedZone} onValueChange={handleZoneChange}>
                  <SelectTrigger className="w-full bg-white h-10 border-slate-200 focus:ring-[#008b8b]">
                    <SelectValue placeholder="Select Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((z) => (
                      <SelectItem key={z.id} value={z.id}>
                        {z.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
              </div>
            </div>

            {/* City (Territory) Select */}
            <div className="flex items-center">
              <div className="w-[180px] text-right pr-6 shrink-0 text-sm font-semibold text-slate-700">
                City <span className="text-destructive font-bold">*</span>
              </div>
              <div className="flex-1 max-w-[420px]">
                <UiSelect
                  value={selectedTerritory}
                  onValueChange={handleTerritoryChange}
                  disabled={!selectedZone}
                >
                  <SelectTrigger className="w-full bg-white h-10 border-slate-200 focus:ring-[#008b8b]">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTerritories.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
              </div>
            </div>

            {/* Doctor Select */}
            <div className="flex items-center">
              <div className="w-[180px] text-right pr-6 shrink-0 text-sm font-semibold text-slate-700">
                Doctor <span className="text-destructive font-bold">*</span>
              </div>
              <div className="flex-1 max-w-[420px]">
                <UiSelect
                  value={form.watch("doctorId")}
                  onValueChange={(val) => form.setValue("doctorId", val)}
                  disabled={!selectedTerritory}
                >
                  <SelectTrigger className="w-full bg-white h-10 border-slate-200 focus:ring-[#008b8b]">
                    <SelectValue placeholder="Select Doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDoctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} ({d.speciality || "No Speciality"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
                {form.formState.errors.doctorId && (
                  <p className="text-xs text-destructive mt-1 ml-1">
                    {form.formState.errors.doctorId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Employee (Representative) Select */}
            <div className="flex items-center">
              <div className="w-[180px] text-right pr-6 shrink-0 text-sm font-semibold text-slate-700">
                <span className="text-destructive font-bold">*</span>
              </div>
              <div className="flex-1 max-w-[420px]">
                <UiSelect
                  value={watchEmployeeId}
                  onValueChange={(val) => form.setValue("assignedEmployeeId", val)}
                >
                  <SelectTrigger className="w-full bg-white h-10 border-slate-200 focus:ring-[#008b8b]">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.name} ({e.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
                {form.formState.errors.assignedEmployeeId && (
                  <p className="text-xs text-destructive mt-1 ml-1">
                    {form.formState.errors.assignedEmployeeId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Visit Date Input */}
            <div className="flex items-center">
              <div className="w-[180px] text-right pr-6 shrink-0 text-sm font-semibold text-slate-700">
                Visit Date <span className="text-destructive font-bold">*</span>
              </div>
              <div className="flex-1 max-w-[420px]">
                <Input
                  type="date"
                  placeholder="Select Visit Date"
                  className="w-full bg-white h-10 border-slate-200 focus:ring-[#008b8b]"
                  {...form.register("date")}
                />
                {form.formState.errors.date && (
                  <p className="text-xs text-destructive mt-1 ml-1">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Teal Divider */}
          <div className="border-t border-[#008b8b]/35 my-8"></div>

          {/* Buttons Row */}
          <div className="w-full max-w-xl mx-auto flex items-center">
            <div className="w-[180px] shrink-0"></div>
            <div className="flex-1 flex items-center gap-3">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-[#008b8b] hover:bg-[#007373] text-white px-6 h-10 rounded font-medium border-none"
              >
                {createMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="bg-[#f3f4f6] text-slate-700 border-none hover:bg-slate-200 px-6 h-10 rounded font-medium"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

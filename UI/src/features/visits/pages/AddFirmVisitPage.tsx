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
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import { useStockistsList } from "@/features/sales/hooks";
import { useCreateFirmVisit } from "../hooks";
import { createFirmVisitSchema, type FirmVisitFormValues } from "../schemas";

export function AddFirmVisitPage() {
  const navigate = useNavigate();

  // Cascading Selection States
  const [selectedZone, setSelectedZone] = React.useState<string>("");
  const [selectedTerritory, setSelectedTerritory] = React.useState<string>("");

  // Queries
  const { data: zones = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: stockists = [] } = useStockistsList();
  const { data: employees = [] } = useEmployeesList();

  // Mutation
  const createMutation = useCreateFirmVisit();

  // Form Setup
  const form = useForm<FirmVisitFormValues>({
    resolver: zodResolver(createFirmVisitSchema),
    defaultValues: {
      date: "",
      firmName: "",
      firmType: "chemist",
      assignedEmployeeId: "",
      status: "planned",
      purpose: "",
      remarks: "",
      latitude: 21.1904,
      longitude: 81.2849,
      geoAddress: "Sefmed Headquarters, Raipur, India",
      geoVerificationStatus: "Verified",
    },
  });

  const watchFirmName = form.watch("firmName");
  const watchEmployeeId = form.watch("assignedEmployeeId");
  const watchFirmType = form.watch("firmType");

  // Filtering Territories based on Zone
  const filteredTerritories = React.useMemo(() => {
    if (!selectedZone) return [];
    return territories.filter((t) => t.zoneId === selectedZone);
  }, [selectedZone, territories]);

  // Filtering Stockists (Firms) based on Territory (City)
  const filteredStockists = React.useMemo(() => {
    if (!selectedTerritory) return [];
    return stockists.filter((s) => s.territoryId === selectedTerritory);
  }, [selectedTerritory, stockists]);

  // Auto-fill firm type and representative employee when a stockist is selected
  React.useEffect(() => {
    if (watchFirmName) {
      const selectedStockist = stockists.find((s) => s.name === watchFirmName);
      if (selectedStockist) {
        // Map stockist type to institution type (chemist | stockist | hospital)
        let mappedType: "chemist" | "stockist" | "hospital" = "stockist";
        const typeStr = selectedStockist.type?.toLowerCase() || "";
        if (typeStr.includes("chemist")) {
          mappedType = "chemist";
        } else if (typeStr.includes("hospital") || typeStr.includes("clinic")) {
          mappedType = "hospital";
        }
        form.setValue("firmType", mappedType);

        // Pre-fill representative if available in stockist details
        if (selectedStockist.employeeAssigned) {
          const emp = employees.find(
            (e) =>
              e.name.toLowerCase() === selectedStockist.employeeAssigned?.toLowerCase()
          );
          if (emp) {
            form.setValue("assignedEmployeeId", emp.id);
          }
        }
      }
    }
  }, [watchFirmName, stockists, employees, form]);

  const handleZoneChange = (val: string) => {
    setSelectedZone(val);
    setSelectedTerritory("");
    form.setValue("firmName", "");
    form.setValue("assignedEmployeeId", "");
  };

  const handleTerritoryChange = (val: string) => {
    setSelectedTerritory(val);
    form.setValue("firmName", "");
    form.setValue("assignedEmployeeId", "");
  };

  const onSubmit = async (values: FirmVisitFormValues) => {
    try {
      // Ensure the date is formatted as ISO
      const isoDate = new Date(values.date).toISOString();
      await createMutation.mutateAsync({
        ...values,
        date: isoDate,
      });
      toast.success("Institution/Firm visit planned successfully");
      navigate({ to: "/visits/firm" });
    } catch (err) {
      toast.error("Failed to plan firm visit");
    }
  };

  const handleCancel = () => {
    navigate({ to: "/visits/firm" });
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

            {/* Firm/Stockist Name Select */}
            <div className="flex items-center">
              <div className="w-[180px] text-right pr-6 shrink-0 text-sm font-semibold text-slate-700">
                Firm Name <span className="text-destructive font-bold">*</span>
              </div>
              <div className="flex-1 max-w-[420px]">
                <UiSelect
                  value={form.watch("firmName")}
                  onValueChange={(val) => form.setValue("firmName", val)}
                  disabled={!selectedTerritory}
                >
                  <SelectTrigger className="w-full bg-white h-10 border-slate-200 focus:ring-[#008b8b]">
                    <SelectValue placeholder="Select Firm Name" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStockists.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name} ({s.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
                {form.formState.errors.firmName && (
                  <p className="text-xs text-destructive mt-1 ml-1">
                    {form.formState.errors.firmName.message}
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

            {/* Institution Type Select */}
            <div className="flex items-center">
              <div className="w-[180px] text-right pr-6 shrink-0 text-sm font-semibold text-slate-700">
                Institution Type <span className="text-destructive font-bold">*</span>
              </div>
              <div className="flex-1 max-w-[420px]">
                <UiSelect
                  value={watchFirmType}
                  onValueChange={(val: "chemist" | "stockist" | "hospital") =>
                    form.setValue("firmType", val)
                  }
                >
                  <SelectTrigger className="w-full bg-white h-10 border-slate-200 focus:ring-[#008b8b]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chemist">Chemist / Retailer</SelectItem>
                    <SelectItem value="stockist">Stockist / Wholesaler</SelectItem>
                    <SelectItem value="hospital">Hospital / Clinic Premises</SelectItem>
                  </SelectContent>
                </UiSelect>
              </div>
            </div>

            {/* Purpose Input */}
            <div className="flex items-center">
              <div className="w-[180px] text-right pr-6 shrink-0 text-sm font-semibold text-slate-700">
                Visit Purpose <span className="text-destructive font-bold">*</span>
              </div>
              <div className="flex-1 max-w-[420px]">
                <Input
                  type="text"
                  placeholder="e.g. Audit stocks, collect POB, etc."
                  className="w-full bg-white h-10 border-slate-200 focus:ring-[#008b8b]"
                  {...form.register("purpose")}
                />
                {form.formState.errors.purpose && (
                  <p className="text-xs text-destructive mt-1 ml-1">
                    {form.formState.errors.purpose.message}
                  </p>
                )}
              </div>
            </div>

            {/* Remarks Input */}
            <div className="flex items-center">
              <div className="w-[180px] text-right pr-6 shrink-0 text-sm font-semibold text-slate-700">
                Remarks
              </div>
              <div className="flex-1 max-w-[420px]">
                <Input
                  type="text"
                  placeholder="Optional planning remarks..."
                  className="w-full bg-white h-10 border-slate-200 focus:ring-[#008b8b]"
                  {...form.register("remarks")}
                />
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

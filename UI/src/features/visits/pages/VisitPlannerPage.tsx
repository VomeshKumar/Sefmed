import * as React from "react";
import { Calendar as CalendarIcon, ListPlus, Users, Plus, Trash2, MapPin, Stethoscope, ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import { useVisitTypesList } from "@/features/master-data/visit-types/hooks";
import { usePlannerItems, useCreatePlannerItem, useDeletePlannerItem } from "../hooks";
import { createVisitPlannerSchema, type VisitPlannerFormValues } from "../schemas";
import type { VisitPlanner } from "../types";

export function VisitPlannerPage() {
  const [activeTab, setActiveTab] = React.useState("monthly");
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date(2026, 5, 5)); // June 5, 2026 default

  // Queries
  const { data: doctors = [] } = useDoctorsList();
  const { data: employees = [] } = useEmployeesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: visitTypes = [] } = useVisitTypesList();
  const { data: plannerItems = [] } = usePlannerItems();

  // Mutations
  const createMutation = useCreatePlannerItem();
  const deleteMutation = useDeletePlannerItem();

  // Maps
  const doctorMap = React.useMemo(() => new Map(doctors.map((d) => [d.id, d])), [doctors]);
  const employeeMap = React.useMemo(() => new Map(employees.map((e) => [e.id, e])), [employees]);
  const territoryMap = React.useMemo(() => new Map(territories.map((t) => [t.id, t])), [territories]);
  const visitTypeMap = React.useMemo(() => new Map(visitTypes.map((v) => [v.id, v])), [visitTypes]);

  // Form Setup
  const form = useForm<VisitPlannerFormValues>({
    resolver: zodResolver(createVisitPlannerSchema),
    defaultValues: {
      plannedDate: new Date(2026, 5, 5).toISOString().substring(0, 10),
      assignedEmployeeId: "",
      doctorId: "",
      firmName: "",
      territoryId: "",
      visitTypeId: "visit-doctor",
      status: "planned",
      remarks: "",
    },
  });

  const watchDoctor = form.watch("doctorId");
  const watchEmployee = form.watch("assignedEmployeeId");

  // Sync territory automatically when doctor is selected
  React.useEffect(() => {
    if (watchDoctor) {
      const doc = doctorMap.get(watchDoctor);
      if (doc) {
        form.setValue("territoryId", doc.territoryId);
        if (doc.assignedEmployeeId) {
          form.setValue("assignedEmployeeId", doc.assignedEmployeeId);
        }
      }
    }
  }, [watchDoctor, doctorMap, form]);

  // Calendar builder helper (June 2026)
  const daysInJune = 30;
  const startDayOffset = 1; // June 1, 2026 is Monday (offset 1 in 0-indexed Sun=0 framework)

  const plannedVisitsByDay = React.useMemo(() => {
    const counts: Record<number, number> = {};
    plannerItems.forEach((item) => {
      const d = new Date(item.plannedDate);
      if (d.getFullYear() === 2026 && d.getMonth() === 5) {
        const dateNum = d.getDate();
        counts[dateNum] = (counts[dateNum] || 0) + 1;
      }
    });
    return counts;
  }, [plannerItems]);

  const dailyPlannerItems = React.useMemo(() => {
    return plannerItems.filter((item) => {
      const d = new Date(item.plannedDate);
      return (
        d.getFullYear() === selectedDate.getFullYear() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getDate() === selectedDate.getDate()
      );
    });
  }, [plannerItems, selectedDate]);

  const handleSelectDay = (dayNum: number) => {
    setSelectedDate(new Date(2026, 5, dayNum));
    setActiveTab("daily");
  };

  const onSubmit = async (values: VisitPlannerFormValues) => {
    try {
      // Create planning entry
      await createMutation.mutateAsync({
        ...values,
        doctorId: values.doctorId || undefined,
        firmName: values.firmName || undefined,
      });
      toast.success("Visit plan created and registered in calendar");
      form.reset({
        plannedDate: selectedDate.toISOString().substring(0, 10),
        assignedEmployeeId: "",
        doctorId: "",
        firmName: "",
        territoryId: "",
        visitTypeId: "visit-doctor",
        status: "planned",
        remarks: "",
      });
      setActiveTab("monthly");
    } catch (err) {
      toast.error("Failed to create visit plan");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Visit plan removed");
    } catch (err) {
      toast.error("Failed to remove plan");
    }
  };

  return (
    <>
      <PageHeader
        title="Visit Planner"
        description="Configure monthly call grids, daily schedules, and territorial assignments for reps."
        breadcrumbs={[
          { label: "Home", to: "/dashboard" },
          { label: "Visits", to: "/visits/doctor" },
          { label: "Planner" },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md h-10">
          <TabsTrigger value="monthly" className="gap-1 text-xs">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>Monthly Planner</span>
          </TabsTrigger>
          <TabsTrigger value="daily" className="gap-1 text-xs">
            <ListPlus className="h-3.5 w-3.5" />
            <span>Daily Planner</span>
          </TabsTrigger>
          <TabsTrigger value="assignment" className="gap-1 text-xs">
            <Users className="h-3.5 w-3.5" />
            <span>Assignment View</span>
          </TabsTrigger>
        </TabsList>

        {/* Monthly Planner Calendar Tab */}
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg">Monthly Call Grid</CardTitle>
                <CardDescription>June 2026 planner details</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-semibold px-2">June 2026</span>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground uppercase border-b pb-2 mb-2">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {/* Pad first week empty cells */}
                {Array.from({ length: startDayOffset }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-20 bg-muted/10 rounded-md border border-transparent" />
                ))}

                {/* June days */}
                {Array.from({ length: daysInJune }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const count = plannedVisitsByDay[dayNum] || 0;
                  const isCurrent = selectedDate.getDate() === dayNum;
                  return (
                    <button
                      key={`day-${dayNum}`}
                      type="button"
                      onClick={() => handleSelectDay(dayNum)}
                      className={`h-20 p-2 border rounded-md text-left flex flex-col justify-between transition-all hover:border-primary hover:bg-primary/5 ${
                        isCurrent ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card"
                      }`}
                    >
                      <span className="font-semibold text-sm nums-tabular">{dayNum}</span>
                      {count > 0 && (
                        <span className="inline-flex self-end items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
                          {count} Call{count > 1 ? "s" : ""}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Planner List Tab */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-base">
                  Daily Call Schedule: {selectedDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </CardTitle>
                <CardDescription>Reps assignments scheduled for this day</CardDescription>
              </div>
              <Button onClick={() => setActiveTab("assignment")} className="h-8 gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Create Schedule</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {dailyPlannerItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {dailyPlannerItems.map((item) => {
                    const doc = item.doctorId ? doctorMap.get(item.doctorId) : null;
                    const emp = employeeMap.get(item.assignedEmployeeId);
                    const terr = territoryMap.get(item.territoryId);
                    const vt = visitTypeMap.get(item.visitTypeId);

                    return (
                      <Card key={item.id} className="relative group overflow-hidden border-l-4 border-l-primary shadow-sm">
                        <CardContent className="p-4 space-y-3 text-sm">
                          <div className="flex items-start justify-between">
                            <div className="space-y-0.5">
                              <div className="font-bold text-foreground">
                                {doc ? doc.name : item.firmName || "Institutional Premises"}
                              </div>
                              {doc && <div className="text-[10px] text-primary font-bold uppercase">{doc.speciality}</div>}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              <span>Rep: <strong className="text-foreground">{emp ? emp.name : "—"}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>HQ: {terr ? terr.name : "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Stethoscope className="h-3.5 w-3.5" />
                              <span>Type: {vt ? vt.name : "—"}</span>
                            </div>
                          </div>

                          {item.remarks && (
                            <div className="bg-muted p-2 rounded text-xs text-muted-foreground leading-normal border">
                              {item.remarks}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded bg-muted/20">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-55" />
                  <p className="font-semibold text-muted-foreground">No visits scheduled for this date</p>
                  <p className="text-xs text-muted-foreground/85 mt-0.5">Click 'Create Schedule' or selection tab to assign calls.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignment Configuration Form Tab */}
        <TabsContent value="assignment" className="space-y-4">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle className="text-base font-bold">Plan Call Schedule Assignment</CardTitle>
              <CardDescription>
                Select Date, Doctor/Premises, and map to Representative.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-sm">
                <div className="space-y-1.5">
                  <Label htmlFor="plannedDate">Planned Date</Label>
                  <Input id="plannedDate" type="date" {...form.register("plannedDate")} />
                  {form.formState.errors.plannedDate && (
                    <p className="text-xs text-destructive">{form.formState.errors.plannedDate.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="formDoctor">Doctor Target</Label>
                    <UiSelect
                      value={form.watch("doctorId")}
                      onValueChange={(val) => {
                        form.setValue("doctorId", val);
                        form.setValue("firmName", ""); // clear firm
                      }}
                    >
                      <SelectTrigger className="bg-background text-xs">
                        <SelectValue placeholder="Select doctor..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Chemist/Firm visit)</SelectItem>
                        {doctors.map((d) => (
                          <SelectItem key={d.id} value={d.id} className="text-xs">
                            {d.name} ({d.speciality})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </UiSelect>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="formFirm">Firm Name (if not Doctor)</Label>
                    <Input
                      id="formFirm"
                      placeholder="e.g. Apex Pharmacy"
                      disabled={!!watchDoctor && watchDoctor !== "none"}
                      {...form.register("firmName")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="formRep">Representative Assigned</Label>
                  <UiSelect
                    value={watchEmployee}
                    onValueChange={(val) => form.setValue("assignedEmployeeId", val)}
                  >
                    <SelectTrigger className="bg-background text-xs">
                      <SelectValue placeholder="Select representative..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id} className="text-xs">
                          {e.name} ({employeeMap.get(e.id)?.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {form.formState.errors.assignedEmployeeId && (
                    <p className="text-xs text-destructive">{form.formState.errors.assignedEmployeeId.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="formTerritory">HQ Territory (Auto from Doctor)</Label>
                    <UiSelect
                      value={form.watch("territoryId")}
                      onValueChange={(val) => form.setValue("territoryId", val)}
                      disabled={!!watchDoctor && watchDoctor !== "none"}
                    >
                      <SelectTrigger className="bg-background text-xs">
                        <SelectValue placeholder="Select territory..." />
                      </SelectTrigger>
                      <SelectContent>
                        {territories.map((t) => (
                          <SelectItem key={t.id} value={t.id} className="text-xs">
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </UiSelect>
                    {form.formState.errors.territoryId && (
                      <p className="text-xs text-destructive">{form.formState.errors.territoryId.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="formVisitType">Visit Type</Label>
                    <UiSelect
                      value={form.watch("visitTypeId")}
                      onValueChange={(val) => form.setValue("visitTypeId", val)}
                    >
                      <SelectTrigger className="bg-background text-xs">
                        <SelectValue placeholder="Select visit type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {visitTypes.map((v) => (
                          <SelectItem key={v.id} value={v.id} className="text-xs">
                            {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </UiSelect>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="formRemarks">Planning Remarks</Label>
                  <Input id="formRemarks" placeholder="Planning notes..." {...form.register("remarks")} />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setActiveTab("monthly");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add to Calendar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

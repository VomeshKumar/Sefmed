import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { useCreateDoctor } from "../hooks";
import { createDoctorSchema, type DoctorFormValues } from "../schemas";

const PREFIXES = ["Dr.", "Mr.", "Mrs.", "Ms."];
const GENDERS = ["Male", "Female", "Other"];
const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];
const SPECIALITIES = ["GYN", "CARDIO", "GP", "CHEST", "PEDIATRIC", "DERMA", "ORTHO"];
const CATEGORIES = ["Specialist", "Super Specialist", "General Practitioner"];
const TYPES = ["Consultant", "Resident", "Practitioner"];
const APPROX_BUSINESSES = ["5000-10000", "10000-25000", "25000-50000", "50000+"];
const FIRMS = ["Teqmed Pharma", "Lifecare Distributors", "Vanguard Medicose"];

const STATES = [
  "Bihar",
  "Chhattisgarh",
  "Jharkhand",
  "Karnataka",
  "Madhya Pradesh",
  "Maharashtra",
  "ODISHA",
  "Uttarpradesh",
];

// Helper to generate Days (1-31)
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
// Helper for Months
const MONTHS = [
  { label: "Jan", value: "01" },
  { label: "Feb", value: "02" },
  { label: "Mar", value: "03" },
  { label: "Apr", value: "04" },
  { label: "May", value: "05" },
  { label: "Jun", value: "06" },
  { label: "Jul", value: "07" },
  { label: "Aug", value: "08" },
  { label: "Sep", value: "09" },
  { label: "Oct", value: "10" },
  { label: "Nov", value: "11" },
  { label: "Dec", value: "12" },
];
// Helper for Years (1940 to 2026)
const YEARS = Array.from({ length: 87 }, (_, i) => String(2026 - i));

export function AddDoctorPage() {
  const { data: zones = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: employees = [] } = useEmployeesList();
  const { data: divisions = [] } = useDivisionsList();

  const createMutation = useCreateDoctor();

  // Generate a Doctor Code e.g. TEQ10934
  const generatedDocCode = React.useMemo(() => {
    return "TEQ" + Math.floor(100000 + Math.random() * 900000);
  }, []);

  // DOB Dropdown states
  const [dobDay, setDobDay] = React.useState("");
  const [dobMonth, setDobMonth] = React.useState("");
  const [dobYear, setDobYear] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: {
      name: "",
      registrationNumber: "",
      doctorCode: generatedDocCode,
      hospitalName: "",
      clinicAddress: "",
      speciality: "",
      category: "",
      assignedEmployeeId: "",
      contact: "",
      zoneId: "",
      territoryId: "",
      status: "active",
      qualification: "",
      divisionId: "",
      email: "",
      gender: "Male",
      dob: "",
      anniversary: "",
      type: "",
      firm: "",
      state: "",
      prefix: "Dr.",
      maritalStatus: "",
      district: "",
      pincode: "",
    },
  });

  const watchPrefix = watch("prefix");
  const watchGender = watch("gender");
  const watchMaritalStatus = watch("maritalStatus");
  const watchState = watch("state");
  const watchDivision = watch("divisionId");
  const watchZone = watch("zoneId");
  const watchCity = watch("territoryId");
  const watchSpeciality = watch("speciality");
  const watchType = watch("type");
  const watchCategory = watch("category");
  const watchEmployee = watch("assignedEmployeeId");
  const watchFirm = watch("firm");

  // Filter territories to matching Zone ID
  const filteredTerritories = React.useMemo(() => {
    if (!watchZone) return [];
    return territories.filter((t) => t.zoneId === watchZone);
  }, [watchZone, territories]);

  // Combine DOB parts whenever they change
  React.useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      setValue("dob", `${dobYear}-${dobMonth}-${dobDay}`);
    } else {
      setValue("dob", "");
    }
  }, [dobDay, dobMonth, dobYear, setValue]);

  const onSubmit = async (values: DoctorFormValues) => {
    try {
      // Map clinicAddress to District/City/Pincode for data consistency if needed
      const enrichedValues = {
        ...values,
        clinicAddress: values.clinicAddress || values.district || "Address Info",
      };
      await createMutation.mutateAsync(enrichedValues);
      toast.success("Doctor added successfully");
      window.history.back();
    } catch {
      toast.error("Failed to add doctor profile");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {/* Header Title */}
        <div className="border-b border-slate-200 px-6 py-4 bg-white">
          <h1 className="text-xl font-bold text-slate-800">Add Doctor</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8 max-w-4xl">
          {/* ───────────────── Basic Information ───────────────── */}
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                Basic Information
              </h3>
              <div className="h-[1px] bg-teal-600/30 w-full mt-1.5" />
            </div>

            <div className="space-y-4">
              {/* Doctor Code */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Doctor Code
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder=""
                    disabled
                    className="h-9 border-slate-300 bg-slate-50 text-slate-600"
                    {...register("doctorCode")}
                  />
                </div>
              </div>

              {/* Prefix */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Prefix
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchPrefix} onValueChange={(val) => setValue("prefix", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Prefix" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREFIXES.map((pr) => (
                        <SelectItem key={pr} value={pr}>
                          {pr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Doctor Name */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Doctor Name<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Doctor Name"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
                </div>
              </div>

              {/* Hospital Name */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Hospital Name
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Hospital Name"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("hospitalName")}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Gender
                </label>
                <div className="flex items-center gap-5 py-1">
                  {GENDERS.map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none"
                    >
                      <input
                        type="radio"
                        value={g}
                        checked={watchGender === g}
                        onChange={() => setValue("gender", g)}
                        className="h-3.5 w-3.5 border-slate-300 text-[#008b8b] focus:ring-[#008b8b] checked:bg-[#008b8b]"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contact Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Contact Number
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Contact Number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("contact")}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Email
                </label>
                <div className="space-y-1">
                  <Input
                    type="email"
                    placeholder="Enter Email"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              {/* Date Of Birth */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Date Of Birth
                </label>
                <div className="flex gap-2">
                  {/* Day */}
                  <UiSelect value={dobDay} onValueChange={setDobDay}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white flex-1">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {/* Month */}
                  <UiSelect value={dobMonth} onValueChange={setDobMonth}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white flex-1">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {/* Year */}
                  <UiSelect value={dobYear} onValueChange={setDobYear}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white flex-1">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Marital Status */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Marital Status
                </label>
                <div className="space-y-1">
                  <UiSelect
                    value={watchMaritalStatus}
                    onValueChange={(val) => setValue("maritalStatus", val)}
                  >
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Marital Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARITAL_STATUSES.map((ms) => (
                        <SelectItem key={ms} value={ms}>
                          {ms}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Anniversary */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Anniversary
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Anniversary"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("anniversary")}
                  />
                </div>
              </div>

              {/* Qualification */}
              <div className="grid grid-cols-[220px_450px] items-start gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700 mt-2">
                  Qualification
                </label>
                <div className="space-y-1">
                  <Textarea
                    placeholder="Enter Qualification"
                    className="border-slate-300 focus-visible:ring-[#008b8b] min-h-[80px]"
                    {...register("qualification")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────── Address Information ───────────────── */}
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                Address Information
              </h3>
              <div className="h-[1px] bg-teal-600/30 w-full mt-1.5" />
            </div>

            <div className="space-y-4">
              {/* State */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  State<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchState} onValueChange={(val) => setValue("state", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((st) => (
                        <SelectItem key={st} value={st}>
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {errors.state && <p className="text-[11px] text-destructive">{errors.state.message}</p>}
                </div>
              </div>

              {/* Division */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Division<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <UiSelect
                    value={watchDivision}
                    onValueChange={(val) => setValue("divisionId", val)}
                  >
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {errors.divisionId && (
                    <p className="text-[11px] text-destructive">{errors.divisionId.message}</p>
                  )}
                </div>
              </div>

              {/* Zone */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Zone<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <UiSelect
                    value={watchZone}
                    onValueChange={(val) => {
                      setValue("zoneId", val);
                      setValue("territoryId", ""); // Reset city on zone change
                    }}
                  >
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
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
                  {errors.zoneId && <p className="text-[11px] text-destructive">{errors.zoneId.message}</p>}
                </div>
              </div>

              {/* District */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  District
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter District"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("district")}
                  />
                </div>
              </div>

              {/* City */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  City<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <UiSelect
                    value={watchCity}
                    onValueChange={(val) => setValue("territoryId", val)}
                    disabled={!watchZone}
                  >
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
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
                  {errors.territoryId && (
                    <p className="text-[11px] text-destructive">{errors.territoryId.message}</p>
                  )}
                </div>
              </div>

              {/* Pincode */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Pincode
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Fill Area Pincode"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("pincode")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────── Work Information ───────────────── */}
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                Work Information
              </h3>
              <div className="h-[1px] bg-teal-600/30 w-full mt-1.5" />
            </div>

            <div className="space-y-4">
              {/* Speciality */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Speciality
                </label>
                <div className="space-y-1">
                  <UiSelect
                    value={watchSpeciality}
                    onValueChange={(val) => setValue("speciality", val)}
                  >
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Speciality" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALITIES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Type */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Type
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchType} onValueChange={(val) => setValue("type", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Category */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Category
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchCategory} onValueChange={(val) => setValue("category", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Select Approximated Business */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Select Approximated Business
                </label>
                <div className="space-y-1">
                  <UiSelect
                    onValueChange={(val) => setValue("approxBusiness", parseFloat(val))}
                  >
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Approximated Business" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPROX_BUSINESSES.map((ab) => (
                        <SelectItem key={ab} value={ab.replace(/[^0-9]/g, "")}>
                          {ab}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Assigned To */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Assigned To
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchEmployee} onValueChange={(val) => setValue("assignedEmployeeId", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Firm Name */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Firm Name
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchFirm} onValueChange={(val) => setValue("firm", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Firm" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIRMS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Registration Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Registration Number
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="enter registration number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("registrationNumber")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-teal-600/30 w-full pt-2" />

          {/* Action buttons */}
          <div className="grid grid-cols-[220px_450px] gap-x-6 pt-2">
            <div />
            <div className="flex gap-2.5">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#008b8b] hover:bg-[#008b8b]/90 text-white px-6 h-9 font-medium"
              >
                {isSubmitting ? "Adding..." : "Add Doctor"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="h-9 px-6 text-sm font-medium border-slate-300 text-slate-700 hover:bg-slate-100 bg-white"
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

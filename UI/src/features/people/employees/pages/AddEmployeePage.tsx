import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useDivisionsList } from "@/features/master-data/divisions/hooks";
import { useZonesList } from "@/features/master-data/zones/hooks";
import { useTerritoriesList } from "@/features/master-data/territories/hooks";
import { useDesignationsList } from "@/features/master-data/designations/hooks";
import { useEmployeesList, useCreateEmployee } from "../hooks";
import { createEmployeeSchema, type EmployeeFormValues } from "../schemas";

const COUNTRIES = ["India", "Nepal", "Bangladesh", "Sri Lanka"];
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

const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];

// Helpers for Date Dropdowns
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
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
const YEARS = Array.from({ length: 87 }, (_, i) => String(2026 - i));

export function AddEmployeePage() {
  const { data: divisions = [] } = useDivisionsList();
  const { data: zones = [] } = useZonesList();
  const { data: territories = [] } = useTerritoriesList();
  const { data: designations = [] } = useDesignationsList();
  const { data: employees = [] } = useEmployeesList();

  const createMutation = useCreateEmployee();

  // Generate Employee Code (e.g. TEQEMP0110)
  const generatedCode = React.useMemo(() => {
    return "TEQEMP" + String(Math.floor(1000 + Math.random() * 9000));
  }, []);

  // DOB & Anniversary Dropdowns
  const [dobDay, setDobDay] = React.useState("");
  const [dobMonth, setDobMonth] = React.useState("");
  const [dobYear, setDobYear] = React.useState("");

  const [annDay, setAnnDay] = React.useState("");
  const [annMonth, setAnnMonth] = React.useState("");
  const [annYear, setAnnYear] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      name: "",
      code: generatedCode,
      email: "",
      contact: "",
      designationId: "",
      divisionId: "",
      zoneId: "",
      territoryId: "",
      reportingTo: "",
      workType: "onfield",
      status: "active",
      state: "",
      address: "",
      dateOfBirth: "",
      dateOfJoin: "",
      dateOfResignation: "",
      signUpDateTime: "",
      lastSyncDateTime: "",
      apkVersion: "1.0.0",
      mobile: "",
      os: "Android",
      inactiveDate: "",
      inactiveReason: "",
      gender: "male",
      anniversary: "",
      alternateContact: "",
      country: "India",
      currentAddress: "",
      permanentAddress: "",
      ageAsOfDate: "",
      additionalDivision: "",
      exSystem: "",
      additionalApproverId: "",
      endProbationDate: "",
      dailyWorkingHourPolicy: "Standard 8 Hours",
      showTourplanOption: false,
      managementEmployeeId: "",
      showInReports: true,
      workingDivisionId: "",
      qualification: "",
      aadharNumber: "",
      panNumber: "",
      pfaNumber: "",
      esicNumber: "",
      pranNumber: "",
      drivingLicenseNumber: "",
      licenseExpiryDate: "",
      bloodGroup: "",
      daHq: 0,
      daEx: 0,
      daOut: 0,
      daHilly: 0,
      daTransit: 0,
      daSpecial: 0,
      accountHolderName: "",
      accountNumber: "",
      ifscNumber: "",
      beneficiaryId: "",
      bankName: "",
      branchName: "",
      nomineeName: "",
      annualIncome: "",
    },
  });

  const watchGender = watch("gender");
  const watchWorkType = watch("workType");
  const watchMaritalStatus = watch("maritalStatus" as any);
  const watchCountry = watch("country");
  const watchState = watch("state");
  const watchCity = watch("territoryId");
  const watchDivision = watch("divisionId");
  const watchZone = watch("zoneId");
  const watchDesignation = watch("designationId");
  const watchSupervisor = watch("reportingTo");
  const watchManager = watch("managementEmployeeId");
  const watchAddDivision = watch("additionalDivision");
  const watchAccompaniedEmployee = watch("additionalApproverId");
  const watchHolidayCalendar = watch("workingDivisionId");
  const watchBloodGroup = watch("bloodGroup");

  // Combine DOB parts
  React.useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      setValue("dateOfBirth", `${dobYear}-${dobMonth}-${dobDay}`);
    } else {
      setValue("dateOfBirth", "");
    }
  }, [dobDay, dobMonth, dobYear, setValue]);

  // Combine Anniversary parts
  React.useEffect(() => {
    if (annDay && annMonth && annYear) {
      setValue("anniversary", `${annYear}-${annMonth}-${annDay}`);
    } else {
      setValue("anniversary", "");
    }
  }, [annDay, annMonth, annYear, setValue]);

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      await createMutation.mutateAsync({
        ...values,
        reportingTo: values.reportingTo || undefined,
      });
      toast.success("Employee profile created successfully");
      window.history.back();
    } catch {
      toast.error("Failed to save employee profile");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {/* Header Title */}
        <div className="border-b border-slate-200 px-6 py-4 bg-white">
          <h1 className="text-xl font-bold text-slate-800">Add Employees</h1>
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
              {/* Profile Image */}
              <div className="grid grid-cols-[220px_450px] items-start gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700 mt-2">
                  Profile Image
                </label>
                <div className="space-y-2">
                  <div className="flex h-36 w-36 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
                    <div className="text-slate-400 text-6xl">👤</div>
                  </div>
                  <Button type="button" size="sm" variant="outline" className="h-8 text-xs">
                    Select Image
                  </Button>
                  <p className="text-[10px] text-destructive leading-normal">
                    NOTE! Attached image thumbnail is supported in Latest Firefox, Chrome, Opera, Safari and Internet Explorer 10 only
                  </p>
                </div>
              </div>

              {/* Employee Code */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Employee Code<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder=""
                    disabled
                    className="h-9 border-slate-300 bg-slate-50 text-slate-600"
                    {...register("code")}
                  />
                </div>
              </div>

              {/* Employee Name */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Employee Name<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Employee Name"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
                </div>
              </div>

              {/* Gender */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Gender<span className="text-destructive"> *</span>
                </label>
                <div className="flex items-center gap-5 py-1">
                  {["male", "female"].map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none capitalize"
                    >
                      <input
                        type="radio"
                        value={g}
                        checked={watchGender === g}
                        onChange={() => setValue("gender", g as any)}
                        className="h-3.5 w-3.5 border-slate-300 text-[#008b8b] focus:ring-[#008b8b] checked:bg-[#008b8b]"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Work Type */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Work Type<span className="text-destructive"> *</span>
                </label>
                <div className="flex items-center gap-5 py-1">
                  {[
                    { label: "OFFICE", value: "office" },
                    { label: "ONFIELD", value: "onfield" },
                  ].map((w) => (
                    <label
                      key={w.value}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none"
                    >
                      <input
                        type="radio"
                        value={w.value}
                        checked={watchWorkType === w.value}
                        onChange={() => setValue("workType", w.value as any)}
                        className="h-3.5 w-3.5 border-slate-300 text-[#008b8b] focus:ring-[#008b8b] checked:bg-[#008b8b]"
                      />
                      <span>{w.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Of Birth */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Date Of Birth
                </label>
                <div className="flex gap-2">
                  <UiSelect value={dobDay} onValueChange={setDobDay}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white flex-1">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  <UiSelect value={dobMonth} onValueChange={setDobMonth}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white flex-1">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  <UiSelect value={dobYear} onValueChange={setDobYear}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white flex-1">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
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
                    onValueChange={(val) => setValue("maritalStatus" as any, val)}
                  >
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Marital Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARITAL_STATUSES.map((ms) => (
                        <SelectItem key={ms} value={ms}>{ms}</SelectItem>
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
                <div className="flex gap-2">
                  <UiSelect value={annDay} onValueChange={setAnnDay}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white flex-1">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  <UiSelect value={annMonth} onValueChange={setAnnMonth}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white flex-1">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  <UiSelect value={annYear} onValueChange={setAnnYear}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white flex-1">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────── Contact Information ───────────────── */}
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                Contact Information
              </h3>
              <div className="h-[1px] bg-teal-600/30 w-full mt-1.5" />
            </div>

            <div className="space-y-4">
              {/* Primary Contact Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Primary Contact Number<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Primary Contact Number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("contact")}
                  />
                  {errors.contact && <p className="text-[11px] text-destructive">{errors.contact.message}</p>}
                </div>
              </div>

              {/* Alternate Contact Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Alternate Contact Number
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Alternate Contact Number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("alternateContact")}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Email<span className="text-destructive"> *</span>
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

              {/* Country */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Country<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchCountry} onValueChange={(val) => setValue("country", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

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
                      {STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* HQ */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  HQ<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchCity} onValueChange={(val) => setValue("territoryId", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {territories.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {errors.territoryId && <p className="text-[11px] text-destructive">{errors.territoryId.message}</p>}
                </div>
              </div>

              {/* Multiple HQ */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Multiple HQ
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Select Multiple HQ"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("ageAsOfDate")} // mapped temporarily or as text
                  />
                </div>
              </div>

              {/* Division */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Division<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchDivision} onValueChange={(val) => setValue("divisionId", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Division" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {errors.divisionId && <p className="text-[11px] text-destructive">{errors.divisionId.message}</p>}
                </div>
              </div>

              {/* Zones */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Zones<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchZone} onValueChange={(val) => setValue("zoneId", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((z) => (
                        <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {errors.zoneId && <p className="text-[11px] text-destructive">{errors.zoneId.message}</p>}
                </div>
              </div>

              {/* Current Address */}
              <div className="grid grid-cols-[220px_450px] items-start gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700 mt-2">
                  Current Address
                </label>
                <div className="space-y-1">
                  <Textarea
                    placeholder="Enter Current Address"
                    className="border-slate-300 focus-visible:ring-[#008b8b] min-h-[70px]"
                    {...register("currentAddress")}
                  />
                </div>
              </div>

              {/* Permanent Address */}
              <div className="grid grid-cols-[220px_450px] items-start gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700 mt-2">
                  Permanent Address
                </label>
                <div className="space-y-1">
                  <Textarea
                    placeholder="Enter Permanent Address"
                    className="border-slate-300 focus-visible:ring-[#008b8b] min-h-[70px]"
                    {...register("permanentAddress")}
                  />
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Eg. :- 201, Lala Banarasilal Dawar Marg, New Palasia, Old Palasia, Indore, Madhya Pradesh 452001, India
                  </p>
                </div>
              </div>

              {/* Zip/Postal Code */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Zip/Postal Code
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Zip/Postal Code"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("address")} // mapped to address
                  />
                </div>
              </div>

              {/* Additional Division */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Additional Division
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchAddDivision} onValueChange={(val) => setValue("additionalDivision", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Additional Division" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisions.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
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
              {/* Ex-Stations */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Ex-Stations
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Select Ex Station"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("exSystem")} // mapped
                  />
                </div>
              </div>

              {/* Out-Stations */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Out-Stations
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Select Out Station"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("inactiveReason")} // mapped
                  />
                </div>
              </div>

              {/* Designation */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Designation<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchDesignation} onValueChange={(val) => setValue("designationId", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                  {errors.designationId && <p className="text-[11px] text-destructive">{errors.designationId.message}</p>}
                </div>
              </div>

              {/* Assigned To */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Assigned To
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchSupervisor} onValueChange={(val) => setValue("reportingTo", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Additional Supervisor */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Additional Supervisor
                </label>
                <div className="space-y-1">
                  <UiSelect value={watchManager} onValueChange={(val) => setValue("managementEmployeeId", val)}>
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>

              {/* Date Of Join */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Date Of Join<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <Input
                    type="date"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("dateOfJoin")}
                  />
                </div>
              </div>

              {/* End Probation Date */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  End Probation Date
                </label>
                <div className="space-y-1">
                  <Input
                    type="date"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("endProbationDate")}
                  />
                </div>
              </div>

              {/* End Confirmation Date */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  End Confirmation Date
                </label>
                <div className="space-y-1">
                  <Input
                    type="date"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("dateOfResignation")} // mapped
                  />
                </div>
              </div>

              {/* Daily Work Hours (In numbers) * */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Daily Work Hours (In numbers)<span className="text-destructive"> *</span>
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Daily Work Hours"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("dailyWorkingHourPolicy")}
                  />
                  {errors.dailyWorkingHourPolicy && (
                    <p className="text-[11px] text-destructive">{errors.dailyWorkingHourPolicy.message}</p>
                  )}
                </div>
              </div>

              {/* Show Accompanied */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Show Accompanied
                </label>
                <div className="flex items-center h-9">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-[#008b8b] focus:ring-[#008b8b] checked:bg-[#008b8b]"
                    {...register("showTourplanOption")}
                  />
                </div>
              </div>

              {/* Accompanied Employee */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Accompanied Employee
                </label>
                <div className="space-y-1">
                  <UiSelect
                    value={watchAccompaniedEmployee}
                    onValueChange={(val) => setValue("additionalApproverId", val)}
                  >
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Accompanied Employee" />
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

              {/* Date Of Resignation */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Date Of Resignation
                </label>
                <div className="space-y-1">
                  <Input
                    type="text"
                    placeholder="Enter Date Of Resignation"
                    onFocus={(e) => {
                      e.target.type = "date";
                    }}
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("inactiveDate")}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        e.target.type = "text";
                      }
                    }}
                  />
                </div>
              </div>

              {/* Show In Transit */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Show In Transit
                </label>
                <div className="flex items-center h-9">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-[#008b8b] focus:ring-[#008b8b] checked:bg-[#008b8b]"
                    {...register("showInReports")}
                  />
                </div>
              </div>

              {/* Holiday Calendar */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Holiday Calendar
                </label>
                <div className="space-y-1">
                  <UiSelect
                    value={watchHolidayCalendar}
                    onValueChange={(val) => setValue("workingDivisionId", val)}
                  >
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Holiday Calendar</SelectItem>
                      <SelectItem value="state">State Holiday Calendar</SelectItem>
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────── Other Information ───────────────── */}
          <div>
            <div className="mb-6">
              <h3 className="text-[17px] font-semibold text-slate-800">
                Other Information
              </h3>
              <div className="h-[1px] bg-[#008b8b] w-full mt-1.5" />
            </div>

            <div className="space-y-4">
              {/* Employee Qualification */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Employee Qualification
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Employee Qualification"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("qualification")}
                  />
                </div>
              </div>

              {/* Aadhar Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Aadhar Number
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Aadhar Number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("aadharNumber")}
                  />
                </div>
              </div>

              {/* PAN Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  PAN Number
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter PAN Number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("panNumber")}
                  />
                </div>
              </div>

              {/* PF Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  PF Number
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter PF Number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("pfaNumber")}
                  />
                </div>
              </div>

              {/* ESIC Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  ESIC Number
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter ESIC Number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("esicNumber")}
                  />
                </div>
              </div>

              {/* PF UAN Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  PF UAN Number
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter PF UAN Number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("pranNumber")}
                  />
                </div>
              </div>

              {/* Driver's License Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Driver's License Number
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Driver's License Number<"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("drivingLicenseNumber")}
                  />
                </div>
              </div>

              {/* Licence Expiry Date */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Licence Expiry Date
                </label>
                <div className="space-y-1">
                  <Input
                    type="text"
                    placeholder="Enter Licence Expiry Date"
                    onFocus={(e) => {
                      e.target.type = "date";
                    }}
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("licenseExpiryDate")}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        e.target.type = "text";
                      }
                    }}
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Blood Group
                </label>
                <div className="space-y-1">
                  <UiSelect
                    value={watchBloodGroup}
                    onValueChange={(val) => setValue("bloodGroup", val)}
                  >
                    <SelectTrigger className="h-9 border-slate-300 bg-white">
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </UiSelect>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────── Daily Allowance Information ───────────────── */}
          <div>
            <div className="mb-6">
              <h3 className="text-[17px] font-semibold text-slate-800">
                Daily Allowance Information
              </h3>
              <div className="h-[1px] bg-[#008b8b] w-full mt-1.5" />
            </div>

            <div className="space-y-4">
              {/* DA_HO */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  DA_HO
                </label>
                <div className="space-y-1">
                  <Input
                    type="number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("daHq", { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* DA_EX */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  DA_EX
                </label>
                <div className="space-y-1">
                  <Input
                    type="number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("daEx", { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* DA_OUT */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  DA_OUT
                </label>
                <div className="space-y-1">
                  <Input
                    type="number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("daOut", { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* DA_RHO */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  DA_RHO
                </label>
                <div className="space-y-1">
                  <Input
                    type="number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("daHilly", { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* DA_TRANSIT */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  DA_TRANSIT
                </label>
                <div className="space-y-1">
                  <Input
                    type="number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("daTransit", { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* DA_OTHER */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  DA_OTHER
                </label>
                <div className="space-y-1">
                  <Input
                    type="number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("daSpecial", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────── Account Information ───────────────── */}
          <div>
            <div className="mb-6">
              <h3 className="text-[17px] font-semibold text-slate-800">
                Account Information
              </h3>
              <div className="h-[1px] bg-[#008b8b] w-full mt-1.5" />
            </div>

            <div className="space-y-4">
              {/* Account Holder Name */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Account Holder Name
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Account Holder Name"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("accountHolderName")}
                  />
                </div>
              </div>

              {/* Account Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Account Number
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Account Number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("accountNumber")}
                  />
                </div>
              </div>

              {/* IFSC Number */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  IFSC Number
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter IFSC Number"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("ifscNumber")}
                  />
                </div>
              </div>

              {/* Beneficiary ID */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Beneficiary ID
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Beneficiary ID"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("beneficiaryId")}
                  />
                </div>
              </div>

              {/* Bank Name */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Bank Name
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Bank Name"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("bankName")}
                  />
                </div>
              </div>

              {/* Branch Name */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Branch Name
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Branch Name"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("branchName")}
                  />
                </div>
              </div>

              {/* Nominee Name */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Nominee Name
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Nominee Name"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("nomineeName")}
                  />
                </div>
              </div>

              {/* Annual Income */}
              <div className="grid grid-cols-[220px_450px] items-center gap-x-6">
                <label className="text-right text-sm font-semibold text-slate-700">
                  Annual Income
                </label>
                <div className="space-y-1">
                  <Input
                    placeholder="Enter Annual Income"
                    className="h-9 border-slate-300 focus-visible:ring-[#008b8b]"
                    {...register("annualIncome")}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-teal-600/30 w-full pt-2" />

          {/* Action Buttons */}
          <div className="grid grid-cols-[220px_450px] gap-x-6 pt-2">
            <div />
            <div className="flex gap-2.5">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#008b8b] hover:bg-[#008b8b]/90 text-white px-6 h-9 font-medium"
              >
                {isSubmitting ? "Adding..." : "Add Employee"}
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

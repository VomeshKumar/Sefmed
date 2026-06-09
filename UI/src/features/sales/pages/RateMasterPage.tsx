import * as React from "react";
import {
  Download,
  Edit,
  Trash,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  useRateMastersList,
  useUpdateRateMaster,
  useStockistsList,
  useFirmRateOverrides,
  useUpdateFirmRateOverride,
  useDoctorRateOverrides,
  useUpdateDoctorRateOverride,
} from "../hooks";
import { useEmployeesList } from "@/features/people/employees/hooks";
import { useDoctorsList } from "@/features/people/doctors/hooks";
import type { RateMaster } from "../types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(n);

export function RateMasterPage() {
  const [activeTab, setActiveTab] = React.useState<"base" | "firm" | "doctor">("base");
  const [selectedDivision, setSelectedDivision] = React.useState("all");

  // Load base rate masters (the 10 products sheet)
  const { data: rateMasters = [], isLoading: isBaseLoading, refetch: refetchBase } = useRateMastersList({
    division: selectedDivision === "all" ? undefined : selectedDivision,
  });

  // Load all 10 products unconditionally for custom overrides lists
  const { data: allRateMasters = [] } = useRateMastersList({});

  const updateBaseMutation = useUpdateRateMaster();

  // Tab 2 (Firm Wise) State
  const [selectedFirmEmployee, setSelectedFirmEmployee] = React.useState("all");
  const [selectedFirmId, setSelectedFirmId] = React.useState("shobha-ent");

  // Load employees & stockists/firms
  const { data: employees = [] } = useEmployeesList({});
  const { data: stockists = [] } = useStockistsList({});

  // Filtered firms based on selected representative employee
  const filteredFirms = React.useMemo(() => {
    if (selectedFirmEmployee === "all") return stockists;
    const emp = employees.find((e) => e.id === selectedFirmEmployee);
    if (!emp) return stockists;
    return stockists.filter((s) => s.employeeAssigned === emp.name);
  }, [stockists, selectedFirmEmployee, employees]);

  // Adjust firm selection if filtered firms change
  React.useEffect(() => {
    if (filteredFirms.length > 0) {
      const exists = filteredFirms.some((f) => f.id === selectedFirmId);
      if (!exists) {
        const shobha = filteredFirms.find((f) => f.id === "shobha-ent");
        if (shobha) {
          setSelectedFirmId("shobha-ent");
        } else {
          setSelectedFirmId(filteredFirms[0].id);
        }
      }
    }
  }, [filteredFirms, selectedFirmId]);

  // Fetch overrides for selected firm
  const { data: firmOverrides = [], isLoading: isFirmOverridesLoading, refetch: refetchFirmOverrides } = useFirmRateOverrides(selectedFirmId);
  const updateFirmOverrideMutation = useUpdateFirmRateOverride();

  const firmRatesMap = React.useMemo(() => {
    const map = new Map<string, number>();
    firmOverrides.forEach((fo) => map.set(fo.productId, fo.rate));
    return map;
  }, [firmOverrides]);

  // Tab 3 (Doctor Wise) State
  const [selectedDocState, setSelectedDocState] = React.useState("Chhattisgarh");
  const [selectedDocEmployeeId, setSelectedDocEmployeeId] = React.useState("emp-akash");
  const [selectedDoctorId, setSelectedDoctorId] = React.useState("doc-atul");

  // Get unique states of active employees
  const uniqueDocStates = React.useMemo(() => {
    const states = new Set<string>();
    employees.forEach((e) => {
      if (e.status === "active" && e.state) {
        states.add(e.state);
      }
    });
    // Ensure Chhattisgarh is in the list
    if (states.size === 0) {
      states.add("Chhattisgarh");
    }
    return Array.from(states);
  }, [employees]);

  // Filter representatives by state
  const representativesInState = React.useMemo(() => {
    return employees.filter((e) => e.status === "active" && e.state === selectedDocState);
  }, [employees, selectedDocState]);

  // Default selection for representative
  React.useEffect(() => {
    if (representativesInState.length > 0) {
      const exists = representativesInState.some((r) => r.id === selectedDocEmployeeId);
      if (!exists) {
        const akash = representativesInState.find((r) => r.id === "emp-akash");
        if (akash) {
          setSelectedDocEmployeeId("emp-akash");
        } else {
          setSelectedDocEmployeeId(representativesInState[0].id);
        }
      }
    }
  }, [representativesInState, selectedDocEmployeeId]);

  // Load doctors filtered by Employee
  const { data: doctors = [] } = useDoctorsList({
    assignedEmployeeId: selectedDocEmployeeId || undefined,
  });

  // Default selection for doctor
  React.useEffect(() => {
    if (doctors.length > 0) {
      const exists = doctors.some((d) => d.id === selectedDoctorId);
      if (!exists) {
        const atul = doctors.find((d) => d.id === "doc-atul");
        if (atul) {
          setSelectedDoctorId("doc-atul");
        } else {
          setSelectedDoctorId(doctors[0].id);
        }
      }
    }
  }, [doctors, selectedDoctorId]);

  // Fetch overrides for selected doctor
  const { data: doctorOverrides = [], isLoading: isDocOverridesLoading, refetch: refetchDoctorOverrides } = useDoctorRateOverrides(selectedDoctorId);
  const updateDoctorOverrideMutation = useUpdateDoctorRateOverride();

  const doctorRatesMap = React.useMemo(() => {
    const map = new Map<string, number>();
    doctorOverrides.forEach((do_ov) => map.set(do_ov.productId, do_ov.rate));
    return map;
  }, [doctorOverrides]);

  // Save updated base rates locally on input blur
  const handleRateUpdate = async (id: string, field: keyof RateMaster, value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;
    try {
      await updateBaseMutation.mutateAsync({
        id,
        data: { [field]: numericValue },
      });
      toast.success("Rate updated successfully");
      refetchBase();
    } catch {
      toast.error("Failed to update rate");
    }
  };

  // Save firm override rate on input blur
  const handleFirmRateUpdate = async (productId: string, value: string) => {
    if (!selectedFirmId) return;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;
    try {
      await updateFirmOverrideMutation.mutateAsync({
        firmId: selectedFirmId,
        productId,
        rate: numericValue,
      });
      toast.success("Firm rate override updated successfully");
      refetchFirmOverrides();
    } catch {
      toast.error("Failed to update override");
    }
  };

  // Save doctor override rate on input blur
  const handleDoctorRateUpdate = async (productId: string, value: string) => {
    if (!selectedDoctorId) return;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;
    try {
      await updateDoctorOverrideMutation.mutateAsync({
        doctorId: selectedDoctorId,
        productId,
        rate: numericValue,
      });
      toast.success("Doctor rate override updated successfully");
      refetchDoctorOverrides();
    } catch {
      toast.error("Failed to update override");
    }
  };

  // Export to CSV
  const handleExport = () => {
    if (activeTab === "base") {
      if (rateMasters.length === 0) {
        toast.error("No data available to export");
        return;
      }
      const headers = ["Sr.No.", "Product Name", "Distributor Price", "Stockist Price", "Retailer Price", "Doctor Price", "Division"];
      const rows = rateMasters.map((rm, idx) => [
        idx + 1,
        rm.productName,
        rm.distributorPrice,
        rm.stockistPrice,
        rm.retailerPrice,
        rm.doctorPrice,
        rm.division,
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `All_Rate_Master_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (activeTab === "firm") {
      const selectedFirm = stockists.find((s) => s.id === selectedFirmId);
      const firmName = selectedFirm ? selectedFirm.name : "Shobha Enterprises";
      const headers = ["Product Name", "Rate"];
      const rows = allRateMasters.map((rm) => {
        const rate = firmRatesMap.get(rm.id) ?? 0;
        return [rm.productName, rate];
      });
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Firm_Wise_Rate_Master_${firmName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const selectedDoc = doctors.find((d) => d.id === selectedDoctorId);
      const docName = selectedDoc ? selectedDoc.name : "DR ATUL MOHANKAR";
      const headers = ["Product Name", "Rate"];
      const rows = allRateMasters.map((rm) => {
        const rate = doctorRatesMap.get(rm.id) ?? 0;
        return [rm.productName, rate];
      });
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Doctor_Wise_Rate_Master_${docName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast.success("CSV Export completed");
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      {/* Page Header exactly as screenshot */}
      <div className="flex flex-col border-b pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span>Home</span>
          <span>/</span>
          <span>Sales</span>
          <span>/</span>
          <span className="text-foreground font-semibold">Rate Master</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-baseline gap-2">
          All Rate Master
          <span className="text-xs font-semibold text-slate-500 font-normal">
            (All the Prices are Inclusive of taxes)
          </span>
        </h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "base" | "firm" | "doctor")}
        className="w-full"
      >
        {/* Tabs Header exactly as screenshot */}
        <TabsList className="flex gap-6 border-b rounded-none bg-transparent p-0 mb-4 h-11 w-full justify-start">
          <TabsTrigger
            value="base"
            className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-[#008272] data-[state=active]:text-[#008272] hover:text-[#008272] text-sm font-bold px-1 py-3 text-slate-600 transition-all shadow-none"
          >
            Rate Master
          </TabsTrigger>
          <TabsTrigger
            value="firm"
            className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-[#008272] data-[state=active]:text-[#008272] hover:text-[#008272] text-sm font-bold px-1 py-3 text-slate-600 transition-all shadow-none"
          >
            Firm Wise Rate Master
          </TabsTrigger>
          <TabsTrigger
            value="doctor"
            className="rounded-none bg-transparent border-b-2 border-transparent data-[state=active]:border-[#008272] data-[state=active]:text-[#008272] hover:text-[#008272] text-sm font-bold px-1 py-3 text-slate-600 transition-all shadow-none"
          >
            Doctor Wise Rate Master
          </TabsTrigger>
        </TabsList>

        {/* Tab 1 Content - Rate Master */}
        <TabsContent value="base" className="space-y-4 outline-none">
          {/* Base Rate Master Filters */}
          <div className="flex items-center justify-between gap-4">
            <div className="w-60">
              <UiSelect value={selectedDivision} onValueChange={setSelectedDivision}>
                <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                  <SelectValue placeholder="All Division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Division</SelectItem>
                  <SelectItem value="DERMA">DERMA</SelectItem>
                  <SelectItem value="CARDIO">CARDIO</SelectItem>
                  <SelectItem value="GYN">GYN</SelectItem>
                  <SelectItem value="PEDIATRIC">PEDIATRIC</SelectItem>
                </SelectContent>
              </UiSelect>
            </div>

            <Button
              onClick={handleExport}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-10 px-4 font-bold text-xs gap-1.5"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>

          <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b">
                    <th className="py-3.5 px-4 border-r w-20 text-center">Sr.No.</th>
                    <th className="py-3.5 px-4 border-r w-1/3">Product Name</th>
                    <th className="py-3.5 px-4 border-r">Distributor</th>
                    <th className="py-3.5 px-4 border-r">Stockist</th>
                    <th className="py-3.5 px-4 border-r">Retailer</th>
                    <th className="py-3.5 px-4">Doctor</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-600 text-xs">
                  {isBaseLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/50">
                        <div className="flex flex-col items-center gap-2 justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#008272] border-t-transparent" />
                          <span>Loading Rate Master sheet...</span>
                        </div>
                      </td>
                    </tr>
                  ) : rateMasters.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-400 font-semibold bg-slate-50/50">
                        No product rates found.
                      </td>
                    </tr>
                  ) : (
                    rateMasters.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/30 border-b align-middle transition-colors">
                        <td className="py-3 px-4 border-r text-center text-slate-500 font-medium">{idx + 1}</td>
                        <td className="py-3 px-4 border-r">
                          <div className="w-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-md">
                            {item.productName}
                          </div>
                        </td>
                        <td className="py-3 px-4 border-r">
                          <Input
                            type="number"
                            step="0.01"
                            defaultValue={item.distributorPrice}
                            onBlur={(e) => handleRateUpdate(item.id, "distributorPrice", e.target.value)}
                            className="w-full h-10 bg-white border-slate-200 text-xs px-3 font-semibold text-slate-700 focus:border-[#008272] rounded-md shadow-sm"
                          />
                        </td>
                        <td className="py-3 px-4 border-r">
                          <Input
                            type="number"
                            step="0.01"
                            defaultValue={item.stockistPrice}
                            onBlur={(e) => handleRateUpdate(item.id, "stockistPrice", e.target.value)}
                            className="w-full h-10 bg-white border-slate-200 text-xs px-3 font-semibold text-slate-700 focus:border-[#008272] rounded-md shadow-sm"
                          />
                        </td>
                        <td className="py-3 px-4 border-r">
                          <Input
                            type="number"
                            step="0.01"
                            defaultValue={item.retailerPrice}
                            onBlur={(e) => handleRateUpdate(item.id, "retailerPrice", e.target.value)}
                            className="w-full h-10 bg-white border-slate-200 text-xs px-3 font-semibold text-slate-700 focus:border-[#008272] rounded-md shadow-sm"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Input
                            type="number"
                            step="0.0001"
                            defaultValue={item.doctorPrice}
                            onBlur={(e) => handleRateUpdate(item.id, "doctorPrice", e.target.value)}
                            className="w-full h-10 bg-white border-slate-200 text-xs px-3 font-semibold text-slate-700 focus:border-[#008272] rounded-md shadow-sm"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2 Content - Firm Wise Rate Master */}
        <TabsContent value="firm" className="space-y-4 outline-none">
          {/* Firm Wise Rate Master Filters exactly as screenshot */}
          <div className="flex items-center gap-2">
            <div className="w-60">
              <UiSelect value={selectedFirmEmployee} onValueChange={setSelectedFirmEmployee}>
                <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select Employee</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </UiSelect>
            </div>

            <div className="w-60">
              <UiSelect value={selectedFirmId} onValueChange={setSelectedFirmId}>
                <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                  <SelectValue placeholder="Select Firm" />
                </SelectTrigger>
                <SelectContent>
                  {filteredFirms.length === 0 ? (
                    <SelectItem value="none" disabled>No firms found</SelectItem>
                  ) : (
                    filteredFirms.map((firm) => (
                      <SelectItem key={firm.id} value={firm.id}>
                        {firm.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </UiSelect>
            </div>

            <Button
              onClick={handleExport}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-10 px-4 font-bold text-xs gap-1.5"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>

          <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b">
                    <th className="py-3.5 px-4 border-r w-2/3">Product Name</th>
                    <th className="py-3.5 px-4 w-1/3">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-600 text-xs">
                  {isFirmOverridesLoading ? (
                    <tr>
                      <td colSpan={2} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/50">
                        <div className="flex flex-col items-center gap-2 justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#008272] border-t-transparent" />
                          <span>Loading override rates...</span>
                        </div>
                      </td>
                    </tr>
                  ) : allRateMasters.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-16 text-center text-slate-400 font-semibold bg-slate-50/50">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    allRateMasters.map((item) => {
                      const currentVal = firmRatesMap.has(item.id) ? String(firmRatesMap.get(item.id)) : "0";
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/30 border-b align-middle transition-colors">
                          {/* Product Name (Disabled Look input style) */}
                          <td className="py-3 px-4 border-r">
                            <div className="w-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-md">
                              {item.productName}
                            </div>
                          </td>

                          {/* Rate input field */}
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              step="0.01"
                              key={`${selectedFirmId}_${item.id}_${currentVal}`}
                              defaultValue={currentVal}
                              onBlur={(e) => handleFirmRateUpdate(item.id, e.target.value)}
                              className="w-full h-10 bg-white border-slate-200 text-xs px-3 font-semibold text-slate-700 focus:border-[#008272] rounded-md shadow-sm"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3 Content - Doctor Wise Rate Master */}
        <TabsContent value="doctor" className="space-y-4 outline-none">
          {/* Doctor Wise Rate Master Filters exactly as screenshot */}
          <div className="flex items-center gap-2">
            {/* Zone/State selector */}
            <div className="w-48">
              <UiSelect value={selectedDocState} onValueChange={setSelectedDocState}>
                <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueDocStates.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </UiSelect>
            </div>

            {/* Employee representative selector */}
            <div className="w-48">
              <UiSelect value={selectedDocEmployeeId} onValueChange={setSelectedDocEmployeeId}>
                <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  {representativesInState.length === 0 ? (
                    <SelectItem value="none" disabled>No employees</SelectItem>
                  ) : (
                    representativesInState.map((rep) => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </UiSelect>
            </div>

            {/* Doctor selector */}
            <div className="w-60">
              <UiSelect value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.length === 0 ? (
                    <SelectItem value="none" disabled>No doctors found</SelectItem>
                  ) : (
                    doctors.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </UiSelect>
            </div>

            <Button
              onClick={handleExport}
              className="bg-[#008272] hover:bg-[#006e60] text-white h-10 px-4 font-bold text-xs gap-1.5"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>

          <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b">
                    <th className="py-3.5 px-4 border-r w-2/3">Product Name</th>
                    <th className="py-3.5 px-4 w-1/3">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-600 text-xs">
                  {isDocOverridesLoading ? (
                    <tr>
                      <td colSpan={2} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/50">
                        <div className="flex flex-col items-center gap-2 justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#008272] border-t-transparent" />
                          <span>Loading override rates...</span>
                        </div>
                      </td>
                    </tr>
                  ) : allRateMasters.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-16 text-center text-slate-400 font-semibold bg-slate-50/50">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    allRateMasters.map((item) => {
                      const currentVal = doctorRatesMap.has(item.id) ? String(doctorRatesMap.get(item.id)) : "0";
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/30 border-b align-middle transition-colors">
                          {/* Product Name (Disabled Look input style) */}
                          <td className="py-3 px-4 border-r">
                            <div className="w-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-md">
                              {item.productName}
                            </div>
                          </td>

                          {/* Rate input field */}
                          <td className="py-3 px-4">
                            <Input
                              type="number"
                              step="0.01"
                              key={`${selectedDoctorId}_${item.id}_${currentVal}`}
                              defaultValue={currentVal}
                              onBlur={(e) => handleDoctorRateUpdate(item.id, e.target.value)}
                              className="w-full h-10 bg-white border-slate-200 text-xs px-3 font-semibold text-slate-700 focus:border-[#008272] rounded-md shadow-sm"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

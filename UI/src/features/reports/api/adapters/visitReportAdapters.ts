import { visitsApi } from "@/features/visits/api/index";
import { doctorsApi } from "@/features/people/doctors/api/index";
import { mockEmployees } from "@/features/people/employees/fixtures";
import type { Doctor } from "@/features/people/doctors/types";

export const visitReportAdapters = {
  getDoctorVisitSummary: async (filters?: { status?: string }) => {
    const visits = await visitsApi.listDoctorVisits(filters?.status ? { status: filters.status } : undefined);
    const doctors = await doctorsApi.list();
    const docMap = new Map<string, Doctor>(doctors.map((d) => [d.id, d]));
    const empMap = new Map(mockEmployees.map((e) => [e.id, e]));

    return visits.map((v) => {
      const doc = docMap.get(v.doctorId);
      const emp = empMap.get(v.assignedEmployeeId);
      return {
        id: v.id,
        visitDate: v.date,
        doctorName: doc?.name ?? "Unknown Doctor",
        specialty: doc?.speciality ?? "—",
        representativeName: emp?.name ?? "—",
        status: v.status,
        geoVerificationStatus: v.geoVerificationStatus || "Unverified",
        purpose: v.discussionSummary || v.remarks || "—",
      };
    });
  },

  getFirmVisitSummary: async (filters?: { status?: string }) => {
    const visits = await visitsApi.listFirmVisits(filters?.status ? { status: filters.status } : undefined);
    const empMap = new Map(mockEmployees.map((e) => [e.id, e]));

    return visits.map((v) => {
      const emp = empMap.get(v.assignedEmployeeId);
      return {
        id: v.id,
        visitDate: v.date,
        firmName: v.firmName,
        firmType: v.firmType.replace("_", " ").toUpperCase(),
        representativeName: emp?.name ?? "—",
        status: v.status,
        geoVerificationStatus: v.geoVerificationStatus || "Unverified",
        purpose: v.purpose || v.remarks || "—",
      };
    });
  },

  getVisitProductivityReport: async (filters?: { employeeId?: string }) => {
    const dVisits = await visitsApi.listDoctorVisits();
    const fVisits = await visitsApi.listFirmVisits();
    const allVisits = [
      ...dVisits.map((v) => ({ ...v, type: "doctor" })),
      ...fVisits.map((v) => ({ ...v, type: "firm" })),
    ];

    let employees = mockEmployees;
    if (filters?.employeeId && filters.employeeId !== "all") {
      employees = employees.filter((e) => e.id === filters.employeeId);
    }

    return employees.map((e) => {
      const empVisits = allVisits.filter((v) => v.assignedEmployeeId === e.id);

      const planned = empVisits.filter((v) => v.status === "planned").length;
      const open = empVisits.filter((v) => v.status === "open").length;
      const closed = empVisits.filter((v) => v.status === "closed" || v.status === "approved").length;
      const rescheduled = empVisits.filter((v) => v.status === "rescheduled").length;
      const skipped = empVisits.filter((v) => v.status === "skipped").length;
      const cancelled = empVisits.filter((v) => v.status === "cancelled").length;

      const total = empVisits.length;
      const completionRate = total > 0 ? Math.round((closed / total) * 100) : 0;

      return {
        id: e.id,
        employeeName: e.name,
        employeeCode: e.code,
        planned,
        open,
        closed,
        rescheduled,
        skipped,
        cancelled,
        total,
        completionRate,
      };
    });
  },

  getGeoVerificationReport: async () => {
    const dVisits = await visitsApi.listDoctorVisits();
    const fVisits = await visitsApi.listFirmVisits();
    const allVisits = [...dVisits, ...fVisits];
    const totalVisits = allVisits.length;

    const verified = allVisits.filter((v) => v.geoVerificationStatus === "Verified").length;
    const unverified = allVisits.filter((v) => v.geoVerificationStatus === "Unverified").length;
    const outsideRadius = allVisits.filter((v) => v.geoVerificationStatus === "Outside Radius").length;

    const verificationRate = totalVisits > 0 ? Math.round((verified / totalVisits) * 100) : 0;

    return {
      totalVisits,
      verified,
      unverified,
      outsideRadius,
      verificationRate,
      byStatus: [
        { name: "Verified", value: verified, color: "#10b981" },
        { name: "Unverified", value: unverified, color: "#f59e0b" },
        { name: "Outside Radius", value: outsideRadius, color: "#ef4444" },
      ],
    };
  },

  getVisitStatusAnalysisReport: async () => {
    const dVisits = await visitsApi.listDoctorVisits();
    const fVisits = await visitsApi.listFirmVisits();
    const allVisits = [...dVisits, ...fVisits];
    const total = allVisits.length;

    const planned = allVisits.filter((v) => v.status === "planned").length;
    const open = allVisits.filter((v) => v.status === "open").length;
    const closed = allVisits.filter((v) => v.status === "closed" || v.status === "approved").length;
    const rescheduled = allVisits.filter((v) => v.status === "rescheduled").length;
    const skipped = allVisits.filter((v) => v.status === "skipped").length;
    const cancelled = allVisits.filter((v) => v.status === "cancelled").length;

    return {
      total,
      planned,
      open,
      closed,
      rescheduled,
      skipped,
      cancelled,
      byStatus: [
        { name: "Planned", count: planned },
        { name: "Open", count: open },
        { name: "Closed/Approved", count: closed },
        { name: "Rescheduled", count: rescheduled },
        { name: "Skipped", count: skipped },
        { name: "Cancelled", count: cancelled },
      ],
    };
  },
};

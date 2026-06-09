import { writeAudit } from "./writer";
import type { AuditRecord } from "./types";

export function logSecurityEvent(input: Omit<AuditRecord, "at" | "category">) {
  return writeAudit({ ...input, at: new Date().toISOString(), category: "security_event" });
}
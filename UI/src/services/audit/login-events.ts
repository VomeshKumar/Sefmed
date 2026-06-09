import { writeAudit } from "./writer";
import type { AuditRecord } from "./types";

export function logLoginEvent(input: Omit<AuditRecord, "at" | "category">) {
  return writeAudit({ ...input, at: new Date().toISOString(), category: "login_event" });
}
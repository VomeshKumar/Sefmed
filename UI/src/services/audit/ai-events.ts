import { writeAudit } from "./writer";
import type { AuditRecord } from "./types";

export function logAiEvent(input: Omit<AuditRecord, "at" | "category">) {
  return writeAudit({ ...input, at: new Date().toISOString(), category: "ai_event" });
}
import { writeAudit } from "./writer";
import type { AuditRecord } from "./types";

export function logApprovalAction(input: Omit<AuditRecord, "at" | "category">) {
  return writeAudit({ ...input, at: new Date().toISOString(), category: "approval_action" });
}
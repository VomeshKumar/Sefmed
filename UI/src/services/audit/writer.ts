import type { AuditRecord } from "./types";

/**
 * Append-only audit writer. All five sub-domains funnel through this single
 * function so we have one place to swap the sink (console → DB → SIEM).
 *
 * Phase-2: console sink. Phase-3: insert into `audit_log` table via
 * supabaseAdmin in a server function.
 */
export async function writeAudit(record: AuditRecord): Promise<void> {
  // eslint-disable-next-line no-console
  console.info("[audit]", record.category, record.action, record);
}
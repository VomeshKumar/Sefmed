export type AuditCategory =
  | "user_action"
  | "approval_action"
  | "login_event"
  | "security_event"
  | "ai_event";

export interface AuditRecord {
  id?: string;
  at: string;
  actorId: string | null;
  category: AuditCategory;
  action: string;
  resourceType?: string;
  resourceId?: string;
  outcome: "success" | "failure" | "denied";
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}
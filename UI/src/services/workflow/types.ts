/**
 * Workflow engine domain types.
 *
 * A WorkflowDefinition is declarative — states, transitions, rules, and an
 * approval chain. The engine (engine.ts) advances WorkflowInstances along
 * transitions when guard rules pass and when required approvals are met.
 */
export type WorkflowDomain =
  | "expense"
  | "leave"
  | "visit"
  | "order"
  | "secondary_sales";

export interface WorkflowState {
  id: string;
  label: string;
  terminal?: boolean;
}

export interface WorkflowTransition {
  id: string;
  from: string;
  to: string;
  action: string;
  guard?: string; // rule id
  requiresApproval?: boolean;
  approverStep?: number; // index into approvalChain
}

export interface ApprovalStep {
  id: string;
  resolver: ApprovalResolver;
  label: string;
}

export type ApprovalResolver =
  | { kind: "role"; role: string }
  | { kind: "manager_of"; field: string }
  | { kind: "user"; userId: string }
  | { kind: "expression"; expression: string };

export interface WorkflowDefinition {
  id: string;
  domain: WorkflowDomain;
  version: number;
  initialState: string;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  approvalChain: ApprovalStep[];
}

export interface WorkflowInstance {
  id: string;
  definitionId: string;
  entityId: string;
  state: string;
  history: WorkflowEvent[];
  context: Record<string, unknown>;
}

export interface WorkflowEvent {
  at: string;
  actorId: string;
  transitionId: string;
  fromState: string;
  toState: string;
  comment?: string;
}
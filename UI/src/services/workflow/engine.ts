import { evaluateRule } from "./rules";
import { findTransition } from "./transitions";
import { resolveApprovers } from "./approval-chain";
import type { WorkflowDefinition, WorkflowEvent, WorkflowInstance } from "./types";

export interface AdvanceInput {
  definition: WorkflowDefinition;
  instance: WorkflowInstance;
  action: string;
  actorId: string;
  comment?: string;
}

export interface AdvanceResult {
  instance: WorkflowInstance;
  event: WorkflowEvent;
  pendingApprovers: string[];
}

export async function advance({
  definition,
  instance,
  action,
  actorId,
  comment,
}: AdvanceInput): Promise<AdvanceResult> {
  const transition = findTransition(definition, instance.state, action);
  if (!transition) {
    throw new Error(`No transition '${action}' from state '${instance.state}'`);
  }

  const guardOk = await evaluateRule(transition.guard, instance.context);
  if (!guardOk) throw new Error(`Guard '${transition.guard}' rejected transition`);

  let pendingApprovers: string[] = [];
  if (transition.requiresApproval && transition.approverStep != null) {
    const step = definition.approvalChain[transition.approverStep];
    if (step) pendingApprovers = await resolveApprovers(step, instance);
  }

  const event: WorkflowEvent = {
    at: new Date().toISOString(),
    actorId,
    transitionId: transition.id,
    fromState: instance.state,
    toState: transition.to,
    comment,
  };

  const next: WorkflowInstance = {
    ...instance,
    state: transition.to,
    history: [...instance.history, event],
  };

  return { instance: next, event, pendingApprovers };
}
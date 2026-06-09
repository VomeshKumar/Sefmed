import type { WorkflowDefinition, WorkflowTransition } from "./types";

export function getAvailableTransitions(
  def: WorkflowDefinition,
  state: string,
): WorkflowTransition[] {
  return def.transitions.filter((t) => t.from === state);
}

export function findTransition(
  def: WorkflowDefinition,
  state: string,
  action: string,
): WorkflowTransition | undefined {
  return def.transitions.find((t) => t.from === state && t.action === action);
}
import type { ApprovalStep, WorkflowInstance } from "./types";

/**
 * Resolves which user(s) must approve a given step. Stubbed — Phase-3 will
 * read the org tree from the database.
 */
export async function resolveApprovers(
  step: ApprovalStep,
  _instance: WorkflowInstance,
): Promise<string[]> {
  switch (step.resolver.kind) {
    case "user":
      return [step.resolver.userId];
    case "role":
      return []; // Phase-3: query users with this role in scope
    case "manager_of":
      return []; // Phase-3: walk org tree
    case "expression":
      return []; // Phase-3: evaluator
  }
}
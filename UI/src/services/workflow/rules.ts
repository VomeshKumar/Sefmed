/**
 * Rule DSL for transition guards.
 * Phase-2: registry only. Phase-3 wires a real expression evaluator.
 */
export type RuleFn = (ctx: Record<string, unknown>) => boolean | Promise<boolean>;

const registry = new Map<string, RuleFn>();

export function registerRule(id: string, fn: RuleFn) {
  registry.set(id, fn);
}

export function getRule(id: string): RuleFn | undefined {
  return registry.get(id);
}

export async function evaluateRule(
  id: string | undefined,
  ctx: Record<string, unknown>,
): Promise<boolean> {
  if (!id) return true;
  const fn = registry.get(id);
  if (!fn) throw new Error(`Unknown workflow rule: ${id}`);
  return await fn(ctx);
}
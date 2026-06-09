import type { ReactNode } from "react";
import { useAuth } from "./auth-context";
import type { Permission } from "./permissions";

interface Props {
  permission?: Permission;
  anyOf?: Permission[];
  allOf?: Permission[];
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Conditionally renders children based on the current user's permissions.
 * Use for UI-level gating only. Server functions MUST also enforce permissions.
 */
export function RequirePermission({ permission, anyOf, allOf, fallback = null, children }: Props) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();
  let ok = true;
  if (permission) ok = ok && hasPermission(permission);
  if (anyOf?.length) ok = ok && hasAnyPermission(anyOf);
  if (allOf?.length) ok = ok && hasAllPermissions(allOf);
  return <>{ok ? children : fallback}</>;
}
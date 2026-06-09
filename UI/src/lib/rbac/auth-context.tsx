import { createContext, useContext, useMemo, type ReactNode } from "react";
import { permissionsForRoles, ROLES, type Role } from "./roles";
import type { Permission } from "./permissions";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  divisionId?: string;
  territoryId?: string;
}

interface AuthContextValue {
  user: CurrentUser | null;
  permissions: Set<Permission>;
  hasPermission: (p: Permission) => boolean;
  hasAnyPermission: (ps: Permission[]) => boolean;
  hasAllPermissions: (ps: Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Phase-2 stub provider. Replace `defaultUser` with a real session loader
 * (Supabase auth + `user_roles` table) in Phase 3.
 */
const defaultUser: CurrentUser = {
  id: "stub-user",
  name: "Demo Admin",
  email: "admin@sefmed.local",
  roles: [ROLES.ADMIN],
};

export function AuthProvider({
  children,
  user = defaultUser,
}: {
  children: ReactNode;
  user?: CurrentUser | null;
}) {
  const value = useMemo<AuthContextValue>(() => {
    const permissions = user ? permissionsForRoles(user.roles) : new Set<Permission>();
    return {
      user,
      permissions,
      hasPermission: (p) => permissions.has(p),
      hasAnyPermission: (ps) => ps.some((p) => permissions.has(p)),
      hasAllPermissions: (ps) => ps.every((p) => permissions.has(p)),
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
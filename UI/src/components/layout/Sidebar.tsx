import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/rbac/auth-context";
import { NAV, type NavItem } from "@/lib/navigation/nav-config";

function isVisible(item: NavItem, can: ReturnType<typeof useAuth>) {
  if (item.permission && !can.hasPermission(item.permission)) return false;
  if (item.anyOf && !can.hasAnyPermission(item.anyOf)) return false;
  return true;
}

export function Sidebar() {
  const auth = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-white text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        {/* Custom Sefmed Logo SVG */}
        <svg className="h-6 w-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35 15 L15 50 L35 85 L55 50 Z" fill="#008272" />
          <path d="M65 15 L45 50 L65 85 L85 50 Z" fill="#0ea5e9" />
        </svg>
        <span className="font-bold text-lg tracking-wider text-[#0f172a]">
          SEF<span className="text-[#008272]">MED</span>
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {NAV.filter((i) => isVisible(i, auth)).map((item) => {
          const Icon = item.icon;
          const children = item.children?.filter((c) => isVisible(c, auth)) ?? [];
          const active = location.pathname.startsWith(item.to);
          const isOpen = open[item.to] ?? active;
          if (children.length === 0) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
                  active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                )}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                {item.label}
              </Link>
            );
          }
          return (
            <div key={item.to}>
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [item.to]: !isOpen }))}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
                  active && "text-sidebar-accent-foreground font-medium",
                )}
              >
                <span className="flex items-center gap-2">
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  {item.label}
                </span>
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")}
                />
              </button>
              {isOpen ? (
                <div className="ml-7 mt-1 flex flex-col border-l pl-2">
                  {children.map((c) => {
                    const cActive = location.pathname === c.to;
                    const CIcon = c.icon;
                    return (
                      <Link
                        key={c.to}
                        to={c.to}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative flex items-center gap-2",
                          cActive && "text-[#008272] bg-[#008272]/5 font-semibold",
                        )}
                      >
                        {CIcon && <CIcon className="h-4 w-4 shrink-0 text-slate-800" />}
                        <span>{c.label}</span>
                        {cActive && <span className="absolute right-0 top-0 bottom-0 w-1 bg-[#008272]" />}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
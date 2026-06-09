import { Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/rbac/auth-context";

export function Topbar() {
  const { user } = useAuth();
  return (
    <header className="flex h-14 items-center gap-3 border-b bg-white px-4">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input placeholder="Search" className="pl-8 h-9 bg-slate-50 border-slate-200" />
      </div>
      <Button variant="ghost" size="icon" aria-label="Notifications" className="text-slate-600">
        <Bell className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
        <span className="hidden md:inline">{user?.name === "Demo Admin" ? "Teqmed Pharma LLP" : (user?.name || "Teqmed Pharma LLP")}</span>
        <button
          onClick={() => {
            window.location.href = "/login";
          }}
          className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-slate-900" />
        </button>
      </div>
    </header>
  );
}
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  delta?: { value: string; positive?: boolean };
  icon?: LucideIcon;
  className?: string;
}

export function KpiCard({ label, value, delta, icon: Icon, className }: Props) {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="kpi-value mt-1 text-2xl font-semibold tracking-tight">{value}</p>
          {delta ? (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                delta.positive ? "text-success" : "text-destructive",
              )}
            >
              {delta.positive ? "▲" : "▼"} {delta.value}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <div className="rounded-md bg-primary-muted p-2 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
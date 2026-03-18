import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
};

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="rounded-lg bg-[#6C5CE7]/10 p-2">
            <Icon className="h-4 w-4 text-[#6C5CE7]" />
          </div>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {change && (
            <span
              className={cn(
                "mb-0.5 text-xs font-medium",
                changeType === "positive" && "text-emerald-600",
                changeType === "negative" && "text-red-500",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

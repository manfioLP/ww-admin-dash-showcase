import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentActivity, type Activity } from "@/data/mock";
import { UserPlus, Rocket, TrendingUp, AlertTriangle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const activityConfig: Record<
  Activity["type"],
  { icon: typeof UserPlus; color: string; bg: string }
> = {
  partner_onboarded: {
    icon: UserPlus,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  agent_deployed: {
    icon: Rocket,
    color: "text-[#6C5CE7]",
    bg: "bg-[#6C5CE7]/10",
  },
  conversion: {
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  agent_alert: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  audit_completed: {
    icon: Search,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function ActivityFeed() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={cn("rounded-lg p-1.5", config.bg)}>
                  <Icon className={cn("h-3.5 w-3.5", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug text-foreground">
                    {activity.message}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

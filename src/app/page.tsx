import { Users, Bot, MessageSquare, TrendingUp } from "lucide-react";
import { customers, agents } from "@/data/mock";
import { StatCard } from "@/components/dashboard/stat-card";
import { ConversationsChart } from "@/components/dashboard/conversations-chart";
import { PlatformChart } from "@/components/dashboard/platform-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function getDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const totalCustomers = customers.length;
  const activeAgents = agents.filter((a) => a.status === "live").length;
  const totalConversations = customers.reduce(
    (sum, c) => sum + c.totalConversations,
    0
  );
  const avgConversionRate =
    customers
      .filter((c) => c.contractStatus === "active")
      .reduce((sum, c) => sum + c.conversionRate, 0) /
    customers.filter((c) => c.contractStatus === "active").length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">{getDate()}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Operations Overview
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">WaniWani Command Center</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Total Partners"
          value={totalCustomers.toString()}
          change="+2 this month"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Active Agents"
          value={activeAgents.toString()}
          change={`${agents.length} total`}
          changeType="neutral"
          icon={Bot}
        />
        <StatCard
          title="Total Conversations"
          value={formatNumber(totalConversations)}
          change="+12.3%"
          changeType="positive"
          icon={MessageSquare}
        />
        <StatCard
          title="Avg Conversion Rate"
          value={`${avgConversionRate.toFixed(1)}%`}
          change="+0.4pp"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <ConversationsChart />
        </div>
        <div className="space-y-6">
          <PlatformChart />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

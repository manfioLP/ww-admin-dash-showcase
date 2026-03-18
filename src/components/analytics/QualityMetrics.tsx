import { MessageSquare, Clock, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FilterProps = {
  dateRange: "7d" | "30d" | "90d";
};

// Slightly varied by date range to feel dynamic
const METRICS_BY_RANGE = {
  "7d": {
    avgLength: { value: "9.2", change: "+0.8", up: true },
    timeToQuote: { value: "2.9 min", change: "-0.3 min", up: true },
    engagementRate: { value: "76%", change: "+3pp", up: true },
    intentDropOff: { value: "19%", change: "-2pp", up: true },
    quoteDropOff: { value: "28%", change: "-3pp", up: true },
  },
  "30d": {
    avgLength: { value: "8.4", change: "+0.5", up: true },
    timeToQuote: { value: "3.2 min", change: "-0.2 min", up: true },
    engagementRate: { value: "73%", change: "+1pp", up: true },
    intentDropOff: { value: "22%", change: "-1pp", up: true },
    quoteDropOff: { value: "31%", change: "+2pp", up: false },
  },
  "90d": {
    avgLength: { value: "7.9", change: "+1.1", up: true },
    timeToQuote: { value: "3.6 min", change: "-0.5 min", up: true },
    engagementRate: { value: "71%", change: "+4pp", up: true },
    intentDropOff: { value: "24%", change: "-4pp", up: true },
    quoteDropOff: { value: "33%", change: "-2pp", up: true },
  },
};

type MetricCardProps = {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  description: string;
};

function MetricCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  change,
  positive,
  description,
}: MetricCardProps) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="rounded-lg p-2" style={{ backgroundColor: iconBg }}>
            <Icon className="h-4 w-4" style={{ color: iconColor }} />
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            )}
          >
            {change}
          </span>
        </div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground leading-snug">{description}</p>
      </CardContent>
    </Card>
  );
}

export function QualityMetrics({ dateRange }: FilterProps) {
  const m = METRICS_BY_RANGE[dateRange];

  const cards: MetricCardProps[] = [
    {
      icon: MessageSquare,
      iconColor: "#6C5CE7",
      iconBg: "#6C5CE71a",
      label: "Avg Conversation Length",
      value: m.avgLength.value,
      change: m.avgLength.change,
      positive: m.avgLength.up,
      description: "Messages per conversation session",
    },
    {
      icon: Clock,
      iconColor: "#2563eb",
      iconBg: "#2563eb1a",
      label: "Avg Time to Quote",
      value: m.timeToQuote.value,
      change: m.timeToQuote.change,
      positive: m.timeToQuote.up,
      description: "From conversation start to quote delivery",
    },
    {
      icon: CheckCircle,
      iconColor: "#10b981",
      iconBg: "#10b9811a",
      label: "Engagement Rate",
      value: m.engagementRate.value,
      change: m.engagementRate.change,
      positive: m.engagementRate.up,
      description: "Conversations with 3+ exchanges",
    },
    {
      icon: TrendingDown,
      iconColor: "#f59e0b",
      iconBg: "#f59e0b1a",
      label: "Intent Drop-off",
      value: m.intentDropOff.value,
      change: m.intentDropOff.change,
      positive: m.intentDropOff.up,
      description: "Conversations that didn't reach quoting",
    },
    {
      icon: AlertCircle,
      iconColor: "#ef4444",
      iconBg: "#ef44441a",
      label: "Quote Drop-off",
      value: m.quoteDropOff.value,
      change: m.quoteDropOff.change,
      positive: m.quoteDropOff.up,
      description: "Quoted users who didn't convert",
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Conversation Quality</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Engagement and drop-off metrics across all agents
        </p>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}

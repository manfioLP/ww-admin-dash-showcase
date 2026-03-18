"use client";

import { BarChart, Bar, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { MessageSquare, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Agent, type Customer } from "@/data/mock";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return `${Math.floor(diff / 60_000)}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function generateSparkline(agent: Agent) {
  const daily = Math.round(agent.conversations / 30);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day, i) => ({
    day,
    value: Math.max(0, Math.round(daily * (0.7 + (i < 5 ? 0.6 : 0.3) * Math.random()))),
  }));
}

type Outcome = "converted" | "quoted" | "dropped";

const OUTCOME_CONFIG: Record<Outcome, { label: string; color: string; bg: string }> = {
  converted: { label: "Converted", color: "#059669", bg: "#10b98112" },
  quoted: { label: "Quoted", color: "#2563eb", bg: "#3b82f612" },
  dropped: { label: "Dropped", color: "#9ca3af", bg: "#9ca3af12" },
};

const CONVERSATION_PREVIEWS: Record<string, string[]> = {
  insurance: [
    "I need home insurance for a 3-bed house in Austin…",
    "What's the cheapest auto coverage for a 2019 Camry?",
    "Can I bundle home and auto for a discount?",
    "Looking for renters insurance under $20/month",
    "My premium just increased — what are my options?",
  ],
  fintech: [
    "I want to start investing $500/month — where to begin?",
    "How does your account compare to a HYSA?",
    "Difference between your basic and premium plans?",
    "Do you support international wire transfers?",
    "How does your robo-advisor compare to Betterment?",
  ],
  travel: [
    "Planning 2 weeks in Italy — do I need travel insurance?",
    "What does cancel-for-any-reason actually cover?",
    "Traveling with elderly parents — best medical coverage?",
    "Am I covered for a long layover delay in Dubai?",
    "Need adventure coverage for hiking in Patagonia",
  ],
  health: [
    "I need a plan that covers specialist for migraines",
    "What's covered under preventive care pre-deductible?",
    "Does your plan cover mental health therapy?",
    "Self-employed at 32 — best value health plan?",
    "My Rx costs $400/month — can you help reduce that?",
  ],
};

function generateConversations(agent: Agent, vertical: string) {
  const previews = CONVERSATION_PREVIEWS[vertical] ?? CONVERSATION_PREVIEWS.insurance;
  const outcomes: Outcome[] = ["converted", "quoted", "quoted", "dropped", "converted"];
  const base = new Date("2026-03-18T14:00:00Z");
  return previews.map((preview, i) => ({
    id: `${agent.id}_c${i}`,
    preview,
    outcome: outcomes[i],
    timestamp: new Date(base.getTime() - (i * 3 + 1) * 3_600_000).toISOString(),
  }));
}

export function AgentPerformance({
  agent,
  customer,
}: {
  agent: Agent;
  customer: Customer;
}) {
  const sparkline = generateSparkline(agent);
  const weeklyTotal = sparkline.reduce((s, d) => s + d.value, 0);
  const weeklyConversions = Math.round(agent.conversions * (7 / 30));
  const weeklyQuotes = Math.round(agent.quotes * (7 / 30));
  const convRate =
    agent.conversations > 0
      ? ((agent.conversions / agent.conversations) * 100).toFixed(1)
      : "0.0";

  const conversations = generateConversations(agent, customer.vertical);

  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Performance</h3>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Last 7 days
            </span>
          </div>

          <div className="mb-5 grid grid-cols-3 divide-x divide-border/50">
            <MiniStat icon={MessageSquare} label="Conversations" value={weeklyTotal.toLocaleString()} />
            <MiniStat icon={FileText} label="Quotes" value={weeklyQuotes.toLocaleString()} />
            <MiniStat icon={TrendingUp} label="Conv. Rate" value={`${convRate}%`} />
          </div>

          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sparkline} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "11px",
                    padding: "4px 8px",
                  }}
                  cursor={{ fill: "#f3f4f6" }}
                  formatter={(v) => [v, "Convos"]}
                />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {sparkline.map((_, i) => (
                    <Cell key={i} fill={i === sparkline.length - 1 ? "#6C5CE7" : "#e0ddfa"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex justify-between px-1 text-[10px] text-muted-foreground">
            {sparkline.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <h3 className="mb-4 text-sm font-semibold">Recent Conversations</h3>
          <div className="space-y-3">
            {conversations.map((c) => {
              const outcfg = OUTCOME_CONFIG[c.outcome];
              return (
                <div
                  key={c.id}
                  className="flex items-start gap-3 rounded-lg border border-border/40 bg-gray-50/50 px-3.5 py-3"
                >
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-foreground">{c.preview}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{timeAgo(c.timestamp)}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{ color: outcfg.color, backgroundColor: outcfg.bg }}
                  >
                    {outcfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-2 py-1 first:pl-0 last:pr-0">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <p className="text-base font-semibold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

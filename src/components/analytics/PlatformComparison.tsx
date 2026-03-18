"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { agents } from "@/data/mock";
import { cn } from "@/lib/utils";

type Metric = "conversations" | "quotes" | "conversions";
type FilterProps = {
  dateRange: "7d" | "30d" | "90d";
  customerId: string;
  platform: string;
};

const RANGE_MULT = { "7d": 0.08, "30d": 0.30, "90d": 0.75 };

const PERIOD_LABELS = {
  "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "30d": ["Week 1", "Week 2", "Week 3", "Week 4"],
  "90d": ["Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26", "Mar '26"],
};

function buildChartData(
  dateRange: "7d" | "30d" | "90d",
  filteredAgents: typeof agents,
  metric: Metric
) {
  const labels = PERIOD_LABELS[dateRange];
  const n = labels.length;
  const mult = RANGE_MULT[dateRange];

  const totals = {
    chatgpt: filteredAgents.filter((a) => a.platform === "chatgpt").reduce((s, a) => s + a[metric], 0),
    claude: filteredAgents.filter((a) => a.platform === "claude").reduce((s, a) => s + a[metric], 0),
    gemini: filteredAgents.filter((a) => a.platform === "gemini").reduce((s, a) => s + a[metric], 0),
  };

  return labels.map((label, i) => {
    const trend = 1 + (i / n) * 0.3;
    const jitter = () => 0.82 + Math.random() * 0.36;
    return {
      label,
      ChatGPT: Math.round((totals.chatgpt * mult / n) * trend * jitter()),
      Claude: Math.round((totals.claude * mult / n) * trend * jitter()),
      Gemini: Math.round((totals.gemini * mult / n) * trend * jitter()),
    };
  });
}

const METRICS: { key: Metric; label: string }[] = [
  { key: "conversations", label: "Conversations" },
  { key: "quotes", label: "Quotes" },
  { key: "conversions", label: "Conversions" },
];

export function PlatformComparison({ dateRange, customerId, platform }: FilterProps) {
  const [metric, setMetric] = useState<Metric>("conversations");

  const { data, show } = useMemo(() => {
    let fa = agents;
    if (customerId !== "all") fa = fa.filter((a) => a.customerId === customerId);
    if (platform !== "all") fa = fa.filter((a) => a.platform === platform);

    return {
      data: buildChartData(dateRange, fa, metric),
      show: {
        chatgpt: platform === "all" || platform === "chatgpt",
        claude: platform === "all" || platform === "claude",
        gemini: platform === "all" || platform === "gemini",
      },
    };
  }, [dateRange, customerId, platform, metric]);

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold">Platform Comparison</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              ChatGPT vs Claude vs Gemini
            </p>
          </div>
          <div className="flex overflow-hidden rounded-lg border border-border">
            {METRICS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  metric === m.key
                    ? "bg-[#6C5CE7] text-white"
                    : "bg-white text-muted-foreground hover:bg-gray-50"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={3} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            {show.chatgpt && <Bar dataKey="ChatGPT" fill="#10a37f" radius={[3, 3, 0, 0]} />}
            {show.claude && <Bar dataKey="Claude" fill="#d97706" radius={[3, 3, 0, 0]} />}
            {show.gemini && <Bar dataKey="Gemini" fill="#4285f4" radius={[3, 3, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

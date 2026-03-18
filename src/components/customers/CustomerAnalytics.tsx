"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { type Customer, type Agent } from "@/data/mock";

function generateCustomerDailyData(totalConversations: number) {
  const daily = Math.round(totalConversations / 180);
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const weekend = d.getDay() === 0 || d.getDay() === 6 ? 0.6 : 1;
    const trend = 1 + (29 - i) * 0.01;
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      conversations: Math.max(0, Math.round(daily * weekend * trend + (Math.random() - 0.5) * daily * 0.4)),
    });
  }
  return data;
}

function FunnelBar({
  label,
  value,
  max,
  color,
  pct,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  pct?: string;
}) {
  const width = Math.round((value / max) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value.toLocaleString()} {pct && <span className="text-xs text-muted-foreground">({pct})</span>}
        </span>
      </div>
      <div className="h-8 w-full overflow-hidden rounded-lg bg-gray-100">
        <div
          className="h-full rounded-lg transition-all duration-500"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function CustomerAnalytics({
  customer,
  agents,
}: {
  customer: Customer;
  agents: Agent[];
}) {
  const chartData = generateCustomerDailyData(customer.totalConversations);

  const totalQuotes = agents.reduce((s, a) => s + a.quotes, 0);
  const totalConversions = customer.conversions;
  const totalConversations = customer.totalConversations;

  const quotePct = totalConversations > 0
    ? `${((totalQuotes / totalConversations) * 100).toFixed(1)}%`
    : "—";
  const convPct = totalQuotes > 0
    ? `${((totalConversions / totalQuotes) * 100).toFixed(1)}% of quotes`
    : "—";

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Conversations Over Time</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 30 days</p>
            </div>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              30d
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                interval={4}
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
                labelStyle={{ fontWeight: 600, marginBottom: 2 }}
              />
              <Line
                type="monotone"
                dataKey="conversations"
                stroke="#6C5CE7"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#6C5CE7" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold">Conversion Funnel</h3>
            <p className="text-xs text-muted-foreground mt-0.5">All time performance</p>
          </div>
          <div className="space-y-4">
            <FunnelBar
              label="Conversations"
              value={totalConversations}
              max={totalConversations}
              color="#6C5CE7"
            />
            <FunnelBar
              label="Quotes Generated"
              value={totalQuotes}
              max={totalConversations}
              color="#8b7cf6"
              pct={quotePct}
            />
            <FunnelBar
              label="Conversions"
              value={totalConversions}
              max={totalConversations}
              color="#10b981"
              pct={convPct}
            />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border/50 pt-5">
            <Metric label="Quote Rate" value={quotePct} />
            <Metric label="Conv. Rate" value={`${customer.conversionRate.toFixed(2)}%`} />
            <Metric
              label="Quote→Conv"
              value={totalQuotes > 0 ? `${((totalConversions / totalQuotes) * 100).toFixed(1)}%` : "—"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-semibold tracking-tight">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dailyConversations } from "@/data/mock";
import { ChartCard } from "./chart-card";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ConversationsChart() {
  return (
    <ChartCard title="Conversations" badge="30d">
      <div className="h-[300px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dailyConversations}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="chatgptGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="claudeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="geminiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
              labelFormatter={(label) => formatDate(String(label))}
            />
            <Area
              type="monotone"
              dataKey="chatgpt"
              stackId="1"
              stroke="#3B82F6"
              fill="url(#chatgptGrad)"
              strokeWidth={2}
              name="ChatGPT"
            />
            <Area
              type="monotone"
              dataKey="claude"
              stackId="1"
              stroke="#F97316"
              fill="url(#claudeGrad)"
              strokeWidth={2}
              name="Claude"
            />
            <Area
              type="monotone"
              dataKey="gemini"
              stackId="1"
              stroke="#22C55E"
              fill="url(#geminiGrad)"
              strokeWidth={2}
              name="Gemini"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

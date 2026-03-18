"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "./chart-card";
import { dailyConversations } from "@/data/mock";

const COLORS = ["#3B82F6", "#F97316", "#22C55E"];

function getPlatformData() {
  const totals = dailyConversations.reduce(
    (acc, day) => ({
      chatgpt: acc.chatgpt + day.chatgpt,
      claude: acc.claude + day.claude,
      gemini: acc.gemini + day.gemini,
    }),
    { chatgpt: 0, claude: 0, gemini: 0 }
  );

  const total = totals.chatgpt + totals.claude + totals.gemini;

  return [
    { name: "ChatGPT", value: totals.chatgpt, pct: ((totals.chatgpt / total) * 100).toFixed(1) },
    { name: "Claude", value: totals.claude, pct: ((totals.claude / total) * 100).toFixed(1) },
    { name: "Gemini", value: totals.gemini, pct: ((totals.gemini / total) * 100).toFixed(1) },
  ];
}

export function PlatformChart() {
  const data = getPlatformData();

  return (
    <ChartCard title="Platform Distribution">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
              }}
              formatter={(value) => Number(value).toLocaleString()}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-1">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i] }}
            />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="font-medium">{item.pct}%</span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

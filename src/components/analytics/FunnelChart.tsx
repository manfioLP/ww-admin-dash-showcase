"use client";

import { useMemo, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { customers, agents } from "@/data/mock";

type FilterProps = {
  dateRange: "7d" | "30d" | "90d";
  customerId: string;
  platform: string;
};

const RANGE_MULT = { "7d": 0.08, "30d": 0.30, "90d": 0.75 };

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

const STAGES = [
  {
    key: "convs" as const,
    label: "Conversations",
    sublabel: "Users who engaged with the agent",
    color: "#c4b5fd",
    textColor: "#5b21b6",
  },
  {
    key: "quotes" as const,
    label: "Quotes Generated",
    sublabel: "Users who received a product quote",
    color: "#8b5cf6",
    textColor: "#fff",
  },
  {
    key: "conversions" as const,
    label: "Conversions",
    sublabel: "Users who completed a purchase",
    color: "#6C5CE7",
    textColor: "#fff",
  },
];

export function FunnelChart({ dateRange, customerId, platform }: FilterProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const data = useMemo(() => {
    const mult = RANGE_MULT[dateRange];

    const filteredCustomers = customerId !== "all"
      ? customers.filter((c) => c.id === customerId)
      : customers;

    let filteredAgents = agents;
    if (customerId !== "all") filteredAgents = filteredAgents.filter((a) => a.customerId === customerId);
    if (platform !== "all") filteredAgents = filteredAgents.filter((a) => a.platform === platform);

    const convs = Math.round(filteredCustomers.reduce((s, c) => s + c.totalConversations, 0) * mult);
    const quotes = Math.round(filteredAgents.reduce((s, a) => s + a.quotes, 0) * mult);
    const conversions = Math.round(filteredCustomers.reduce((s, c) => s + c.conversions, 0) * mult);

    return { convs, quotes, conversions };
  }, [dateRange, customerId, platform]);

  const maxVal = data.convs;

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold">Conversion Funnel</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              End-to-end journey for the selected period
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {STAGES.map((stage, i) => {
            const value = data[stage.key];
            const pct = maxVal > 0 ? (value / maxVal) * 100 : 0;
            const widthPct = mounted ? Math.max(pct, value > 0 ? 8 : 0) : 0;

            return (
              <div key={stage.key} className="flex items-center gap-5">
                <div className="w-40 shrink-0 text-right">
                  <p className="text-xs font-semibold text-foreground">{stage.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                    {stage.sublabel}
                  </p>
                </div>

                <div className="relative flex-1 h-14 rounded-xl bg-gray-100 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-xl flex items-center px-4 gap-3"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: stage.color,
                      transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <span
                      className="text-sm font-bold whitespace-nowrap"
                      style={{ color: stage.textColor }}
                    >
                      {fmt(value)}
                    </span>
                  </div>
                </div>

                <div className="w-20 shrink-0">
                  <p className="text-sm font-semibold">
                    {i === 0 ? "100%" : `${pct.toFixed(1)}%`}
                  </p>
                  {i > 0 && (
                    <p className="text-[10px] text-muted-foreground">of convos</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-8 border-t border-border/50 pt-5">
          <SummaryMetric
            label="Quote Rate"
            value={data.convs > 0 ? `${((data.quotes / data.convs) * 100).toFixed(1)}%` : "—"}
          />
          <SummaryMetric
            label="Conversion Rate"
            value={data.convs > 0 ? `${((data.conversions / data.convs) * 100).toFixed(1)}%` : "—"}
          />
          <SummaryMetric
            label="Quote → Conversion"
            value={data.quotes > 0 ? `${((data.conversions / data.quotes) * 100).toFixed(1)}%` : "—"}
          />
          <div className="ml-auto text-right">
            <p className="text-xl font-semibold text-[#6C5CE7]">{fmt(data.conversions)}</p>
            <p className="text-xs text-muted-foreground">total conversions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-lg font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

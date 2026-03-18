"use client";

import { useState } from "react";
import { customers } from "@/data/mock";
import { cn } from "@/lib/utils";
import { FunnelChart } from "@/components/analytics/FunnelChart";
import { PlatformComparison } from "@/components/analytics/PlatformComparison";
import { TopCustomers } from "@/components/analytics/TopCustomers";
import { BrandVisibility } from "@/components/analytics/BrandVisibility";
import { QualityMetrics } from "@/components/analytics/QualityMetrics";

type DateRange = "7d" | "30d" | "90d";

const DATE_RANGES: { key: DateRange; label: string }[] = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
];

const selectCls =
  "rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10 cursor-pointer";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [customerId, setCustomerId] = useState("all");
  const [platform, setPlatform] = useState("all");

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Performance insights across customers, agents, and platforms
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
        {/* Date range toggle */}
        <div className="flex overflow-hidden rounded-lg border border-border">
          {DATE_RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setDateRange(r.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                dateRange === r.key
                  ? "bg-[#6C5CE7] text-white"
                  : "bg-white text-muted-foreground hover:bg-gray-50"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="mx-1 h-5 w-px bg-border" />

        {/* Customer filter */}
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className={selectCls}
        >
          <option value="all">All Customers</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.logo} {c.name}
            </option>
          ))}
        </select>

        {/* Platform filter */}
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className={selectCls}
        >
          <option value="all">All Platforms</option>
          <option value="chatgpt">ChatGPT</option>
          <option value="claude">Claude</option>
          <option value="gemini">Gemini</option>
        </select>

        {/* Active filter pills */}
        {(customerId !== "all" || platform !== "all" || dateRange !== "30d") && (
          <button
            onClick={() => { setCustomerId("all"); setPlatform("all"); setDateRange("30d"); }}
            className="ml-auto text-xs text-[#6C5CE7] hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Funnel — full width */}
        <FunnelChart dateRange={dateRange} customerId={customerId} platform={platform} />

        {/* Platform Comparison + Top Customers — side by side */}
        <div className="grid grid-cols-2 gap-6">
          <PlatformComparison dateRange={dateRange} customerId={customerId} platform={platform} />
          <TopCustomers dateRange={dateRange} customerId={customerId} />
        </div>

        {/* Brand Visibility — full width */}
        <BrandVisibility customerId={customerId} platform={platform} />

        {/* Quality Metrics — full width */}
        <QualityMetrics dateRange={dateRange} />
      </div>
    </div>
  );
}

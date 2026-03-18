"use client";

import { TrendingUp, Award, Users, Smile } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { QueryResultCard } from "./QueryResultCard";
import { CompetitorChart } from "./CompetitorChart";
import type { AuditResult, AuditSummary } from "@/types";

type Props = {
  brandName: string;
  results: AuditResult[];
  summary: AuditSummary;
};

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function AuditResults({ brandName, results, summary }: Props) {
  const doneCount = results.filter((r) => r.status === "done").length;

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Summary</h2>
          <span className="text-xs text-muted-foreground">
            {doneCount} / {results.length} queries complete
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard
            icon={TrendingUp}
            label="Mention Rate"
            value={`${summary.mentionRate}%`}
            sub={`${results.filter((r) => r.status === "done" && r.brandMentioned).length} of ${doneCount} queries`}
            color="#6C5CE7"
          />
          <SummaryCard
            icon={Award}
            label="Avg. Position"
            value={summary.avgPosition !== null ? `#${summary.avgPosition}` : "—"}
            sub="when mentioned"
            color="#10b981"
          />
          <SummaryCard
            icon={Users}
            label="Competitors"
            value={String(summary.competitorCount)}
            sub="brands detected"
            color="#3b82f6"
          />
          <SummaryCard
            icon={Smile}
            label="Sentiment"
            value={`${summary.sentimentScore}`}
            sub={
              summary.sentimentScore >= 70
                ? "Positive"
                : summary.sentimentScore >= 40
                ? "Neutral"
                : "Negative"
            }
            color={
              summary.sentimentScore >= 70
                ? "#10b981"
                : summary.sentimentScore >= 40
                ? "#f59e0b"
                : "#ef4444"
            }
          />
        </div>
      </div>

      {/* Query results */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">Query Results</h2>
        <div className="space-y-2">
          {results.map((r, i) => (
            <QueryResultCard key={r.queryId} result={r} brandName={brandName} index={i} />
          ))}
        </div>
      </div>

      {/* Competitor chart */}
      {doneCount > 0 && <CompetitorChart summary={summary} brandName={brandName} />}
    </div>
  );
}

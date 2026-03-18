"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { AuditSummary } from "@/types";

type Props = {
  summary: AuditSummary;
  brandName: string;
};

export function CompetitorChart({ summary, brandName }: Props) {
  const { topCompetitors } = summary;

  if (topCompetitors.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6">
          <h3 className="mb-4 text-sm font-semibold">Competitor Mentions</h3>
          <p className="text-sm text-muted-foreground">No competitors detected in this audit.</p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...topCompetitors.map((c) => c.count));

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Competitor Mentions</h3>
          <span className="text-xs text-muted-foreground">Across all queries</span>
        </div>
        <div className="space-y-2.5">
          {topCompetitors.map((c, i) => {
            const pct = Math.round((c.count / maxCount) * 100);
            const isTarget = c.brand.toLowerCase() === brandName.toLowerCase();
            return (
              <div key={i} className="group">
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    {c.brand}
                    {isTarget && (
                      <span className="rounded-full bg-[#6C5CE7]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#6C5CE7]">
                        You
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {c.count} mention{c.count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: isTarget ? "#6C5CE7" : "#d1d5db",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

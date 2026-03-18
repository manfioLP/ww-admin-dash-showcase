"use client";

import { Clock, TrendingUp, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AuditRecord } from "@/types";

type Props = {
  history: AuditRecord[];
  onSelect: (record: AuditRecord) => void;
};

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function AuditHistory({ history, onSelect }: Props) {
  if (history.length === 0) return null;

  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Audit History</h3>
          <span className="ml-auto text-xs text-muted-foreground">{history.length} run{history.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="divide-y divide-border/50">
          {history.map((record) => (
            <button
              key={record.id}
              onClick={() => onSelect(record)}
              className="group flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-gray-50/80"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{record.brandName}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{record.industry}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{record.queryCount} queries</span>
                  <span>·</span>
                  <span className="capitalize">{record.platform}</span>
                  <span>·</span>
                  <span>{timeAgo(record.runAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-[#6C5CE7]" />
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        record.summary.mentionRate >= 75
                          ? "text-emerald-600"
                          : record.summary.mentionRate >= 40
                          ? "text-amber-600"
                          : "text-red-500"
                      )}
                    >
                      {record.summary.mentionRate}%
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">mention rate</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

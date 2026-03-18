"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditResult } from "@/types";

type Props = {
  result: AuditResult;
  brandName: string;
  index: number;
};

const INTENT_LABELS: Record<string, string> = {
  recommendation: "Recommendation",
  comparison: "Comparison",
  discovery: "Discovery",
  price: "Price",
};

const SENTIMENT_CONFIG = {
  positive: { label: "Positive", color: "text-emerald-700", bg: "bg-emerald-50" },
  neutral: { label: "Neutral", color: "text-amber-700", bg: "bg-amber-50" },
  negative: { label: "Negative", color: "text-red-700", bg: "bg-red-50" },
};

export function QueryResultCard({ result, brandName, index }: Props) {
  const [expanded, setExpanded] = useState(false);

  const intentLabel = INTENT_LABELS[result.queryId?.split("-")[1] ?? ""] ?? "Query";

  return (
    <div
      className={cn(
        "rounded-xl border transition-all",
        result.status === "done" && result.brandMentioned
          ? "border-emerald-200 bg-emerald-50/30"
          : result.status === "done"
          ? "border-red-200 bg-red-50/20"
          : result.status === "error"
          ? "border-red-200 bg-red-50/30"
          : "border-border bg-white"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-muted-foreground shadow-sm border border-border">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-snug">{result.queryText}</p>
            <div className="flex shrink-0 items-center gap-2">
              {result.status === "running" && (
                <Loader2 className="h-4 w-4 animate-spin text-[#6C5CE7]" />
              )}
              {result.status === "done" && result.brandMentioned && (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              )}
              {result.status === "done" && !result.brandMentioned && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              {result.status === "error" && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              {result.status === "pending" && (
                <div className="h-2 w-2 rounded-full bg-gray-300" />
              )}
            </div>
          </div>

          {result.status === "done" && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {result.brandMentioned ? (
                <>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {brandName} mentioned
                  </span>
                  {result.brandPosition !== null && (
                    <span className="rounded-full bg-white border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      Position #{result.brandPosition}
                    </span>
                  )}
                  {result.sentiment && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        SENTIMENT_CONFIG[result.sentiment].bg,
                        SENTIMENT_CONFIG[result.sentiment].color
                      )}
                    >
                      {SENTIMENT_CONFIG[result.sentiment].label}
                    </span>
                  )}
                </>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Not mentioned
                </span>
              )}
              {result.competitors.length > 0 && (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-muted-foreground">
                  {result.competitors.length} competitor{result.competitors.length !== 1 ? "s" : ""} found
                </span>
              )}
            </div>
          )}

          {result.status === "running" && (
            <p className="mt-1.5 text-xs text-muted-foreground animate-pulse">
              Querying Claude…
            </p>
          )}

          {result.status === "error" && (
            <p className="mt-1.5 text-xs text-red-600">{result.error ?? "An error occurred"}</p>
          )}
        </div>

        {result.status === "done" && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-black/5 transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Expanded content */}
      {expanded && result.status === "done" && (
        <div className="border-t border-border/50 px-4 pb-4 pt-3 space-y-3">
          {/* AI response */}
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Claude&apos;s Response
            </p>
            <div className="rounded-lg bg-white border border-border p-3">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {result.response}
              </p>
            </div>
          </div>

          {/* Competitors */}
          {result.competitors.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Brands Mentioned
              </p>
              <div className="space-y-1.5">
                {result.competitors.map((c, i) => {
                  const sentConf = SENTIMENT_CONFIG[c.sentiment];
                  return (
                    <div key={i} className="flex items-start gap-2.5 rounded-lg bg-white border border-border px-3 py-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-muted-foreground">
                        {c.position}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{c.brand}</span>
                          <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", sentConf.bg, sentConf.color)}>
                            {sentConf.label}
                          </span>
                        </div>
                        {c.excerpt && (
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                            &ldquo;{c.excerpt}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

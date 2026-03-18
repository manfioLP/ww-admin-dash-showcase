"use client";

import { useState, useCallback } from "react";
import { Radar, RefreshCw } from "lucide-react";
import { QueryBuilder } from "@/components/monitor/QueryBuilder";
import { AuditResults } from "@/components/monitor/AuditResults";
import { AuditHistory } from "@/components/monitor/AuditHistory";
import { generateQueries, runSyntheticQuery, analyzeResponse, computeSummary } from "@/lib/api";
import type { AuditResult, AuditRecord, AuditSummary } from "@/types";

const EMPTY_SUMMARY: AuditSummary = {
  mentionRate: 0,
  avgPosition: null,
  competitorCount: 0,
  sentimentScore: 50,
  topCompetitors: [],
};

export default function MonitorPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [summary, setSummary] = useState<AuditSummary>(EMPTY_SUMMARY);
  const [brandName, setBrandName] = useState("");
  const [history, setHistory] = useState<AuditRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const updateResult = useCallback((queryId: string, patch: Partial<AuditResult>) => {
    setResults((prev) => {
      const next = prev.map((r) => (r.queryId === queryId ? { ...r, ...patch } : r));
      setSummary(computeSummary(next));
      return next;
    });
  }, []);

  async function handleRun(brand: string, industry: string, customerName: string) {
    setIsRunning(true);
    setError(null);
    setBrandName(brand);
    setResults([]);
    setSummary(EMPTY_SUMMARY);

    try {
      // 1. Generate queries
      const queries = await generateQueries(brand, industry);

      // 2. Initialize result placeholders
      const initial: AuditResult[] = queries.map((q) => ({
        queryId: q.id,
        queryText: q.text,
        status: "pending",
        response: "",
        brandMentioned: false,
        brandPosition: null,
        competitors: [],
        sentiment: null,
      }));
      setResults(initial);

      // 3. Run each query progressively
      const finalResults: AuditResult[] = [...initial];

      for (let i = 0; i < queries.length; i++) {
        const q = queries[i];

        // Mark as running
        updateResult(q.id, { status: "running" });

        try {
          const aiResponse = await runSyntheticQuery(q.text);
          const analysis = await analyzeResponse(q.text, aiResponse, brand);

          const done: Partial<AuditResult> = {
            status: "done",
            response: aiResponse,
            brandMentioned: analysis.brandMentioned,
            brandPosition: analysis.brandPosition,
            competitors: analysis.competitors ?? [],
            sentiment: analysis.sentiment,
          };
          updateResult(q.id, done);
          finalResults[i] = { ...finalResults[i], ...done };
        } catch (e) {
          const errMsg = e instanceof Error ? e.message : "Unknown error";
          updateResult(q.id, { status: "error", error: errMsg });
          finalResults[i] = { ...finalResults[i], status: "error", error: errMsg };
        }
      }

      // 4. Save to history
      const finalSummary = computeSummary(finalResults);
      const record: AuditRecord = {
        id: `audit_${Date.now()}`,
        customerName,
        industry,
        brandName: brand,
        platform: "claude",
        runAt: new Date(),
        queryCount: queries.length,
        summary: finalSummary,
        results: finalResults,
      };
      setHistory((prev) => [record, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to run audit");
    } finally {
      setIsRunning(false);
    }
  }

  function handleSelectHistory(record: AuditRecord) {
    setBrandName(record.brandName);
    setResults(record.results);
    setSummary(record.summary);
    setError(null);
  }

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/10">
            <Radar className="h-5 w-5 text-[#6C5CE7]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">AI Brand Monitor</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Synthetic buyer audits — see how Claude recommends your customers&apos; brands
            </p>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          <QueryBuilder onRun={handleRun} isRunning={isRunning} />
          <AuditHistory history={history} onSelect={handleSelectHistory} />
        </div>

        {/* Right column */}
        <div>
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">{error}</p>
              <p className="mt-0.5 text-xs text-red-600">
                Make sure ANTHROPIC_API_KEY is set in your environment.
              </p>
            </div>
          )}

          {results.length > 0 ? (
            <AuditResults
              brandName={brandName}
              results={results}
              summary={summary}
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-20">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6C5CE7]/10">
                <Radar className="h-7 w-7 text-[#6C5CE7]" />
              </div>
              <h3 className="text-base font-semibold">No audit running</h3>
              <p className="mt-1.5 max-w-xs text-center text-sm text-muted-foreground">
                Configure a brand audit on the left and click{" "}
                <span className="font-medium text-foreground">Run Brand Audit</span> to
                see how Claude recommends your brand.
              </p>
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-gray-50 px-4 py-2.5 text-xs text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5" />
                Powered by Claude {" "}
                <span className="font-medium text-foreground">claude-sonnet-4-6</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

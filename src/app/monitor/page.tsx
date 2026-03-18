"use client";

import { useState, useCallback } from "react";
import { Radar, RefreshCw, Loader2 } from "lucide-react";
import { QueryBuilder } from "@/components/monitor/QueryBuilder";
import { AuditResults } from "@/components/monitor/AuditResults";
import { AuditHistory } from "@/components/monitor/AuditHistory";
import { sendChatMessage, generateStructured, computeSummary } from "@/lib/api";
import type { AuditResult, AuditRecord, AuditSummary, BrandMention } from "@/types";

const EMPTY_SUMMARY: AuditSummary = {
  mentionRate: 0,
  avgPosition: null,
  competitorCount: 0,
  sentimentScore: 50,
  topCompetitors: [],
};

const SYSTEM_PROMPT =
  "You are a helpful AI assistant. Answer the user's question naturally with specific recommendations and brand names where relevant.";

interface AnalysisData {
  brandMentioned: boolean;
  position?: number | null;
  competitors?: BrandMention[];
  sentiment?: "positive" | "neutral" | "negative" | null;
}

export default function MonitorPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [summary, setSummary] = useState<AuditSummary>(EMPTY_SUMMARY);
  const [brandName, setBrandName] = useState("");
  const [history, setHistory] = useState<AuditRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ index: number; total: number; text: string } | null>(null);

  const updateResult = useCallback((queryId: string, patch: Partial<AuditResult>) => {
    setResults((prev) => {
      const next = prev.map((r) => (r.queryId === queryId ? { ...r, ...patch } : r));
      setSummary(computeSummary(next));
      return next;
    });
  }, []);

  async function handleRun(
    brand: string,
    industry: string,
    customerName: string,
    customScenario?: string
  ) {
    setIsRunning(true);
    setError(null);
    setBrandName(brand);
    setResults([]);
    setSummary(EMPTY_SUMMARY);
    setProgress(null);

    try {
      // Step 1: Generate 5 queries
      const queryPrompt = customScenario?.trim()
        ? `Generate 5 realistic questions a consumer would ask an AI assistant about ${industry}. Focus on this specific scenario: "${customScenario.trim()}". Vary the questions slightly. Return a JSON array of 5 strings only — no objects, just plain question strings.`
        : `Generate 5 realistic questions a consumer would ask an AI assistant about ${industry}. The questions should be the kind where an AI might recommend specific brands. Vary the intent: general research, comparison, budget-focused, specific need, switching provider. Return a JSON array of 5 strings only — no objects, just plain question strings.`;

      const queriesResp = await generateStructured<unknown>(queryPrompt);

      // Normalize — real API returns string[], mock may return mixed formats
      const rawQueries = Array.isArray(queriesResp.data) ? queriesResp.data : [];
      const queryTexts: string[] = rawQueries.map((q) =>
        typeof q === "string" ? q : (q as { text?: string }).text ?? String(q)
      );

      if (queryTexts.length === 0) throw new Error("No queries were generated");

      // Initialize placeholders
      const initial: AuditResult[] = queryTexts.map((text, i) => ({
        queryId: `q${i + 1}`,
        queryText: text,
        status: "pending" as const,
        response: "",
        brandMentioned: false,
        brandPosition: null,
        competitors: [],
        sentiment: null,
      }));
      setResults(initial);

      const finalResults: AuditResult[] = [...initial];

      // Step 2 & 3: Run each query progressively
      for (let i = 0; i < queryTexts.length; i++) {
        const queryId = `q${i + 1}`;
        const queryText = queryTexts[i];

        setProgress({ index: i + 1, total: queryTexts.length, text: queryText });
        updateResult(queryId, { status: "running" });

        try {
          // Simulate the AI assistant answering the query
          const chatResp = await sendChatMessage(
            [{ role: "user", content: queryText }],
            SYSTEM_PROMPT
          );

          // Analyze the response for brand mentions
          const analysisPrompt =
            `Analyze this AI assistant response about ${industry} and extract brand mention data.\n\n` +
            `Target brand: "${brand}"\n` +
            `Query asked: "${queryText}"\n` +
            `AI Response: "${chatResp.content}"\n\n` +
            `Return JSON only:\n` +
            `{\n` +
            `  "brandMentioned": boolean,\n` +
            `  "position": number or null (1 = first brand mentioned, 2 = second, etc.),\n` +
            `  "competitors": [{"brand": "Name", "position": 1, "sentiment": "positive"|"neutral"|"negative", "excerpt": "short quote from response"}],\n` +
            `  "sentiment": "positive"|"neutral"|"negative"|null\n` +
            `}`;

          const analysisResp = await generateStructured<AnalysisData>(analysisPrompt);
          const a = analysisResp.data;

          const done: Partial<AuditResult> = {
            status: "done",
            response: chatResp.content,
            brandMentioned: a.brandMentioned ?? false,
            brandPosition: a.position ?? null,
            competitors: a.competitors ?? [],
            sentiment: a.sentiment ?? null,
          };
          updateResult(queryId, done);
          finalResults[i] = { ...finalResults[i], ...done };
        } catch (e) {
          const errMsg = e instanceof Error ? e.message : "Unknown error";
          updateResult(queryId, { status: "error", error: errMsg });
          finalResults[i] = { ...finalResults[i], status: "error", error: errMsg };
        }
      }

      // Save to session history
      const finalSummary = computeSummary(finalResults);
      const record: AuditRecord = {
        id: `audit_${Date.now()}`,
        customerName,
        industry,
        brandName: brand,
        platform: "claude",
        runAt: new Date(),
        queryCount: queryTexts.length,
        summary: finalSummary,
        results: finalResults,
      };
      setHistory((prev) => [record, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to run audit");
    } finally {
      setIsRunning(false);
      setProgress(null);
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
              Synthetic buyer audits — see how AI assistants recommend your partners&apos; brands
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
            </div>
          )}

          {/* Progress indicator */}
          {isRunning && progress && (
            <div className="mb-4 rounded-xl border border-[#6C5CE7]/20 bg-[#6C5CE7]/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#6C5CE7]" />
                <p className="text-sm font-medium text-[#6C5CE7]">
                  Running query {progress.index} of {progress.total}
                </p>
              </div>
              <p className="mt-1 max-w-md truncate text-xs text-muted-foreground">
                {progress.text}
              </p>
              {/* Progress bar */}
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#6C5CE7]/15">
                <div
                  className="h-full rounded-full bg-[#6C5CE7] transition-all duration-500"
                  style={{ width: `${(progress.index / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {results.length > 0 ? (
            <AuditResults brandName={brandName} results={results} summary={summary} />
          ) : (
            !isRunning && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-20">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6C5CE7]/10">
                  <Radar className="h-7 w-7 text-[#6C5CE7]" />
                </div>
                <h3 className="text-base font-semibold">No audit running</h3>
                <p className="mt-1.5 max-w-xs text-center text-sm text-muted-foreground">
                  Configure a brand audit on the left and click{" "}
                  <span className="font-medium text-foreground">Run Synthetic Audit</span> to see
                  how AI assistants recommend a brand.
                </p>
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-gray-50 px-4 py-2.5 text-xs text-muted-foreground">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Works in both{" "}
                  <span className="font-medium text-foreground">mock</span> and{" "}
                  <span className="font-medium text-foreground">live API</span> mode
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

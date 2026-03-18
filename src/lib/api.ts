import type {
  AuditQuery,
  AuditResult,
  AuditSummary,
  ChatMessage,
  ChatResponse,
  StructuredResponse,
} from "@/types";
import { mockChatResponse, mockStructuredResponse } from "./mock-responses";

// ─── Mode detection ───────────────────────────────────────────────────────────

export function getApiMode(): "real" | "mock" {
  if (process.env.NEXT_PUBLIC_API_MODE === "real") return "real";
  return "mock";
}

// ─── Unified chat client ──────────────────────────────────────────────────────

export async function sendChatMessage(
  messages: ChatMessage[],
  system?: string
): Promise<ChatResponse> {
  if (getApiMode() === "mock") {
    return mockChatResponse(messages, system);
  }

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, system }),
    });

    const data = await res.json();

    // Server returned mock:true (missing API key) → fall back silently
    if (data.mock === true) {
      return mockChatResponse(messages, system);
    }

    if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
    return data as ChatResponse;
  } catch {
    // Any network/parse failure → fall back to mock
    return mockChatResponse(messages, system);
  }
}

// ─── Unified structured generation client ─────────────────────────────────────

export async function generateStructured<T>(
  prompt: string,
  system?: string
): Promise<StructuredResponse<T>> {
  if (getApiMode() === "mock") {
    return mockStructuredResponse<T>(prompt);
  }

  try {
    const res = await fetch("/api/chat/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, system }),
    });

    const data = await res.json();

    if (data.mock === true) {
      return mockStructuredResponse<T>(prompt);
    }

    if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
    return data as StructuredResponse<T>;
  } catch {
    return mockStructuredResponse<T>(prompt);
  }
}

// ─── Monitor API helpers (existing) ──────────────────────────────────────────

async function callMonitorApi(
  action: "generate_queries" | "run_query" | "analyze_response",
  payload: Record<string, string>
) {
  const res = await fetch("/api/monitor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function generateQueries(
  brandName: string,
  industry: string,
  vertical?: string
): Promise<AuditQuery[]> {
  const data = await callMonitorApi("generate_queries", {
    brandName,
    industry,
    vertical: vertical ?? "",
  });
  return data.queries as AuditQuery[];
}

export async function runSyntheticQuery(queryText: string): Promise<string> {
  const data = await callMonitorApi("run_query", { queryText });
  return data.response as string;
}

export async function analyzeResponse(
  queryText: string,
  aiResponse: string,
  brandName: string
): Promise<
  Pick<AuditResult, "brandMentioned" | "brandPosition" | "competitors" | "sentiment">
> {
  return callMonitorApi("analyze_response", { queryText, aiResponse, brandName });
}

export function computeSummary(results: AuditResult[]): AuditSummary {
  const done = results.filter((r) => r.status === "done");
  if (done.length === 0) {
    return { mentionRate: 0, avgPosition: null, competitorCount: 0, sentimentScore: 50, topCompetitors: [] };
  }

  const mentioned = done.filter((r) => r.brandMentioned);
  const mentionRate = Math.round((mentioned.length / done.length) * 100);

  const positions = mentioned.map((r) => r.brandPosition).filter((p): p is number => p !== null);
  const avgPosition =
    positions.length > 0
      ? Math.round((positions.reduce((a, b) => a + b, 0) / positions.length) * 10) / 10
      : null;

  const competitorMap = new Map<string, number>();
  for (const r of done) {
    for (const c of r.competitors) {
      competitorMap.set(c.brand, (competitorMap.get(c.brand) ?? 0) + 1);
    }
  }
  const topCompetitors = Array.from(competitorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([brand, count]) => ({ brand, count }));

  const sentimentValues = mentioned
    .map((r) => r.sentiment)
    .map((s): number | null =>
      s === "positive" ? 100 : s === "neutral" ? 50 : s === "negative" ? 0 : null
    )
    .filter((v): v is number => v !== null);
  const sentimentScore =
    sentimentValues.length > 0
      ? Math.round(sentimentValues.reduce((a, b) => a + b, 0) / sentimentValues.length)
      : 50;

  return {
    mentionRate,
    avgPosition,
    competitorCount: competitorMap.size,
    sentimentScore,
    topCompetitors,
  };
}

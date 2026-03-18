// ─── AI / Chat types ──────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  content: string;
  model: string;
  mock: boolean;
  usage?: { input_tokens: number; output_tokens: number };
}

export interface StructuredResponse<T = unknown> {
  data: T;
  raw: string;
  mock: boolean;
}

export interface BrandAuditQuery {
  question: string;
  response: string;
  brandMentioned: boolean;
  position: number | null;
  competitors: string[];
  sentiment: "positive" | "neutral" | "negative" | null;
}

export interface BrandAuditResult {
  brand: string;
  industry: string;
  queries: BrandAuditQuery[];
  mentionRate: number;
  avgPosition: number | null;
  competitorLandscape: Record<string, number>;
  timestamp: string;
}

export interface ConversationStage {
  stage: "discovery" | "recommendation" | "quote" | "conversion" | "objection_handling";
  productsMentioned: string[];
  quoteProvided: boolean;
}

// ─── Audit types (existing) ───────────────────────────────────────────────────

export type AuditQuery = {
  id: string;
  text: string;
  intent: "recommendation" | "comparison" | "discovery" | "price";
};

export type BrandMention = {
  brand: string;
  position: number | null; // 1 = first mention, null = not mentioned
  sentiment: "positive" | "neutral" | "negative";
  excerpt: string;
};

export type AuditResult = {
  queryId: string;
  queryText: string;
  status: "pending" | "running" | "done" | "error";
  response: string;
  brandMentioned: boolean;
  brandPosition: number | null;
  competitors: BrandMention[];
  sentiment: "positive" | "neutral" | "negative" | null;
  error?: string;
};

export type AuditSummary = {
  mentionRate: number; // 0–100
  avgPosition: number | null;
  competitorCount: number;
  sentimentScore: number; // 0–100 (0=very negative, 100=very positive)
  topCompetitors: { brand: string; count: number }[];
};

export type AuditRecord = {
  id: string;
  customerName: string;
  industry: string;
  brandName: string;
  platform: "claude" | "chatgpt" | "gemini";
  runAt: Date;
  queryCount: number;
  summary: AuditSummary;
  results: AuditResult[];
};

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

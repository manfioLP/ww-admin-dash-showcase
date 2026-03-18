import { MessageSquare, TrendingUp, Package, FileText, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversationAnalysis, ChatMessage } from "@/hooks/useChat";

const STAGE_CONFIG = {
  discovery: { label: "Discovery", color: "#3b82f6", step: 1 },
  recommendation: { label: "Recommendation", color: "#8b5cf6", step: 2 },
  quote: { label: "Quote", color: "#f59e0b", step: 3 },
  conversion: { label: "Conversion", color: "#10b981", step: 4 },
  objection_handling: { label: "Objection", color: "#ef4444", step: 2 },
};

type Props = {
  messages: ChatMessage[];
  analysis: ConversationAnalysis | null;
};

function StatRow({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color ?? "#6C5CE7"}18` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: color ?? "#6C5CE7" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm font-semibold">{value}</div>
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export function ConversationAnalytics({ messages, analysis }: Props) {
  const userMessages = messages.filter((m) => m.role === "user").length;
  const assistantMessages = messages.filter((m) => m.role === "assistant" && !m.isError).length;
  const totalExchanges = Math.min(userMessages, assistantMessages);

  const stage = analysis?.stage ?? (messages.length > 0 ? "discovery" : null);
  const stageConf = stage ? STAGE_CONFIG[stage] : null;
  const products = analysis?.products_mentioned ?? [];
  const quoteProvided = analysis?.quote_provided ?? false;
  const conversionPct = analysis
    ? Math.round(analysis.conversion_probability * 100)
    : totalExchanges > 0
    ? Math.min(5 + totalExchanges * 3, 35)
    : 0;

  // Stage steps for the progress indicator
  const STAGES = ["discovery", "recommendation", "quote", "conversion"] as const;
  const currentStep = stageConf?.step ?? 0;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border px-4 py-3.5">
        <h3 className="text-sm font-semibold">Conversation Analytics</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Live metrics · updates after each response</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {/* Stage funnel */}
        <div className="py-4 border-b border-border/50">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Stage
          </p>
          <div className="flex items-center gap-1">
            {STAGES.map((s, idx) => {
              const conf = STAGE_CONFIG[s];
              const isActive = stage === s;
              const isPast = currentStep > idx + 1;
              return (
                <div key={s} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={cn(
                      "h-1.5 w-full rounded-full transition-all duration-500",
                      isActive
                        ? "opacity-100"
                        : isPast
                        ? "opacity-60"
                        : "bg-gray-200"
                    )}
                    style={isActive || isPast ? { backgroundColor: conf.color } : {}}
                  />
                  <span
                    className={cn(
                      "text-[9px] font-medium transition-colors",
                      isActive ? "font-semibold" : "text-muted-foreground"
                    )}
                    style={isActive ? { color: conf.color } : {}}
                  >
                    {conf.label}
                  </span>
                </div>
              );
            })}
          </div>
          {stage === "objection_handling" && (
            <p className="mt-1.5 text-[10px] text-amber-600 font-medium">⚠ Handling objection</p>
          )}
        </div>

        {/* Stats */}
        <div className="divide-y divide-border/50">
          <StatRow
            icon={MessageSquare}
            label="Messages Exchanged"
            value={`${totalExchanges} exchange${totalExchanges !== 1 ? "s" : ""}`}
            sub={`${messages.length} total messages`}
            color="#6C5CE7"
          />
          <StatRow
            icon={Package}
            label="Products Mentioned"
            value={
              products.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {products.map((p) => (
                    <span
                      key={p}
                      className="inline-block rounded-full bg-[#6C5CE7]/10 px-2 py-0.5 text-[10px] font-medium text-[#6C5CE7]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground font-normal">None yet</span>
              )
            }
            color="#8b5cf6"
          />
          <StatRow
            icon={FileText}
            label="Quote Provided"
            value={
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  quoteProvided
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    quoteProvided ? "bg-emerald-500" : "bg-gray-400"
                  )}
                />
                {quoteProvided ? "Yes" : "No"}
              </span>
            }
            color="#f59e0b"
          />
          <StatRow
            icon={Gauge}
            label="Conversion Probability"
            value={
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-base font-bold",
                      conversionPct >= 70
                        ? "text-emerald-600"
                        : conversionPct >= 40
                        ? "text-amber-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {conversionPct}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${conversionPct}%`,
                      backgroundColor:
                        conversionPct >= 70 ? "#10b981" : conversionPct >= 40 ? "#f59e0b" : "#d1d5db",
                    }}
                  />
                </div>
              </div>
            }
            color="#10b981"
          />
        </div>

        {/* Trend tip */}
        {analysis && (
          <div className="mt-3 rounded-xl border border-border bg-gray-50 p-3">
            <div className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6C5CE7]" />
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {stageConf?.step === 4
                  ? "🎉 Conversion reached — user is ready to buy."
                  : stageConf?.step === 3
                  ? "Quote was delivered. Nudge toward purchase."
                  : stageConf?.step === 2
                  ? "Products recommended. Move toward quoting."
                  : "Gathering needs. Ask qualifying questions."}
              </p>
            </div>
          </div>
        )}

        {messages.length === 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Start a conversation to see live analytics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { RefreshCw, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { customers, visibilityScores } from "@/data/mock";
import { cn } from "@/lib/utils";

type FilterProps = {
  customerId: string;
  platform: string;
};

const PLATFORMS = [
  { key: "chatgpt" as const, label: "ChatGPT", color: "#10a37f" },
  { key: "claude" as const, label: "Claude", color: "#d97706" },
  { key: "gemini" as const, label: "Gemini", color: "#4285f4" },
];

function scoreStyle(score: number | null): { bg: string; text: string; label: string } {
  if (score === null) return { bg: "#f9fafb", text: "#d1d5db", label: "—" };
  if (score >= 70) return { bg: "#d1fae5", text: "#065f46", label: score.toString() };
  if (score >= 30) return { bg: "#fef3c7", text: "#92400e", label: score.toString() };
  return { bg: "#fee2e2", text: "#991b1b", label: score.toString() };
}

function ScoreCell({ score }: { score: number | null }) {
  const [hovered, setHovered] = useState(false);
  const style = scoreStyle(score);

  const tooltip =
    score === null
      ? "Not deployed on this platform"
      : score >= 70
      ? `Strong visibility (${score}/100) — AI assistants frequently recommend this brand`
      : score >= 30
      ? `Moderate visibility (${score}/100) — AI assistants occasionally recommend this brand`
      : `Low visibility (${score}/100) — AI assistants rarely recommend this brand`;

  return (
    <td className="px-3 py-2.5 text-center">
      <div className="relative inline-flex items-center justify-center">
        <span
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "flex h-9 w-14 cursor-default items-center justify-center rounded-lg text-xs font-semibold transition-all",
            score !== null && "hover:scale-105 hover:shadow-sm"
          )}
          style={{ backgroundColor: style.bg, color: style.text }}
        >
          {style.label}
        </span>
        {hovered && score !== null && (
          <div className="absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 rounded-lg border border-border bg-white p-2.5 text-left shadow-lg">
            <p className="text-xs text-foreground leading-snug">{tooltip}</p>
            <div
              className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-border bg-white"
            />
          </div>
        )}
      </div>
    </td>
  );
}

export function BrandVisibility({ customerId, platform }: FilterProps) {
  const [auditing, setAuditing] = useState(false);
  const [lastAudit, setLastAudit] = useState("2 hours ago");

  function runAudit() {
    setAuditing(true);
    setTimeout(() => {
      setAuditing(false);
      setLastAudit("just now");
    }, 2200);
  }

  const { rows, visiblePlatforms } = useMemo(() => {
    const scoreMap = Object.fromEntries(visibilityScores.map((s) => [s.customerId, s]));

    const filtered =
      customerId !== "all"
        ? customers.filter((c) => c.id === customerId)
        : customers.filter((c) => c.status !== "onboarding").slice(0, 8);

    const visiblePlatforms = PLATFORMS.filter(
      (p) => platform === "all" || platform === p.key
    );

    const rows = filtered.map((c) => ({
      customer: c,
      scores: scoreMap[c.id] ?? { customerId: c.id, chatgpt: null, claude: null, gemini: null },
    }));

    return { rows, visiblePlatforms };
  }, [customerId, platform]);

  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">AI Brand Visibility</h3>
              <span className="rounded-full bg-[#6C5CE7]/10 px-2 py-0.5 text-[10px] font-semibold text-[#6C5CE7]">
                Synthetic Buyer Audit
              </span>
            </div>
            <p className="mt-1 max-w-lg text-xs text-muted-foreground">
              WaniWani deploys AI personas across platforms to test how often each brand gets
              recommended. Scores reflect organic recommendation frequency (0–100).
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              Last audit: <span className="font-medium text-foreground">{lastAudit}</span>
            </div>
            <button
              onClick={runAudit}
              disabled={auditing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#6C5CE7] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#5a4bd1] disabled:opacity-60 transition-colors"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", auditing && "animate-spin")} />
              {auditing ? "Running…" : "Run Audit"}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-[#d1fae5]" />
              High (≥70)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-[#fef3c7]" />
              Medium (30–69)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-[#fee2e2]" />
              Low (&lt;30)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-gray-100" />
              Not deployed
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-gray-50/60">
                  <th className="px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Customer
                  </th>
                  {visiblePlatforms.map((p) => (
                    <th
                      key={p.key}
                      className="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wide"
                      style={{ color: p.color }}
                    >
                      {p.label}
                    </th>
                  ))}
                  <th className="px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Avg Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ customer: c, scores }, i) => {
                  const vals = visiblePlatforms
                    .map((p) => scores[p.key])
                    .filter((v): v is number => v !== null);
                  const avg = vals.length > 0
                    ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
                    : null;
                  const avgStyle = scoreStyle(avg);

                  return (
                    <tr
                      key={c.id}
                      className={cn(
                        "transition-colors hover:bg-gray-50/40",
                        i < rows.length - 1 && "border-b border-border/50"
                      )}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{c.logo}</span>
                          <div>
                            <p className="text-sm font-medium">{c.name}</p>
                            <p className="text-xs capitalize text-muted-foreground">{c.vertical}</p>
                          </div>
                        </div>
                      </td>
                      {visiblePlatforms.map((p) => (
                        <ScoreCell key={p.key} score={scores[p.key]} />
                      ))}
                      <td className="px-5 py-3">
                        {avg !== null ? (
                          <span
                            className="inline-flex h-7 w-12 items-center justify-center rounded-lg text-xs font-bold"
                            style={{ backgroundColor: avgStyle.bg, color: avgStyle.text }}
                          >
                            {avg}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

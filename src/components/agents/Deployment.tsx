"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { type Agent } from "@/data/mock";

const PLATFORM_CONFIG = {
  chatgpt: { label: "ChatGPT", color: "#10a37f", bg: "#10a37f12" },
  claude: { label: "Claude", color: "#d97706", bg: "#d9770612" },
  gemini: { label: "Gemini", color: "#4285f4", bg: "#4285f412" },
};

const STATUS_DISPLAY = {
  live: { label: "Live", dot: "#10b981", text: "#059669", bg: "#10b98112" },
  testing: { label: "Testing", dot: "#f59e0b", text: "#d97706", bg: "#f59e0b12" },
  pending_approval: { label: "Pending Approval", dot: "#9ca3af", text: "#6b7280", bg: "#9ca3af12" },
};

export function Deployment({ agent }: { agent: Agent }) {
  const [status, setStatus] = useState(agent.status);

  const platform = PLATFORM_CONFIG[agent.platform];
  const s = STATUS_DISPLAY[status];
  const isLive = status === "live";
  const isPending = status === "pending_approval";

  const lastDeployed = new Date(agent.createdAt);
  lastDeployed.setDate(lastDeployed.getDate() + 3);

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Deployment</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Platform configuration and live status
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.dot }} />
              <div>
                <p className="text-sm font-medium">Target Platform</p>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-0.5"
                  style={{ color: platform.color, backgroundColor: platform.bg }}
                >
                  {platform.label}
                </span>
              </div>
            </div>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ color: s.text, backgroundColor: s.bg }}
            >
              {s.label}
            </span>
          </div>

          <div className="rounded-lg bg-gray-50 px-4 py-2.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Last deployed:</span>{" "}
            {lastDeployed.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at{" "}
            {lastDeployed.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          {!isPending && (
            <button
              onClick={() => setStatus((s) => (s === "live" ? "testing" : "live"))}
              className={`w-full rounded-lg py-2.5 text-sm font-medium transition-colors ${
                isLive
                  ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-[#6C5CE7] text-white hover:bg-[#5a4bd1]"
              }`}
            >
              {isLive ? "Pause Agent" : "Deploy Agent"}
            </button>
          )}

          {isPending && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              This agent is awaiting platform approval. Deployment will be available once approved.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Agent } from "@/data/mock";
import { cn } from "@/lib/utils";

function formatNumber(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

const MODEL_LABELS: Record<string, string> = {
  "gpt-4o": "GPT-4o",
  "claude-sonnet": "Claude Sonnet",
  "gemini-pro": "Gemini Pro",
};

const PLATFORM_CONFIG = {
  chatgpt: { label: "ChatGPT", color: "#10a37f", bg: "#10a37f12" },
  claude: { label: "Claude", color: "#d97706", bg: "#d9770612" },
  gemini: { label: "Gemini", color: "#4285f4", bg: "#4285f412" },
};

const STATUS_CONFIG = {
  live: { label: "Live", dot: "#10b981", bg: "#10b98112", text: "#059669" },
  testing: { label: "Testing", dot: "#f59e0b", bg: "#f59e0b12", text: "#d97706" },
  pending_approval: { label: "Pending", dot: "#9ca3af", bg: "#9ca3af12", text: "#6b7280" },
};

export function CustomerAgents({ agents }: { agents: Agent[] }) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-sm font-semibold">Deployed Agents</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{agents.length} agent{agents.length !== 1 ? "s" : ""} configured</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#6C5CE7] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#5a4bd1] transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Deploy New Agent
          </button>
        </div>

        {agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm font-medium text-muted-foreground">No agents deployed yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Deploy your first agent to get started</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-gray-50/60">
                {["Agent", "Model", "Platform", "Status", "Conversations", "Quotes", "Conversions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, i) => {
                const platform = PLATFORM_CONFIG[agent.platform];
                const status = STATUS_CONFIG[agent.status];
                return (
                  <tr
                    key={agent.id}
                    className={cn(
                      "hover:bg-gray-50/60 transition-colors",
                      i < agents.length - 1 && "border-b border-border/50"
                    )}
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Since {new Date(agent.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">{MODEL_LABELS[agent.model] ?? agent.model}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ color: platform.color, backgroundColor: platform.bg }}
                      >
                        {platform.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ color: status.text, backgroundColor: status.bg }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium">{formatNumber(agent.conversations)}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{formatNumber(agent.quotes)}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{formatNumber(agent.conversions)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

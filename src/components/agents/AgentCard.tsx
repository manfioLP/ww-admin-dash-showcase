import Link from "next/link";
import { MessageSquare, FileText, TrendingUp } from "lucide-react";
import { type Agent, type Customer } from "@/data/mock";
import { cn } from "@/lib/utils";

const MODEL_CONFIG = {
  "gpt-4o": { label: "GPT-4o", color: "#10a37f", bg: "#10a37f12" },
  "claude-sonnet": { label: "Claude Sonnet", color: "#d97706", bg: "#d9770612" },
  "gemini-pro": { label: "Gemini Pro", color: "#4285f4", bg: "#4285f412" },
};

const PLATFORM_CONFIG = {
  chatgpt: { label: "ChatGPT", color: "#10a37f", bg: "#10a37f12" },
  claude: { label: "Claude", color: "#d97706", bg: "#d9770612" },
  gemini: { label: "Gemini", color: "#4285f4", bg: "#4285f412" },
};

const STATUS_CONFIG = {
  live: { label: "Live", dot: "#10b981", textColor: "#059669", bg: "#10b98112" },
  testing: { label: "Testing", dot: "#f59e0b", textColor: "#d97706", bg: "#f59e0b12" },
  pending_approval: { label: "Pending", dot: "#9ca3af", textColor: "#6b7280", bg: "#9ca3af12" },
};

function formatNumber(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function StatCell({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function AgentCard({ agent, customer }: { agent: Agent; customer: Customer }) {
  const model = MODEL_CONFIG[agent.model];
  const platform = PLATFORM_CONFIG[agent.platform];
  const status = STATUS_CONFIG[agent.status];
  const convRate =
    agent.conversations > 0
      ? ((agent.conversions / agent.conversations) * 100).toFixed(1)
      : "0.0";

  return (
    <Link
      href={`/agents/${agent.id}`}
      className="group flex flex-col rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#6C5CE7]/20 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-2.5 min-w-0">
          <span
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: status.dot }}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-[#6C5CE7]">
              {agent.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {customer.logo} {customer.name}
            </p>
          </div>
        </div>
        <span
          className="ml-2 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{ color: status.textColor, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ color: model.color, backgroundColor: model.bg }}
        >
          {model.label}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            agent.platform === agent.model.split("-")[0] ? "opacity-0" : ""
          )}
          style={{ color: platform.color, backgroundColor: platform.bg }}
        >
          {platform.label}
        </span>
      </div>

      <div className="mt-auto grid grid-cols-3 divide-x divide-border/50 border-t border-border/50 pt-4">
        <StatCell icon={MessageSquare} label="Convos" value={formatNumber(agent.conversations)} />
        <StatCell icon={FileText} label="Quotes" value={formatNumber(agent.quotes)} />
        <StatCell icon={TrendingUp} label="Conv. Rate" value={`${convRate}%`} />
      </div>
    </Link>
  );
}

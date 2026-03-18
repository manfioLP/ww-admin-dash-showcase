"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { type Agent, type Customer } from "@/data/mock";
import { ModelConfig } from "./ModelConfig";
import { ProductCatalog } from "./ProductCatalog";
import { Deployment } from "./Deployment";
import { AgentPerformance } from "./AgentPerformance";

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
  live: { label: "Live", dot: "#10b981", text: "#059669", bg: "#10b98112" },
  testing: { label: "Testing", dot: "#f59e0b", text: "#d97706", bg: "#f59e0b12" },
  pending_approval: { label: "Pending", dot: "#9ca3af", text: "#6b7280", bg: "#9ca3af12" },
};

export function AgentDetail({
  agent,
  customer,
}: {
  agent: Agent;
  customer: Customer;
}) {
  const model = MODEL_CONFIG[agent.model];
  const platform = PLATFORM_CONFIG[agent.platform];
  const status = STATUS_CONFIG[agent.status];

  return (
    <div className="p-8">
      <Link
        href="/agents"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Agents
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-white shadow-sm text-xl">
          {customer.logo}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight">{agent.name}</h1>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ color: status.text, backgroundColor: status.bg }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
              {status.label}
            </span>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ color: model.color, backgroundColor: model.bg }}
            >
              {model.label}
            </span>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ color: platform.color, backgroundColor: platform.bg }}
            >
              {platform.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {customer.logo} {customer.name} · {agent.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-6">
          <ModelConfig agent={agent} vertical={customer.vertical} />
          <ProductCatalog vertical={customer.vertical} />
          <Deployment agent={agent} />
        </div>
        <div className="col-span-2">
          <AgentPerformance agent={agent} customer={customer} />
        </div>
      </div>
    </div>
  );
}

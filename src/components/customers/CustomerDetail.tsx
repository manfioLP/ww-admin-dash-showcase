"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { type Customer, type Agent } from "@/data/mock";
import { cn } from "@/lib/utils";
import { CustomerOverview } from "./CustomerOverview";
import { CustomerAgents } from "./CustomerAgents";
import { CustomerAnalytics } from "./CustomerAnalytics";

type Tab = "overview" | "agents" | "analytics";

const STATUS_CONFIG = {
  active: { label: "Active", dot: "#10b981", bg: "#10b98112", text: "#059669" },
  pilot: { label: "Pilot", dot: "#8b5cf6", bg: "#8b5cf612", text: "#7c3aed" },
  onboarding: { label: "Onboarding", dot: "#3b82f6", bg: "#3b82f612", text: "#2563eb" },
  churned: { label: "Churned", dot: "#ef4444", bg: "#ef444412", text: "#dc2626" },
};

export function CustomerDetail({
  customer,
  agents,
}: {
  customer: Customer;
  agents: Agent[];
}) {
  const [tab, setTab] = useState<Tab>("overview");

  const status = STATUS_CONFIG[customer.contractStatus];

  return (
    <div className="p-8">
      <Link
        href="/partners"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Partners
      </Link>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-white shadow-sm text-2xl">
          {customer.logo}
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ color: status.text, backgroundColor: status.bg }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
              {status.label}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-600">
              {customer.vertical}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {customer.id} · Account owner: {customer.accountOwner} · Partner since {new Date(customer.partnerSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-1 border-b border-border">
        {(["overview", "agents", "analytics"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
              tab === t
                ? "border-[#6C5CE7] text-[#6C5CE7]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && <CustomerOverview customer={customer} agents={agents} />}
      {tab === "agents" && <CustomerAgents agents={agents} />}
      {tab === "analytics" && <CustomerAnalytics customer={customer} agents={agents} />}
    </div>
  );
}

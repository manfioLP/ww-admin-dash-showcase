"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronUp, ChevronDown, Search } from "lucide-react";
import { type Customer } from "@/data/mock";
import { cn } from "@/lib/utils";

function PlatformBadge({ platform }: { platform: "chatgpt" | "claude" | "gemini" }) {
  const config = {
    chatgpt: { label: "ChatGPT", color: "#10a37f", bg: "#10a37f18" },
    claude: { label: "Claude", color: "#d97706", bg: "#d9770618" },
    gemini: { label: "Gemini", color: "#4285f4", bg: "#4285f418" },
  }[platform];

  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  );
}

function StatusBadge({ status }: { status: Customer["status"] }) {
  const config = {
    active: { label: "Active", dot: "#10b981", bg: "#10b98118", text: "#059669" },
    onboarding: { label: "Onboarding", dot: "#3b82f6", bg: "#3b82f618", text: "#2563eb" },
    churned: { label: "Churned", dot: "#ef4444", bg: "#ef444418", text: "#dc2626" },
  }[status];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ color: config.text, backgroundColor: config.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.dot }} />
      {config.label}
    </span>
  );
}

function PlanBadge({ plan }: { plan: Customer["plan"] }) {
  const styles = {
    starter: "bg-gray-100 text-gray-600",
    growth: "bg-blue-50 text-blue-700",
    enterprise: "bg-purple-50 text-[#6C5CE7]",
  }[plan];

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", styles)}>
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

function VerticalBadge({ vertical }: { vertical: Customer["vertical"] }) {
  const styles = {
    insurance: "bg-amber-50 text-amber-700",
    fintech: "bg-indigo-50 text-indigo-700",
    travel: "bg-teal-50 text-teal-700",
    health: "bg-rose-50 text-rose-700",
  }[vertical];

  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize mt-0.5", styles)}>
      {vertical}
    </span>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

type SortKey = "totalConversations" | "conversionRate";

export function CustomerTable({ customers }: { customers: Customer[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verticalFilter, setVerticalFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("totalConversations");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const rows = useMemo(() => {
    let out = customers;
    if (search) out = out.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") out = out.filter((c) => c.status === statusFilter);
    if (verticalFilter !== "all") out = out.filter((c) => c.vertical === verticalFilter);
    if (planFilter !== "all") out = out.filter((c) => c.plan === planFilter);
    return [...out].sort((a, b) =>
      sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]
    );
  }, [customers, search, statusFilter, verticalFilter, planFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "desc"
      ? <ChevronDown className="h-3 w-3 text-[#6C5CE7]" />
      : <ChevronUp className="h-3 w-3 text-[#6C5CE7]" />;
  }

  const selectCls = "rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10 cursor-pointer";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10"
          />
        </div>
        <select value={verticalFilter} onChange={(e) => setVerticalFilter(e.target.value)} className={selectCls}>
          <option value="all">All Verticals</option>
          <option value="insurance">Insurance</option>
          <option value="fintech">Fintech</option>
          <option value="travel">Travel</option>
          <option value="health">Health</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="onboarding">Onboarding</option>
          <option value="churned">Churned</option>
        </select>
        <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className={selectCls}>
          <option value="all">All Plans</option>
          <option value="starter">Starter</option>
          <option value="growth">Growth</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-gray-50/60">
              {["Company", "Status", "Plan", "Platforms"].map((h) => (
                <th key={h} className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{h}</th>
              ))}
              {(["totalConversations", "conversionRate"] as SortKey[]).map((col) => (
                <th key={col} className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <button
                    onClick={() => toggleSort(col)}
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    {col === "totalConversations" ? "Conversations" : "Conv. Rate"}
                    <SortIcon col={col} />
                  </button>
                </th>
              ))}
              <th className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                  No customers match your filters
                </td>
              </tr>
            ) : (
              rows.map((c, i) => (
                <tr
                  key={c.id}
                  className={cn(
                    "group cursor-pointer transition-colors hover:bg-[#6C5CE7]/[0.03]",
                    i < rows.length - 1 && "border-b border-border/50"
                  )}
                >
                  <td className="px-5 py-3.5">
                    <Link href={`/customers/${c.id}`} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-gray-50 text-lg">
                        {c.logo}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground group-hover:text-[#6C5CE7] transition-colors">
                          {c.name}
                        </span>
                        <VerticalBadge vertical={c.vertical} />
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/customers/${c.id}`}><StatusBadge status={c.status} /></Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/customers/${c.id}`}><PlanBadge plan={c.plan} /></Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/customers/${c.id}`} className="flex flex-wrap gap-1">
                      {c.platforms.map((p) => <PlatformBadge key={p} platform={p} />)}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/customers/${c.id}`} className="text-sm font-medium">
                      {formatNumber(c.totalConversations)}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/customers/${c.id}`} className="text-sm font-medium">
                      {c.conversionRate.toFixed(2)}%
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/customers/${c.id}`} className="text-sm text-muted-foreground">
                      {new Date(c.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        {rows.length} of {customers.length} customers
      </p>
    </div>
  );
}

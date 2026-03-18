"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { agents, customers } from "@/data/mock";
import { AgentCard } from "@/components/agents/AgentCard";
import { CreateAgentModal } from "@/components/agents/CreateAgentModal";

const selectCls =
  "rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10 cursor-pointer";

const customerMap = Object.fromEntries(customers.map((c) => [c.id, c]));

export default function AgentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [customerFilter, setCustomerFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    let out = agents;
    if (customerFilter !== "all") out = out.filter((a) => a.customerId === customerFilter);
    if (platformFilter !== "all") out = out.filter((a) => a.platform === platformFilter);
    if (modelFilter !== "all") out = out.filter((a) => a.model === modelFilter);
    if (statusFilter !== "all") out = out.filter((a) => a.status === statusFilter);
    return out;
  }, [customerFilter, platformFilter, modelFilter, statusFilter]);

  const liveCount = agents.filter((a) => a.status === "live").length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI agents managed by WaniWani across all partner platforms · {liveCount} live
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#6C5CE7] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#5a4bd1] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Configure New Agent
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value)}
          className={selectCls}
        >
          <option value="all">All Customers</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.logo} {c.name}
            </option>
          ))}
        </select>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className={selectCls}
        >
          <option value="all">All Platforms</option>
          <option value="chatgpt">ChatGPT</option>
          <option value="claude">Claude</option>
          <option value="gemini">Gemini</option>
        </select>
        <select
          value={modelFilter}
          onChange={(e) => setModelFilter(e.target.value)}
          className={selectCls}
        >
          <option value="all">All Models</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="claude-sonnet">Claude Sonnet</option>
          <option value="gemini-pro">Gemini Pro</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectCls}
        >
          <option value="all">All Statuses</option>
          <option value="live">Live</option>
          <option value="testing">Testing</option>
          <option value="pending_approval">Pending</option>
        </select>
        {filtered.length !== agents.length && (
          <span className="text-xs text-muted-foreground">
            {filtered.length} of {agents.length} agents
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white py-20">
          <p className="text-sm font-medium text-muted-foreground">No agents match your filters</p>
          <button
            onClick={() => {
              setCustomerFilter("all");
              setPlatformFilter("all");
              setModelFilter("all");
              setStatusFilter("all");
            }}
            className="mt-2 text-xs text-[#6C5CE7] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agent) => {
            const customer = customerMap[agent.customerId];
            if (!customer) return null;
            return <AgentCard key={agent.id} agent={agent} customer={customer} />;
          })}
        </div>
      )}

      <CreateAgentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

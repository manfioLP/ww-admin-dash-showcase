import { ExternalLink, TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const INVOICES = [
  { id: "inv_008", date: "Mar 1, 2026", description: "Enterprise Plan — March 2026", amount: "$2,499.00", status: "paid" },
  { id: "inv_007", date: "Feb 1, 2026", description: "Enterprise Plan — February 2026", amount: "$2,499.00", status: "paid" },
  { id: "inv_006", date: "Jan 1, 2026", description: "Enterprise Plan — January 2026", amount: "$2,499.00", status: "paid" },
  { id: "inv_005", date: "Dec 1, 2025", description: "Enterprise Plan — December 2025", amount: "$2,499.00", status: "paid" },
  { id: "inv_004", date: "Nov 1, 2025", description: "Growth Plan — November 2025", amount: "$899.00", status: "paid" },
  { id: "inv_003", date: "Oct 1, 2025", description: "Growth Plan — October 2025", amount: "$899.00", status: "paid" },
];

const PLANS = [
  { name: "Starter", price: "$149/mo", conversations: "Up to 10K / mo", agents: "2 agents", highlight: false },
  { name: "Growth", price: "$899/mo", conversations: "Up to 100K / mo", agents: "10 agents", highlight: false },
  { name: "Enterprise", price: "$2,499/mo", conversations: "Up to 500K / mo", agents: "Unlimited", highlight: true },
];

export function BillingTab() {
  const usedConversations = 142_000;
  const totalConversations = 200_000;
  const usagePct = Math.round((usedConversations / totalConversations) * 100);

  return (
    <div className="max-w-3xl space-y-6">
      {/* Current plan */}
      <Card className="border-[#6C5CE7]/30 bg-gradient-to-br from-[#6C5CE7]/5 to-white">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#6C5CE7]" />
                <span className="text-xs font-semibold uppercase tracking-wide text-[#6C5CE7]">Current Plan</span>
              </div>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Enterprise</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">$2,499 / month · Renews Apr 1, 2026</p>
            </div>
            <span className="rounded-full bg-[#6C5CE7] px-3 py-1 text-xs font-semibold text-white">
              Active
            </span>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium">Conversation Usage</span>
              <span className="text-muted-foreground">
                {usedConversations.toLocaleString()} / {totalConversations.toLocaleString()}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  usagePct > 80 ? "bg-amber-500" : "bg-[#6C5CE7]"
                )}
                style={{ width: `${usagePct}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {usagePct}% used this month — {(totalConversations - usedConversations).toLocaleString()} remaining
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plan comparison */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Available Plans</h3>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#6C5CE7] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#5a4bd1] transition-colors">
              <TrendingUp className="h-3.5 w-3.5" />
              Upgrade Plan
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "rounded-xl border p-4 transition-all",
                  plan.highlight
                    ? "border-[#6C5CE7]/40 bg-[#6C5CE7]/5 ring-1 ring-[#6C5CE7]/20"
                    : "border-border bg-gray-50/50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold">{plan.name}</p>
                  {plan.highlight && (
                    <span className="rounded-full bg-[#6C5CE7] px-2 py-0.5 text-[10px] font-bold text-white">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-lg font-semibold text-[#6C5CE7]">{plan.price}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">{plan.conversations}</p>
                  <p className="text-xs text-muted-foreground">{plan.agents}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing history */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="border-b border-border px-6 py-5">
            <h3 className="text-sm font-semibold">Billing History</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-gray-50/60">
                {["Date", "Description", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr
                  key={inv.id}
                  className={cn(
                    "transition-colors hover:bg-gray-50/50",
                    i < INVOICES.length - 1 && "border-b border-border/50"
                  )}
                >
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{inv.date}</td>
                  <td className="px-5 py-3.5 text-sm">{inv.description}</td>
                  <td className="px-5 py-3.5 text-sm font-medium">{inv.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Paid
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="inline-flex items-center gap-1 text-xs text-[#6C5CE7] hover:underline">
                      Invoice
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

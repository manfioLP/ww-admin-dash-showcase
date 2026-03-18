"use client";

import { useState } from "react";
import { Radar, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { customers } from "@/data/mock";

const INDUSTRIES = [
  "Insurance",
  "SaaS / Software",
  "E-commerce",
  "Financial Services",
  "Healthcare",
  "Real Estate",
  "Travel",
  "Education",
];

type Props = {
  onRun: (brandName: string, industry: string, customerName: string) => void;
  isRunning: boolean;
};

const inputCls =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all";

export function QueryBuilder({ onRun, isRunning }: Props) {
  const [mode, setMode] = useState<"customer" | "custom">("customer");
  const [customerId, setCustomerId] = useState(customers[0].id);
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "customer") {
      const c = customers.find((c) => c.id === customerId)!;
      onRun(c.name, c.vertical, c.name);
    } else {
      if (!brandName.trim()) return;
      onRun(brandName.trim(), industry, brandName.trim());
    }
  }

  const selectedCustomer = customers.find((c) => c.id === customerId);

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C5CE7]/10">
            <Radar className="h-5 w-5 text-[#6C5CE7]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Configure Audit</h2>
            <p className="text-xs text-muted-foreground">
              Select a customer or enter a custom brand to audit
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="mb-5 flex gap-1 rounded-xl bg-gray-100 p-1">
          {(["customer", "custom"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-all",
                mode === m
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "customer" ? "Existing Customer" : "Custom Brand"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "customer" ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium">Customer</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className={inputCls}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.vertical}
                  </option>
                ))}
              </select>
              {selectedCustomer && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-muted-foreground">
                    Industry: {selectedCustomer.vertical}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-muted-foreground">
                    Status: {selectedCustomer.contractStatus}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Acme Insurance"
                  className={inputCls}
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className={inputCls}
                >
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={isRunning || (mode === "custom" && !brandName.trim())}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C5CE7] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5a4bd1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running Audit…
                </>
              ) : (
                <>
                  <Radar className="h-4 w-4" />
                  Run Brand Audit
                </>
              )}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

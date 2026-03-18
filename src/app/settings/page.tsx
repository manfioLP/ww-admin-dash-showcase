"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GeneralTab } from "@/components/settings/GeneralTab";
import { ApiKeysTab } from "@/components/settings/ApiKeysTab";
import { TeamTab } from "@/components/settings/TeamTab";
import { BillingTab } from "@/components/settings/BillingTab";

type Tab = "general" | "api-keys" | "team" | "billing";

const TABS: { key: Tab; label: string }[] = [
  { key: "general", label: "General" },
  { key: "api-keys", label: "API Keys" },
  { key: "team", label: "Team" },
  { key: "billing", label: "Billing" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("general");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your organization, team, and billing preferences
        </p>
      </div>

      <div className="mb-8 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors",
              tab === t.key
                ? "border-[#6C5CE7] text-[#6C5CE7]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "general" && <GeneralTab />}
      {tab === "api-keys" && <ApiKeysTab />}
      {tab === "team" && <TeamTab />}
      {tab === "billing" && <BillingTab />}
    </div>
  );
}

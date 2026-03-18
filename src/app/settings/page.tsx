"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GeneralTab } from "@/components/settings/GeneralTab";
import { TeamTab } from "@/components/settings/TeamTab";

type Tab = "general" | "team";

const TABS: { key: Tab; label: string }[] = [
  { key: "general", label: "General" },
  { key: "team", label: "Team" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("general");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage organization preferences and team
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
      {tab === "team" && <TeamTab />}
    </div>
  );
}

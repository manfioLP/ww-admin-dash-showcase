"use client";

import { useState } from "react";
import { Plus, Copy, Trash2, Check, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ApiKey = {
  id: string;
  name: string;
  masked: string;
  full: string;
  created: string;
  lastUsed: string;
  status: "active" | "revoked";
};

const INITIAL_KEYS: ApiKey[] = [
  {
    id: "key_01",
    name: "Production",
    masked: "sk-ww-prod-...x4f9",
    full: "sk-ww-prod-a1b2c3d4e5f6g7h8i9j0x4f9",
    created: "Jun 20, 2025",
    lastUsed: "Today",
    status: "active",
  },
  {
    id: "key_02",
    name: "Staging",
    masked: "sk-ww-stag-...a2b7",
    full: "sk-ww-stag-z9y8x7w6v5u4t3s2r1q0a2b7",
    created: "Sep 15, 2025",
    lastUsed: "3 days ago",
    status: "active",
  },
  {
    id: "key_03",
    name: "Dev / Local",
    masked: "sk-ww-dev-...c8d1",
    full: "sk-ww-dev-p1o2n3m4l5k6j7i8h9g0c8d1",
    created: "Jan 10, 2026",
    lastUsed: "1 hour ago",
    status: "active",
  },
  {
    id: "key_04",
    name: "Legacy Integration",
    masked: "sk-ww-leg-...e5f3",
    full: "sk-ww-leg-f0e1d2c3b4a5z6y7x8w9v0e5f3",
    created: "Jul 1, 2025",
    lastUsed: "45 days ago",
    status: "revoked",
  },
];

export function ApiKeysTab() {
  const [keys, setKeys] = useState(INITIAL_KEYS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  function handleCopy(key: ApiKey) {
    navigator.clipboard.writeText(key.full).catch(() => {});
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  function handleRevoke(id: string) {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "revoked" } : k))
    );
    setRevokingId(null);
  }

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        name: "New Key",
        masked: `sk-ww-new-...${Math.random().toString(36).slice(-4)}`,
        full: `sk-ww-new-${Math.random().toString(36).slice(2, 32)}`,
        created: "Today",
        lastUsed: "Never",
        status: "active",
      };
      setKeys((prev) => [newKey, ...prev]);
      setGenerating(false);
    }, 900);
  }

  return (
    <div className="max-w-3xl">
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h3 className="text-sm font-semibold">API Keys</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Use these keys to authenticate against the WaniWani API.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-lg bg-[#6C5CE7] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#5a4bd1] disabled:opacity-60 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              {generating ? "Generating…" : "Generate New Key"}
            </button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-gray-50/60">
                {["Name", "Key", "Created", "Last Used", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keys.map((key, i) => (
                <tr
                  key={key.id}
                  className={cn(
                    "transition-colors hover:bg-gray-50/50",
                    i < keys.length - 1 && "border-b border-border/50",
                    key.status === "revoked" && "opacity-50"
                  )}
                >
                  <td className="px-5 py-3.5 text-sm font-medium">{key.name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-700">
                        {revealedId === key.id ? key.full : key.masked}
                      </code>
                      <button
                        onClick={() => setRevealedId(revealedId === key.id ? null : key.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        disabled={key.status === "revoked"}
                      >
                        {revealedId === key.id
                          ? <EyeOff className="h-3.5 w-3.5" />
                          : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{key.created}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{key.lastUsed}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        key.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          key.status === "active" ? "bg-emerald-500" : "bg-gray-400"
                        )}
                      />
                      {key.status === "active" ? "Active" : "Revoked"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(key)}
                        disabled={key.status === "revoked"}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-gray-100 hover:text-foreground disabled:opacity-40 transition-colors"
                        title="Copy key"
                      >
                        {copiedId === key.id
                          ? <Check className="h-3.5 w-3.5 text-emerald-600" />
                          : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      {key.status === "active" && (
                        <>
                          {revokingId === key.id ? (
                            <span className="flex items-center gap-1.5 text-xs">
                              <span className="text-muted-foreground">Revoke?</span>
                              <button
                                onClick={() => handleRevoke(key.id)}
                                className="font-medium text-red-600 hover:underline"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setRevokingId(null)}
                                className="text-muted-foreground hover:underline"
                              >
                                No
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setRevokingId(key.id)}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Revoke key"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-xs font-medium text-amber-800">Security reminder</p>
        <p className="mt-0.5 text-xs text-amber-700">
          Never share API keys in public repositories or client-side code. Revoke and rotate keys regularly.
        </p>
      </div>
    </div>
  );
}

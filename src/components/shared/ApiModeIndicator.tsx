"use client";

import { useState, useRef, useEffect } from "react";
import { getApiMode } from "@/lib/api";

export function ApiModeIndicator() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const mode = getApiMode();
  const isReal = mode === "real";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title={isReal ? "Using live Anthropic API" : "Using simulated responses"}
        className="group flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
        style={
          isReal
            ? { borderColor: "#10b98133", backgroundColor: "#10b98108", color: "#059669" }
            : { borderColor: "#f59e0b33", backgroundColor: "#f59e0b08", color: "#b45309" }
        }
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: isReal ? "#10b981" : "#f59e0b" }}
        />
        {isReal ? "Live API" : "Mock Mode"}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-white p-4 shadow-lg">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            API Configuration
          </p>
          <p className="text-sm text-foreground">
            Running in{" "}
            <span className="font-semibold" style={{ color: isReal ? "#059669" : "#b45309" }}>
              {isReal ? "Live API" : "Mock"} mode
            </span>
            .
          </p>
          {!isReal && (
            <p className="mt-2 text-xs text-muted-foreground">
              Configure <code className="rounded bg-gray-100 px-1 py-0.5 font-mono">ANTHROPIC_API_KEY</code>{" "}
              and set{" "}
              <code className="rounded bg-gray-100 px-1 py-0.5 font-mono">NEXT_PUBLIC_API_MODE=real</code>{" "}
              in <code className="rounded bg-gray-100 px-1 py-0.5 font-mono">.env.local</code> for live responses.
            </p>
          )}
          {isReal && (
            <p className="mt-2 text-xs text-muted-foreground">
              Connected to Anthropic API. All AI features use real model responses.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Platform = "chatgpt" | "claude" | "gemini";

const PLATFORMS: { value: Platform; label: string; color: string }[] = [
  { value: "chatgpt", label: "ChatGPT", color: "#10a37f" },
  { value: "claude", label: "Claude", color: "#d97706" },
  { value: "gemini", label: "Gemini", color: "#4285f4" },
];

const TEAM_MEMBERS = [
  "Ana Costa",
  "Sofia Chen",
  "Marcus Klein",
  "James Park",
  "Raphael Vullierme",
];

const inputCls =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all";

export function AddCustomerModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [vertical, setVertical] = useState("insurance");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [accountOwner, setAccountOwner] = useState(TEAM_MEMBERS[0]);
  const [notes, setNotes] = useState("");

  function togglePlatform(p: Platform) {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  function handleOnboard() {
    onClose();
    setName("");
    setVertical("insurance");
    setPlatforms([]);
    setAccountOwner(TEAM_MEMBERS[0]);
    setNotes("");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold">Onboard Partner</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Company Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Insurance"
              className={inputCls}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Vertical</label>
              <select
                value={vertical}
                onChange={(e) => setVertical(e.target.value)}
                className={inputCls}
              >
                <option value="insurance">Insurance</option>
                <option value="fintech">Fintech</option>
                <option value="travel">Travel</option>
                <option value="health">Health</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Account Owner</label>
              <select
                value={accountOwner}
                onChange={(e) => setAccountOwner(e.target.value)}
                className={inputCls}
              >
                {TEAM_MEMBERS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Platforms{" "}
              <span className="font-normal text-muted-foreground">(select at least one)</span>
            </label>
            <div className="flex gap-3">
              {PLATFORMS.map((p) => {
                const selected = platforms.includes(p.value);
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => togglePlatform(p.value)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all"
                    style={
                      selected
                        ? { borderColor: p.color, backgroundColor: `${p.color}10`, color: p.color }
                        : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                    }
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Internal Notes{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Pilot contract, expanding to pet insurance Q2…"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleOnboard}
            disabled={!name.trim() || platforms.length === 0}
            className="rounded-lg bg-[#6C5CE7] px-4 py-2 text-sm font-medium text-white hover:bg-[#5a4bd1] disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            Onboard
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { X, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatWindow } from "./ChatWindow";
import { ConversationAnalytics } from "./ConversationAnalytics";
import { useChat } from "@/hooks/useChat";
import type { Agent, Customer } from "@/data/mock";

const MODEL_LABELS: Record<string, { label: string; color: string }> = {
  "gpt-4o": { label: "GPT-4o", color: "#10a37f" },
  "claude-sonnet": { label: "Claude Sonnet", color: "#d97706" },
  "gemini-pro": { label: "Gemini Pro", color: "#4285f4" },
};

const PLATFORM_LABELS: Record<string, { label: string; color: string }> = {
  chatgpt: { label: "ChatGPT", color: "#10a37f" },
  claude: { label: "Claude", color: "#d97706" },
  gemini: { label: "Gemini", color: "#4285f4" },
};

type Props = {
  agent: Agent;
  customer: Customer;
  systemPrompt: string;
  isOpen: boolean;
  onClose: () => void;
};

export function PlaygroundPanel({ agent, customer, systemPrompt, isOpen, onClose }: Props) {
  const { messages, isLoading, analysis, sendMessage, resetConversation } = useChat({ systemPrompt });

  const modelConf = MODEL_LABELS[agent.model] ?? { label: agent.model, color: "#6C5CE7" };
  const platformConf = PLATFORM_LABELS[agent.platform] ?? { label: agent.platform, color: "#6C5CE7" };

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content;

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
          "md:w-[75vw] lg:w-[70vw]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Panel header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border bg-white px-5 py-3.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C5CE7]/10">
            <FlaskConical className="h-4 w-4 text-[#6C5CE7]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Agent Playground</h2>
            <p className="text-[11px] text-muted-foreground">
              {customer.logo} {customer.name} · Testing {agent.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Two-column body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chat — 2/3 */}
          <div className="flex flex-1 flex-col overflow-hidden border-r border-border">
            <ChatWindow
              agentName={agent.name}
              modelLabel={modelConf.label}
              platformLabel={platformConf.label}
              platformColor={platformConf.color}
              modelColor={modelConf.color}
              messages={messages}
              isLoading={isLoading}
              onSend={sendMessage}
              onReset={resetConversation}
              lastUserMessage={lastUserMessage}
            />
          </div>

          {/* Analytics — 1/3 */}
          <div className="hidden w-72 shrink-0 overflow-hidden lg:flex lg:flex-col">
            <ConversationAnalytics messages={messages} analysis={analysis} />
          </div>
        </div>
      </div>

      {/* Bounce animation keyframes */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}

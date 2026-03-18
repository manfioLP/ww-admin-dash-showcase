"use client";

import { useEffect, useRef } from "react";
import { RotateCcw, Download, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScenarioButtons } from "./ScenarioButtons";
import type { ChatMessage as ChatMessageType } from "@/hooks/useChat";

type Props = {
  agentName: string;
  modelLabel: string;
  platformLabel: string;
  platformColor: string;
  modelColor: string;
  messages: ChatMessageType[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onReset: () => void;
  lastUserMessage?: string;
};

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6C5CE7]/15 text-sm mt-0.5">
        🤖
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-border bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-gray-400"
              style={{
                animation: `bounce 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ agentName }: { agentName: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6C5CE7]/10 text-2xl mb-3">
        🤖
      </div>
      <p className="text-sm font-semibold">{agentName}</p>
      <p className="mt-1 text-xs text-muted-foreground">Start a conversation or pick a scenario below</p>
    </div>
  );
}

export function ChatWindow({
  agentName,
  modelLabel,
  platformLabel,
  platformColor,
  modelColor,
  messages,
  isLoading,
  onSend,
  onReset,
  lastUserMessage,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function handleExport() {
    if (messages.length === 0) return;
    const text = messages
      .map(
        (m) =>
          `[${m.timestamp.toLocaleTimeString()}] ${m.role === "user" ? "Admin" : agentName}: ${m.content}`
      )
      .join("\n\n");
    const full = `Playground Export — ${agentName}\n${new Date().toLocaleString()}\n${"─".repeat(60)}\n\n${text}`;
    navigator.clipboard.writeText(full).catch(() => {});
    // Visual feedback via brief alert-less approach — just log
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border bg-white px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C5CE7]/10">
          <Bot className="h-4 w-4 text-[#6C5CE7]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold truncate">{agentName}</span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ color: modelColor, backgroundColor: `${modelColor}18` }}
            >
              {modelLabel}
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ color: platformColor, backgroundColor: `${platformColor}18` }}
            >
              {platformLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Connected indicator */}
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleExport}
              title="Export conversation"
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground"
            >
              <Download className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={onReset}
            title="Reset conversation"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-gray-100 hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 px-4 py-4">
        {messages.length === 0 ? (
          <EmptyState agentName={agentName} />
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                message={m}
                onRetry={m.isError && lastUserMessage ? () => onSend(lastUserMessage) : undefined}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
        {messages.length === 0 && <div ref={bottomRef} />}
      </div>

      {/* Scenario buttons — only when empty */}
      {messages.length === 0 && !isLoading && (
        <ScenarioButtons onSelect={onSend} />
      )}

      {/* Input */}
      <ChatInput onSend={onSend} disabled={isLoading} />
    </div>
  );
}

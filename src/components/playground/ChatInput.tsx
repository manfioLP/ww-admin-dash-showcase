"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function ChatInput({ onSend, disabled, placeholder = "Ask about insurance..." }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-border bg-white px-4 py-3">
      <div className="flex items-end gap-2 rounded-xl border border-border bg-gray-50 px-3 py-2 focus-within:border-[#6C5CE7] focus-within:ring-2 focus-within:ring-[#6C5CE7]/10 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "min-h-[20px] max-h-[120px]"
          )}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className={cn(
            "mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all",
            value.trim() && !disabled
              ? "bg-[#6C5CE7] text-white hover:bg-[#5a4bd1]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">
        Press <kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono">Enter</kbd> to send ·{" "}
        <kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}

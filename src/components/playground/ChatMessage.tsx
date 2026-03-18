import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/hooks/useChat";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Lightweight markdown parser — handles bold, italic, bullets, numbered lists, code
function parseMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Bullet list
    if (/^[-*•] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*•] /, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-1.5 ml-4 list-disc space-y-0.5">
          {items.map((item, j) => (
            <li key={j}>{inlineMarkdown(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-1.5 ml-4 list-decimal space-y-0.5">
          {items.map((item, j) => (
            <li key={j}>{inlineMarkdown(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line → small spacer
    if (line.trim() === "") {
      elements.push(<div key={`br-${i}`} className="my-1" />);
      i++;
      continue;
    }

    // Regular paragraph line
    elements.push(
      <span key={`p-${i}`} className="block">
        {inlineMarkdown(line)}
      </span>
    );
    i++;
  }

  return <>{elements}</>;
}

function inlineMarkdown(text: string): React.ReactNode {
  // Split on **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-black/8 px-1 py-0.5 font-mono text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

type Props = {
  message: ChatMessageType;
  onRetry?: () => void;
};

export function ChatMessage({ message, onRetry }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6C5CE7]/15 text-sm mt-0.5">
          🤖
        </div>
      )}

      <div className={cn("flex max-w-[78%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-sm bg-[#6C5CE7] text-white"
              : message.isError
              ? "rounded-tl-sm border border-red-200 bg-red-50 text-red-800"
              : "rounded-tl-sm border border-border bg-white text-foreground shadow-sm"
          )}
        >
          {message.isError ? (
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-xs mt-0.5">{message.content}</p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Retry
                  </button>
                )}
              </div>
            </div>
          ) : isUser ? (
            message.content
          ) : (
            parseMarkdown(message.content)
          )}
        </div>
        <span className="px-1 text-[10px] text-muted-foreground">{formatTime(message.timestamp)}</span>
      </div>

      {isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-muted-foreground mt-0.5">
          A
        </div>
      )}
    </div>
  );
}

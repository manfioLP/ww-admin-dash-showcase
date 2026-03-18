"use client";

import { useState, useCallback, useRef } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isError?: boolean;
};

export type ConversationAnalysis = {
  stage: "discovery" | "recommendation" | "quote" | "conversion" | "objection_handling";
  products_mentioned: string[];
  quote_provided: boolean;
  conversion_probability: number;
};

type UseChatOptions = {
  systemPrompt: string;
};

export function useChat({ systemPrompt }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null);
  const systemPromptRef = useRef(systemPrompt);
  systemPromptRef.current = systemPrompt;

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = await new Promise<ChatMessage[]>((resolve) => {
        setMessages((prev) => {
          resolve(prev);
          return prev;
        });
      });

      const apiMessages = history.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          systemPrompt: systemPromptRef.current,
          messages: apiMessages,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now()}_a`,
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Async analysis — non-blocking
      const allMessages = [...history, assistantMsg];
      fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze",
          systemPrompt: systemPromptRef.current,
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
        .then((r) => r.json())
        .then((analyticsData) => {
          if (analyticsData && !analyticsData.error) {
            setAnalysis(analyticsData as ConversationAnalysis);
          }
        })
        .catch(() => {/* silent */});
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now()}_err`,
        role: "assistant",
        content: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setAnalysis(null);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, analysis, sendMessage, resetConversation };
}

"use client";

import { useState, useCallback, useRef } from "react";
import { sendChatMessage, generateStructured } from "@/lib/api";
import type { ChatMessage as ApiChatMessage } from "@/types";

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
  conversion_probability: number; // 0–1
};

type UseChatOptions = {
  systemPrompt: string;
  onMessageComplete?: (messages: ChatMessage[]) => void;
};

// Cap history sent to API to avoid token limit issues
const MAX_HISTORY = 20;

export function useChat({ systemPrompt, onMessageComplete }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null);

  // Use refs so callbacks always see latest values without stale closures
  const systemPromptRef = useRef(systemPrompt);
  systemPromptRef.current = systemPrompt;
  const messagesRef = useRef<ChatMessage[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Update ref and state together
    const withUser = [...messagesRef.current, userMsg];
    messagesRef.current = withUser;
    setMessages(withUser);
    setIsLoading(true);

    try {
      // Build API-compatible messages, capped at last MAX_HISTORY, skipping error messages
      const apiMessages: ApiChatMessage[] = withUser
        .slice(-MAX_HISTORY)
        .filter((m) => !m.isError)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await sendChatMessage(apiMessages, systemPromptRef.current);

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now()}_a`,
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
      };

      const withAssistant = [...messagesRef.current, assistantMsg];
      messagesRef.current = withAssistant;
      setMessages(withAssistant);

      onMessageComplete?.(withAssistant);

      // Fire-and-forget: classify conversation stage
      const last6 = withAssistant.slice(-6);
      const convoSummary = last6
        .map((m) => `${m.role === "user" ? "User" : "Agent"}: ${m.content.slice(0, 200)}`)
        .join("\n");

      generateStructured<ConversationAnalysis>(
        `Classify this insurance sales conversation.\n\nRecent messages:\n${convoSummary}\n\n` +
          `Return JSON only: {"stage":"discovery"|"recommendation"|"quote"|"conversion"|"objection_handling","products_mentioned":string[],"quote_provided":boolean,"conversion_probability":number}`
      )
        .then((result) => {
          if (result?.data) setAnalysis(result.data);
        })
        .catch(() => {/* silent */});
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now()}_err`,
        role: "assistant",
        content:
          err instanceof Error ? err.message : "Something went wrong. Please try again.",
        timestamp: new Date(),
        isError: true,
      };
      const withError = [...messagesRef.current, errorMsg];
      messagesRef.current = withError;
      setMessages(withError);
    } finally {
      setIsLoading(false);
    }
  }, [onMessageComplete]);

  const resetConversation = useCallback(() => {
    messagesRef.current = [];
    setMessages([]);
    setAnalysis(null);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, analysis, sendMessage, resetConversation };
}

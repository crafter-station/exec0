"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ChatMessages } from "./chat-messages";
import { PresetPrompts } from "./preset-prompts";
import { PromptInput } from "./prompt-input";

function formatError(message: string): string {
  if (message.includes("429")) {
    return "Rate limit reached. Please wait a moment and try again.";
  }
  if (message.includes("timed out") || message.includes("timeout") || message.includes("Timeout")) {
    return "Request timed out. The server may be warming up — please try again.";
  }
  if (message.includes("Cannot connect") || message.includes("fetch failed") || message.includes("network")) {
    return "Connection error. Please check your internet and try again.";
  }
  if (message.includes("500") || message.includes("Internal Server")) {
    return "Something went wrong on our end. Please try again.";
  }
  if (message.includes("503") || message.includes("unavailable")) {
    return "Service temporarily unavailable. Please try again in a moment.";
  }
  // Strip long technical details, keep first sentence
  const firstSentence = message.split(/[.!]\s/)[0];
  if (firstSentence.length > 120) {
    return "Something went wrong. Please try again.";
  }
  return firstSentence;
}

export function PlaygroundChat() {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/playground/chat" }),
    [],
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport,
  });

  const isLoading = status === "streaming" || status === "submitted";
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom within the container only, not the page
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;
      await sendMessage({ text });
    },
    [isLoading, sendMessage],
  );

  const handleClear = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return (
    <div className="relative mx-auto flex max-w-4xl flex-col overflow-hidden rounded-md border bg-background text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium">Playground</span>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="relative h-[300px] sm:h-[350px] md:h-[400px]">
        {/* Top gradient fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-background to-transparent" />

        <div
          ref={scrollContainerRef}
          className="no-scrollbar h-full overflow-y-auto p-4"
        >
          {messages.length === 0 ? (
            <PresetPrompts onSelect={handleSend} />
          ) : (
            <ChatMessages messages={messages} status={status} />
          )}
          <div className="h-4" />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-3 mb-2 rounded-md border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
          {formatError(error.message)}
        </div>
      )}

      {/* Input */}
      <PromptInput onSubmit={handleSend} status={status} />
    </div>
  );
}

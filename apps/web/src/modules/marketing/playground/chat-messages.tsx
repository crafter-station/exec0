"use client";

import type { ChatStatus, ToolUIPart, UIMessage } from "ai";
import { motion } from "motion/react";
import { memo } from "react";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import { cn } from "@/lib/utils";
import { StreamingParagraph } from "./streaming-paragraph";
import { ToolCallCard } from "./tool-call-card";

interface ChatMessagesProps {
  messages: UIMessage[];
  status: ChatStatus;
}

type AnyToolPart = {
  type: `tool-${string}`;
  state: ToolUIPart["state"];
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  errorText?: string;
};

const streamdownPlugins = { code };
const streamdownComponents = { p: StreamingParagraph };

const MarkdownResponse = memo(
  ({
    children,
    mode,
  }: {
    children: string;
    mode: "streaming" | "static";
  }) => (
    <Streamdown
      className="size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
      plugins={streamdownPlugins}
      components={streamdownComponents}
      mode={mode}
    >
      {children}
    </Streamdown>
  ),
  (prev, next) =>
    prev.children === next.children && prev.mode === next.mode,
);
MarkdownResponse.displayName = "MarkdownResponse";

export function ChatMessages({ messages, status }: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, messageIndex) => {
        const isLastMessage = messageIndex === messages.length - 1;
        const isStreaming =
          isLastMessage &&
          (status === "streaming" || status === "submitted");

        return (
          <div key={message.id}>
            {message.role === "user" ? (
              <div className="flex justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="bg-muted border-foreground/15 w-fit max-w-[90%] break-words rounded-[8px_8px_3px_8px] border p-3 text-sm sm:max-w-[80%]"
                >
                  {message.parts
                    .filter((p) => p.type === "text")
                    .map((p, i) => (
                      <p key={`${message.id}-${i}`}>{p.text}</p>
                    ))}
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={cn(
                  "space-y-3 prose prose-neutral dark:prose-invert max-w-none",
                  "prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0",
                  "prose-p:leading-relaxed prose-sm",
                )}
              >
                {message.parts.map((part, index) => {
                  const key = `${message.id}-${index}`;

                  if (part.type === "text") {
                    if (!part.text.trim()) return null;
                    return (
                      <MarkdownResponse
                        key={key}
                        mode={isStreaming ? "streaming" : "static"}
                      >
                        {part.text}
                      </MarkdownResponse>
                    );
                  }

                  if (part.type.startsWith("tool-")) {
                    const toolPart = part as AnyToolPart;
                    return (
                      <ToolCallCard
                        key={key}
                        state={toolPart.state}
                        input={
                          (toolPart.input as {
                            language?: string;
                            code?: string;
                          }) ?? undefined
                        }
                        output={
                          toolPart.output as {
                            success?: boolean;
                            stdout?: string;
                            stderr?: string;
                            exitCode?: number;
                            executionTime?: number;
                            language?: string;
                          }
                        }
                      />
                    );
                  }

                  return null;
                })}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

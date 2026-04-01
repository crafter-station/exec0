"use client";

import { Badge } from "@exec0/ui/badge";
import type { ToolUIPart } from "ai";
import { Logo } from "@exec0/ui/assets";
import {
  CheckCircle,
  ChevronDown,
  Circle,
  Clock,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-go";
import "../code.css";
import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import { cn } from "@/lib/utils";

interface ToolCallCardProps {
  state: ToolUIPart["state"];
  input?: { language?: string; code?: string };
  output?: {
    success?: boolean;
    stdout?: string;
    stderr?: string;
    exitCode?: number;
    executionTime?: number;
    language?: string;
  };
}

const statusConfig: Record<
  string,
  { label: string; icon: React.ReactNode; className: string }
> = {
  "input-streaming": {
    label: "Pending",
    icon: <Circle className="size-3" />,
    className: "text-muted-foreground",
  },
  "input-available": {
    label: "Running",
    icon: <Clock className="size-3 animate-pulse" />,
    className: "text-yellow-600",
  },
  "output-available": {
    label: "Completed",
    icon: <CheckCircle className="size-3" />,
    className: "text-green-600",
  },
  "output-error": {
    label: "Error",
    icon: <XCircle className="size-3" />,
    className: "text-red-600",
  },
};

function highlightCode(code: string, language: string): string {
  const langMap: Record<string, string> = {
    typescript: "typescript",
    javascript: "javascript",
    go: "go",
  };
  const lang = langMap[language] || "typescript";
  if (languages[lang]) {
    return highlight(code, languages[lang], lang);
  }
  return code;
}

export function ToolCallCard({ state, input, output }: ToolCallCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [justCompleted, setJustCompleted] = useState(false);
  const prevStateRef = useRef(state);
  const language = input?.language || "typescript";
  const rawCode = input?.code || "";
  const code = rawCode.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
  const status = statusConfig[state] || statusConfig["input-streaming"];
  const hasOutput = state === "output-available" || state === "output-error";

  const [playSuccess] = useSound("/audio/success.mp3", { volume: 0.15 });

  // Detect completion transition
  useEffect(() => {
    const wasRunning =
      prevStateRef.current === "input-available" ||
      prevStateRef.current === "input-streaming";
    const isNowComplete = state === "output-available";

    if (wasRunning && isNowComplete) {
      playSuccess();
      setJustCompleted(true);
      const timer = setTimeout(() => setJustCompleted(false), 1000);
      return () => clearTimeout(timer);
    }

    prevStateRef.current = state;
  }, [state, playSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: justCompleted ? [1, 1.01, 1] : 1,
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-md border transition-colors duration-500",
        justCompleted && "border-green-500/40",
      )}
    >
      {/* Completion glow */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0 z-0 bg-green-500/5"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 flex w-full items-center justify-between gap-2 px-3 py-2 hover:bg-accent/50 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Logo size="16px" />
          <span className="text-sm font-medium">exec0</span>
          <Badge variant="outline" className="hidden text-[10px] uppercase sm:inline-flex">
            {language}
          </Badge>
          <motion.div
            key={state}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
          >
            <Badge
              variant="secondary"
              className={`gap-1 ${status.className}`}
            >
              {status.icon}
              {status.label}
            </Badge>
          </motion.div>
          {hasOutput && output?.executionTime != null && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-muted-foreground"
            >
              {output.executionTime}ms
            </motion.span>
          )}
        </div>
        <ChevronDown
          className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 overflow-hidden"
          >
            {/* Code */}
            <div className="border-t">
              <pre className="overflow-x-auto bg-[#0f0f0f] p-3 text-xs leading-relaxed sm:p-4 sm:text-sm">
                <code
                  className="language-typescript"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: syntax highlighting
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(code, language),
                  }}
                />
              </pre>
            </div>

            {/* Output */}
            {hasOutput && output && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="border-t"
              >
                {output.stdout && (
                  <pre className="overflow-x-auto bg-[#0f0f0f] p-4 font-mono text-xs leading-relaxed text-green-400">
                    {output.stdout}
                  </pre>
                )}
                {output.stderr && (
                  <pre className="overflow-x-auto bg-[#0f0f0f] p-4 font-mono text-xs leading-relaxed text-red-400">
                    {output.stderr}
                  </pre>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

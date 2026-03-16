"use client";

import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import useSound from "use-sound";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  onSubmit: (text: string) => void;
  status: string;
  disabled?: boolean;
}

function Grad({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-stretch -space-y-3",
        className,
      )}
    >
      <div className="w-full flex-1 bg-[#FC2BA3] blur-xl" />
      <div className="w-full flex-1 bg-[#FC6D35] blur-xl" />
      <div className="w-full flex-1 bg-[#F9C83D] blur-xl" />
      <div className="w-full flex-1 bg-[#C2D6E1] blur-xl" />
    </div>
  );
}

export function PromptInput({ onSubmit, status, disabled }: PromptInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [sendKey, setSendKey] = useState(0);
  const isLoading = status === "streaming" || status === "submitted";

  const [playSend] = useSound("/audio/send.mp3", { volume: 0.2 });

  const handleSubmit = useCallback(() => {
    const value = inputValue.trim();
    if (!value || isLoading || disabled) return;
    playSend();
    onSubmit(value);
    setInputValue("");
    setSendKey((k) => k + 1);
  }, [inputValue, onSubmit, isLoading, disabled, playSend]);

  return (
    <motion.div
      initial={false}
      animate={{ borderRadius: "10px" }}
      className="bg-muted border-foreground/10 relative mx-3 mb-3 flex w-auto flex-col justify-between overflow-hidden rounded-lg border p-2"
    >
      <div className="flex items-center justify-between">
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask me anything..."
          value={inputValue}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading || disabled}
          className="h-10 w-full border-none bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />
        <motion.button
          type="button"
          onClick={handleSubmit}
          initial={false}
          animate={{
            width: 36,
            height: 36,
          }}
          className="bg-background/75 border-foreground/10 flex shrink-0 items-center justify-center rounded-full border"
          disabled={isLoading || disabled}
        >
          <ArrowUp className="size-4" />
        </motion.button>
      </div>

      {/* Gradient sweep on send */}
      <motion.div
        key={`sweep-${sendKey}`}
        initial={{ y: "250%", opacity: 1 }}
        animate={{ y: "-200%", opacity: 0.2 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        className="pointer-events-none absolute inset-x-[-10%] top-0 z-[2] flex h-10 w-[120%]"
      >
        <Grad className="w-full" />
        <Grad className="w-full -translate-y-2" />
        <Grad className="w-full" />
      </motion.div>
    </motion.div>
  );
}

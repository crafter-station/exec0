"use client";

import { Logo } from "@exec0/ui/assets";
import { Calculator, CalendarDays, KeyRound, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const presets = [
  {
    label: "Calculate fibonacci(50)",
    prompt: "Calculate fibonacci(50) and check if it's prime",
    icon: Calculator,
  },
  {
    label: "Generate random passwords",
    prompt: "Generate 5 random passwords and rate their strength",
    icon: KeyRound,
  },
  {
    label: "FizzBuzz with a twist",
    prompt:
      "FizzBuzz from 1-30 with a twist: use 'Exec' for 3 and 'Zero' for 5",
    icon: Sparkles,
  },
  {
    label: "Day of the week for Y2K",
    prompt: "What day of the week was January 1st, 2000?",
    icon: CalendarDays,
  },
];

interface PresetPromptsProps {
  onSelect: (text: string) => void;
}

export function PresetPrompts({ onSelect }: PresetPromptsProps) {
  return (
    <div className="flex h-full flex-col items-center justify-end gap-6 pb-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        className="mb-auto mt-auto"
      >
        <Logo size="80px" />
      </motion.div>

      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {presets.map(({ label, prompt, icon: Icon }, i) => (
          <motion.button
            key={label}
            type="button"
            onClick={() => onSelect(prompt)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 rounded-md border border-foreground/10 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

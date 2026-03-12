"use client";

import { Button } from "@exec0/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exec0/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type Period = "7d" | "30d" | "month";

const PERIODS: { id: Period; label: string }[] = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "month", label: "This month" },
];

interface DatePeriodSelectorProps {
  currentPeriod: Period;
}

export function DatePeriodSelector({ currentPeriod }: DatePeriodSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  const selectedLabel =
    PERIODS.find((p) => p.id === currentPeriod)?.label ?? "Last 30 days";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-border/50 hover:border-border transition duration-200"
        >
          <span className="text-sm font-medium">{selectedLabel}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {PERIODS.map((p) => (
          <DropdownMenuItem
            key={p.id}
            className={
              currentPeriod === p.id ? "bg-primary/10 text-foreground" : ""
            }
            onClick={() => router.push(`${pathname}?period=${p.id}`)}
          >
            {p.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

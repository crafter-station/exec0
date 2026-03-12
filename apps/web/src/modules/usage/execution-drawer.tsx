"use client";

import { Badge } from "@exec0/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@exec0/ui/sheet";
import type { UsageRecord } from "@exec0/usage";
import { CodeViewer } from "./code-viewer";

interface ExecutionDrawerProps {
  record: UsageRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  go: "Go",
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ExecutionDrawer({
  record,
  open,
  onOpenChange,
}: ExecutionDrawerProps) {
  if (!record) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md overflow-auto">
        <SheetHeader>
          <SheetTitle className="font-mono">Execution Details</SheetTitle>
          <SheetDescription asChild>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="font-mono text-xs">
                {LANGUAGE_LABELS[record.language] ?? record.language}
              </Badge>
              <span className="text-xs">{record.resources}</span>
              <span className="text-xs">
                {formatDuration(record.deltaTime)}
              </span>
            </div>
          </SheetDescription>
          <p className="text-xs text-muted-foreground font-mono pt-1">
            {formatTimestamp(record.timestamp)}
          </p>
        </SheetHeader>

        <div className="flex-1 px-4 pb-1 space-y-4">
          {/* Code */}
          {record.code ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Code
              </h3>
              <CodeViewer code={record.code} language={record.language} />
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Code
              </h3>
              <p className="text-xs text-muted-foreground italic">
                Code not available for this execution
              </p>
            </div>
          )}

          {/* Output */}
          {record.output ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Output
              </h3>
              <pre className="px-3 py-2 overflow-auto font-mono text-sm leading-relaxed bg-card border border-border rounded-md max-h-[30vh] text-foreground/80">
                {record.output}
              </pre>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { Badge } from "@exec0/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exec0/ui/table";
import type { UsageRecord } from "@exec0/usage";

interface ExecutionLogProps {
  records: UsageRecord[];
}

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  go: "Go",
};

const RESOURCE_LABELS: Record<string, string> = {
  lite: "Lite",
  basic: "Basic",
  medium: "Medium",
  large: "Large",
  max: "Max",
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ExecutionLog({ records }: ExecutionLogProps) {
  return (
    <div>
      <Table className="border-separate border-spacing-y-1.5">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-none [&>th]:text-muted-foreground">
            <TableHead className="px-6">Date</TableHead>
            <TableHead className="px-6">Language</TableHead>
            <TableHead className="px-6">Tier</TableHead>
            <TableHead className="px-6 text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow
              key={`${record.timestamp}-${record.apiKeyId}`}
              className="group bg-card [&>td]:first:rounded-l-sm [&>td]:last:rounded-r-sm"
            >
              <TableCell className="px-6 text-sm text-foreground/70 font-mono">
                {formatTimestamp(record.timestamp)}
              </TableCell>
              <TableCell className="px-6">
                <Badge variant="outline" className="font-mono text-xs">
                  {LANGUAGE_LABELS[record.language] ?? record.language}
                </Badge>
              </TableCell>
              <TableCell className="px-6 text-sm text-foreground/70">
                {RESOURCE_LABELS[record.resources] ?? record.resources}
              </TableCell>
              <TableCell className="px-6 text-right text-sm font-mono text-foreground/70">
                {formatDuration(record.deltaTime)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

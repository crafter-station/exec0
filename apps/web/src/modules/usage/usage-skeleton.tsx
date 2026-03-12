import { Card } from "@exec0/ui/card";
import { Skeleton } from "@exec0/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exec0/ui/table";

export function UsageSkeleton() {
  return (
    <>
      {/* Header skeleton — mirrors UsageContent header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      {/* Chart skeleton — mirrors UsageChart */}
      <Card className="w-full border-border">
        <div className="w-full h-64 flex items-end gap-1 p-6">
          {Array.from({ length: 12 }, (_, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-sm"
              style={{ height: `${20 + Math.sin(i * 0.8) * 30 + 30}%` }}
            />
          ))}
        </div>
      </Card>

      {/* Execution log skeleton — mirrors ExecutionLog */}
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
          {Array.from({ length: 5 }, (_, i) => (
            <TableRow
              key={i}
              className="bg-card [&>td]:first:rounded-l-sm [&>td]:last:rounded-r-sm"
            >
              <TableCell className="px-6">
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className="px-6">
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell className="px-6">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell className="px-6 text-right">
                <Skeleton className="ml-auto h-4 w-14" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

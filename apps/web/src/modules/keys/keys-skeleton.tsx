import { Skeleton } from "@exec0/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exec0/ui/table";

export function KeysSkeleton() {
  return (
    <>
      {/* Header skeleton — mirrors KeysContent header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      {/* Table skeleton — mirrors KeysTable */}
      <Table className="border-separate border-spacing-y-1.5">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-none [&>th]:text-muted-foreground">
            <TableHead className="px-6">Key</TableHead>
            <TableHead className="px-6">Created</TableHead>
            <TableHead className="px-6">Last Used</TableHead>
            <TableHead className="px-6">Status</TableHead>
            <TableHead className="px-6 w-12.5 text-right">Actions</TableHead>
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
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="px-6">
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className="px-6">
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell className="px-6 text-right">
                <Skeleton className="ml-auto h-8 w-8 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

import { Skeleton } from "@exec0/ui/skeleton";

export function RecentKeysSkeleton() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="flex w-full items-center justify-between rounded-md px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

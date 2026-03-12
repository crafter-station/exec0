import { Badge } from "@exec0/ui/badge";
import { Card } from "@exec0/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@exec0/ui/empty";
import { Link } from "next-view-transitions";
import {
  IconGamingButtonsFillDuo18,
  IconVault3FillDuo18,
  IconWindowChartLineFillDuo18,
} from "nucleo-ui-essential-fill-duo-18";
import { Suspense } from "react";
import keys from "@/lib/keys";
import { RecentKeysSkeleton } from "@/modules/dashboard/recent-keys-skeleton";
import { CreateApiKeyDialog } from "@/modules/keys/create-keys";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      {/* Action Cards — static, renders instantly */}
      <div className="mb-12 grid grid-cols-3 gap-4">
        <Link prefetch={true} href={`/${slug}/keys`}>
          <Card className="flex flex-col gap-2 px-6 border-border/50 hover:border-border transition duration-100 cursor-pointer">
            <IconVault3FillDuo18 className="size-6 key-breadcrumb-icon" />
            <span className="text-sm font-semibold font-mono key-breadcrumb-title">
              Keys
            </span>
          </Card>
        </Link>
        <Link prefetch={true} href={`/${slug}/usage`}>
          <Card className="flex flex-col gap-2 px-6 border-border/50 hover:border-border transition duration-100 cursor-pointer">
            <IconWindowChartLineFillDuo18 className="size-6 chart-breadcrumb-icon" />
            <span className="text-sm font-semibold font-mono chart-breadcrumb-title">
              Usage
            </span>
          </Card>
        </Link>
        <Link prefetch={true} href={`/${slug}/playground`}>
          <Card className="flex flex-col gap-2 px-6 border-border/50 hover:border-border transition duration-100 cursor-pointer">
            <IconGamingButtonsFillDuo18 className="size-6" />
            <span className="text-sm font-semibold font-mono">Playground</span>
          </Card>
        </Link>
      </div>

      {/* Recent Keys — async, streams when ready */}
      <Suspense fallback={<RecentKeysSkeleton />}>
        <RecentKeys slug={slug} />
      </Suspense>
    </div>
  );
}

async function RecentKeys({ slug }: { slug: string }) {
  const allKeys = await keys.list(slug);

  const recentKeys = allKeys
    .sort((a, b) => {
      const dateA = a.metadata.createdAt
        ? new Date(a.metadata.createdAt).getTime()
        : 0;
      const dateB = b.metadata.createdAt
        ? new Date(b.metadata.createdAt).getTime()
        : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  if (recentKeys.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconVault3FillDuo18 className="size-6" />
          </EmptyMedia>
          <EmptyTitle>No API Keys</EmptyTitle>
          <EmptyDescription>
            Create your first API key to start executing code.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CreateApiKeyDialog slug={slug} />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Recent keys</h2>
        {allKeys.length > 0 ? (
          <Link
            href={`/${slug}/keys`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View all ({allKeys.length})
          </Link>
        ) : null}
      </div>
      <div className="space-y-1">
        {recentKeys.map((apiKey) => {
          const isRevoked = !!apiKey.metadata.revokedAt;
          const isDisabled = apiKey.metadata.enabled === false;
          const isExpired =
            apiKey.metadata.expiresAt &&
            new Date(apiKey.metadata.expiresAt) < new Date();
          return (
            <div
              key={apiKey.id}
              className="group flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground">
                  {apiKey.metadata.name || "Unnamed Key"}
                </span>
                <Badge
                  variant={
                    isRevoked
                      ? "destructive"
                      : isExpired
                        ? "outline"
                        : isDisabled
                          ? "secondary"
                          : "default"
                  }
                  className="text-[10px] px-1.5 py-0"
                >
                  {isRevoked
                    ? "Revoked"
                    : isExpired
                      ? "Expired"
                      : isDisabled
                        ? "Disabled"
                        : "Active"}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {apiKey.metadata.createdAt
                  ? new Date(apiKey.metadata.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )
                  : "\u2014"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

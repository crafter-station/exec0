import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@exec0/ui/empty";
import { IconVault3FillDuo18 } from "nucleo-ui-essential-fill-duo-18";
import { Suspense } from "react";
import keys from "@/lib/keys";
import { CreateApiKeyDialog } from "@/modules/keys/create-keys";
import { KeysSkeleton } from "@/modules/keys/keys-skeleton";
import { KeysTable } from "@/modules/keys/keys-table";

export default async function PageKeys({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      <Suspense fallback={<KeysSkeleton />}>
        <KeysContent slug={slug} />
      </Suspense>
    </div>
  );
}

async function KeysContent({ slug }: { slug: string }) {
  const userKeys = await keys.list(slug);

  if (userKeys.length === 0) {
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
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium font-mono">API Keys</h1>
          <p className="text-muted-foreground text-sm">
            Manage and secure your API keys for integrations
          </p>
        </div>
        <CreateApiKeyDialog slug={slug} />
      </div>
      <KeysTable keys={userKeys} />
    </>
  );
}

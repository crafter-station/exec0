import { Badge } from "@exec0/ui/badge";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@exec0/ui/empty";
import { IconPlug2FillDuo18 } from "nucleo-ui-essential-fill-duo-18";
import keys from "@/lib/keys";
import { CreateApiKeyDialog } from "@/modules/keys/create-keys";
import { KeysTable } from "@/modules/keys/keys-table";

export default async function PageKeys({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const userKeys = await keys.list(slug);

  if (userKeys.length === 0) {
    return (
      <div className="space-y-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconPlug2FillDuo18 className="h-8 w-8" />
            </EmptyMedia>
            <EmptyTitle>No API Keys</EmptyTitle>
            <EmptyDescription>
              You don't have any API keys yet. Create one to get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateApiKeyDialog slug={slug as string} />
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium font-mono">API Keys</h1>
          <p className="text-muted-foreground text-sm">
            Manage and secure your API keys for integrations
          </p>
        </div>
        <CreateApiKeyDialog slug={slug as string} />
      </div>

      <KeysTable keys={userKeys} />
    </div>
  );
}

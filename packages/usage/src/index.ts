import {
  PutItemCommand,
  QueryCommand,
  type QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { dynamoUsage } from "@exec0/db";
import { languageSchema, resourcesSchema } from "@exec0/schemas";
import { z } from "zod";

export const usageRecordSchema = z.object({
  ownerId: z.string().min(1),
  timestamp: z.number().int().positive(),
  apiKeyId: z.string().min(1),
  language: languageSchema,
  resources: resourcesSchema,
  deltaTime: z.number().nonnegative(),
  code: z.string().max(100_000).optional(),
  output: z.string().max(100_000).optional(),
  schemaVersion: z.literal(1),
  ttl: z.number().int().positive(),
});

export const usageInputSchema = usageRecordSchema.omit({
  schemaVersion: true,
  ttl: true,
});

export type UsageRecord = z.infer<typeof usageRecordSchema>;
export type UsageInput = z.infer<typeof usageInputSchema>;

// --- Constants ---

const MARSHALL_OPTIONS = { removeUndefinedValues: true };
const TTL_90_DAYS = 90 * 24 * 60 * 60;

// --- Write ---

export const recordUsage = async (
  tableName: string,
  input: UsageInput,
): Promise<void> => {
  const record: UsageRecord = {
    ...input,
    schemaVersion: 1,
    ttl: Math.floor(input.timestamp / 1000) + TTL_90_DAYS,
  };

  await dynamoUsage.send(
    new PutItemCommand({
      TableName: tableName,
      Item: marshall(record, MARSHALL_OPTIONS),
    }),
  );
};

// --- Read ---

export const getUsageByOwner = async (
  tableName: string,
  ownerId: string,
  options?: { since?: number; until?: number },
): Promise<UsageRecord[]> => {
  const params: QueryCommandInput = {
    TableName: tableName,
    KeyConditionExpression: "ownerId = :ownerId",
    ExpressionAttributeValues: marshall(
      { ":ownerId": ownerId },
      MARSHALL_OPTIONS,
    ),
  };

  if (options?.since && options?.until) {
    params.KeyConditionExpression += " AND #ts BETWEEN :since AND :until";
    params.ExpressionAttributeNames = { "#ts": "timestamp" };
    params.ExpressionAttributeValues = marshall(
      {
        ":ownerId": ownerId,
        ":since": options.since,
        ":until": options.until,
      },
      MARSHALL_OPTIONS,
    );
  } else if (options?.since) {
    params.KeyConditionExpression += " AND #ts >= :since";
    params.ExpressionAttributeNames = { "#ts": "timestamp" };
    params.ExpressionAttributeValues = marshall(
      { ":ownerId": ownerId, ":since": options.since },
      MARSHALL_OPTIONS,
    );
  }

  const result = await dynamoUsage.send(new QueryCommand(params));
  return (result.Items?.map((item) => unmarshall(item)) ?? []) as UsageRecord[];
};

export const getUsageByApiKey = async (
  tableName: string,
  apiKeyId: string,
  options?: { since?: number; until?: number },
): Promise<UsageRecord[]> => {
  const params: QueryCommandInput = {
    TableName: tableName,
    IndexName: "ApiKeyIdIndex",
    KeyConditionExpression: "apiKeyId = :apiKeyId",
    ExpressionAttributeValues: marshall(
      { ":apiKeyId": apiKeyId },
      MARSHALL_OPTIONS,
    ),
  };

  if (options?.since && options?.until) {
    params.KeyConditionExpression += " AND #ts BETWEEN :since AND :until";
    params.ExpressionAttributeNames = { "#ts": "timestamp" };
    params.ExpressionAttributeValues = marshall(
      {
        ":apiKeyId": apiKeyId,
        ":since": options.since,
        ":until": options.until,
      },
      MARSHALL_OPTIONS,
    );
  } else if (options?.since) {
    params.KeyConditionExpression += " AND #ts >= :since";
    params.ExpressionAttributeNames = { "#ts": "timestamp" };
    params.ExpressionAttributeValues = marshall(
      { ":apiKeyId": apiKeyId, ":since": options.since },
      MARSHALL_OPTIONS,
    );
  }

  const result = await dynamoUsage.send(new QueryCommand(params));
  return (result.Items?.map((item) => unmarshall(item)) ?? []) as UsageRecord[];
};

// --- Aggregations (pure functions) ---

export const aggregateByDay = (
  records: UsageRecord[],
): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const r of records) {
    const day = new Date(r.timestamp).toISOString().split("T")[0] as string;
    result[day] = (result[day] ?? 0) + 1;
  }
  return result;
};

export const aggregateByLanguage = (
  records: UsageRecord[],
): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const r of records) {
    result[r.language] = (result[r.language] ?? 0) + 1;
  }
  return result;
};

export const aggregateByResource = (
  records: UsageRecord[],
): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const r of records) {
    result[r.resources] = (result[r.resources] ?? 0) + 1;
  }
  return result;
};

export const getTimePeriod = (
  period: "day" | "week" | "month",
): { since: number; until: number } => {
  const now = Date.now();
  const ms = { day: 86400000, week: 604800000, month: 2592000000 };
  return { since: now - ms[period], until: now };
};

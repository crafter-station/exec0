import {
  aggregateByDay,
  aggregateByLanguage,
  aggregateByResource,
  getTimePeriod,
  getUsageByOwner,
} from "@exec0/usage";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { Resource } from "sst";
import { z } from "zod";
import { authMiddleware } from "../../core/middleware";

const app = new Hono();

app.use(authMiddleware);

const periodSchema = z.enum(["day", "week", "month"]);

app.get(
  "/summary",
  describeRoute({
    operationId: "getUsageSummary",
    description: "Get aggregated usage summary for the authenticated user",
    security: [{ ApiKeyAuth: [] }],
  }),
  async (c) => {
    const apiKey = c.get("apiKey" as never) as {
      id: string;
      metadata: { ownerId: string };
    };
    const period = periodSchema.catch("month").parse(c.req.query("period"));
    const timeRange = getTimePeriod(period);

    const records = await getUsageByOwner(
      Resource.Usage.name,
      apiKey.metadata.ownerId,
      timeRange,
    );

    return c.json({
      total: records.length,
      byDay: aggregateByDay(records),
      byLanguage: aggregateByLanguage(records),
      byResource: aggregateByResource(records),
      period,
    });
  },
);

app.get(
  "/details",
  describeRoute({
    operationId: "getUsageDetails",
    description: "Get raw usage records for the authenticated user",
    security: [{ ApiKeyAuth: [] }],
  }),
  async (c) => {
    const apiKey = c.get("apiKey" as never) as {
      id: string;
      metadata: { ownerId: string };
    };
    const since = c.req.query("since");
    const limit = Number(c.req.query("limit") ?? "100");

    const records = await getUsageByOwner(
      Resource.Usage.name,
      apiKey.metadata.ownerId,
      since ? { since: Number(since) } : undefined,
    );

    return c.json(records.slice(0, limit));
  },
);

export { app as usageRouter };

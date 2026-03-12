import { executeRequestSchema } from "@exec0/schemas";
import { recordUsage } from "@exec0/usage";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { Resource } from "sst";
import { authMiddleware } from "../../core/middleware";
import { executeLambda } from "./service";

const app = new Hono();

app.use(authMiddleware);

app.post(
  "/",
  describeRoute({
    operationId: "executeCode",
    description: "Execute code in supported programming languages",
    security: [{ ApiKeyAuth: [] }],
  }),
  zValidator("json", executeRequestSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const apiKey = c.get("apiKey" as never) as {
      id: string;
      metadata: { ownerId: string };
    };
    const result = await executeLambda(payload);

    // Fire-and-forget usage tracking
    const output = [result.result.stdout, result.result.stderr]
      .filter(Boolean)
      .join("\n");

    recordUsage(Resource.Usage.name, {
      ownerId: apiKey.metadata.ownerId,
      apiKeyId: apiKey.id,
      timestamp: Date.now(),
      language: payload.language,
      resources: payload.resources,
      deltaTime: result.executionTime,
      code: payload.code,
      output: output || undefined,
    }).catch(console.error);

    return c.json(result);
  },
);

export { app as executeRouter };

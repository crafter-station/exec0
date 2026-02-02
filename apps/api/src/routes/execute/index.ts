import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { executeLambda } from "@/lib/lambda-executor";
import { authMiddleware } from "@/middleware";
import { executeRequestSchema } from "@/schemas";

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
    const result = await executeLambda(payload);
    return c.json(result);
  },
);

export { app as executeRouter };

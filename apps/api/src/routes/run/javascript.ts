import { Hono } from "hono";
import { describeRoute, resolver, validator as zValidator } from "hono-openapi";
import {
  errorResponseSchema,
  runRequestSchema,
  runResponseSchema,
} from "@/schemas";
import { runCode } from "@/services/runcode";

const app = new Hono();

app.post(
  "/",
  describeRoute({
    operationId: "runJavascript",
    description: "Run Javascript code",
    responses: {
      200: {
        description: "Successful execution",
        content: {
          "application/json": {
            schema: resolver(runResponseSchema),
          },
        },
      },
      400: {
        description: "Execution error",
        content: {
          "application/json": {
            schema: resolver(errorResponseSchema),
          },
        },
      },
    },
  }),
  zValidator("json", runRequestSchema),
  async (c) => {
    const env = c.env as { Sandbox: string };
    const body = c.req.valid("json");

    const result = await runCode("javascript", body.code, env.Sandbox);
    return c.json(result, result.success ? 200 : 400);
  },
);

export { app as runJavascriptRouter };

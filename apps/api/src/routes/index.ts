import { Hono } from "hono";
import { describeRoute, resolver, validator as zValidator } from "hono-openapi";
import { createExecuteHandler } from "@/handlers";
import { executeRequestSchema, executeResponseSchema } from "@/schemas";

const app = new Hono();

app.post(
  "/python",
  describeRoute({
    operationId: "executePython",
    description: "Execute Python code",
    responses: {
      200: {
        description: "Successful execution",
        content: {
          "application/json": {
            schema: resolver(executeResponseSchema),
          },
        },
      },
    },
  }),
  zValidator("json", executeRequestSchema),
  createExecuteHandler("python"),
);

app.post(
  "/javascript",
  describeRoute({
    operationId: "executeJavaScript",
    description: "Execute JavaScript code",
    responses: {
      200: {
        description: "Successful execution",
        content: {
          "application/json": {
            schema: resolver(executeResponseSchema),
          },
        },
      },
    },
  }),
  zValidator("json", executeRequestSchema),
  createExecuteHandler("javascript"),
);

app.post(
  "/typescript",
  describeRoute({
    operationId: "executeTypeScript",
    description: "Execute TypeScript code",
    responses: {
      200: {
        description: "Successful execution",
        content: {
          "application/json": {
            schema: resolver(executeResponseSchema),
          },
        },
      },
    },
  }),
  zValidator("json", executeRequestSchema),
  createExecuteHandler("typescript"),
);

export default app;

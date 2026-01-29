import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { runRequestSchema } from "@/schemas";

const lambda = new LambdaClient();
const app = new Hono();

app.post(
  "/",
  describeRoute({
    operationId: "runGo",
    description: "Run Go code",
    security: [{ ApiKeyAuth: [] }],
  }),
  zValidator("json", runRequestSchema),
  async (c) => {
    const body = c.req.valid("json");

    const startTime = Date.now();
    const response = await lambda.send(
      new InvokeCommand({
        FunctionName: process.env.GO_ARN,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({ code: body.code }),
      }),
    );
    const executionTime = Date.now() - startTime;
    const result = JSON.parse(new TextDecoder().decode(response.Payload));

    return c.json({
      ...result,
      executionTime,
    });
  },
);

export { app as runGoRouter };

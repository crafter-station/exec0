import { apiKeysTable, usageTable } from "./dynamodb";

export const runTypescript = new sst.aws.Function("RunTypescript", {
  handler: "apps/functions/typescript/index.handler",
  memory: "256 MB",
  runtime: "nodejs22.x",
});

export const runJavascript = new sst.aws.Function("RunJavascript", {
  handler: "apps/functions/javascript/index.handler",
  memory: "256 MB",
  runtime: "nodejs22.x",
});

export const api = new sst.aws.Function("Api", {
  handler: "apps/api/src/index.handler",
  memory: "256 MB",
  runtime: "nodejs22.x",
  url: { cors: false },
  link: [apiKeysTable, usageTable, runTypescript, runJavascript],
  permissions: [
    {
      actions: ["lambda:InvokeFunction"],
      resources: [runTypescript.arn, runJavascript.arn],
    },
  ],
  environment: {
    TYPESCRIPT_ARN: runTypescript.arn,
    JAVASCRIPT_ARN: runJavascript.arn,
  },
});

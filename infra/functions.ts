import { apiKeysTable, usageTable } from "./dynamodb";
import { exec0Router } from "./router";

export const runTypescript = new sst.aws.Function("RunTypescript", {
  handler: "apps/functions/typescript/index.handler",
  memory: "256 MB",
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

export const runJavascript = new sst.aws.Function("RunJavascript", {
  handler: "apps/functions/javascript/index.handler",
  memory: "256 MB",
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

export const runGo = new sst.aws.Function("RunGo", {
  handler: "apps/functions/go",
  memory: "256 MB",
  runtime: "go",
  architecture: "arm64",
  logging: false,
});

export const api = new sst.aws.Function("Api", {
  handler: "apps/api/src/index.handler",
  memory: "256 MB",
  runtime: "nodejs22.x",
  architecture: "arm64",
  url: {
    router: {
      instance: exec0Router,
      path: "/api",
    },
  },
  link: [
    apiKeysTable,
    usageTable,
    runTypescript,
    runJavascript,
    runGo,
    exec0Router,
  ],
  permissions: [
    {
      actions: ["lambda:InvokeFunction"],
      resources: [runTypescript.arn, runJavascript.arn, runGo.arn],
    },
  ],
  environment: {
    TYPESCRIPT_ARN: runTypescript.arn,
    JAVASCRIPT_ARN: runJavascript.arn,
    GO_ARN: runGo.arn,
    REDIS_URL: process.env.REDIS_URL as string,
  },
});

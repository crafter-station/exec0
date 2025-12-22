export const runTypescript = new sst.aws.Function("RunTypescript", {
  handler: "apps/functions/typescript/index.handler",
  memory: "256 MB",
});

export const runJavascript = new sst.aws.Function("RunJavascript", {
  handler: "apps/functions/javascript/index.handler",
  memory: "256 MB",
});

export const api = new sst.aws.Function("Api", {
  handler: "apps/api/src/index.handler",
  memory: "256 MB",
  url: { cors: false },
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

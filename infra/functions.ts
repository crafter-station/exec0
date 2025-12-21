export const runTypescript = new sst.aws.Function("RunTypescript", {
  handler: "apps/functions/typescript/index.handler",
});

export const runJavascript = new sst.aws.Function("RunJavascript", {
  handler: "apps/functions/javascript/index.handler",
});

export const api = new sst.aws.Function("Api", {
  handler: "apps/api-v2/src/index.handler",
  url: true,
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

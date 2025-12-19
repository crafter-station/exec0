/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "exec0",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Function("RunTypescript", {
      handler: "apps/functions/typescript/index.handler",
      memory: "128 MB",
      url: true,
    });
  },
});

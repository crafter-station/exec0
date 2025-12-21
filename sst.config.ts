/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "exec0",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: { "@pulumiverse/vercel": "3.15.1" },
    };
  },
  async run() {
    await import("./infra/functions");
  },
});

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
    const { api } = await import("./infra/functions");
    const { apiKeysTable, usageTable } = await import("./infra/dynamodb");

    return {
      apiUrl: api.url,
      apiKeysTableName: apiKeysTable.name,
      usageTableName: usageTable.name,
    };
  },
});

import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "https://api.uprizing.me/v1/openapi.json",
    output: {
      target: "./packages/exec0-sdk/index.ts",
      client: "fetch",
      prettier: true,
      clean: true,
    },
    operations: {
      postApiV1ExecutePython: {
        transformer: "transformers/executePython.ts",
        mutator: "mutators/executePython.ts",
      },
      postApiV1ExecuteJavascript: {
        transformer: "transformers/executeJavascript.ts",
        mutator: "mutators/executeJavascript.ts",
      },
      postApiV1ExecuteTypescript: {
        transformer: "transformers/executeTypescript.ts",
        mutator: "mutators/executeTypescript.ts",
      },
    },
  },
});

import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "https://api.uprizing.me/v1/openapi.json",
    output: {
      target: "./packages/exec0-sdk/index.ts",
      client: "fetch",
      biome: true,
      clean: true,
      docs: true,
    },
  },
});

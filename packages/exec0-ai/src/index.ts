import { run } from "@exec0/run";
import { tool } from "ai";
import { z } from "zod";

export const exec0Tools = {
  runPython: tool({
    description:
      "Execute Python code and return the output. Use only Python standard library",
    inputSchema: z.object({
      code: z.string().min(1).describe("Python code to execute"),
    }),
    execute: async ({ code }) => {
      try {
        const result = await run.python(code);
        return {
          success: result.data.success,
          output: result.data.output,
          error: result.data.error,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  }),

  runJavaScript: tool({
    description:
      "Execute JavaScript code and return the output. Use only JavaScript standard library",
    inputSchema: z.object({
      code: z.string().min(1).describe("JavaScript code to execute"),
    }),
    execute: async ({ code }) => {
      try {
        const result = await run.javascript(code);
        return {
          success: result.data.success,
          output: result.data.output,
          error: result.data.error,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  }),

  runTypeScript: tool({
    description:
      "Execute TypeScript code and return the output. Use only TypeScript standard library",
    inputSchema: z.object({
      code: z.string().min(1).describe("TypeScript code to execute"),
    }),
    execute: async ({ code }) => {
      try {
        const result = await run.typescript(code);
        return {
          success: result.data.success,
          output: result.data.output,
          error: result.data.error,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
  }),
};

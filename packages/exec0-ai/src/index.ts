import {
  executeJavaScript,
  executePython,
  executeTypeScript,
} from "@exec0/sdk";
import { tool } from "ai";
import { z } from "zod";

const DEFAULT_TIMEOUT = 20000;

export const exec0Tools = {
  executePython: tool({
    description:
      "Execute Python code and return the output. Use only Python standard library",
    inputSchema: z.object({
      code: z.string().min(1).describe("Python code to execute"),
    }),
    execute: async ({ code }) => {
      try {
        const result = await executePython({
          code,
          timeout: DEFAULT_TIMEOUT,
        });
        return {
          success: true,
          output: result.data.output,
          executionTime: result.data.executionTime,
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

  executeJavaScript: tool({
    description:
      "Execute JavaScript code and return the output. Use only JavaScript standard library",
    inputSchema: z.object({
      code: z.string().min(1).describe("JavaScript code to execute"),
    }),
    execute: async ({ code }) => {
      try {
        const result = await executeJavaScript({
          code,
          timeout: DEFAULT_TIMEOUT,
        });
        return {
          success: true,
          output: result.data.output,
          executionTime: result.data.executionTime,
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

  executeTypeScript: tool({
    description:
      "Execute TypeScript code and return the output. Use only TypeScript standard library",
    inputSchema: z.object({
      code: z.string().min(1).describe("TypeScript code to execute"),
    }),
    execute: async ({ code }) => {
      try {
        const result = await executeTypeScript({
          code,
          timeout: DEFAULT_TIMEOUT,
        });
        return {
          success: true,
          output: result.data.output,
          executionTime: result.data.executionTime,
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

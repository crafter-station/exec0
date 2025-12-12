import { getSandbox } from "@cloudflare/sandbox";
import type { Context } from "hono";
import { getOutput } from "@/lib";

export const createExecuteHandler = (
  language: "python" | "javascript" | "typescript",
) => {
  return async (c: Context) => {
    const startTime = Date.now();
    const body = (await c.req.json()) as { code: string };
    const env = c.env as { Sandbox: string };

    try {
      const sandbox = getSandbox(env.Sandbox, "default");
      const ctx = await sandbox.createCodeContext({ language });
      const result = await sandbox.runCode(body.code, { context: ctx });

      return c.json({
        output: getOutput(result),
        error: result.error?.toString(),
        executionTime: Date.now() - startTime,
      });
    } catch (err) {
      return c.json(
        {
          output: "",
          error: err instanceof Error ? err.message : "Unknown error",
          executionTime: Date.now() - startTime,
        },
        500,
      );
    }
  };
};

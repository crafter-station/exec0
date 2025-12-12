/** biome-ignore-all lint/suspicious/noExplicitAny: <Fix before please xo> */
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

      const hasError = result.error !== null && result.error !== undefined;

      let errorMessage = null;
      if (hasError) {
        const err = result.error;
        errorMessage =
          typeof err === "string"
            ? err
            : (err as any).message ||
              (err as any).traceback ||
              JSON.stringify(err);
      }

      return c.json(
        {
          output: getOutput(result),
          error: errorMessage,
          executionTime: Date.now() - startTime,
        },
        hasError ? 400 : 200,
      );
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

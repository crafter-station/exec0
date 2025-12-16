import { getSandbox } from "@cloudflare/sandbox";
import type { Language, ExecuteCodeOptions } from "@/types";
import type { ExecutionResult } from "@cloudflare/sandbox";

// Execute code in a sandbox and return the output
async function executeCode(
  options: ExecuteCodeOptions,
  sandboxBinding: string,
) {
  const { language, code } = options;

  try {
    // Get or create a sandbox instance
    const sandbox = getSandbox(sandboxBinding, "default");

    // Create a code context for the specified language
    const ctx = await sandbox.createCodeContext({
      language,
    });

    // Run the code in the context
    const result = await sandbox.runCode(code, {
      context: ctx,
    });

    // Clean up the context after execution
    await sandbox.deleteCodeContext(ctx.id);

    // Extract output from results or logs
    let output: ExecutionResult["results"][number] | undefined;

    // If there are expression results, use the first one
    if (result.results?.length) {
      output = result.results[0];
    } else if (result.logs?.stdout?.length) {
      // Otherwise, use stdout from logs
      output = { text: result.logs.stdout.join("\n") };
    }

    return {
      success: true,
      output: output || null,
      error: result.error || null,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// Public API to run code with language, code, and sandbox binding
export async function runCode(
  language: Language,
  code: string,
  sandboxBinding: string,
) {
  return executeCode({ language, code }, sandboxBinding);
}

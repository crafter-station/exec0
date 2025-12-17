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

const JS_POLYFILLS = `
const _nf = require('node-fetch');
const fetch = globalThis.fetch || _nf;
const Headers = globalThis.Headers || _nf.Headers;
const Request = globalThis.Request || _nf.Request;
const Response = globalThis.Response || _nf.Response;
const URL = globalThis.URL || require('url').URL;
const URLSearchParams = globalThis.URLSearchParams || require('url').URLSearchParams;
const TextEncoder = globalThis.TextEncoder || require('util').TextEncoder;
const TextDecoder = globalThis.TextDecoder || require('util').TextDecoder;
const Buffer = globalThis.Buffer || require('buffer').Buffer;
const btoa = globalThis.btoa || ((s) => Buffer.from(s, 'binary').toString('base64'));
const atob = globalThis.atob || ((s) => Buffer.from(s, 'base64').toString('binary'));
const crypto = globalThis.crypto || require('crypto');
const AbortController = globalThis.AbortController || require('abort-controller').AbortController;
const AbortSignal = globalThis.AbortSignal || require('abort-controller').AbortSignal;
const FormData = globalThis.FormData || require('form-data');
const setTimeout = globalThis.setTimeout;
const setInterval = globalThis.setInterval;
const clearTimeout = globalThis.clearTimeout;
const clearInterval = globalThis.clearInterval;
`;

export async function runCode(
  language: Language,
  code: string,
  sandboxBinding: string,
) {
  const wrappedCode =
    language === "javascript" || language === "typescript"
      ? `${JS_POLYFILLS}${code}`
      : code;
  return executeCode({ language, code: wrappedCode }, sandboxBinding);
}

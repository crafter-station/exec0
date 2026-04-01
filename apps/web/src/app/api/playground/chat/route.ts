import { gateway } from "@ai-sdk/gateway";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import {
  getClientIdentifier,
  rateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { z } from "zod/v4";

const API_URL = process.env.API_URL_DEV || "https://exec0.run/api";
const PLAYGROUND_API_KEY = process.env.PLAYGROUND_API_KEY || "";

const systemPrompt = `You are an AI coding assistant powered by exec0 — a fast, secure code execution engine.

Your job is to solve problems by writing and executing code step by step.

Rules:
- Break complex problems into small, executable steps
- Use the execute_code tool for each step
- Always console.log() or print results so you can see the output
- Use results from previous steps to inform next steps
- Default to TypeScript. Support JavaScript and Go when asked
- Be concise between tool calls — explain what you're doing in 1-2 sentences
- If code fails, read the error, fix it, and retry
- Never fabricate output — always execute code to get real results
- IMPORTANT: Write clean, well-formatted, multi-line code with proper indentation. Never put all code on a single line. Use real newlines, not escaped \\n characters.`;

export async function POST(req: Request) {
  const clientId = getClientIdentifier(req);
  const { success, reset, limit, remaining } = await rateLimit(
    clientId,
    "playground",
  );
  if (!success) {
    return rateLimitResponse(reset, limit, remaining);
  }

  try {
    const { messages } = (await req.json()) as { messages: UIMessage[] };
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: gateway("gpt-4o-mini"),
      system: systemPrompt,
      messages: modelMessages,
      tools: {
        execute_code: tool({
          description:
            "Execute code in a secure sandbox. Use this to run TypeScript, JavaScript, or Go code. Always console.log() results.",
          inputSchema: z.object({
            language: z
              .enum(["typescript", "javascript", "go"])
              .describe("Programming language to execute"),
            code: z.string().describe("Code to execute"),
          }),
          execute: async ({ language, code }) => {
            // Warm up the API if cold — first call may take longer
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 30_000);

            let res: Response;
            try {
              res = await fetch(`${API_URL}/v1/execute`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${PLAYGROUND_API_KEY}`,
                },
                body: JSON.stringify({
                  language,
                  code,
                  resources: "lite",
                }),
                signal: controller.signal,
              });
            } catch (err) {
              clearTimeout(timeout);
              return {
                success: false,
                stdout: "",
                stderr: "Execution timed out. The server may be warming up — please try again.",
                exitCode: 1,
                executionTime: 0,
                language,
              };
            }
            clearTimeout(timeout);

            if (!res.ok) {
              const text = await res.text();
              const isTimeout = res.status === 504;
              return {
                success: false,
                stdout: "",
                stderr: isTimeout
                  ? "Server is warming up — please try again in a few seconds."
                  : `API error (${res.status}): ${text}`,
                exitCode: 1,
                executionTime: 0,
                language,
              };
            }

            const data = await res.json();
            const result = data.result || data;
            return {
              success: result.exitCode === 0,
              stdout: result.stdout || "",
              stderr: result.stderr || "",
              exitCode: result.exitCode ?? 0,
              executionTime: data.executionTime ?? 0,
              language,
            };
          },
        }),
      },
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Playground chat error:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

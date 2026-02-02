import { z } from "zod";

export const runRequestSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

export const languageSchema = z.enum(["javascript", "typescript", "go"]);
export const resourcesSchema = z.enum([
  "lite",
  "basic",
  "medium",
  "large",
  "max",
]);

export const executeRequestSchema = z.object({
  language: languageSchema,
  code: z.string().min(1, "Code is required").meta({
    example: "console.log(1+1)",
  }),
  resources: resourcesSchema.optional().default("lite"),
});

export const executionResultSchema = z.object({
  id: z.string(),
  status: z.enum(["completed", "error", "timeout"]),
  result: z.object({
    stdout: z.string(),
    stderr: z.string(),
    exitCode: z.number(),
    compilationOutput: z.string(),
  }),
  executionTime: z.number(),
  resources: resourcesSchema,
  createdAt: z.string(),
  language: languageSchema,
});

export type Language = z.infer<typeof languageSchema>;
export type Resources = z.infer<typeof resourcesSchema>;
export type ExecuteRequest = z.infer<typeof executeRequestSchema>;
export type ExecutionResult = z.infer<typeof executionResultSchema>;

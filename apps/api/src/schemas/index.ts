import { z } from "zod";

export const executeRequestSchema = z.object({
  code: z.string().min(1, "Code cannot be empty"),
  timeout: z.number().int().positive().optional().default(5000),
});

export const executeResponseSchema = z.object({
  output: z.string(),
  error: z.string().optional(),
  executionTime: z.number(),
});

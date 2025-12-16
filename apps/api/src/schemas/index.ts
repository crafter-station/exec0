import z from "zod";

export const runRequestSchema = z.object({
  code: z
    .string()
    .min(1, "Code cannot be empty")
    .describe("The code snippet to be executed"),
});

export const outputSchema = z.object({
  text: z.string().optional(),
  html: z.string().optional(),
  png: z.string().optional(),
  jpeg: z.string().optional(),
  svg: z.string().optional(),
  latex: z.string().optional(),
  markdown: z.string().optional(),
  json: z.any().optional(),
  chart: z.any().optional(),
  data: z.any().optional(),
});

export const runResponseSchema = z.object({
  success: z.boolean(),
  output: outputSchema.optional(),
  error: z.string().nullable().optional(),
});

export const errorResponseSchema = z.object({
  success: z.boolean(),
  error: z.string(),
});

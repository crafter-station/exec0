import { z } from "zod";

export const runRequestSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

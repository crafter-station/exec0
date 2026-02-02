import { z } from "zod";

// Auth-related schemas can be added here in the future
// Currently the auth logic is simple and doesn't require complex schemas

export const apiKeyCreateSchema = z.object({
  name: z.string().optional(),
});

export type ApiKeyCreateRequest = z.infer<typeof apiKeyCreateSchema>;

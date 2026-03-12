import { z } from "zod";

export const createKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  scopes: z.array(z.string()).default(["read"]),
  expiresAt: z.string().datetime().optional(),
});

export const revokeKeySchema = z.object({
  keyId: z.string().min(1, "Key ID is required"),
});

export const toggleKeySchema = z.object({
  keyId: z.string().min(1, "Key ID is required"),
});

export const rotateKeySchema = z.object({
  keyId: z.string().min(1, "Key ID is required"),
  name: z.string().optional(),
  scopes: z.array(z.string()).optional(),
});

export type CreateKeyRequest = z.infer<typeof createKeySchema>;
export type RevokeKeyRequest = z.infer<typeof revokeKeySchema>;
export type ToggleKeyRequest = z.infer<typeof toggleKeySchema>;
export type RotateKeyRequest = z.infer<typeof rotateKeySchema>;

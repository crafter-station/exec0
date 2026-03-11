import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { authMiddleware } from "../../core/middleware";
import {
  createKeySchema,
  revokeKeySchema,
  rotateKeySchema,
  toggleKeySchema,
} from "./schemas";
import keys from "./service";

const app = new Hono();

// All key management endpoints require a valid API key
app.use(authMiddleware);

// POST /keys — Create a new API key for the authenticated owner
app.post(
  "/",
  describeRoute({
    operationId: "createApiKey",
    description: "Create a new API key for the authenticated owner",
    security: [{ ApiKeyAuth: [] }],
  }),
  zValidator("json", createKeySchema),
  async (c) => {
    try {
      const apiKey = c.get("apiKey" as never) as {
        id: string;
        metadata: { ownerId: string };
      };

      const { name, description, scopes, expiresAt } = c.req.valid("json");

      const { key, record } = await keys.create({
        ownerId: apiKey.metadata.ownerId,
        name,
        scopes,
        ...(description && { description }),
        ...(expiresAt && { expiresAt }),
      });

      return c.json({
        key,
        keyId: record.id,
        name,
        scopes,
        expiresAt: expiresAt ?? null,
        createdAt: record.metadata.createdAt,
      });
    } catch (err) {
      console.error("POST /keys error:", err);
      return c.json(
        { error: err instanceof Error ? err.message : "Internal server error" },
        500,
      );
    }
  },
);

// GET /keys — List all API keys for the authenticated owner
app.get(
  "/",
  describeRoute({
    operationId: "listApiKeys",
    description: "List all API keys for the authenticated owner",
    security: [{ ApiKeyAuth: [] }],
  }),
  async (c) => {
    try {
      const apiKey = c.get("apiKey" as never) as {
        id: string;
        metadata: { ownerId: string };
      };

      const keysList = await keys.list(apiKey.metadata.ownerId);

      const data = keysList.map((record) => ({
        id: record.id,
        name: record.metadata.name,
        description: record.metadata.description,
        scopes: record.metadata.scopes || [],
        createdAt: record.metadata.createdAt,
        lastUsedAt: record.metadata.lastUsedAt,
        expiresAt: record.metadata.expiresAt,
        enabled: record.metadata.enabled !== false,
        revokedAt: record.metadata.revokedAt,
      }));

      return c.json({ total: data.length, data });
    } catch (err) {
      console.error("GET /keys error:", err);
      return c.json(
        { error: err instanceof Error ? err.message : "Internal server error" },
        500,
      );
    }
  },
);

// POST /keys/revoke — Revoke an API key
app.post(
  "/revoke",
  describeRoute({
    operationId: "revokeApiKey",
    description: "Revoke an API key by ID",
    security: [{ ApiKeyAuth: [] }],
  }),
  zValidator("json", revokeKeySchema),
  async (c) => {
    try {
      const { keyId } = c.req.valid("json");
      await keys.revoke(keyId);
      return c.json({ success: true });
    } catch (err) {
      console.error("POST /keys/revoke error:", err);
      return c.json(
        { error: err instanceof Error ? err.message : "Internal server error" },
        500,
      );
    }
  },
);

// POST /keys/enable — Enable a disabled API key
app.post(
  "/enable",
  describeRoute({
    operationId: "enableApiKey",
    description: "Enable a disabled API key",
    security: [{ ApiKeyAuth: [] }],
  }),
  zValidator("json", toggleKeySchema),
  async (c) => {
    try {
      const { keyId } = c.req.valid("json");
      await keys.enable(keyId);
      return c.json({ success: true });
    } catch (err) {
      console.error("POST /keys/enable error:", err);
      return c.json(
        { error: err instanceof Error ? err.message : "Internal server error" },
        500,
      );
    }
  },
);

// POST /keys/disable — Disable an API key
app.post(
  "/disable",
  describeRoute({
    operationId: "disableApiKey",
    description: "Disable an active API key",
    security: [{ ApiKeyAuth: [] }],
  }),
  zValidator("json", toggleKeySchema),
  async (c) => {
    try {
      const { keyId } = c.req.valid("json");
      await keys.disable(keyId);
      return c.json({ success: true });
    } catch (err) {
      console.error("POST /keys/disable error:", err);
      return c.json(
        { error: err instanceof Error ? err.message : "Internal server error" },
        500,
      );
    }
  },
);

// POST /keys/rotate — Rotate an API key (generates new key, invalidates old)
app.post(
  "/rotate",
  describeRoute({
    operationId: "rotateApiKey",
    description: "Rotate an API key, generating a new key value",
    security: [{ ApiKeyAuth: [] }],
  }),
  zValidator("json", rotateKeySchema),
  async (c) => {
    try {
      const { keyId, name, scopes } = c.req.valid("json");
      const updates = { ...(name && { name }), ...(scopes && { scopes }) };

      const { key } = await keys.rotate(
        keyId,
        Object.keys(updates).length > 0 ? updates : undefined,
      );

      return c.json({ success: true, key });
    } catch (err) {
      console.error("POST /keys/rotate error:", err);
      return c.json(
        { error: err instanceof Error ? err.message : "Internal server error" },
        500,
      );
    }
  },
);

export { app as keysRouter };

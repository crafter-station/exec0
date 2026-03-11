import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
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
  async (c) => {
    const apiKey = c.get("apiKey" as never) as {
      id: string;
      metadata: { ownerId: string };
    };

    const body = await c.req.json();
    const parsed = createKeySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message }, 400);
    }

    const { name, description, scopes, expiresAt } = parsed.data;

    const { key, record } = await keys.create({
      ownerId: apiKey.metadata.ownerId,
      name,
      description,
      scopes,
      expiresAt: expiresAt ?? null,
    });

    return c.json({
      key,
      keyId: record.id,
      name,
      scopes,
      expiresAt: expiresAt ?? null,
      createdAt: record.metadata.createdAt,
    });
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
  async (c) => {
    const body = await c.req.json();
    const parsed = revokeKeySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message }, 400);
    }

    await keys.revoke(parsed.data.keyId, {
      metadata: { via: "api" },
    });

    return c.json({ success: true });
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
  async (c) => {
    const body = await c.req.json();
    const parsed = toggleKeySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message }, 400);
    }

    await keys.enable(parsed.data.keyId);

    return c.json({ success: true });
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
  async (c) => {
    const body = await c.req.json();
    const parsed = toggleKeySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message }, 400);
    }

    await keys.disable(parsed.data.keyId);

    return c.json({ success: true });
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
  async (c) => {
    const body = await c.req.json();
    const parsed = rotateKeySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message }, 400);
    }

    const { keyId, name, scopes } = parsed.data;
    const updates = { ...(name && { name }), ...(scopes && { scopes }) };

    const { key } = await keys.rotate(
      keyId,
      Object.keys(updates).length > 0 ? updates : undefined,
    );

    return c.json({ success: true, key });
  },
);

export { app as keysRouter };

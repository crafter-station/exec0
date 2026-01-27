import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { Resource } from "sst";
import { createKeysInstance, createStorage } from "@exec0/keys";

const storage = createStorage(Resource.ApiKeys.name);
const keys = createKeysInstance(storage);

const app = new Hono();

app.post(
  "/",
  describeRoute({
    operationId: "createApiKey",
    description: "Create a test API key with 7 days expiration",
  }),
  async (c) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { key, record } = await keys.create({
      ownerId: "test_user",
      name: "Test Key",
      scopes: ["read", "write"],
      expiresAt: expiresAt.toISOString(),
    });

    return c.json({
      key,
      keyId: record.id,
      expiresAt: expiresAt.toISOString(),
    });
  },
);

export { app as keysRouter };

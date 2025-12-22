import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { openAPIRouteHandler } from "hono-openapi";
import { routes } from "@/routes";
import keys from "@exec0/keys";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Welcome to Exec0!!");
});

// Create API key endpoint
app.post("/api/keys", async (c) => {
  // Only admins can create keys
  // if (!keys.hasScope(record, "admin")) {
  //   return c.json({ error: "Admin permission required" }, 403);
  // }

  try {
    const body = await c.req.json();

    const { key, record: newRecord } = await keys.create(
      {
        ownerId: body.ownerId,
        name: body.name,
        scopes: body.scopes,
        expiresAt: body.expiresAt,
      },
      {
        userId: "uprizing_01",
        ip: c.req.header("x-forwarded-for"),
        metadata: { action: "api_create" },
      },
    );

    return c.json({
      success: true,
      key, // Only returned once!
      keyId: newRecord.id,
    });
  } catch (error) {
    console.error("Failed to create key:", error);
    return c.json({ error: "Failed to create key" }, 500);
  }
});

app.route("/v1", routes);

app.get(
  "/v1/openapi.json",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: "Code Execution API",
        version: "0.1.0",
        description:
          "API for executing code snippets in various programming languages.",
      },
      servers: [{ url: "http://localhost:8787", description: "Local Server" }],
    },
  }),
);

app.get(
  "/scalar",
  Scalar({
    url: "v1/openapi.json",
    showDeveloperTools: "never",
    theme: "deepSpace",
  }),
);

export const handler = handle(app);

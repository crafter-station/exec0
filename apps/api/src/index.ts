import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import executeRoutes from "@/routes";

export { Sandbox } from "@cloudflare/sandbox";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Welcome to Exec0");
});

app.route("/api/v1/execute", executeRoutes);

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
      servers: [
        { url: "https://api.uprizing.me", description: "Production Server" },
        { url: "http://localhost:8787", description: "Local Server" },
      ],
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

export default app;

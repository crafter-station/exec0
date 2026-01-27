import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { logger } from "hono/logger";
import { openAPIRouteHandler } from "hono-openapi";
import { routes } from "@/routes";
import { Resource } from "sst";

const app = new Hono().basePath("/api");

app.use(logger());

app.get("/", (c) => {
  return c.text("Welcome to Exec0!!");
});

// Create API key endpoint
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
      servers: [
        {
          url: "https://exec0.run",
          description: "Production Server Preview",
        },
        {
          url: Resource.Exec0Router.url,
          description: "Public URL",
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
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

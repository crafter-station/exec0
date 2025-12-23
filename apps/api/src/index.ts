import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { openAPIRouteHandler } from "hono-openapi";
import { routes } from "@/routes";

const app = new Hono();

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
          url: "https://76apw4cpbbs7xbkln26gv7q7xm0ryfcb.lambda-url.us-east-1.on.aws/",
          description: "Local Server",
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

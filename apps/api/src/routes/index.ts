import { Hono } from "hono";
import { keysRouter } from "./keys";
import { runRouter } from "./run";

const app = new Hono();
app.route("/keys", keysRouter);
app.route("/run", runRouter);

export { app as routes };

import { Hono } from "hono";
import { runRouter } from "./run";

const app = new Hono();

app.route("/run", runRouter)

export { app as routes}

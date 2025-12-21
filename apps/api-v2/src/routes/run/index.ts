import { Hono } from "hono";
import { runJavascriptRouter } from "./javascript";
import { runTypescriptRouter } from "./typescript";

const app = new Hono();

app.route("/typescript", runTypescriptRouter);
app.route("/javascript", runJavascriptRouter);

export { app as runRouter };

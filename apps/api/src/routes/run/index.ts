import { Hono } from "hono";
import { authMiddleware } from "@/middleware";
import { runJavascriptRouter } from "./javascript";
import { runTypescriptRouter } from "./typescript";

const app = new Hono();

app.use(authMiddleware);

app.route("/typescript", runTypescriptRouter);
app.route("/javascript", runJavascriptRouter);

export { app as runRouter };

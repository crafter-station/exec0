import { Hono } from "hono";
import { authMiddleware } from "@/middleware";
import { runJavascriptRouter } from "./javascript";
import { runTypescriptRouter } from "./typescript";
import { runGoRouter } from "./go";

const app = new Hono();

app.use(authMiddleware);

app.route("/go", runGoRouter);
app.route("/javascript", runJavascriptRouter);
app.route("/typescript", runTypescriptRouter);

export { app as runRouter };

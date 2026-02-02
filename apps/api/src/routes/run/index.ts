import { Hono } from "hono";
import { authMiddleware } from "@/middleware";
import { runGoRouter } from "./go";
import { runJavascriptRouter } from "./javascript";
import { runTypescriptRouter } from "./typescript";

const app = new Hono();

app.use(authMiddleware);

app.route("/go", runGoRouter);
app.route("/javascript", runJavascriptRouter);
app.route("/typescript", runTypescriptRouter);

export { app as runRouter };

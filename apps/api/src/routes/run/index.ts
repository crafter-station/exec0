import { Hono } from "hono";
import {  runPythonRouter } from "./python";
import { runJavascriptRouter } from "./javascript";
import { runTypescriptRouter } from "./typescript";

const app = new Hono();

app.route("/python", runPythonRouter)
app.route("/javascript", runJavascriptRouter)
app.route("/typescript", runTypescriptRouter)

export { app as runRouter}

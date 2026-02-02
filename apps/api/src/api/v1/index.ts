import { Hono } from "hono";
import authRouter from "./auth";
import executionRouter from "./execution";

// import legacyRouter from "./legacy"; // Commented out as per current setup

const v1Router = new Hono();

// Mount feature routes
v1Router.route("/execute", executionRouter);
v1Router.route("/keys", authRouter);

// Mount legacy routes (commented out as per current setup)
// v1Router.route("/run", legacyRouter);

export default v1Router;

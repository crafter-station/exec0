import { Hono } from "hono";
import authRouter from "./auth";
import executionRouter from "./execution";
import usageRouter from "./usage";

const router = new Hono();

// Mount routes
router.route("/execute", executionRouter);
router.route("/keys", authRouter);
router.route("/usage", usageRouter);

export default router;

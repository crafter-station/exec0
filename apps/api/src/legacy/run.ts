// Legacy run routes - disabled in new architecture
import { Hono } from "hono";

const app = new Hono();

// Legacy routes have been moved to features/execution/legacy/
// This router is kept for compatibility but routes are disabled

export { app as runRouter };

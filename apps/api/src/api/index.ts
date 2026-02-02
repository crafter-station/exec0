import { Hono } from "hono";
import v1Router from "./v1";

const apiRouter = new Hono();

// Mount v1 routes
apiRouter.route("/v1", v1Router);

export default apiRouter;

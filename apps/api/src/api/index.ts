import { Hono } from "hono";
import router from "./v1";

const apiRouter = new Hono();

// Mount routes
apiRouter.route("/v1", router);

export default apiRouter;

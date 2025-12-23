import keys, { ApiKeyErrorCode } from "@exec0/keys";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(async (c, next) => {
  const result = await keys.verify(c.req.raw.headers);

  if (!result.valid) {
    const statusCode =
      result.errorCode === ApiKeyErrorCode.DISABLED ? 403 : 401;
    return c.json({ error: result.error }, statusCode);
  }

  c.set("apiKey", result.record);
  await next();
});

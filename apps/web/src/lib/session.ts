import { auth } from "@exec0/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getCachedSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

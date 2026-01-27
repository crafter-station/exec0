import { createKeys as createKeysLib } from "keypal";
import type { Storage } from "keypal";
import { createStorage } from "./storage";

export { ApiKeyErrorCode } from "keypal";

export function createKeysInstance(storage: Storage) {
  return createKeysLib({
    prefix: "ex0_",
    length: 32,
    algorithm: "sha256",
    salt: process.env.API_KEY_SALT,
    storage,
    autoTrackUsage: true,
    auditLogs: true,
    auditContext: {
      metadata: { service: "api-keys" },
    },
    headerNames: ["x-api-key", "authorization"],
    extractBearer: true,
  });
}

export { createStorage };
// export * from "./utils";

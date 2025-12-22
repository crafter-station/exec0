import { createKeys } from "keypal";
import customStorage from "./storage";

const keys = createKeys({
  // Key generation
  prefix: "ex0_",
  length: 32,

  // Security
  algorithm: "sha256",
  salt: process.env.API_KEY_SALT,

  // Storage
  storage: customStorage,

  // Caching
  // cache: true,
  // cacheTtl: 60,

  // Usage tracking
  autoTrackUsage: true,

  // Audit logging
  auditLogs: true,
  auditContext: {
    metadata: { service: "api-keys" },
  },

  // Header detection
  headerNames: ["x-api-key", "authorization"],
  extractBearer: true,
});

export default keys;
export { default as keys } from "./index";
export * from "./utils";
export * from "./storage";

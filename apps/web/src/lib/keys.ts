import {
  ApiKeyErrorCode,
  createKeysInstance,
  createStorage,
} from "@exec0/keys";

const apiKeysTable = process.env.API_KEYS_TABLE;

if (!apiKeysTable) {
  throw new Error("Missing required environment variable: API_KEYS_TABLE");
}

const storage = createStorage(apiKeysTable);
const keys = createKeysInstance(storage);

export { ApiKeyErrorCode };
export default keys;

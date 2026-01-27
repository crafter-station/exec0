import {
  ApiKeyErrorCode,
  createKeysInstance,
  createStorage,
} from "@exec0/keys";
import { Resource } from "sst";

const storage = createStorage(Resource.ApiKeys.name);
const keys = createKeysInstance(storage);

export default keys;
export { ApiKeyErrorCode };

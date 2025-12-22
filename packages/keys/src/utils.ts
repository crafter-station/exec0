import { ApiKeyErrorCode } from "keypal";
import keys from "./index";

export async function verifyApiKey(headers: Headers) {
  const result = await keys.verify(headers);

  if (!result.valid) {
    return {
      valid: false,
      error: result.error,
      errorCode: result.errorCode,
      statusCode: result.errorCode === ApiKeyErrorCode.DISABLED ? 403 : 401,
    };
  }

  return {
    valid: true,
    record: result.record,
    ownerId: result.record.metadata.ownerId,
  };
}

export async function createApiKey(ownerId: string, scopes: string[]) {
  const { key, record } = await keys.create({
    ownerId,
    scopes,
  });

  return { key, keyId: record.id };
}

export async function revokeApiKey(keyId: string, userId: string) {
  await keys.revoke(keyId, {
    userId,
    metadata: { via: "api" },
  });
}

export { keys };

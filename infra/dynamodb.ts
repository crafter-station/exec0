export const apiKeysTable = new sst.aws.Dynamo("ApiKeys", {
  fields: {
    id: "string",
    keyHash: "string",
    ownerId: "string",
  },
  primaryIndex: {
    hashKey: "id",
  },
  globalIndexes: {
    KeyHashIndex: {
      hashKey: "keyHash",
    },
    OwnerIdIndex: {
      hashKey: "ownerId",
    },
  },
});

export const usageTable = new sst.aws.Dynamo("Usage", {
  fields: {
    ownerId: "string",
    timestamp: "number",
    keyId: "string",
  },
  primaryIndex: {
    hashKey: "ownerId",
    rangeKey: "timestamp",
  },
  globalIndexes: {
    KeyIdIndex: {
      hashKey: "keyId",
      rangeKey: "timestamp",
    },
  },
  ttl: "ttl",
});

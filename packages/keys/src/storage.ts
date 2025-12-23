import { DynamoDBTable } from "@exec0/db";
import type { ApiKeyRecord, Storage } from "keypal";
import { Resource } from "sst";

const apiKeysTable = new DynamoDBTable(Resource.ApiKeys.name);

const customStorage: Storage = {
  save: async (record) => {
    await apiKeysTable.create(record);
  },

  findByHash: async (keyHash) => {
    const items = await apiKeysTable.query(
      "keyHash = :keyHash",
      { ":keyHash": keyHash },
      "KeyHashIndex",
    );
    return (items[0] || null) as ApiKeyRecord | null;
  },

  findById: async (id) => {
    const item = await apiKeysTable.read({ id });
    return item as ApiKeyRecord | null;
  },

  findByOwner: async (ownerId) => {
    const items = await apiKeysTable.query(
      "ownerId = :ownerId",
      { ":ownerId": ownerId },
      "OwnerIdIndex",
    );
    return items as ApiKeyRecord[];
  },

  findByTag: async (tag, ownerId) => {
    const items = await apiKeysTable.query(
      "ownerId = :ownerId",
      { ":ownerId": ownerId },
      "OwnerIdIndex",
    );
    return items.filter((item) => item.tags?.includes(tag)) as ApiKeyRecord[];
  },

  findByTags: async (tags, ownerId) => {
    const items = await apiKeysTable.query(
      "ownerId = :ownerId",
      { ":ownerId": ownerId },
      "OwnerIdIndex",
    );
    return items.filter((item) =>
      tags.some((tag) => item.tags?.includes(tag)),
    ) as ApiKeyRecord[];
  },

  updateMetadata: async (id, metadata) => {
    await apiKeysTable.update({ id }, "SET metadata = :metadata", {
      ":metadata": metadata,
    });
  },

  delete: async (id) => {
    await apiKeysTable.delete({ id });
  },

  deleteByOwner: async (ownerId) => {
    const items = await customStorage.findByOwner(ownerId);
    for (const item of items) {
      await apiKeysTable.delete({ id: item.id });
    }
  },
};

export default customStorage;

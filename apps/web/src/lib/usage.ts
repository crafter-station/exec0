import {
  aggregateByDay,
  aggregateByLanguage,
  aggregateByResource,
  getTimePeriod,
  getUsageByOwner,
} from "@exec0/usage";

const envUsageTable = process.env.USAGE_TABLE;

if (!envUsageTable) {
  throw new Error("Missing required environment variable: USAGE_TABLE");
}

const usageTable: string = envUsageTable;

export {
  aggregateByDay,
  aggregateByLanguage,
  aggregateByResource,
  getTimePeriod,
  getUsageByOwner,
  usageTable,
};

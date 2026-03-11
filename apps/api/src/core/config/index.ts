import type { Language, Resources } from "@exec0/schemas";
import { z } from "zod";

const envSchema = z.object({
  // JavaScript ARNs
  JAVASCRIPT_LITE_ARN: z.string().min(1, "JAVASCRIPT_LITE_ARN is required"),
  JAVASCRIPT_BASIC_ARN: z.string().min(1, "JAVASCRIPT_BASIC_ARN is required"),
  JAVASCRIPT_MEDIUM_ARN: z.string().min(1, "JAVASCRIPT_MEDIUM_ARN is required"),
  JAVASCRIPT_LARGE_ARN: z.string().min(1, "JAVASCRIPT_LARGE_ARN is required"),
  JAVASCRIPT_MAX_ARN: z.string().min(1, "JAVASCRIPT_MAX_ARN is required"),

  // TypeScript ARNs
  TYPESCRIPT_LITE_ARN: z.string().min(1, "TYPESCRIPT_LITE_ARN is required"),
  TYPESCRIPT_BASIC_ARN: z.string().min(1, "TYPESCRIPT_BASIC_ARN is required"),
  TYPESCRIPT_MEDIUM_ARN: z.string().min(1, "TYPESCRIPT_MEDIUM_ARN is required"),
  TYPESCRIPT_LARGE_ARN: z.string().min(1, "TYPESCRIPT_LARGE_ARN is required"),
  TYPESCRIPT_MAX_ARN: z.string().min(1, "TYPESCRIPT_MAX_ARN is required"),

  // Go ARNs
  GO_LITE_ARN: z.string().min(1, "GO_LITE_ARN is required"),
  GO_BASIC_ARN: z.string().min(1, "GO_BASIC_ARN is required"),
  GO_MEDIUM_ARN: z.string().min(1, "GO_MEDIUM_ARN is required"),
  GO_LARGE_ARN: z.string().min(1, "GO_LARGE_ARN is required"),
  GO_MAX_ARN: z.string().min(1, "GO_MAX_ARN is required"),
});

const env = envSchema.parse(process.env);

// Mapping language + resources to ARN
const languageResourceArns: Record<Language, Record<Resources, string>> = {
  javascript: {
    lite: env.JAVASCRIPT_LITE_ARN,
    basic: env.JAVASCRIPT_BASIC_ARN,
    medium: env.JAVASCRIPT_MEDIUM_ARN,
    large: env.JAVASCRIPT_LARGE_ARN,
    max: env.JAVASCRIPT_MAX_ARN,
  },
  typescript: {
    lite: env.TYPESCRIPT_LITE_ARN,
    basic: env.TYPESCRIPT_BASIC_ARN,
    medium: env.TYPESCRIPT_MEDIUM_ARN,
    large: env.TYPESCRIPT_LARGE_ARN,
    max: env.TYPESCRIPT_MAX_ARN,
  },
  go: {
    lite: env.GO_LITE_ARN,
    basic: env.GO_BASIC_ARN,
    medium: env.GO_MEDIUM_ARN,
    large: env.GO_LARGE_ARN,
    max: env.GO_MAX_ARN,
  },
};

export const getLambdaArn = (
  language: Language,
  resources: Resources,
): string => {
  return languageResourceArns[language][resources];
};

export { env };

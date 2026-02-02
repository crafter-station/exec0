import { apiKeysTable, usageTable } from "./dynamodb";
import { exec0Router } from "./router";

// RAM allocation mapping for resource tiers
const RAM_ALLOCATIONS = {
  lite: "128 MB",
  basic: "256 MB",
  medium: "512 MB",
  large: "1024 MB",
  max: "2048 MB",
} as const;

// TypeScript Functions - All resource tiers
export const runTypescriptLite = new sst.aws.Function("RunTypescriptLite", {
  handler: "apps/functions/typescript/index.handler",
  memory: RAM_ALLOCATIONS.lite,
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

export const runTypescriptBasic = new sst.aws.Function("RunTypescriptBasic", {
  handler: "apps/functions/typescript/index.handler",
  memory: RAM_ALLOCATIONS.basic,
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

export const runTypescriptMedium = new sst.aws.Function("RunTypescriptMedium", {
  handler: "apps/functions/typescript/index.handler",
  memory: RAM_ALLOCATIONS.medium,
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

export const runTypescriptLarge = new sst.aws.Function("RunTypescriptLarge", {
  handler: "apps/functions/typescript/index.handler",
  memory: RAM_ALLOCATIONS.large,
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

export const runTypescriptMax = new sst.aws.Function("RunTypescriptMax", {
  handler: "apps/functions/typescript/index.handler",
  memory: RAM_ALLOCATIONS.max,
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

// JavaScript Functions - All resource tiers
export const runJavascriptLite = new sst.aws.Function("RunJavascriptLite", {
  handler: "apps/functions/javascript/index.handler",
  memory: RAM_ALLOCATIONS.lite,
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

export const runJavascriptBasic = new sst.aws.Function("RunJavascriptBasic", {
  handler: "apps/functions/javascript/index.handler",
  memory: RAM_ALLOCATIONS.basic,
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

export const runJavascriptMedium = new sst.aws.Function("RunJavascriptMedium", {
  handler: "apps/functions/javascript/index.handler",
  memory: RAM_ALLOCATIONS.medium,
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

export const runJavascriptLarge = new sst.aws.Function("RunJavascriptLarge", {
  handler: "apps/functions/javascript/index.handler",
  memory: RAM_ALLOCATIONS.large,
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

export const runJavascriptMax = new sst.aws.Function("RunJavascriptMax", {
  handler: "apps/functions/javascript/index.handler",
  memory: RAM_ALLOCATIONS.max,
  runtime: "nodejs22.x",
  architecture: "arm64",
  logging: false,
});

// Go Functions - All resource tiers

export const runGoLite = new sst.aws.Function("RunGoLite", {
  handler: "apps/functions/go",
  memory: RAM_ALLOCATIONS.lite,
  runtime: "go",
  architecture: "arm64",
  logging: false,
});

export const runGoBasic = new sst.aws.Function("RunGoBasic", {
  handler: "apps/functions/go",
  memory: RAM_ALLOCATIONS.basic,
  runtime: "go",
  architecture: "arm64",
  logging: false,
});

export const runGoMedium = new sst.aws.Function("RunGoMedium", {
  handler: "apps/functions/go",
  memory: RAM_ALLOCATIONS.medium,
  runtime: "go",
  architecture: "arm64",
  logging: false,
});

export const runGoLarge = new sst.aws.Function("RunGoLarge", {
  handler: "apps/functions/go",
  memory: RAM_ALLOCATIONS.large,
  runtime: "go",
  architecture: "arm64",
  logging: false,
});

export const runGoMax = new sst.aws.Function("RunGoMax", {
  handler: "apps/functions/go",
  memory: RAM_ALLOCATIONS.max,
  runtime: "go",
  architecture: "arm64",
  logging: false,
});

// Legacy exports for backward compatibility (maps to basic tier)
export const runTypescript = runTypescriptBasic;
export const runJavascript = runJavascriptBasic;
// export const runGo = runGoBasic; // Comentado: Bug con Go

export const api = new sst.aws.Function("Api", {
  handler: "apps/api/src/index.handler",
  memory: "256 MB",
  runtime: "nodejs22.x",
  architecture: "arm64",
  url: {
    router: {
      instance: exec0Router,
      path: "/api",
    },
  },
  link: [
    apiKeysTable,
    usageTable,
    exec0Router,
    // TypeScript functions
    runTypescriptLite,
    runTypescriptBasic,
    runTypescriptMedium,
    runTypescriptLarge,
    runTypescriptMax,
    // JavaScript functions
    runJavascriptLite,
    runJavascriptBasic,
    runJavascriptMedium,
    runJavascriptLarge,
    runJavascriptMax,
    // Go functions
    runGoLite,
    runGoBasic,
    runGoMedium,
    runGoLarge,
    runGoMax,
  ],
  permissions: [
    {
      actions: ["lambda:InvokeFunction"],
      resources: [
        // TypeScript function ARNs
        runTypescriptLite.arn,
        runTypescriptBasic.arn,
        runTypescriptMedium.arn,
        runTypescriptLarge.arn,
        runTypescriptMax.arn,
        // JavaScript function ARNs
        runJavascriptLite.arn,
        runJavascriptBasic.arn,
        runJavascriptMedium.arn,
        runJavascriptLarge.arn,
        runJavascriptMax.arn,
        // Go function ARNs - COMENTADO: Bug con Go
        runGoLite.arn,
        runGoBasic.arn,
        runGoMedium.arn,
        runGoLarge.arn,
        runGoMax.arn,
      ],
    },
  ],
  environment: {
    // TypeScript ARNs por tier
    TYPESCRIPT_LITE_ARN: runTypescriptLite.arn,
    TYPESCRIPT_BASIC_ARN: runTypescriptBasic.arn,
    TYPESCRIPT_MEDIUM_ARN: runTypescriptMedium.arn,
    TYPESCRIPT_LARGE_ARN: runTypescriptLarge.arn,
    TYPESCRIPT_MAX_ARN: runTypescriptMax.arn,
    // JavaScript ARNs por tier
    JAVASCRIPT_LITE_ARN: runJavascriptLite.arn,
    JAVASCRIPT_BASIC_ARN: runJavascriptBasic.arn,
    JAVASCRIPT_MEDIUM_ARN: runJavascriptMedium.arn,
    JAVASCRIPT_LARGE_ARN: runJavascriptLarge.arn,
    JAVASCRIPT_MAX_ARN: runJavascriptMax.arn,
    // Go ARNs por tier - COMENTADO: Bug con Go
    GO_LITE_ARN: runGoLite.arn,
    GO_BASIC_ARN: runGoBasic.arn,
    GO_MEDIUM_ARN: runGoMedium.arn,
    GO_LARGE_ARN: runGoLarge.arn,
    GO_MAX_ARN: runGoMax.arn,
    // Legacy environment variables for backward compatibility
    TYPESCRIPT_ARN: runTypescriptBasic.arn,
    JAVASCRIPT_ARN: runJavascriptBasic.arn,
    GO_ARN: runGoBasic.arn,
    REDIS_URL: process.env.REDIS_URL as string,
  },
});

import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { getLambdaArn } from "../../core/config";
import type { ExecuteRequest, ExecutionResult } from "./schemas";

const lambda = new LambdaClient();

/**
 * Executes code on AWS Lambda and returns the execution result.
 *
 * @param payload - The execution request containing code, language, and resources
 * @returns The execution result with output, errors, and metadata
 */
export const executeLambda = async (
  payload: ExecuteRequest,
): Promise<ExecutionResult> => {
  const startTime = Date.now();

  // Invoke the Lambda function based on language and resources
  const response = await lambda.send(
    new InvokeCommand({
      FunctionName: getLambdaArn(payload.language, payload.resources),
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({ code: payload.code }),
    }),
  );

  // Calculate total execution time
  const executionTime = Date.now() - startTime;

  // Decode the Lambda response payload from binary to string
  const decodedPayload = new TextDecoder().decode(response.Payload);

  // Parse the Lambda HTTP response wrapper
  const lambdaResponse = JSON.parse(decodedPayload);

  // Extract the actual execution result from the response body
  const result = JSON.parse(lambdaResponse.body);

  // Determine execution status based on HTTP status code
  const status = lambdaResponse.statusCode === 200 ? "completed" : "error";

  return {
    id: `exec_${Math.random().toString(36).substring(2, 15)}`,
    status,
    result: {
      stdout: result.output || "",
      stderr: result.error || "",
      exitCode: result.error ? 1 : 0,
      compilationOutput: "",
    },
    executionTime,
    resources: payload.resources,
    createdAt: new Date().toISOString(),
    language: payload.language,
  };
};

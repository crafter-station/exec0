export const getOutput = (result: {
  logs?: { stdout?: string[] };
  results?: Array<{ text?: string }>;
}): string => {
  const stdout = result.logs?.stdout?.join("\n") || "";
  const resultText = result.results?.[0]?.text || "";
  return (stdout + resultText).trim();
};

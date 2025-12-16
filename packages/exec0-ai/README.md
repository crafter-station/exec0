# @exec0/ai-tool

AI tools for agent code execution. Execute Python, JavaScript, and TypeScript code within your AI agents.

## Installation

```bash
npm install @exec0/ai-tool
```

## Quick Start

Use your preferred language execution tools in your AI agents.

```ts
import { exec0Tools } from '@exec0/ai-tool';
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-haiku-4.5',
  prompt: 'Calculate the sum of numbers 1 to 100',
  tools: {
    runPython: exec0Tools.runPython,
    runJavaScript: exec0Tools.runJavaScript,
    runTypeScript: exec0Tools.runTypeScript,
  },
});

console.log(text);
```

Or use all available execution tools:

```ts
import { exec0Tools } from '@exec0/ai-tool';
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-haiku-4.5',
  prompt: 'Calculate the sum of numbers 1 to 100',
  tools: exec0Tools,
});

console.log(text);
```

## Tools

- **runPython** - Execute Python code and return the output
- **runJavaScript** - Execute JavaScript code and return the output
- **runTypeScript** - Execute TypeScript code and return the output

## Response Format

Each tool returns an object with the following structure:

```ts
{
  success: boolean,
  output?: {
    text?: string,
    html?: string,
    png?: string,
    jpeg?: string,
    svg?: string,
    latex?: string,
    markdown?: string,
    json?: unknown,
    chart?: unknown,
    data?: unknown
  },
  error?: string | null
}
```

## Error Handling

If an error occurs during execution, it will be available in the `error` property and `success` will be `false`.
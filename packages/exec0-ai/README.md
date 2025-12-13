# @exec0/ai-tool

AI tools for agent code execution. Execute Python, JavaScript, and TypeScript code within your AI agents.

## Installation

```bash
npm install @exec0/ai-tool
```

## Quick Start

Use your preferred language execution tool in your AI agents.

```ts
import { exec0Tools } from '@exec0/ai-tool';
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-haiku-4.5',
  prompt: 'Calculate the sum of numbers 1 to 100',
  tools: {
    executePython: exec0Tools.executePython,
    executeJavaScript: exec0Tools.executeJavaScript,
    executeTypeScript: exec0Tools.executeTypeScript,
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

- **executePython** - Execute Python code and return the output
- **executeJavaScript** - Execute JavaScript code and return the output
- **executeTypeScript** - Execute TypeScript code and return the output

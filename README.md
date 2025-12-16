# Exec0 SDK

SDK for executing code in multiple programming languages.

## Installation

```bash
npm install @exec0/run
```

## Usage

### Execute Python

```javascript
import { run } from '@exec0/run';

const result = await run.python('print("Hello world")');

console.log(result.data.output);
```

### Execute JavaScript

```javascript
import { run } from '@exec0/run';

const result = await run.javascript('console.log("Hello world")');

console.log(result.data.output);
```

### Execute TypeScript

```javascript
import { run } from '@exec0/run';

const result = await run.typescript('console.log("Hello world")');

console.log(result.data.output);
```

## Response

Each function returns an object with the following structure:

```javascript
{
  data: {
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
  },
  status: number,
  headers: Headers
}
```

## Parameters

- `code`: Code to execute (required, minimum 1 character)

## Errors

If an error occurs during execution, it will be available in `data.error`.

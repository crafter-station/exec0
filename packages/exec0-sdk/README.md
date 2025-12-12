# Exec0 SDK

SDK for executing code in multiple programming languages.

## Installation

```bash
npm install exec0-sdk
```

## Usage

### Execute Python

```javascript
import { executePython } from 'exec0-sdk';

const result = await executePython({
  code: 'print("Hello world")',
  timeout: 5000
});

console.log(result.data.output);
console.log(result.data.executionTime);
```

### Execute JavaScript

```javascript
import { executeJavaScript } from 'exec0-sdk';

const result = await executeJavaScript({
  code: 'console.log("Hello world")',
  timeout: 5000
});

console.log(result.data.output);
```

### Execute TypeScript

```javascript
import { executeTypeScript } from 'exec0-sdk';

const result = await executeTypeScript({
  code: 'console.log("Hello world")',
  timeout: 5000
});

console.log(result.data.output);
```

## Response

Each function returns an object with the following structure:

```javascript
{
  data: {
    output: string,
    error?: string,
    executionTime: number
  },
  status: number,
  headers: Headers
}
```

## Parameters

- `code`: Code to execute (required, minimum 1 character)
- `timeout`: Maximum execution time in milliseconds (optional)

## Errors

If an error occurs during execution, it will be available in `data.error`.

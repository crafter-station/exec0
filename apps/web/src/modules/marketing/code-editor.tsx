"use client";

import { highlight, languages } from "prismjs";
import "prismjs/themes/prism-dark.css";
import "prismjs/components/prism-typescript";
import { useState } from "react";
import Editor from "react-simple-code-editor";
import "./code.css";
import { IconWindowPointerFillDuo18 } from "nucleo-ui-essential-fill-duo-18";

const DEFAULT_CODE = `interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = async (id: number): Promise<User> => {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
};`;

export default function CodeEditor() {
  const [code, setCode] = useState(DEFAULT_CODE);

  return (
    <div className="w-full border border-border overflow-hidden ">
      <div className="flex items-center justify-start px-4 py-2 border-b border-border bg-card gap-2">
        <IconWindowPointerFillDuo18 />
        <span className="text-sm font-medium font-mono">Code Editor</span>
      </div>

      <Editor
        value={code}
        onValueChange={(newCode) => setCode(newCode)}
        highlight={(code) =>
          highlight(code, languages.typescript, "typescript")
        }
        padding={16}
        textareaClassName="focus:outline-none"
        preClassName="pointer-events-none"
        className="min-h-24 w-full overflow-hidden font-mono bg-background"
      />

      <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground bg-card">
        {code.split("\n").length} lines · {code.length} characters
      </div>
    </div>
  );
}

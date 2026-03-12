"use client";

import { highlight, languages } from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-go";
import "./code-viewer.css";

const LANGUAGE_GRAMMAR: Record<string, { grammar: Prism.Grammar; id: string }> =
  {
    javascript: { grammar: languages.javascript, id: "javascript" },
    typescript: { grammar: languages.typescript, id: "typescript" },
    go: { grammar: languages.go, id: "go" },
  };

interface CodeViewerProps {
  code: string;
  language: string;
}

export function CodeViewer({ code, language }: CodeViewerProps) {
  const lang = LANGUAGE_GRAMMAR[language] ?? LANGUAGE_GRAMMAR.javascript;
  const highlighted = highlight(code, lang.grammar, lang.id);

  return (
    <div className="code-viewer w-full overflow-hidden border border-border rounded-md">
      <pre className="m-0 py-2 px-3 overflow-auto font-mono text-sm leading-relaxed bg-background max-h-[50vh]">
        <code
          // biome-ignore lint/security/noDangerouslySetInnerHtml: prismjs output
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
      <div className="px-3 py-1.5 border-t border-border text-xs text-muted-foreground bg-card font-mono">
        {code.split("\n").length} lines · {code.length} characters
      </div>
    </div>
  );
}

import type { Sandbox } from "@cloudflare/sandbox";

export type { Sandbox } from "@cloudflare/sandbox";

export type Language = "python" | "typescript" | "javascript";

export interface ExecuteCodeOptions {
  language: Language;
  code: string;
}

export interface Env {
  Sandbox: Sandbox;
}

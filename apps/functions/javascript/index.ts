import { runInNewContext } from "node:vm";

export async function handler(event: any) {
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event;
    const code = body.code;

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "code es requerido" }),
      };
    }

    let output = "";
    const console_log = (...args: any[]) => {
      output += args.join(" ") + "\n";
    };

    const wrappedCode = `(async () => { ${code} })()`;

    await runInNewContext(wrappedCode, {
      console: { log: console_log },
      fetch: fetch,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        output: output.trim(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
}

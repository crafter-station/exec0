# exec0

To install dependencies:

```bash
bun install
```
Api folder

```bash
cd apps/api
```

Login Cloudflare

```bash
bun run wrangler login
```

Run development server:

```bash
bun run wrangler dev
```

Deploy to Cloudflare Workers:

```bash
bun run wrangler deploy
```

## Sdk generation

```bash
bunx --bun orval --input https://api.uprizing.me/v1/openapi.json --output ./packages/exec0-sdk --client fetch
```

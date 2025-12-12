# exec0

## Install dependencies:

```bash
bun install
```

## Login Cloudflare

```bash
bun run wrangler login
```

## Run development server:

```bash
# ./ base path
bun run dev
```

Deploy to Cloudflare Workers (manual)

```bash
cd apps/api
```

```bash
bun run wrangler deploy
```

## Sdk generation

```bash
bun run sdk
```

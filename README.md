# TanStack Start + @cloudflare/vite-plugin SSR Build Issue

## The Issue

When using `@cloudflare/vite-plugin` instead of `target: "cloudflare-module"` in TanStack Start, the SSR build fails when libraries like `xlsx-js-style` are bundled:

```
[tanstack-start-core::server-fn:ssr] 'return' outside of function. (1:3002863)
```

**Root cause:** The `@cloudflare/vite-plugin` requires all code to be bundled (no externals allowed). When `xlsx-js-style` is bundled, its character encoding table strings cause Babel's parser (used by TanStack's server function transformation) to fail.

## Reproduction

### 1. Clone and install

```bash
git clone https://github.com/jasongitmail/tanstack-xlsx-repro.git
cd tanstack-xlsx-repro
bun install
```

### 2. Test working config (target: "cloudflare-module")

```bash
cat vite.config.works.ts > vite.config.ts
bun run build
# ✅ Builds successfully
```

### 3. Test failing config (@cloudflare/vite-plugin)

This minimal repro may work because xlsx is kept external. In larger projects with more plugins/routes, xlsx gets bundled and causes the error.

To force the bundling (and trigger the error), add to vite.config:

```typescript
ssr: {
  noExternal: ["xlsx-js-style"],
}
```

But note: `@cloudflare/vite-plugin` **rejects `ssr.external`**, making it impossible to work around by keeping xlsx external:

```
Error: The following environment options are incompatible with the Cloudflare Vite plugin:
	- "ssr" environment: `resolve.external`: ["xlsx-js-style"]
```

## Key Finding

The Cloudflare Vite plugin explicitly disallows external modules for Workers. Since xlsx-js-style must be bundled, and its code contains patterns Babel cannot parse, there's no workaround when using `@cloudflare/vite-plugin`.

## Suggested Fix

The `[tanstack-start-core::server-fn:ssr]` transformation should:
1. Skip parsing node_modules code (server functions are defined in user code)
2. Or handle Babel parse errors gracefully for third-party libraries
3. Or match the behavior of `target: "cloudflare-module"` which works correctly

## Environment

- @tanstack/react-start: 1.129.5+
- @cloudflare/vite-plugin: 1.x
- vite: 7.x
- xlsx-js-style: 1.2.0

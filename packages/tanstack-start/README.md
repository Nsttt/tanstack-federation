# @module-federation/tanstack-start

Module Federation helpers for TanStack Start on Rsbuild.

```ts
import { pluginTanStackStartModuleFederation } from '@module-federation/tanstack-start'

export default defineConfig({
  plugins: [
    tanstackStart(),
    ...pluginTanStackStartModuleFederation({
      federation: {
        name: 'remote',
        exposes: {
          './Badge': './src/Badge.tsx',
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
        },
      },
      server: {
        shared: {
          react: { eager: true, singleton: true },
          'react-dom': { eager: true, singleton: true },
        },
      },
    }),
  ],
})
```

The plugin registers a browser federation remote for TanStack Start's `client`
environment and a Node federation remote for the `ssr` environment. The SSR
compat plugin keeps the server bundle and server federation chunks emitted as
`.cjs` so Node can load them when the app package uses `"type": "module"`.
Server chunks use `[id]` by default so Rspack's async-node runtime resolves the
same chunk id that it writes to disk in development and production.

The client compat plugin forces the TanStack Start client federation chunks back
to script/JSONP output. Without that, the browser federation runtime can inject
exposed chunks as classic scripts while Rspack emits ESM chunks, causing syntax
errors in development. Keep an async host bootstrap boundary when consuming
shared React from a federated host.

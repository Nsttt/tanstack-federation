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

# TanStack Start + Module Federation

pnpm workspace for testing Rsbuild Module Federation with TanStack Start SSR.

## Workspace

- `apps/host`: CSR Rsbuild React host on port `3000`
- `apps/remote-ssr`: SSR TanStack Start remote on port `3001`
- `apps/remote-csr`: CSR Rsbuild React remote on port `3002`
- `packages/tanstack-start`: local `@module-federation/tanstack-start` Rsbuild helper package

## Dev

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs all three app servers through Turbo:

- host: `http://localhost:3000`
- SSR remote: `http://localhost:3001`
- CSR remote: `http://localhost:3002`
- CSR remote manifest: `http://localhost:3002/mf-manifest.json`
- SSR remote container: `http://localhost:3001/serverRemoteEntry.cjs`

The host consumes:

```ts
csr_remote@http://localhost:3002/mf-manifest.json
```

and imports:

```ts
import('csr_remote/FederatedBadge')
```

The host view intentionally shows both remote render paths:

- SSR: `http://localhost:3001/ssr-remote` displayed inside the host.
- CSR: `csr_remote/FederatedBadge` loaded through Module Federation.

## Commands

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

## Module Federation

The SSR remote uses `@module-federation/tanstack-start` to install both Module
Federation compilers:

- web target for the browser manifest and `remoteEntry.js`
- node target for the SSR container and `serverRemoteEntry.cjs`

The helper also patches the TanStack Start SSR compiler output to CommonJS
chunk names so the node federation runtime can load exposed modules during SSR.

SSR remote exposure:

```ts
pluginTanStackStartModuleFederation({
  federation: {
    name: 'ssr_remote',
    exposes: {
      './SsrRemotePanel': './src/components/SsrRemotePanel.tsx',
    },
    shared: {
      react: { singleton: true },
      'react-dom': { singleton: true },
    },
  },
})
```

CSR remote exposure:

```ts
pluginModuleFederation({
  name: 'csr_remote',
  exposes: {
    './FederatedBadge': './src/FederatedBadge.tsx',
  },
})
```

Host remote:

```ts
pluginModuleFederation({
  name: 'tanstack_host',
  remotes: {
    csr_remote: 'csr_remote@http://localhost:3002/mf-manifest.json',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

## Production Preview

```bash
pnpm build
pnpm preview
```

The SSR remote preview server serves the TanStack Start SSR app from
`apps/remote-ssr/dist/server/index.cjs` and static client/federation assets from
`apps/remote-ssr/dist/client`.

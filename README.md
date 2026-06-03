# TanStack Start + Module Federation

pnpm workspace for testing Rsbuild Module Federation with TanStack Start SSR.

## Workspace

- `apps/host`: CSR Rsbuild React host on port `3000`
- `apps/remote`: SSR TanStack Start remote on port `3001`
- `packages/tanstack-start`: local `@module-federation/tanstack-start` Rsbuild helper package

## Dev

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs both app servers through Turbo:

- host: `http://localhost:3000`
- remote: `http://localhost:3001`
- remote client manifest: `http://localhost:3001/mf-manifest.json`
- remote SSR container: `http://localhost:3001/serverRemoteEntry.cjs`

The host consumes:

```ts
tanstack_federation@http://localhost:3001/mf-manifest.json
```

and imports:

```ts
import('tanstack_federation/FederatedBadge')
```

The host view intentionally shows both remote render paths:

- SSR: `http://localhost:3001/ssr-remote` displayed inside the host.
- CSR: `tanstack_federation/FederatedBadge` loaded through Module Federation.

## Commands

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

## Module Federation

The remote uses `@module-federation/tanstack-start` to install both Module
Federation compilers:

- web target for the browser manifest and `remoteEntry.js`
- node target for the SSR container and `serverRemoteEntry.cjs`

The helper also patches the TanStack Start SSR compiler output to CommonJS
chunk names so the node federation runtime can load exposed modules during SSR.

Remote exposure:

```ts
pluginTanStackStartModuleFederation({
  federation: {
    name: 'tanstack_federation',
    exposes: {
      './FederatedBadge': './src/components/FederatedBadge.tsx',
    },
    shared: {
      react: { singleton: true },
      'react-dom': { singleton: true },
    },
  },
})
```

Host remote:

```ts
pluginModuleFederation({
  name: 'tanstack_host',
  remotes: {
    tanstack_federation:
      'tanstack_federation@http://localhost:3001/mf-manifest.json',
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

The remote preview server serves the TanStack Start SSR app from
`apps/remote/dist/server/index.cjs` and static client/federation assets from
`apps/remote/dist/client`.

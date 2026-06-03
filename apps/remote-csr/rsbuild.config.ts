import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/rsbuild'
import { pluginTanStackStartModuleFederation } from '@module-federation/tanstack-start'

export default defineConfig({
  dev: {
    lazyCompilation: false,
  },
  server: {
    port: 3002,
  },
  plugins: [
    pluginReact(),
    tanstackStart(),
    ...pluginTanStackStartModuleFederation({
      federation: {
        name: 'csr_remote',
        exposes: {
          './FederatedBadge': './src/FederatedBadge.tsx',
        },
        shared: {
          react: { eager: true, singleton: true },
          'react-dom': { eager: true, singleton: true },
        },
      },
      server: false,
    }),
  ],
})

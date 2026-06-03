import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/rsbuild'
import { pluginTanStackStartModuleFederation } from '@module-federation/tanstack-start'

export default defineConfig({
  dev: {
    lazyCompilation: false,
  },
  server: {
    port: 3000,
  },
  plugins: [
    pluginReact(),
    tanstackStart(),
    ...pluginTanStackStartModuleFederation({
      federation: {
        name: 'tanstack_host',
        remotes: {
          csr_remote: 'csr_remote@http://localhost:3002/mf-manifest.json',
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

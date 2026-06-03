import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import { tanstackStart } from '@tanstack/react-start/plugin/rsbuild'
import { pluginTanStackStartModuleFederation } from '@module-federation/tanstack-start'

export default defineConfig({
  dev: {
    lazyCompilation: false,
  },
  server: {
    port: 3001,
  },
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [tailwindcss()],
      },
    },
  },
  plugins: [
    pluginReact(),
    tanstackStart(),
    ...pluginTanStackStartModuleFederation({
      federation: {
        name: 'tanstack_federation',
        exposes: {
          './FederatedBadge': './src/components/FederatedBadge.tsx',
        },
        shared: {
          react: { eager: true, singleton: true },
          'react-dom': { eager: true, singleton: true },
        },
      },
      server: {
        filename: 'serverRemoteEntry.cjs',
        shared: {
          react: { eager: true, singleton: true },
          'react-dom': { eager: true, singleton: true },
        },
      },
    }),
  ],
})

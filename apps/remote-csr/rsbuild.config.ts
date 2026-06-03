import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  dev: {
    lazyCompilation: false,
  },
  html: {
    template: './index.html',
    title: 'CSR Remote',
  },
  server: {
    port: 3002,
  },
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'csr_remote',
      exposes: {
        './FederatedBadge': './src/FederatedBadge.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
})

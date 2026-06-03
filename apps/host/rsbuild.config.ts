import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  dev: {
    lazyCompilation: false,
  },
  html: {
    template: './index.html',
    title: 'Module Federation Host',
  },
  server: {
    port: 3000,
  },
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  plugins: [
    pluginReact(),
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
    }),
  ],
})

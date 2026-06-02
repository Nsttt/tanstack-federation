import { describe, expect, it } from 'vitest'
import { pluginTanStackStartModuleFederation } from './index'

const federation = {
  name: 'test_remote',
  exposes: {
    './Thing': './src/Thing.tsx',
  },
}

describe('pluginTanStackStartModuleFederation', () => {
  it('creates client and server plugins by default', () => {
    const plugins = pluginTanStackStartModuleFederation({ federation })

    expect(plugins).toHaveLength(3)
    expect(plugins.map((plugin) => plugin.name)).toEqual([
      'rsbuild:module-federation-enhanced',
      'rsbuild:module-federation-enhanced',
      'tanstack-start-federation-ssr-compat',
    ])
  })

  it('can create a client-only federation plugin', () => {
    const plugins = pluginTanStackStartModuleFederation({
      federation,
      server: false,
    })

    expect(plugins).toHaveLength(1)
    expect(plugins[0]?.name).toBe('rsbuild:module-federation-enhanced')
  })
})

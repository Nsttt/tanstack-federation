import { describe, expect, it } from 'vitest'
import { pluginTanStackStartModuleFederation } from './index'
import type { RsbuildPlugin } from '@rsbuild/core'

const federation = {
  name: 'test_remote',
  exposes: {
    './Thing': './src/Thing.tsx',
  },
}

describe('pluginTanStackStartModuleFederation', () => {
  it('creates client and server plugins by default', () => {
    const plugins = pluginTanStackStartModuleFederation({ federation })

    expect(plugins).toHaveLength(4)
    expect(plugins.map((plugin) => plugin.name)).toEqual([
      'rsbuild:module-federation-enhanced',
      'tanstack-start-federation-client-compat',
      'rsbuild:module-federation-enhanced',
      'tanstack-start-federation-ssr-compat',
    ])
  })

  it('can create a client-only federation plugin', () => {
    const plugins = pluginTanStackStartModuleFederation({
      federation,
      server: false,
    })

    expect(plugins).toHaveLength(2)
    expect(plugins[0]?.name).toBe('rsbuild:module-federation-enhanced')
    expect(plugins[1]?.name).toBe('tanstack-start-federation-client-compat')
  })

  it('configures server chunks for node federation', () => {
    const plugins = pluginTanStackStartModuleFederation({ federation })
    const serverCompat = plugins.find(
      (plugin) => plugin.name === 'tanstack-start-federation-ssr-compat',
    )
    const serverConfig: TestBundlerConfig = {
      name: 'ssr',
      output: {
        chunkLoadingGlobal: 'chunk_test_remote',
      },
    }

    applyCompilerHook(serverCompat, [serverConfig])

    expect(serverConfig.target).toBe('async-node')
    expect(serverConfig.output).toEqual({
      chunkFilename: '[id]test_remote.cjs',
      chunkFormat: 'commonjs',
      chunkLoading: 'async-node',
      filename: '[name].cjs',
      library: { type: 'commonjs2' },
      module: false,
    })
  })
})

type TestBundlerConfig = {
  name: string
  target?: string
  output?: {
    chunkFilename?: string
    chunkFormat?: string
    chunkLoading?: string
    chunkLoadingGlobal?: string
    filename?: string
    library?: { type: string }
    module?: boolean
  }
}

function applyCompilerHook(
  plugin: RsbuildPlugin | undefined,
  bundlerConfigs: Array<TestBundlerConfig>,
) {
  let hook:
    | ((args: { bundlerConfigs: Array<TestBundlerConfig> }) => void)
    | undefined

  plugin?.setup({
    onBeforeCreateCompiler(
      callback: (args: { bundlerConfigs: Array<TestBundlerConfig> }) => void,
    ) {
      hook = callback as typeof hook
    },
  } as never)

  expect(hook).toBeDefined()
  hook?.({ bundlerConfigs })
}

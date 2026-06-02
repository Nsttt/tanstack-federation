import {
  pluginModuleFederation,
  type ModuleFederationOptions,
} from '@module-federation/rsbuild-plugin'
import type { RsbuildPlugin } from '@rsbuild/core'

type ModuleFederationOverride = Partial<ModuleFederationOptions>

type ClientFederationOptions = ModuleFederationOverride & {
  environment?: string
}

type ServerFederationOptions =
  | false
  | (ModuleFederationOverride & {
      chunkFilename?: string
      entryFilename?: string
      environment?: string
      forceCommonJsOutput?: boolean
    })

export type TanStackStartModuleFederationOptions = {
  client?: ClientFederationOptions
  federation: ModuleFederationOptions
  server?: ServerFederationOptions
}

export function pluginTanStackStartModuleFederation({
  client = {},
  federation,
  server = {},
}: TanStackStartModuleFederationOptions): Array<RsbuildPlugin> {
  const { environment: clientEnvironment = 'client', ...clientOverrides } =
    client
  const clientFederationOptions = {
    filename: 'remoteEntry.js',
    ...federation,
    ...clientOverrides,
  } as ModuleFederationOptions

  const plugins = [
    pluginModuleFederation(clientFederationOptions, {
      target: 'web',
      environment: clientEnvironment,
    }),
  ]

  if (server === false) {
    return plugins
  }

  const {
    chunkFilename = `[name]${federation.name}.cjs`,
    entryFilename = '[name].cjs',
    environment: serverEnvironment = 'ssr',
    forceCommonJsOutput = true,
    ...serverOverrides
  } = server
  const serverFederationOptions = {
    filename: 'serverRemoteEntry.cjs',
    ...federation,
    ...serverOverrides,
  } as ModuleFederationOptions

  return [
    ...plugins,
    pluginModuleFederation(serverFederationOptions, {
      target: 'node',
      environment: serverEnvironment,
    }),
    pluginTanStackStartFederationSsrCompat({
      chunkFilename,
      entryFilename,
      environment: serverEnvironment,
      forceCommonJsOutput,
    }),
  ]
}

export const tanstackStartModuleFederation =
  pluginTanStackStartModuleFederation

type SsrCompatOptions = {
  chunkFilename: string
  entryFilename: string
  environment: string
  forceCommonJsOutput: boolean
}

function pluginTanStackStartFederationSsrCompat({
  chunkFilename,
  entryFilename,
  environment,
  forceCommonJsOutput,
}: SsrCompatOptions): RsbuildPlugin {
  return {
    name: 'tanstack-start-federation-ssr-compat',
    setup(api) {
      api.onBeforeCreateCompiler(({ bundlerConfigs }) => {
        for (const config of bundlerConfigs ?? []) {
          if (config.name !== environment) {
            continue
          }

          config.output ||= {}
          config.output.filename = entryFilename
          config.output.chunkFilename = chunkFilename

          if (forceCommonJsOutput) {
            config.output.module = false
            config.output.library = { type: 'commonjs2' }
          }
        }
      })
    },
  }
}

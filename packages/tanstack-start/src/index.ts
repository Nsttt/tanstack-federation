import {
  pluginModuleFederation,
  type ModuleFederationOptions,
} from '@module-federation/rsbuild-plugin'
import type { RsbuildPlugin } from '@rsbuild/core'

type ModuleFederationOverride = Partial<ModuleFederationOptions>

type ClientFederationOptions = ModuleFederationOverride & {
  chunkLoadingGlobal?: string
  environment?: string
  forceScriptOutput?: boolean
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
  const {
    chunkLoadingGlobal,
    environment: clientEnvironment = 'client',
    forceScriptOutput = true,
    ...clientOverrides
  } = client
  const clientFederationOptions = {
    filename: 'remoteEntry.js',
    ...federation,
    ...clientOverrides,
  } as ModuleFederationOptions
  const federationName = clientFederationOptions.name

  if (!federationName) {
    throw new Error('federation.name is required')
  }

  const plugins = [
    pluginModuleFederation(clientFederationOptions, {
      target: 'web',
      environment: clientEnvironment,
    }),
    pluginTanStackStartFederationClientCompat({
      chunkLoadingGlobal:
        chunkLoadingGlobal ?? `chunk_${federationName} `,
      environment: clientEnvironment,
      forceScriptOutput,
      name: federationName,
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

type ClientCompatOptions = {
  chunkLoadingGlobal: string
  environment: string
  forceScriptOutput: boolean
  name: string
}

type RspackExperiments = {
  outputModule?: boolean
}

function pluginTanStackStartFederationClientCompat({
  chunkLoadingGlobal,
  environment,
  forceScriptOutput,
  name,
}: ClientCompatOptions): RsbuildPlugin {
  return {
    name: 'tanstack-start-federation-client-compat',
    setup(api) {
      api.onBeforeCreateCompiler(({ bundlerConfigs }) => {
        for (const config of bundlerConfigs ?? []) {
          if (config.name !== environment) {
            continue
          }

          config.output ||= {}
          config.output.chunkFormat = 'array-push'
          config.output.chunkLoading = 'jsonp'
          config.output.chunkLoadingGlobal = chunkLoadingGlobal
          config.output.uniqueName ??= name

          if (forceScriptOutput) {
            config.output.module = false
            const experiments = (config.experiments ??= {}) as RspackExperiments
            experiments.outputModule = false
          }
        }
      })
    },
  }
}

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

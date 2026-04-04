#!/usr/bin/env node
import { generateDotpkg, getConfig, logGenerateInfo, runMain, validateTsconfig } from '@contentlayer/core'
import { pipe, T } from '@contentlayer/utils/effect'

const verbose = process.argv.includes('--verbose')
const configPathArgIndex = process.argv.findIndex((arg) => arg === '--config')
const configPath = configPathArgIndex !== -1 ? process.argv[configPathArgIndex + 1] : undefined

await runMain({ tracingServiceName: 'contentlayer-build-script', verbose })(
  pipe(
    getConfig({ configPath }),
    T.tap((config) => (config.source.options.disableImportAliasWarning ? T.unit : T.fork(validateTsconfig))),
    T.chain((config) => generateDotpkg({ config, verbose })),
    T.tap(logGenerateInfo),
  ),
)

#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const generatedDir = path.join(root, '.contentlayer', 'generated')
const generatedIndex = path.join(generatedDir, 'index.mjs')

const result = spawnSync(
  process.execPath,
  [path.join(root, 'node_modules', 'contentlayer', 'bin', 'cli.cjs'), 'build'],
  {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  },
)

const generatedSuccessfully = fs.existsSync(generatedDir) && fs.existsSync(generatedIndex)

if (result.status === 0) {
  process.exit(0)
}

// Work around a Contentlayer 0.3.4 CLI/Clipanion exit-code bug on Node 20+
// where generation succeeds but the CLI crashes while setting process.exitCode.
if (generatedSuccessfully) {
  console.warn('\n[contentlayer-build] Content generated successfully despite a known Contentlayer CLI exit-code bug; continuing.')
  process.exit(0)
}

if (typeof result.status === 'number') {
  process.exit(result.status)
}

if (result.error) {
  throw result.error
}

process.exit(1)

#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const generatedTypes = path.join(root, '.contentlayer', 'generated', 'index.d.ts')

const result = spawnSync(
  process.execPath,
  [path.join(root, 'node_modules', 'contentlayer', 'bin', 'cli.cjs'), 'postinstall'],
  {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  },
)

if (result.status === 0) {
  process.exit(0)
}

if (fs.existsSync(generatedTypes)) {
  console.warn('\n[contentlayer-postinstall] Types generated successfully despite a known Contentlayer CLI exit-code bug; continuing.')
  process.exit(0)
}

if (typeof result.status === 'number') {
  process.exit(result.status)
}

if (result.error) {
  throw result.error
}

process.exit(1)

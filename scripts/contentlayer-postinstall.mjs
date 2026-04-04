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
    stdio: 'pipe',
    env: process.env,
    encoding: 'utf8',
  },
)

const combinedOutput = `${result.stdout ?? ''}${result.stderr ?? ''}`
const knownExitBug = combinedOutput.includes('The "code" argument must be of type number')

if (result.stdout) process.stdout.write(result.stdout)
if (result.stderr && !knownExitBug) process.stderr.write(result.stderr)

if (result.status === 0) {
  process.exit(0)
}

if (fs.existsSync(generatedTypes) && knownExitBug) {
  console.warn('[contentlayer-postinstall] Types generated successfully; suppressed a known Contentlayer CLI exit-code bug.')
  process.exit(0)
}

if (typeof result.status === 'number') {
  process.exit(result.status)
}

if (result.error) {
  throw result.error
}

process.exit(1)

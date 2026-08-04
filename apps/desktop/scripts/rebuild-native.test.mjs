import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { assertNativeArch, detectNativeArch } = require('./native-arch')
const rebuildScriptPath = join(currentDir, 'rebuild-native.js')
const nativeArchScriptPath = join(currentDir, 'native-arch.js')
const afterPackScriptPath = join(currentDir, '../build-scripts/after-pack.js')
const afterSignScriptPath = join(currentDir, '../build-scripts/after-sign.js')
const builderConfigPath = join(currentDir, '../electron-builder.yml')
const releaseWorkflowPath = join(currentDir, '../../../.github/workflows/release.yml')
const manualWorkflowPath = join(currentDir, '../../../.github/workflows/manual-build.yml')

test('native dependency preparation downloads an Electron prebuilt binary', async () => {
  const source = await readFile(rebuildScriptPath, 'utf8')

  assert.match(source, /prebuild-install\/bin\.js/)
  assert.match(source, /'--runtime=electron'/)
  assert.match(source, /TARGET_ARCH/)
  assert.match(source, /assertNativeArch\(bindingPath, targetArch\)/)
  assert.doesNotMatch(source, /electron-rebuild/)
})

test('native binary architecture is checked before and after packaging', async () => {
  const [nativeArchSource, afterPackSource] = await Promise.all([
    readFile(nativeArchScriptPath, 'utf8'),
    readFile(afterPackScriptPath, 'utf8')
  ])

  assert.match(nativeArchSource, /Native binding architecture mismatch/)
  assert.match(afterPackSource, /verifyNativeBindings\(resourcesPath, arch\)/)
  assert.match(afterPackSource, /'Contents', 'Resources'/)
  assert.match(afterPackSource, /assertNativeArch\(bindingPath, expectedArch\)/)
})

test('native architecture detector distinguishes macOS arm64 and x64 binaries', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'native-arch-'))
  const arm64Path = join(tempDir, 'arm64.node')
  const x64Path = join(tempDir, 'x64.node')

  try {
    const arm64Header = Buffer.from([0xcf, 0xfa, 0xed, 0xfe, 0x0c, 0x00, 0x00, 0x01])
    const x64Header = Buffer.from([0xcf, 0xfa, 0xed, 0xfe, 0x07, 0x00, 0x00, 0x01])
    await Promise.all([writeFile(arm64Path, arm64Header), writeFile(x64Path, x64Header)])

    assert.equal(detectNativeArch(arm64Path), 'arm64')
    assert.equal(detectNativeArch(x64Path), 'x64')
    assert.doesNotThrow(() => assertNativeArch(arm64Path, 'arm64'))
    assert.throws(() => assertNativeArch(x64Path, 'arm64'), /expected arm64, found x64/)
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
})

test('release builds macOS architectures separately with target-specific native bindings', async () => {
  const [source, builderConfig, afterSignSource] = await Promise.all([
    readFile(releaseWorkflowPath, 'utf8'),
    readFile(builderConfigPath, 'utf8'),
    readFile(afterSignScriptPath, 'utf8')
  ])

  assert.match(source, /build_script: 'build:mac:x64'/)
  assert.match(source, /build_script: 'build:mac:arm64'/)
  assert.match(source, /TARGET_ARCH: \$\{\{ matrix\.target_arch \}\}/)
  assert.doesNotMatch(source, /apps\/desktop\/release\/\*\*\/latest\*\.yml/)
  assert.match(builderConfig, /afterSign: "\.\/build-scripts\/after-sign\.js"/)
  const macConfig = builderConfig.match(/\nmac:\n([\s\S]*?)\ndmg:/)?.[1] || ''
  assert.doesNotMatch(macConfig, /^\s+arch:/m)
  assert.match(afterSignSource, /'--force', '--deep', '--sign', '-'/)
  assert.match(afterSignSource, /'--verify', '--deep', '--strict'/)
})

test('manual builds use the same target-specific native binding strategy', async () => {
  const source = await readFile(manualWorkflowPath, 'utf8')

  assert.match(source, /build_script: 'build:mac:x64'/)
  assert.match(source, /build_script: 'build:mac:arm64'/)
  assert.match(source, /pnpm install --frozen-lockfile --ignore-scripts/)
  assert.match(source, /TARGET_ARCH: \$\{\{ matrix\.target_arch \}\}/)
})

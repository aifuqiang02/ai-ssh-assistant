const fs = require('fs')

const ARCH_NAMES = {
  0x014c: 'ia32',
  0x8664: 'x64',
  0xaa64: 'arm64'
}

function detectNativeArch(filePath) {
  const buffer = fs.readFileSync(filePath)

  if (buffer.length >= 20 && buffer[0] === 0x7f && buffer.toString('ascii', 1, 4) === 'ELF') {
    const machine = buffer[5] === 2 ? buffer.readUInt16BE(18) : buffer.readUInt16LE(18)
    return { 0x03: 'ia32', 0x3e: 'x64', 0xb7: 'arm64' }[machine]
  }

  if (buffer.length >= 8) {
    const magic = buffer.readUInt32BE(0)
    if (magic === 0xcffaedfe || magic === 0xcefaedfe) {
      return { 0x01000007: 'x64', 0x0100000c: 'arm64' }[buffer.readUInt32LE(4)]
    }
    if (magic === 0xfeedfacf || magic === 0xfeedface) {
      return { 0x01000007: 'x64', 0x0100000c: 'arm64' }[buffer.readUInt32BE(4)]
    }
  }

  if (buffer.length >= 64 && buffer.toString('ascii', 0, 2) === 'MZ') {
    const peOffset = buffer.readUInt32LE(0x3c)
    if (peOffset + 6 <= buffer.length && buffer.toString('ascii', peOffset, peOffset + 4) === 'PE\0\0') {
      return ARCH_NAMES[buffer.readUInt16LE(peOffset + 4)]
    }
  }

  return undefined
}

function assertNativeArch(filePath, expectedArch) {
  const actualArch = detectNativeArch(filePath)
  if (actualArch !== expectedArch) {
    throw new Error(
      `Native binding architecture mismatch: expected ${expectedArch}, found ${actualArch || 'unknown'} at ${filePath}`
    )
  }
}

module.exports = { assertNativeArch, detectNativeArch }

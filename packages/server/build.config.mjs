import { build } from 'esbuild'
import { copy } from 'fs-extra'
import { readFile, writeFile } from 'fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const serverPackage = JSON.parse(await readFile('package.json', 'utf8'))

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'dist-bundle/index.js',
  define: {
    'process.env.APP_VERSION': JSON.stringify(serverPackage.version)
  },
  external: [
    // 原生二进制依赖不打包
    'sharp',
    '@prisma/client',
    'ssh2',
    '@node-rs/*',
    'cpu-features'
  ],
  banner: {
    js: `
import { createRequire as __createRequire } from 'module';
import { fileURLToPath as __fileURLToPath } from 'url';
import { dirname as __dirname_fn } from 'path';

const require = __createRequire(import.meta.url);
const __filename = __fileURLToPath(import.meta.url);
const __dirname = __dirname_fn(__filename);
`.trim()
  },
  sourcemap: true,
  minify: false,
  treeShaking: true
})

// 复制必要文件
console.log('📁 复制 Prisma 文件...')
try {
  await copy('../database/prisma', 'dist-bundle/prisma')
  await copy('../database/package.json', 'dist-bundle/database/package.json')
  await copy('../database/src/generated/client', 'dist-bundle/database/src/generated/client')
  console.log('✅ Prisma 文件复制成功')
} catch (error) {
  console.error('❌ Prisma 文件复制失败:', error.message)
  throw error
}

// 复制 pino thread-stream worker 文件
console.log('📁 复制 Pino worker 文件...')
try {
  const threadStreamPackageJson = require.resolve('thread-stream/package.json')
  const pinoWorkerPath = join(dirname(threadStreamPackageJson), 'lib/worker.js')
  const targetPath = 'dist-bundle/lib/worker.js'
  await copy(pinoWorkerPath, targetPath)
  console.log('✅ Pino worker 文件复制成功')
} catch (error) {
  console.warn('⚠️ 未找到 Pino worker 文件，跳过复制:', error.message)
}

// 创建 package.json（标记为 ESM）
console.log('📝 创建 package.json...')
await writeFile(
  'dist-bundle/package.json',
  JSON.stringify(
    {
      type: 'module',
      name: '@ai-ssh/server-bundle',
      version: serverPackage.version,
      private: true
    },
    null,
    2
  )
)

console.log('✅ Bundle 完成！')

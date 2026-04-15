import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { logger } from '../utils/safe-logger.js'

const require = createRequire(import.meta.url)
const bootstrapDir = dirname(fileURLToPath(import.meta.url))
const databasePackageDir = resolve(bootstrapDir, '../../../database')
const migrationsDir = resolve(databasePackageDir, 'prisma/migrations')
const prismaSchemaPath = resolve(databasePackageDir, 'prisma/schema-postgresql.prisma')

function getPrismaCliEntrypoint() {
  return require.resolve('prisma/build/index.js', {
    paths: [databasePackageDir]
  })
}

function runPrisma(args: string[], env?: NodeJS.ProcessEnv): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('[prisma-bootstrap] before-spawn', {
      node: process.execPath,
      cli: getPrismaCliEntrypoint(),
      args,
      cwd: databasePackageDir
    })

    logger.info(
      {
        command: process.execPath,
        args: [getPrismaCliEntrypoint(), ...args],
        cwd: databasePackageDir
      },
      'Prisma bootstrap command start'
    )

    const child = spawn(process.execPath, [getPrismaCliEntrypoint(), ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: databasePackageDir,
      shell: false,
      env: { ...process.env, ...env },
      windowsHide: true
    })

    console.log('[prisma-bootstrap] after-spawn', { pid: child.pid })

    child.stdout?.on('data', chunk => {
      process.stdout.write(`[prisma-bootstrap:stdout] ${chunk}`)
    })

    child.stderr?.on('data', chunk => {
      process.stderr.write(`[prisma-bootstrap:stderr] ${chunk}`)
    })

    child.on('error', error => {
      console.error('[prisma-bootstrap] error', error)
      logger.error({ error, command: process.execPath, args }, 'Prisma bootstrap command error')
      reject(error)
    })

    child.on('close', code => {
      console.log('[prisma-bootstrap] close', { code })
      logger.info({ command: process.execPath, args, code }, 'Prisma bootstrap command finished')
      if (code === 0) return resolve()
      reject(new Error(`prisma ${args.join(' ')} exited with code ${code}`))
    })
  })
}

/**
 * 启动时自动执行 Prisma 迁移（生产环境等价于：prisma migrate deploy）
 *
 * 说明：
 * - Prisma 没有稳定的“API 形式 migrate deploy”，因此这里用子进程调用 CLI。
 * - Windows 下直接 spawn('npx') 可能因为 PATH/扩展名解析导致 ENOENT，这里通过 shell:true 解决。
 */
export async function autoMigrateIfEnabled(enabled: boolean): Promise<void> {
  if (!enabled) return

  try {
    const hasMigrations = existsSync(migrationsDir) && readdirSync(migrationsDir).length > 0
    logger.info(
      { migrationsDir, hasMigrations, databasePackageDir, prismaSchemaPath },
      'AUTO_MIGRATE inspection result'
    )

    if (hasMigrations) {
      logger.info('AUTO_MIGRATE enabled, running: prisma migrate deploy')
      await runPrisma(['migrate', 'deploy'])
      logger.info('Prisma migrate deploy completed')
      return
    }

    logger.warn(
      'AUTO_MIGRATE enabled but no prisma migrations found, running prisma db push instead'
    )
    await runPrisma(['db', 'push', '--schema', prismaSchemaPath, '--skip-generate'])
    logger.info('Prisma db push completed')
  } catch (error) {
    logger.error({ error }, 'Prisma migrate deploy failed')
    throw error
  }
}

import { beforeEach, describe, expect, it, vi } from 'vitest'

const spawnMock = vi.fn()
const loggerInfo = vi.fn()
const loggerWarn = vi.fn()
const loggerError = vi.fn()
const existsSyncMock = vi.fn()
const readdirSyncMock = vi.fn()

vi.mock('node:child_process', () => ({
  spawn: spawnMock
}))

vi.mock('node:fs', () => ({
  existsSync: existsSyncMock,
  readdirSync: readdirSyncMock
}))

vi.mock('../utils/safe-logger.js', () => ({
  logger: {
    info: loggerInfo,
    warn: loggerWarn,
    error: loggerError
  }
}))

describe('autoMigrateIfEnabled', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    spawnMock.mockImplementation(() => ({
      on: (event: string, handler: (value?: any) => void) => {
        if (event === 'close') {
          handler(0)
        }
      }
    }))
  })

  it('uses prisma db push when no migrations exist', async () => {
    existsSyncMock.mockReturnValue(false)

    const { autoMigrateIfEnabled } = await import('./prisma-migrate.js')
    await autoMigrateIfEnabled(true)

    expect(spawnMock).toHaveBeenCalledWith(
      process.execPath,
      [
        expect.stringMatching(/prisma[\\/]build[\\/]index\.js$/),
        'db',
        'push',
        '--schema',
        expect.stringMatching(/schema-postgresql\.prisma$/),
        '--skip-generate'
      ],
      expect.objectContaining({
        cwd: expect.stringMatching(/packages[\\/]database$/),
        shell: false
      })
    )
    expect(loggerWarn).toHaveBeenCalled()
  })

  it('uses prisma migrate deploy when migrations exist', async () => {
    existsSyncMock.mockReturnValue(true)
    readdirSyncMock.mockReturnValue(['20260410_init'])

    const { autoMigrateIfEnabled } = await import('./prisma-migrate.js')
    await autoMigrateIfEnabled(true)

    expect(spawnMock).toHaveBeenCalledWith(
      process.execPath,
      [expect.stringMatching(/prisma[\\/]build[\\/]index\.js$/), 'migrate', 'deploy'],
      expect.objectContaining({
        cwd: expect.stringMatching(/packages[\\/]database$/),
        shell: false
      })
    )
  })
})

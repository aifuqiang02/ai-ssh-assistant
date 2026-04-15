import { createHash } from 'node:crypto'
import path from 'node:path'

const PROXY_URL_TEMPLATE = 'https://git.aifuqiang.win/{url}'

export interface UpdateSource {
  id: string
  url: string
}

export interface UpdateArtifact {
  version: string
  releaseDate: string
  notes: string
  fileName: string
  size: number
  sha512: string
  sources: UpdateSource[]
}

export interface PlatformUpdateManifest {
  version: string
  releaseDate: string
  notes: string
  platform: string
  artifact: UpdateArtifact
}

export interface UpdateSourceProbeResult {
  sourceId: string
  url: string
  ok: boolean
  durationMs: number
  status?: number
}

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'up-to-date'
  | 'update-available'
  | 'probing-sources'
  | 'downloading'
  | 'downloaded'
  | 'installing'
  | 'error'

export interface UpdateState {
  status: UpdateStatus
  currentVersion: string
  availableVersion?: string
  progress?: number
  statusText?: string
  downloadedFilePath?: string
  selectedSourceId?: string
  lastCheckedAt?: string
  error?: string
}

interface UpdateFileStore {
  mkdir: (dirPath: string) => Promise<void>
  exists: (filePath: string) => Promise<boolean>
  readFile: (filePath: string) => Promise<Buffer>
  writeFile: (filePath: string, data: Uint8Array) => Promise<void>
}

interface UpdateServiceDeps {
  currentVersion: string
  platform: NodeJS.Platform
  arch: string
  manifestUrls: string[]
  fetch: typeof fetch
  getUserDataPath: () => string
  fileStore: UpdateFileStore
  openPath: (filePath: string) => Promise<string>
  launchInstaller: (filePath: string) => Promise<void>
  emitState: (state: UpdateState) => void
  logger?: {
    info: (message: string, data?: Record<string, unknown>) => void
    warn: (message: string, data?: Record<string, unknown>) => void
    error: (message: string, data?: Record<string, unknown>) => void
  }
}

function sha512Base64(buffer: Uint8Array) {
  return createHash('sha512').update(buffer).digest('base64')
}

export function compareVersions(left: string, right: string) {
  const leftParts = left.split('.').map(value => Number.parseInt(value, 10) || 0)
  const rightParts = right.split('.').map(value => Number.parseInt(value, 10) || 0)
  const length = Math.max(leftParts.length, rightParts.length)

  for (let index = 0; index < length; index += 1) {
    const leftValue = leftParts[index] || 0
    const rightValue = rightParts[index] || 0
    if (leftValue > rightValue) return 1
    if (leftValue < rightValue) return -1
  }

  return 0
}

export function selectFastestSource(results: UpdateSourceProbeResult[]) {
  return [...results]
    .filter(result => result.ok)
    .sort((left, right) => left.durationMs - right.durationMs)[0]
}

export function buildManifestUrls({
  githubOwner,
  githubRepo,
  platform,
  arch
}: {
  githubOwner: string
  githubRepo: string
  platform: string
  arch: string
}) {
  const fileName = `update-manifest-${platform}-${arch}.json`
  const githubUrl = `https://github.com/${githubOwner}/${githubRepo}/releases/latest/download/${fileName}`

  return [githubUrl, PROXY_URL_TEMPLATE.replaceAll('{url}', githubUrl)]
}

export class UpdateService {
  private readonly deps: UpdateServiceDeps
  private state: UpdateState
  private inFlightCheck: Promise<UpdateState> | null = null

  private log(level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>) {
    this.deps.logger?.[level](message, data)
  }

  constructor(deps: UpdateServiceDeps) {
    this.deps = deps
    this.state = {
      status: 'idle',
      currentVersion: deps.currentVersion
    }
  }

  getState() {
    return { ...this.state }
  }

  setStateForTest(nextState: UpdateState) {
    this.state = nextState
  }

  async startBackgroundCheck() {
    if (this.inFlightCheck) {
      this.log('info', 'Reusing in-flight update check')
      return this.inFlightCheck
    }

    this.inFlightCheck = this.runBackgroundCheck().finally(() => {
      this.inFlightCheck = null
    })

    return this.inFlightCheck
  }

  async installDownloadedUpdate() {
    if (!this.state.downloadedFilePath) {
      this.log('warn', 'Install requested without downloaded update')
      throw new Error('No downloaded update available')
    }

    const lowerPath = this.state.downloadedFilePath.toLowerCase()
    const shouldLaunchDirectly =
      this.deps.platform === 'win32' ||
      (this.deps.platform === 'linux' && lowerPath.endsWith('.appimage'))

    this.updateState({
      status: 'installing',
      statusText: shouldLaunchDirectly ? '正在启动安装程序' : '正在打开安装包'
    })

    if (shouldLaunchDirectly) {
      this.log('info', 'Launching cached installer directly', {
        filePath: this.state.downloadedFilePath,
        platform: this.deps.platform
      })
      await this.deps.launchInstaller(this.state.downloadedFilePath)
      return
    }

    this.log('info', 'Opening cached update package with system handler', {
      filePath: this.state.downloadedFilePath,
      platform: this.deps.platform
    })
    await this.deps.openPath(this.state.downloadedFilePath)
  }

  private async runBackgroundCheck() {
    try {
      this.updateState({
        status: 'checking',
        statusText: '正在检查更新',
        error: undefined,
        lastCheckedAt: new Date().toISOString()
      })
      this.log('info', 'Starting background update check', {
        currentVersion: this.state.currentVersion,
        manifestUrls: this.deps.manifestUrls
      })

      const manifest = await this.fetchManifest()
      const availableVersion = manifest.artifact.version || manifest.version
      this.log('info', 'Fetched update manifest', {
        availableVersion,
        platform: manifest.platform,
        fileName: manifest.artifact.fileName,
        sourceCount: manifest.artifact.sources.length
      })
      if (compareVersions(availableVersion, this.state.currentVersion) <= 0) {
        this.log('info', 'No update needed', {
          currentVersion: this.state.currentVersion,
          availableVersion
        })
        this.updateState({
          status: 'up-to-date',
          availableVersion,
          statusText: '当前已是最新版本'
        })
        return this.getState()
      }

      const targetFilePath = this.getArtifactCachePath(manifest.artifact.fileName, availableVersion)
      this.updateState({
        status: 'update-available',
        availableVersion,
        statusText: `发现新版本 ${availableVersion}`,
        downloadedFilePath: undefined
      })

      if (await this.isCachedArtifactValid(targetFilePath, manifest.artifact)) {
        this.log('info', 'Using cached update package', {
          filePath: targetFilePath,
          availableVersion
        })
        this.updateState({
          status: 'downloaded',
          availableVersion,
          downloadedFilePath: targetFilePath,
          statusText: `新版本 ${availableVersion} 已准备完成`
        })
        return this.getState()
      }

      this.updateState({ status: 'probing-sources', statusText: '正在检测最快下载源' })
      const source = await this.pickBestSource(manifest.artifact.sources)
      if (!source) {
        this.log('error', 'No available update source', {
          availableVersion,
          candidateSources: manifest.artifact.sources.map(item => item.id)
        })
        throw new Error('No available update source')
      }

      this.log('info', 'Selected update source', {
        sourceId: source.sourceId,
        url: source.url,
        durationMs: source.durationMs
      })

      this.updateState({
        status: 'downloading',
        selectedSourceId: source.sourceId,
        progress: 0,
        statusText: `正在后台下载更新（${source.sourceId}）`
      })

      await this.downloadArtifact(source.url, targetFilePath, manifest.artifact)

      this.log('info', 'Downloaded update package successfully', {
        filePath: targetFilePath,
        availableVersion,
        sourceId: source.sourceId
      })

      this.updateState({
        status: 'downloaded',
        availableVersion,
        downloadedFilePath: targetFilePath,
        progress: 100,
        statusText: `新版本 ${availableVersion} 已下载完成，可直接安装`
      })

      return this.getState()
    } catch (error: any) {
      this.log('error', 'Background update check failed', {
        error: error?.message || String(error)
      })
      this.updateState({
        status: 'error',
        error: error?.message || String(error),
        statusText: '更新检查失败'
      })
      return this.getState()
    }
  }

  private updateState(patch: Partial<UpdateState>) {
    this.state = { ...this.state, ...patch }
    this.deps.emitState(this.getState())
  }

  private async fetchManifest(): Promise<PlatformUpdateManifest> {
    let lastError: unknown = null

    for (const manifestUrl of this.deps.manifestUrls) {
      try {
        const response = await this.deps.fetch(manifestUrl)
        if (!response.ok) {
          throw new Error(`Manifest request failed with ${response.status}`)
        }

        return (await response.json()) as PlatformUpdateManifest
      } catch (error) {
        this.log('warn', 'Manifest request failed', {
          manifestUrl,
          error: error instanceof Error ? error.message : String(error)
        })
        lastError = error
      }
    }

    throw lastError || new Error('Unable to fetch update manifest')
  }

  private getArtifactCachePath(fileName: string, version: string) {
    return path.join(this.deps.getUserDataPath(), version, fileName)
  }

  private async isCachedArtifactValid(filePath: string, artifact: UpdateArtifact) {
    if (!(await this.deps.fileStore.exists(filePath))) {
      this.log('info', 'No cached update package found', { filePath })
      return false
    }

    const buffer = await this.deps.fileStore.readFile(filePath)
    const isValid = buffer.byteLength === artifact.size && sha512Base64(buffer) === artifact.sha512

    this.log(
      isValid ? 'info' : 'warn',
      isValid ? 'Cached update package validated' : 'Cached update package invalid',
      {
        filePath,
        expectedSize: artifact.size,
        actualSize: buffer.byteLength
      }
    )

    return isValid
  }

  private async pickBestSource(sources: UpdateSource[]) {
    const results = await Promise.all(sources.map(source => this.probeSource(source)))
    this.log('info', 'Completed update source probing', {
      results: results.map(item => ({
        sourceId: item.sourceId,
        ok: item.ok,
        durationMs: item.durationMs,
        status: item.status
      }))
    })
    return selectFastestSource(results)
  }

  private async probeSource(source: UpdateSource): Promise<UpdateSourceProbeResult> {
    const startedAt = Date.now()

    try {
      let response = await this.deps.fetch(source.url, { method: 'HEAD' })
      if (!response.ok) {
        response = await this.deps.fetch(source.url, {
          method: 'GET',
          headers: { Range: 'bytes=0-0' }
        })
      }

      return {
        sourceId: source.id,
        url: source.url,
        ok: response.ok,
        status: response.status,
        durationMs: Date.now() - startedAt
      }
    } catch {
      return {
        sourceId: source.id,
        url: source.url,
        ok: false,
        durationMs: Date.now() - startedAt
      }
    }
  }

  private async downloadArtifact(url: string, filePath: string, artifact: UpdateArtifact) {
    const response = await this.deps.fetch(url)
    if (!response.ok) {
      this.log('error', 'Update package download failed', {
        url,
        status: response.status
      })
      throw new Error(`Download failed with ${response.status}`)
    }

    await this.deps.fileStore.mkdir(path.dirname(filePath))

    let bytes = new Uint8Array()
    if (response.body) {
      const reader = response.body.getReader()
      const chunks: Uint8Array[] = []
      let received = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (!value) continue
        chunks.push(value)
        received += value.byteLength
        this.updateState({
          progress:
            artifact.size > 0 ? Math.min(99, Math.round((received / artifact.size) * 100)) : 0
        })
      }

      bytes = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)))
    } else {
      bytes = new Uint8Array(await response.arrayBuffer())
    }

    if (bytes.byteLength !== artifact.size) {
      this.log('error', 'Downloaded update size mismatch', {
        url,
        expectedSize: artifact.size,
        actualSize: bytes.byteLength
      })
      throw new Error('Downloaded artifact size mismatch')
    }

    if (sha512Base64(bytes) !== artifact.sha512) {
      this.log('error', 'Downloaded update hash mismatch', {
        url,
        fileName: artifact.fileName
      })
      throw new Error('Downloaded artifact hash mismatch')
    }

    await this.deps.fileStore.writeFile(filePath, bytes)
  }
}

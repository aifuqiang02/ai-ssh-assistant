import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

export const PROXY_URL_TEMPLATE = 'https://git.aifuqiang.win/{url}'

const INSTALLER_PREFERENCES = {
  win32: ['.exe'],
  darwin: ['.dmg', '.zip'],
  linux: ['.AppImage', '.deb']
}

function detectArtifactTarget(fileName) {
  const lower = fileName.toLowerCase()

  if (lower.endsWith('.exe')) {
    return { platform: 'win32', arch: lower.includes('arm64') ? 'arm64' : 'x64', ext: '.exe' }
  }

  if (lower.endsWith('.dmg') || lower.endsWith('.zip')) {
    return {
      platform: 'darwin',
      arch: lower.includes('arm64') ? 'arm64' : 'x64',
      ext: path.extname(fileName)
    }
  }

  if (lower.endsWith('.appimage') || lower.endsWith('.deb')) {
    return {
      platform: 'linux',
      arch: lower.includes('arm64') ? 'arm64' : 'x64',
      ext: path.extname(fileName)
    }
  }

  return null
}

function choosePreferredArtifacts(files) {
  const grouped = new Map()

  for (const file of files) {
    const target = detectArtifactTarget(file.fileName)
    if (!target) continue

    const key = `${target.platform}-${target.arch}`
    const current = grouped.get(key)
    const preference = INSTALLER_PREFERENCES[target.platform] || []
    const currentRank = current ? preference.indexOf(current.ext) : Number.POSITIVE_INFINITY
    const nextRank = preference.indexOf(target.ext)

    if (!current || (nextRank !== -1 && nextRank < currentRank)) {
      grouped.set(key, { ...file, ...target })
    }
  }

  return [...grouped.values()]
}

export function generateUpdateManifest({
  version,
  releaseDate,
  notes = '',
  githubOwner,
  githubRepo,
  files
}) {
  const platforms = {}

  for (const file of choosePreferredArtifacts(files)) {
    const tag = `v${version}`
    const key = `${file.platform}-${file.arch}`
    const githubUrl = `https://github.com/${githubOwner}/${githubRepo}/releases/download/${tag}/${file.fileName}`
    platforms[key] = {
      version,
      releaseDate,
      notes,
      fileName: file.fileName,
      size: file.size,
      sha512: file.sha512,
      sources: [
        {
          id: 'github',
          url: githubUrl
        },
        {
          id: 'proxy',
          url: PROXY_URL_TEMPLATE.replaceAll('{url}', githubUrl)
        }
      ]
    }
  }

  return {
    version,
    releaseDate,
    notes,
    platforms
  }
}

async function collectFiles(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)))
      continue
    }

    files.push(fullPath)
  }

  return files
}

async function toManifestFile(fullPath) {
  const buffer = await readFile(fullPath)
  const sha512 = createHash('sha512').update(buffer).digest('base64')
  return {
    fileName: path.basename(fullPath),
    size: buffer.byteLength,
    sha512
  }
}

async function writeManifests({ releaseDir, version, githubOwner, githubRepo, notes }) {
  const fullPaths = await collectFiles(releaseDir)
  const fileEntries = []

  for (const fullPath of fullPaths) {
    const target = detectArtifactTarget(path.basename(fullPath))
    if (!target) continue
    fileEntries.push(await toManifestFile(fullPath))
  }

  const manifest = generateUpdateManifest({
    version,
    releaseDate: new Date().toISOString(),
    notes,
    githubOwner,
    githubRepo,
    files: fileEntries
  })

  await mkdir(releaseDir, { recursive: true })

  for (const [platformKey, platformManifest] of Object.entries(manifest.platforms)) {
    const filePath = path.join(releaseDir, `update-manifest-${platformKey}.json`)
    const content = JSON.stringify(
      {
        version: manifest.version,
        releaseDate: manifest.releaseDate,
        notes: manifest.notes,
        platform: platformKey,
        artifact: platformManifest
      },
      null,
      2
    )
    await writeFile(filePath, `${content}\n`, 'utf8')
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
) {
  const releaseDir = process.env.RELEASE_DIR
  const version = (process.env.RELEASE_VERSION || '').replace(/^v/, '')
  const githubRepository = process.env.GITHUB_REPOSITORY || ''
  const [githubOwner = '', githubRepo = ''] = githubRepository.split('/')

  if (!releaseDir || !version || !githubOwner || !githubRepo) {
    console.error(
      'generate-update-manifest requires RELEASE_DIR, RELEASE_VERSION, and GITHUB_REPOSITORY'
    )
    process.exit(1)
  }

  writeManifests({
    releaseDir,
    version,
    githubOwner,
    githubRepo,
    notes: process.env.RELEASE_NOTES || ''
  }).catch(error => {
    console.error('Failed to generate update manifest:', error)
    process.exit(1)
  })
}

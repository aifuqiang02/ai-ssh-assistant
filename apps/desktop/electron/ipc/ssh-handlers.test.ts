import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const sshHandlersPath = join(currentDir, 'ssh-handlers.ts')
const sshTreeServicePath = join(currentDir, '../services/ssh-tree.service.ts')

test('exec output cleanup only removes the first line when it is an actual command echo', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(source, /const trimmedCommand = command\.trim\(\)/)
  assert.match(source, /const firstLine = lines\[0\]\?\.trim\(\) \|\| ''/)
  assert.match(
    source,
    /if \(firstLine && firstLine === trimmedCommand\) \{[\s\S]*cleanedOutput = lines\.slice\(1\)\.join\('\\n'\)/
  )
  assert.doesNotMatch(source, /console\.log\('\[SSHManager\] 📝 第一行（命令回显）:'/)
})

test('listFiles prefers structured exec output and falls back to SFTP when needed', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(
    source,
    /private async listFilesViaExec\(id: string, remotePath: string\): Promise<any\[] \| null>/
  )
  assert.match(source, /private escapeShellSingleQuotes\(value: string\): string \{/)
  assert.match(source, /const execFiles = await this\.listFilesViaExec\(id, remotePath\)/)
  assert.match(source, /if \(execFiles !== null\) \{[\s\S]*return execFiles/)
  assert.match(source, /console\.warn\('\[SSHManager\] \[listFiles\] exec 列目录失败，回退 SFTP'/)
  assert.match(source, /const execCommand = this\.buildStructuredListCommand\(remotePath\)/)
  assert.match(source, /const execResult = await this\.executeSilent\(id, execCommand\)/)
  assert.match(source, /return this\.listFilesViaSftp\(id, remotePath, startTime\)/)
})

test('listFiles treats empty exec output as an empty directory instead of falling back', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(source, /if \(!execResult\.success\) \{[\s\S]*return null/)
  assert.match(source, /const output = \(execResult\.output \|\| ''\)\.trim\(\)/)
  assert.match(source, /if \(!output\) \{[\s\S]*return \[\]/)
  assert.doesNotMatch(source, /!execResult\.success \|\| !execResult\.output/)
})

test('listFiles prefers a dedicated persistent shell channel before exec and SFTP fallbacks', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(source, /private fileListShellChannels: Map<string, any> = new Map\(\)/)
  assert.match(source, /private async getFileListShell\(id: string\): Promise<any>/)
  assert.match(source, /private async executeOnFileListShell\(id: string, command: string\)/)
  assert.match(
    source,
    /const shellFiles = await this\.listFilesViaPersistentShell\(id, remotePath\)/
  )
  assert.match(source, /if \(shellFiles !== null\) \{[\s\S]*return shellFiles/)
  assert.match(source, /const execFiles = await this\.listFilesViaExec\(id, remotePath\)/)
  assert.match(source, /if \(execFiles !== null\) \{[\s\S]*return execFiles/)
  assert.match(source, /return this\.listFilesViaSftp\(id, remotePath, startTime\)/)
})

test('listFiles no longer runs exec diagnostics after successful listings', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.doesNotMatch(source, /private async runListFilesExecDiagnostic\(/)
  assert.doesNotMatch(source, /exec 对照诊断完成/)
  assert.doesNotMatch(source, /exec 对照诊断异常/)
})

test('getConnections exposes a serializable lastUsed string shape', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(
    source,
    /type SerializedSSHConnection = Omit<[\s\S]*'client' \| 'shell' \| 'sftp' \| 'password' \| 'privateKey' \| 'passphrase' \| 'lastUsed'[\s\S]*> & \{/
  )
  assert.match(source, /lastUsed: string/)
  assert.match(source, /getConnections\(\): SerializedSSHConnection\[]/)
  assert.match(source, /lastUsed: conn\.lastUsed\.toISOString\(\)/)
})

test('execute cancellation is registered before ssh2 returns its stream', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(
    source,
    /pendingExecs\.set\(requestId, \{ stream: null, aborted: false, reject: settleReject \}\)/
  )
  assert.match(source, /if \(!pendingExec \|\| pendingExec\.aborted\)/)
  assert.match(source, /const stream = pendingExec\.stream[\s\S]*pendingExec\.reject\(/)
})

test('remote env doc resolves HOME and uses temp-file rename through dedicated IPC', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(source, /printf '%s' \"\$HOME\"/)
  assert.match(source, /\$\{fullPath\}\.tmp-/)
  assert.match(source, /_extensions\?\.\['posix-rename@openssh\.com'\] === '1'/)
  assert.match(source, /ext_openssh_rename\.bind\(sftp\)/)
  assert.match(source, /ipcMain\.handle\('ssh:read-env-doc'/)
  assert.match(source, /ipcMain\.handle\('ssh:write-env-doc'/)
})

test('file listing carries opaque raw path identity into recursive deletion', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(source, /identity=\$\(printf %s \"\$p\" \| base64/)
  assert.match(source, /name: this\.displayNameFromIdentity\(identity\)/)
  assert.match(source, /base64 -d \| xargs -0 rm \$\{removeFlag\} --/)
  assert.doesNotMatch(source, /const itemPath = `\$\{remotePath\}\/\$\{item\.filename\}`/)
})

test('current directory lookup uses a shell channel before falling back to silent pwd', async () => {
  const source = await readFile(sshHandlersPath, 'utf8')

  assert.match(source, /currentDirectoryProbe\?: \{/)
  assert.match(source, /if \(connection\.currentDirectoryProbe\) \{/)
  assert.match(source, /async getCurrentDirectory\(/)
  assert.match(source, /__OC_CWD_BEGIN__/)
  assert.match(source, /__OC_CWD_END__/)
  assert.match(source, /connection\.shell\.write\(wrappedCommand/)
  assert.match(source, /return await this\.executeSilent\(id, 'pwd'\)/)
  assert.match(source, /ipcMain\.handle\('ssh:get-current-directory'/)
})

test('connection list import and export use native JSON dialogs and SSHTreeService', async () => {
  const [source, serviceSource] = await Promise.all([
    readFile(sshHandlersPath, 'utf8'),
    readFile(sshTreeServicePath, 'utf8')
  ])

  assert.match(source, /ipcMain\.handle\('ssh:export-connections'/)
  assert.match(source, /dialog\.showSaveDialog\(\{/)
  assert.match(source, /sshTreeService\.exportConnections\(userId\)/)
  assert.match(source, /ipcMain\.handle\('ssh:import-connections'/)
  assert.match(source, /dialog\.showOpenDialog\(\{/)
  assert.match(source, /sshTreeService\.importConnections\(userId, JSON\.parse\(content\)\)/)
  assert.doesNotMatch(source, /\.ai-ssh-assistant[\s\S]*connections\.json/)
  assert.match(serviceSource, /storageManager\.create\('SSHConnection', \{[\s\S]*userId,[\s\S]*\.\.\.connection,[\s\S]*folderId: null,[\s\S]*status: 'DISCONNECTED',[\s\S]*isActive: true/)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const sshHandlersPath = join(currentDir, 'ssh-handlers.ts')

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
  assert.match(source, /const escapedRemotePath = this\.escapeShellSingleQuotes\(remotePath\)/)
  assert.match(
    source,
    /const execCommand = `LC_ALL=C find '\$\{escapedRemotePath\}' -mindepth 1 -maxdepth 1 -printf '%f\\t%y\\t%s\\t%T@\\t%m\\n'`/
  )
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

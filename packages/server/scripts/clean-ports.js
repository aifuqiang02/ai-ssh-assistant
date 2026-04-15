#!/usr/bin/env node

import { execSync } from 'child_process'
import { platform } from 'os'

const PORTS_TO_CLEAN = ['3000', '9229']

function getPlatformCommands() {
  if (platform() === 'win32') {
    return {
      findProcesses: (port) => `netstat -ano | findstr :${port}`,
      killProcess: (pid) => `taskkill /F /PID ${pid}`,
      parsePid: (line) => {
        // Windows netstat output: TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       1234
        const parts = line.trim().split(/\s+/)
        return parts[parts.length - 1] // PID is last column
      }
    }
  } else {
    // Unix-like systems (Linux, macOS)
    return {
      findProcesses: (port) => `lsof -ti:${port}`,
      killProcess: (pid) => `kill -9 ${pid}`,
      parsePid: (line) => line.trim()
    }
  }
}

function cleanPort(port) {
  try {
    const commands = getPlatformCommands()

    console.log(`🔍 检查端口 ${port} 的占用情况...`)

    // 查找占用端口的进程
    const output = execSync(commands.findProcesses(port), { encoding: 'utf8' })

    if (!output.trim()) {
      console.log(`✅ 端口 ${port} 未被占用`)
      return
    }

    // 解析进程ID
    const lines = output.trim().split('\n')
    const pids = new Set()

    for (const line of lines) {
      if (line.trim()) {
        const pid = commands.parsePid(line)
        if (pid && pid !== '0') {
          pids.add(pid)
        }
      }
    }

    // 杀掉进程
    for (const pid of pids) {
      try {
        console.log(`🛑 终止进程 PID: ${pid} (端口 ${port})`)
        execSync(commands.killProcess(pid), { stdio: 'inherit' })
        console.log(`✅ 成功终止进程 PID: ${pid}`)
      } catch (error) {
        console.warn(`⚠️  无法终止进程 PID: ${pid}, ${error.message}`)
      }
    }

  } catch (error) {
    // 如果命令执行失败，通常意味着端口未被占用
    if (error.status === 1) {
      console.log(`✅ 端口 ${port} 未被占用`)
    } else {
      console.warn(`⚠️  检查端口 ${port} 时出错: ${error.message}`)
    }
  }
}

function main() {
  console.log('🧹 清理端口占用...')

  // 等待一小段时间，确保之前的进程完全退出
  setTimeout(() => {
    for (const port of PORTS_TO_CLEAN) {
      cleanPort(port)
    }

    // 再等一会儿，确保清理完成
    setTimeout(() => {
      console.log('🎉 端口清理完成！')
    }, 1000)
  }, 500)
}

main()
# SSH 终端输入重复换行问题修复

## 问题描述

用户在 SSH 终端中输入时遇到了严重的问题：
1. 按一个回车键会出现两行提示符（重复换行）
2. 每输入一个字符就会自动换行（更严重）

## 问题现象

```bash
# 原始问题：按一个回车会变成
root@server:/# 
root@server:/# 
root@server:/# 

# 更严重的问题：输入 "ls" 会变成
root@server:/# l
root@server:/# s
root@server:/# 
```

## 根本原因

终端的输入处理使用了错误的方法：

```typescript
// ❌ 错误的实现
terminal.value.onData((data) => {
  window.electronAPI.ssh.execute(connId, data)
})
```

**问题分析：**

1. `ssh.execute()` 是为 **AI 工具调用** 设计的命令执行方法
2. 它会自动执行以下操作：
   - 添加 `\n` 换行符到命令末尾
   - 等待命令执行完成
   - 监听并捕获输出
   - 检测命令提示符来判断完成

3. 当用户在终端输入时：
   - 输入字符 `'a'` → `execute('a')` → shell 执行 `'a\n'` 命令
   - 按回车 `'\r'` → `execute('\r')` → shell 执行 `'\r\n'` 命令
   - 每个输入都被当作独立命令执行和处理

## 解决方案

### 核心思路

将 **命令执行** 和 **终端输入** 两种场景分离：

| 场景 | 方法 | 行为 | 用途 |
|------|------|------|------|
| AI 工具调用 | `execute(id, command)` | 添加 `\n`，等待完成，捕获输出 | AI 助手执行命令 |
| 用户终端输入 | `write(id, data)` | 直接转发，不做任何处理 | 用户交互式输入 |

### 实现细节

#### 1. 后端：添加 `write` 方法

**`apps/desktop/electron/ipc/ssh-handlers.ts`**

```typescript
/**
 * 直接写入终端输入（用于用户交互）
 * 不添加换行符，不等待响应，只是简单地转发给 shell
 */
async write(id: string, data: string): Promise<void> {
  console.log('[SSHManager] write - 开始写入数据')
  const connection = this.connections.get(id)
  
  if (!connection) {
    throw new Error('Connection not found')
  }

  if (!connection.shell) {
    throw new Error('Shell not available')
  }

  // 直接写入，不做任何修改
  connection.shell.write(data, (err: any) => {
    if (err) {
      console.error('[SSHManager] ❌ 写入数据失败:', err)
    }
  })
}
```

#### 2. IPC：注册 `ssh:write` handler

```typescript
ipcMain.handle('ssh:write', async (_, id: string, data: string) => {
  try {
    await sshManager.write(id, data)
  } catch (error) {
    console.error('SSH write error:', error)
    throw error
  }
})
```

#### 3. Preload：暴露 `write` API

**`apps/desktop/electron/preload/index.ts`**

```typescript
ssh: {
  connect: (config: any) => ipcRenderer.invoke('ssh:connect', config),
  disconnect: (id: string) => ipcRenderer.invoke('ssh:disconnect', id),
  execute: (id: string, command: string) => ipcRenderer.invoke('ssh:execute', id, command),
  write: (id: string, data: string) => ipcRenderer.invoke('ssh:write', id, data),  // 新增
  // ... 其他方法
}
```

#### 4. 前端：使用 `write` 处理终端输入

**`apps/desktop/src/views/TerminalView.vue`**

```typescript
// ✅ 正确的实现
terminal.value.onData((data) => {
  const connId = currentConnectionId.value
  if (connId && window.electronAPI) {
    // 直接写入终端输入（不添加换行符，不等待响应）
    window.electronAPI.ssh.write(connId, data).catch((err: any) => {
      console.error('Failed to send input:', err)
    })
  }
})
```

## 技术对比

### execute() - 命令执行方法

```typescript
async execute(id: string, command: string): Promise<{ 
  success: boolean; 
  output?: string; 
  error?: string 
}> {
  // 1. 添加换行符
  const commandWithNewline = command.endsWith('\n') ? command : command + '\n'
  
  // 2. 监听输出
  shell.on('data', onData)
  shell.stderr.on('data', onStderr)
  
  // 3. 写入命令
  shell.write(commandWithNewline)
  
  // 4. 等待命令完成（检测提示符）
  // 5. 清理输出（移除命令和提示符）
  // 6. 返回结果
  
  return { success: true, output: cleanedOutput }
}
```

**特点：**
- ✅ 自动添加换行符
- ✅ 捕获输出
- ✅ 等待完成
- ✅ 清理结果
- ❌ 不适合交互式输入

### write() - 终端输入方法

```typescript
async write(id: string, data: string): Promise<void> {
  // 直接写入，不做任何处理
  shell.write(data)
}
```

**特点：**
- ✅ 直接转发
- ✅ 无延迟
- ✅ 不干预
- ✅ 适合交互式输入
- ❌ 无返回值
- ❌ 不捕获输出

## 使用场景

### 1. 用户在终端输入 - 使用 `write()`

```typescript
// 用户交互式输入
terminal.onData((data) => {
  ssh.write(connectionId, data)  // 直接转发
})
```

**流程：**
```
用户按键 → xterm.js 触发 onData → write() → shell.write() → SSH 服务器
```

### 2. AI 工具调用命令 - 使用 `execute()`

```typescript
// AI 助手执行命令
const result = await ssh.execute(connectionId, 'ls -la')
// result: { success: true, output: "file1\nfile2\n..." }
```

**流程：**
```
AI 调用 → execute() → 添加 \n → 发送命令 → 等待完成 → 捕获输出 → 返回结果
```

## 解决的问题

### ✅ 修复前

1. 每个字符都被当作命令执行
2. 回车键导致双换行
3. 终端响应异常缓慢
4. 无法正常交互

### ✅ 修复后

1. 字符直接传递，无延迟
2. 回车正常工作
3. 终端响应流畅
4. 可以正常交互
5. AI 命令执行不受影响

## 配套修改

### xterm.js 配置

```typescript
new Terminal({
  convertEol: false,  // 禁用自动换行符转换
  // ...
})
```

**说明：**
- `convertEol: false` 确保回车符 `\r` 不被自动转换为 `\r\n`
- 配合 `write()` 方法，避免重复换行

## 相关文件

| 文件 | 修改内容 |
|------|----------|
| `apps/desktop/electron/ipc/ssh-handlers.ts` | 添加 `write()` 方法和 `ssh:write` handler |
| `apps/desktop/electron/preload/index.ts` | 暴露 `write` API 和类型定义 |
| `apps/desktop/src/views/TerminalView.vue` | 使用 `write` 替代 `execute` |

## 测试验证

### 测试步骤

1. **正常输入测试**
   ```bash
   # 输入字符应该正常显示
   ls
   pwd
   echo "hello"
   ```

2. **回车测试**
   ```bash
   # 按回车应该只换一行
   [按回车]
   # 应该只出现一个新的提示符
   ```

3. **AI 命令测试**
   - 在 AI 助手中输入："列出当前目录"
   - AI 应该能正确执行 `ls` 命令并返回结果

### 预期结果

- ✅ 终端输入流畅，无延迟
- ✅ 回车只换一行
- ✅ 可以正常编辑命令
- ✅ AI 工具调用正常工作

## 技术亮点

1. **职责分离**：将两种不同的使用场景分离为两个独立的方法
2. **类型安全**：添加完整的 TypeScript 类型定义
3. **向后兼容**：不影响现有的 AI 工具调用功能
4. **简洁设计**：`write()` 方法实现简单，性能最优

## 总结

这个修复体现了 **单一职责原则**：
- `execute()` 负责命令执行和结果获取（AI 场景）
- `write()` 负责数据透传（用户交互场景）

通过正确区分这两种场景，彻底解决了终端输入问题，同时保持了 AI 工具调用的完整功能。


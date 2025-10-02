# SSH 连接功能使用指南

本文档说明如何使用 AI SSH Assistant 的 SSH 连接功能。

## 功能概述

AI SSH Assistant 现已实现完整的 SSH 连接功能，包括：

1. **连接管理**：通过树形结构管理 SSH 连接
2. **多种认证方式**：支持密码、私钥、SSH Agent 认证
3. **交互式终端**：基于 xterm.js 的真实终端体验
4. **多标签支持**：可同时打开多个 SSH 连接

## 使用流程

### 1. 创建 SSH 连接

#### 方法 A：通过侧边栏
1. 点击活动栏的 SSH 图标
2. 右键点击文件夹 → "新建连接"
3. 或点击连接节点右侧的"更多"(三点)菜单 → "新建连接"

#### 方法 B：直接新建
1. 在 SSH 连接列表顶部点击"新建文件夹"
2. 右键新建的文件夹 → "新建连接"

### 2. 配置连接信息

在弹出的对话框中填写：

- **连接名称**：自定义名称（如"生产服务器"）
- **主机地址**：服务器 IP 或域名
- **端口**：SSH 端口（默认 22）
- **用户名**：SSH 登录用户名
- **认证方式**：
  - 密码认证
  - 私钥认证
  - SSH Agent

#### 密码认证
```
认证类型：password
密码：输入您的 SSH 密码
```

#### 私钥认证
```
认证类型：privateKey
私钥内容：粘贴您的私钥内容
密码短语（可选）：如果私钥有密码保护
```

#### SSH Agent
```
认证类型：agent
系统将使用本地 SSH Agent 进行认证
```

### 3. 测试连接

点击"测试连接"按钮验证配置是否正确：
- ✅ 成功：显示"连接测试成功"
- ❌ 失败：显示具体错误信息

### 4. 保存连接

测试成功后，点击"确定"保存连接配置。

### 5. 建立连接

在 SSH 连接列表中：
1. 点击连接节点右侧的"更多"菜单
2. 选择"连接"

或者：
- 双击连接节点（如果支持）

### 6. 使用终端

连接成功后会自动打开新的终端标签页：

#### 终端特性
- **实时输出**：命令输出实时显示
- **交互式输入**：支持任意命令输入
- **颜色支持**：完整的 ANSI 颜色支持
- **链接识别**：URL 自动识别为可点击链接
- **窗口自适应**：终端大小自动适应窗口

#### 终端操作
- **输入命令**：直接在终端中输入，按 Enter 执行
- **复制粘贴**：
  - 选中文本自动复制
  - 右键粘贴或 Ctrl+V
- **清屏**：输入 `clear` 或 Ctrl+L
- **断开连接**：点击右上角"断开连接"按钮
- **重新连接**：点击"重新连接"按钮

## 技术架构

### 前端组件

#### 1. SSHTreeNode.vue
- 树形连接列表
- 右键菜单
- 拖拽排序

#### 2. SSHConnectionDialog.vue
- 连接配置表单
- 连接测试
- 表单验证

#### 3. TerminalView.vue
- xterm.js 终端
- SSH 输入输出
- 连接状态管理

### 后端服务

#### 1. SSH Manager (electron/ipc/ssh-handlers.ts)
- SSH 连接管理
- Shell 会话创建
- 数据流处理

#### 2. 连接流程
```
用户点击连接
  ↓
调用 electronAPI.ssh.connect()
  ↓
IPC 调用 ssh:connect
  ↓
SSH Manager 创建 Client
  ↓
建立 SSH 连接
  ↓
创建 Shell 会话
  ↓
监听数据流
  ↓
通过 IPC 发送输出到前端
  ↓
TerminalView 显示
```

#### 3. 数据流
```
终端输入 → onData → electronAPI.ssh.execute()
         → IPC → ssh:execute
         → Shell.write()
         → SSH Server

SSH Server → Shell.on('data')
          → windowEvents.sendToRenderer(`ssh:output:${id}`)
          → IPC → 前端监听器
          → terminal.write()
          → 终端显示
```

## 配置文件

SSH 连接配置存储在数据库中：

### 数据库表: ssh_connections
```sql
- id: 连接 ID
- name: 连接名称
- host: 主机地址
- port: 端口
- username: 用户名
- password: 密码（加密存储）
- privateKey: 私钥（加密存储）
- passphrase: 私钥密码短语（加密存储）
- authType: 认证类型
- folderId: 所属文件夹
- order: 排序
- status: 状态
- lastUsed: 最后使用时间
```

## 安全性

### 1. 密码存储
- 密码和私钥在数据库中应加密存储
- 仅在建立连接时解密

### 2. 连接安全
- 使用 SSH2 加密通信
- 支持私钥认证（推荐）
- 支持 SSH Agent（最安全）

### 3. 最佳实践
- ✅ 优先使用私钥或 SSH Agent
- ✅ 使用强密码
- ✅ 定期更换密钥
- ❌ 避免在公共网络使用密码认证

## 故障排查

### 问题 1：连接超时
**原因**：
- 网络不通
- 防火墙阻止
- SSH 服务未启动

**解决**：
```bash
# 检查网络
ping <host>

# 检查端口
telnet <host> 22

# 检查 SSH 服务
systemctl status sshd
```

### 问题 2：认证失败
**原因**：
- 用户名或密码错误
- 私钥不匹配
- SSH Agent 未启动

**解决**：
- 验证用户名密码
- 检查私钥格式（需要 OpenSSH 格式）
- 启动 SSH Agent：`eval $(ssh-agent)`

### 问题 3：终端输出乱码
**原因**：
- 字符编码问题
- 终端环境变量未设置

**解决**：
```bash
# 设置环境变量
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

### 问题 4：无法输入
**原因**：
- Shell 会话未正确建立
- 连接已断开

**解决**：
- 点击"重新连接"
- 检查后端日志
- 重启应用

## 开发调试

### 查看日志

#### 前端日志
打开开发者工具 (F12)：
```javascript
// 查看连接状态
console.log(window.electronAPI)

// 监听事件
window.electronAPI.on('ssh:output:*', (data) => {
  console.log('SSH Output:', data)
})
```

#### 后端日志
查看 Electron 主进程输出：
```bash
pnpm dev
# 查看控制台输出
```

### 测试连接

#### 单元测试
```typescript
// test/ssh-connection.spec.ts
describe('SSH Connection', () => {
  it('should connect successfully', async () => {
    const result = await window.electronAPI.ssh.connect({
      host: 'test.server.com',
      port: 22,
      username: 'test',
      password: 'test123'
    })
    expect(result.status).toBe('connected')
  })
})
```

#### 手动测试
1. 创建测试连接
2. 配置本地 SSH 服务器
3. 测试各种认证方式
4. 验证终端交互

## 已知限制

1. **并发连接**：理论无限制，但受系统资源限制
2. **文件传输**：当前版本仅支持终端操作，SFTP 功能待开发
3. **端口转发**：暂不支持本地/远程端口转发
4. **X11 转发**：暂不支持图形界面转发
5. **多跳连接**：暂不支持跳板机（Jump Host）

## 未来计划

- [ ] SFTP 文件传输
- [ ] 端口转发
- [ ] 终端分屏
- [ ] 命令历史记录
- [ ] AI 命令建议
- [ ] 连接会话保存
- [ ] 跳板机支持
- [ ] 批量操作

## 相关文档

- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - 开发指南
- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - 最佳实践
- [SSH2 Documentation](https://github.com/mscdex/ssh2) - SSH2 库文档
- [xterm.js Documentation](https://xtermjs.org/) - 终端库文档

---

**最后更新**: 2025-09-30

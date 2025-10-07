# 🔧 快速修复：better-sqlite3 版本不匹配

## ❌ 错误信息
```
The module 'better-sqlite3.node' was compiled against a different Node.js version using
NODE_MODULE_VERSION 115. This version of Node.js requires NODE_MODULE_VERSION 118.
```

## ✅ 解决方案

### 方案 1：使用 electron-rebuild（推荐）

在项目根目录运行：

```bash
# 1. 进入 desktop 目录
cd apps/desktop

# 2. 重新编译 better-sqlite3
pnpm rebuild

# 或者使用 npx
npx electron-rebuild -f -w better-sqlite3
```

### 方案 2：重新安装（如果方案1不行）

```bash
# 1. 删除 node_modules
cd apps/desktop
rm -rf node_modules
rm -rf ../../node_modules

# 2. 清理 pnpm 缓存（可选）
pnpm store prune

# 3. 重新安装
cd ../..
pnpm install

# 4. 运行 rebuild
cd apps/desktop
pnpm rebuild
```

### 方案 3：使用 postinstall 脚本（自动化）

已经在 `apps/desktop/package.json` 中配置了：

```json
{
  "scripts": {
    "postinstall": "electron-rebuild -f -w better-sqlite3"
  }
}
```

重新安装即可自动触发：

```bash
cd apps/desktop
pnpm install
```

## 🔍 验证是否成功

运行项目看是否还有错误：

```bash
pnpm dev
```

如果成功，应该看到：
```
[Main] ✅ StorageManager initialized in local mode
[Main] ✅ Settings handlers registered
[Main] ✅ Chat handlers registered
```

## 📝 原因说明

- **问题**：`better-sqlite3` 是原生 Node.js 模块（C++ addon）
- **版本**：需要针对特定的 Node.js/Electron 版本编译
- **Electron**：内置特定版本的 Node.js
- **解决**：使用 `electron-rebuild` 重新编译以匹配 Electron 的 Node.js 版本

## 🚨 如果还是不行

### 检查 Electron 版本

```bash
cd apps/desktop
npm list electron
# 或
pnpm list electron
```

### 检查 Node.js 版本对应关系

- Electron 27.x → Node.js 18.17.x (MODULE_VERSION 108)
- Electron 28.x → Node.js 18.18.x (MODULE_VERSION 108)
- Electron 29.x → Node.js 20.9.x (MODULE_VERSION 115)
- Electron 30.x → Node.js 20.14.x (MODULE_VERSION 115)
- Electron 31.x → Node.js 20.14.x (MODULE_VERSION 115)
- Electron 32.x → Node.js 20.18.x (MODULE_VERSION 127)
- Electron 33.x → Node.js 22.x (MODULE_VERSION 127)

错误显示需要 MODULE_VERSION 118，但 better-sqlite3 是针对 115 编译的。

### 可能需要更新 Electron 版本

查看 `apps/desktop/package.json`：

```json
{
  "devDependencies": {
    "electron": "^27.3.11"  // 可能需要更新
  }
}
```

如果需要，可以更新：

```bash
cd apps/desktop
pnpm update electron
pnpm rebuild
```

## 🎯 最终建议

**立即执行（在项目根目录）**：

```bash
# 清理并重新安装
pnpm install

# 重新编译原生模块
cd apps/desktop
pnpm rebuild

# 启动项目
cd ../..
pnpm dev
```

这应该能解决问题！


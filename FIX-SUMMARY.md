# 🐛 Electron ESM 问题修复摘要

## 问题描述

应用启动时遇到多个 ES Module 相关错误：

1. **缺少文件扩展名**：`Cannot find module '.../database/dist/src/client'`
2. **ESM URL 协议错误**：`ERR_UNSUPPORTED_ESM_URL_SCHEME: Received protocol 'electron:'`

## 根本原因

1. **TypeScript 配置问题**：使用 `moduleResolution: "node"` 时，ES Module 需要明确的 `.js` 扩展名
2. **Electron ESM 限制**：Electron 环境不支持动态 `import()` 和 `electron:` 协议

## 修复方案

### ✅ 1. 修复 database 包的 ES Module 配置

**文件：`packages/database/tsconfig.json`**
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"  // ← 从 "node" 改为 "NodeNext"
  }
}
```

**修改的文件：**
- `packages/database/src/index.ts` - 添加 `.js` 扩展名
- `packages/database/src/client.ts` - 添加 `.js` 扩展名
- `packages/database/src/types.ts` - 添加 `.js` 扩展名
- `packages/database/src/storage-manager.ts` - 添加 `.js` 扩展名
- `packages/database/src/storage.config.ts` - 添加 `.js` 扩展名
- `packages/database/src/adapters/*.ts` - 所有适配器添加 `.js` 扩展名
- `packages/database/prisma/seed.ts` - 添加 `.js` 扩展名

### ✅ 2. 移除所有动态导入

**文件：`apps/desktop/electron/main/index.ts`**

❌ **旧代码（动态导入）：**
```typescript
// ❌ 不支持
const { StorageManager } = await import('@ai-ssh/database')
await import('../ipc/api-handlers')
await import('../ipc/ssh-handlers')
```

✅ **新代码（静态导入）：**
```typescript
// ✅ 支持
import { StorageManager } from '@ai-ssh/database'
import '../ipc/api-handlers'
import '../ipc/ssh-handlers'
import '../ipc/ai-handlers'
import '../ipc/file-handlers'
import '../ipc/system-handlers'
```

**文件：`apps/desktop/electron/ipc/ssh-handlers.ts`**
```typescript
// ❌ 移除动态导入
// const path = await import('path')
// const fs = await import('fs/promises')

// ✅ 已在顶部静态导入
import path from 'path'
import fs from 'fs/promises'
```

## 测试步骤

1. **清理并重新构建：**
   ```bash
   cd packages/database
   pnpm build
   cd ../..
   ```

2. **启动应用：**
   ```bash
   pnpm dev
   ```

3. **验证日志应该显示：**
   ```
   [Main] 初始化 StorageManager...
   [Main] ✅ StorageManager initialized in local mode
   [Settings IPC] ✅ Handlers registered
   [Main] ✅ Settings handlers registered
   [Main] ✅ All IPC handlers registered
   ```

4. **应该没有这些错误：**
   - ❌ `Cannot find module`
   - ❌ `ERR_UNSUPPORTED_ESM_URL_SCHEME`
   - ❌ `ERR_MODULE_NOT_FOUND`

## 提交更改

```bash
# 确保退出 less（按 q）
git add -A
git commit -m "fix: Remove all dynamic imports to fix Electron ESM loader issues

- 修复 database 包的 ES Module 配置
- 所有导入添加 .js 扩展名
- 将动态 import() 改为静态 import
- 移除 ssh-handlers 中的重复动态导入

修复错误:
- ERR_UNSUPPORTED_ESM_URL_SCHEME
- ERR_MODULE_NOT_FOUND
"
git push
```

## 技术细节

### Electron ESM 限制
- Electron 使用定制的 ESM 加载器
- 不支持 `electron:` 协议的动态导入
- 解决方案：使用静态导入

### Node.js ES Module 要求
- 使用 `"type": "module"` 时必须明确扩展名
- TypeScript 的 `NodeNext` 模式会自动处理
- 编译后的 `.js` 文件会保留正确的导入路径

## 参考资料
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Electron ESM Support](https://www.electronjs.org/docs/latest/tutorial/esm)
- [Node.js ES Modules](https://nodejs.org/api/esm.html)


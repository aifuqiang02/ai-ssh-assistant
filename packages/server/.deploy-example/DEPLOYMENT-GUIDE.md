# 🚀 部署指南：两种方案对比

## 📋 方案总览

现在有**两套独立的部署配置**：

| 方案               | 配置文件             | 适用场景         | 推荐度 |
| ------------------ | -------------------- | ---------------- | ------ |
| **Bundle 模式** ⭐ | `server-bundle.json` | 生产环境快速部署 | ✅✅✅ |
| **Workspace 模式** | `server.json`        | 开发/调试部署    | ✅     |

---

## 🎯 **推荐：Bundle 模式** ⭐⭐⭐⭐⭐

### **为什么选择 Bundle？**

- ✅ **超快速**：45 秒完成（vs 217 秒）
- ✅ **超简单**：4 步完成（vs 7 步）
- ✅ **超轻量**：3.4 MB（vs 几百 MB）
- ✅ **无依赖**：只需 3 个 npm 包

### **部署步骤**

#### **在 AI 部署助手中：**

1. 打开"部署"页面
2. 选择配置文件：`server-bundle.json`
3. 点击"开始部署"
4. ✅ 等待 45 秒完成！

#### **详细流程：**

```
[步骤 1/4] Build Bundle
  ⏱️  10 秒
  📝 本地打包：esbuild 打包所有代码
  📦 输出：packages/server/dist-bundle/index.js (3.4 MB)

[步骤 2/4] Create Remote Directory
  ⏱️  2 秒
  📂 创建目录：/var/www/ai-ssh-server-bundle

[步骤 3/4] Upload Bundle Files
  ⏱️  8 秒
  📤 上传：index.js + prisma/
  📊 大小：3.4 MB

[步骤 4/4] Install & Start PM2
  ⏱️  25 秒（首次）或 5 秒（更新）
  📦 安装：@prisma/client, sharp, ssh2
  🔨 生成：Prisma Client
  🚀 启动：PM2
```

**总耗时**：

- **首次部署**：~45 秒
- **更新部署**：~25 秒

---

## 🔄 **Workspace 模式**（备用）

### **适用场景**

- 需要在服务器上运行数据库迁移
- 需要在服务器上直接调试代码
- 需要完整的开发环境

### **部署步骤**

#### **在 AI 部署助手中：**

1. 打开"部署"页面
2. 选择配置文件：`server.json`（默认）
3. 点击"开始部署"
4. ⏳ 等待 3-5 分钟完成

#### **详细流程：**

```
[步骤 1/7] Build Project          ⏱️ 60 秒
[步骤 2/7] Create Remote Dirs     ⏱️ 2 秒
[步骤 3/7] Upload Workspace Root  ⏱️ 5 秒
[步骤 4/7] Upload Server Package  ⏱️ 5 秒
[步骤 5/7] Upload Database Pkg    ⏱️ 30 秒
[步骤 6/7] Upload Shared Package  ⏱️ 2 秒
[步骤 7/7] Install & Start PM2    ⏱️ 180 秒
```

**总耗时**：~4 分钟

---

## 📊 **性能对比**

### **部署速度**

```
Bundle:     ████ 45秒
Workspace:  ████████████████████ 240秒
```

### **文件大小**

```
Bundle:     ███ 3.4 MB
Workspace:  ████████████████████ 300+ MB
```

### **服务器依赖**

```
Bundle:     3 个 npm 包
Workspace:  247 个 npm 包 + pnpm
```

---

## 🛠️ **使用建议**

### **生产环境** ✅

```bash
# 使用 Bundle 模式
配置文件: server-bundle.json
部署目录: /var/www/ai-ssh-server-bundle
```

**优势**：

- 快速部署，不影响用户
- 体积小，节省带宽
- 无需 workspace 依赖

### **开发环境** 🔧

```bash
# 使用 Workspace 模式
配置文件: server.json
部署目录: /var/www/ai-ssh-server-workspace
```

**优势**：

- 可以在服务器上调试
- 完整的开发工具链
- 支持数据库迁移

---

## 📝 **配置文件位置**

```
C:\Users\Administrator\AppData\Roaming\@ai-ssh\desktop\.deploy\project-1761548457808-j84vng06j\
├── server-bundle.json          # Bundle 模式配置 ⭐
├── server.json                 # Workspace 模式配置
├── build-bundle.sh             # Bundle 打包脚本
├── remote-setup-bundle.sh      # Bundle 远程安装
├── create-dirs-bundle.sh       # Bundle 创建目录
├── build.sh                    # Workspace 构建脚本
├── remote-setup.sh             # Workspace 远程安装
└── create-dirs.sh              # Workspace 创建目录
```

---

## 🎯 **快速开始**

### **1. Bundle 模式（推荐）**

**AI 部署助手**：

1. 打开部署页面
2. 配置选择：`server-bundle.json`
3. 开始部署 → 45 秒完成 ✅

**命令行部署**：

```bash
# 本地打包
cd packages/server
pnpm build:bundle

# 上传
scp -r dist-bundle/* root@192.168.3.5:/var/www/ai-ssh-server-bundle/

# 远程安装启动
ssh root@192.168.3.5
cd /var/www/ai-ssh-server-bundle
npm install @prisma/client sharp ssh2 --production
npx prisma generate --schema=./prisma/schema-postgresql.prisma
pm2 start index.js --name server
```

### **2. Workspace 模式**

**AI 部署助手**：

1. 打开部署页面
2. 配置选择：`server.json`
3. 开始部署 → 4 分钟完成

---

## 🔍 **常见问题**

### **Q: Bundle 会影响性能吗？**

A: **不会！** Bundle 只是把多个文件合并成一个，运行时性能完全一样。

### **Q: Bundle 支持 source map 吗？**

A: **支持！** `dist-bundle/index.js.map` 包含完整的 source map，可以精确调试。

### **Q: 两种模式可以共存吗？**

A: **可以！** 它们部署到不同目录，互不影响：

- Bundle: `/var/www/ai-ssh-server-bundle`
- Workspace: `/var/www/ai-ssh-server-workspace`

### **Q: 如何切换模式？**

A: 在 AI 部署助手中选择不同的配置文件即可：

- Bundle: `server-bundle.json`
- Workspace: `server.json`

### **Q: 哪个模式更稳定？**

A: **都很稳定！** Bundle 模式因为依赖少，反而更不容易出问题。

---

## 🎉 **总结**

### **推荐方案**

```
生产部署    → Bundle 模式 ⭐⭐⭐⭐⭐
开发调试    → Workspace 模式 ⭐⭐⭐
```

### **核心优势**

- ✅ Bundle：快速、简单、轻量
- ✅ Workspace：完整、灵活、可调试

**现在就试试 Bundle 模式吧！** 🚀

---

**最后更新**: 2025-11-01  
**配置版本**: v2.0 (双模式部署)

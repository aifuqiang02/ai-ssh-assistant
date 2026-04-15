# 🚀 简化部署方案对比

## 📋 当前问题

**Workspace 部署太复杂**：

- ❌ 需要上传整个 monorepo 结构
- ❌ 需要在服务器安装 pnpm
- ❌ 需要运行 `pnpm install`（慢）
- ❌ 需要生成 Prisma Client
- ❌ 需要处理 workspace 依赖

---

## 💡 **推荐方案：esbuild Bundle（最简单）** ⭐⭐⭐⭐⭐

### 优点

- ✅ **一个文件搞定**：所有代码打包成单文件
- ✅ **快速部署**：只需上传 `dist-bundle/` 目录
- ✅ **无需 pnpm**：服务器只要 Node.js
- ✅ **无需 workspace**：独立运行
- ✅ **秒级安装**：只装必要的二进制依赖

### 使用方法

#### 1. 本地打包

```bash
cd packages/server
pnpm build:bundle
```

**输出**：

```
dist-bundle/
├── index.js           # 单文件 bundle（包含所有 TS 代码）
├── index.js.map       # Source map
└── prisma/            # Prisma schema
```

#### 2. 部署到服务器

```bash
# 上传文件
scp -r dist-bundle root@server:/var/www/server

# 连接服务器
ssh root@server

# 安装二进制依赖（仅 3 个）
cd /var/www/server
npm install @prisma/client sharp ssh2 --production

# 生成 Prisma Client
npx prisma generate --schema=./prisma/schema-postgresql.prisma

# 启动
PORT=3000 node index.js

# 或用 PM2
pm2 start index.js --name server
```

**耗时**：约 30 秒！

---

## 🎯 **方案对比**

| 方案               | 上传大小       | 服务器安装时间 | 复杂度     | 推荐度 |
| ------------------ | -------------- | -------------- | ---------- | ------ |
| **当前 Workspace** | 全部文件（大） | 3-5 分钟       | ⭐⭐⭐⭐⭐ | ❌     |
| **esbuild Bundle** | ~5MB           | 30 秒          | ⭐         | ✅✅✅ |
| **Docker**         | 镜像           | 1 分钟         | ⭐⭐       | ✅✅   |

---

## 📦 **Bundle 部署配置示例**

### 本地构建脚本

```bash
#!/bin/bash
# build-bundle.sh

echo "🔨 开始打包..."

# 构建 bundle
cd packages/server
pnpm build:bundle

echo "✅ 打包完成！"
echo ""
echo "📦 输出目录: packages/server/dist-bundle/"
echo "📊 文件大小:"
du -sh dist-bundle
```

### 部署脚本（超简单）

```bash
#!/bin/bash
# deploy-bundle.sh

SERVER="root@192.168.3.5"
REMOTE_DIR="/var/www/server"

echo "📤 上传文件..."
scp -r packages/server/dist-bundle/* $SERVER:$REMOTE_DIR/

echo "🚀 远程安装并启动..."
ssh $SERVER << 'ENDSSH'
cd /var/www/server

# 安装二进制依赖（如果未安装）
if [ ! -d "node_modules" ]; then
    npm install @prisma/client sharp ssh2 --production
fi

# 生成 Prisma Client
export CI=true
npx prisma generate --schema=./prisma/schema-postgresql.prisma

# 重启 PM2
pm2 restart server || pm2 start index.js --name server

echo "✅ 部署完成！"
pm2 logs server --lines 20
ENDSSH
```

**执行**：

```bash
bash deploy-bundle.sh
```

---

## 🔧 **需要修改的文件**

### 1. `packages/server/build.config.mjs` （已创建）

打包配置

### 2. `packages/server/package.json` （已修改）

添加脚本：

```json
{
  "scripts": {
    "build:bundle": "node build.config.mjs",
    "start:bundle": "node dist-bundle/index.js"
  }
}
```

---

## 🎉 **总结：为什么选 Bundle？**

### **开发时**

- ✅ 保持 workspace 结构
- ✅ 类型安全、代码共享
- ✅ 热重载快

### **生产时**

- ✅ 一个文件，超简单
- ✅ 部署快（30 秒）
- ✅ 无需 pnpm
- ✅ 体积小（~5MB）

**最佳实践**：

- 开发：用 workspace
- 打包：用 bundle
- 部署：传单文件

---

## 📝 **下一步**

1. 测试本地打包：`cd packages/server && pnpm build:bundle`
2. 检查输出：`ls -lh dist-bundle/`
3. 本地测试：`pnpm start:bundle`
4. 修改部署配置使用 bundle 模式

**就这么简单！** 🎊

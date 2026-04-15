# 🔐 环境变量配置指南

## ❌ 当前问题

**Bundle 部署失败原因**：缺少 `.env` 文件，导致必需的环境变量未定义。

---

## ✅ 解决方案

### **方案 1：在服务器上手动创建 `.env`（推荐）** ⭐

#### 步骤 1：连接服务器
```bash
ssh root@192.168.3.5
cd /var/www/ai-ssh-server-bundle
```

#### 步骤 2：生成密钥
```bash
# 生成 JWT_SECRET (32+ 字符)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# 生成 ENCRYPTION_KEY (正好 32 字符)
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(16).toString('hex'))"

# 生成 SESSION_SECRET (32+ 字符)
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

#### 步骤 3：创建 `.env` 文件
```bash
nano .env
```

**粘贴以下内容并修改**：
```env
NODE_ENV=production
PORT=3000

# 数据库（修改为你的配置）
DATABASE_URL=postgresql://user:pass@localhost:5432/ai_ssh_assistant

# 密钥（使用上面生成的值）
JWT_SECRET=<生成的JWT密钥>
ENCRYPTION_KEY=<生成的加密密钥>
SESSION_SECRET=<生成的Session密钥>

# AI 服务（至少配置一个）
OPENAI_API_KEY=sk-your-key
# 或
ANTHROPIC_API_KEY=sk-ant-your-key
```

保存并退出（`Ctrl+X` → `Y` → `Enter`）

#### 步骤 4：重启应用
```bash
pm2 restart @ai-ssh/server
pm2 logs @ai-ssh/server
```

---

### **方案 2：自动化部署（修改部署配置）**

#### 修改 `server-bundle.json`，添加 `.env` 上传步骤：

```json
{
  "steps": [
    {
      "name": "Build Bundle",
      "type": "script",
      "script": {
        "file": ".deploy/project-1761548457808-j84vng06j/build-bundle.sh",
        "location": "local"
      }
    },
    {
      "name": "Create Remote Directory",
      "type": "script",
      "script": {
        "file": ".deploy/project-1761548457808-j84vng06j/create-dirs-bundle.sh",
        "location": "remote",
        "sshConnectionId": "cmgqd52q60001xo32ethtbv8y"
      }
    },
    {
      "name": "Upload Bundle Files",
      "type": "upload",
      "upload": {
        "sshConnectionId": "cmgqd52q60001xo32ethtbv8y",
        "localPath": "D:/git-projects/ai-ssh-assistant/packages/server/dist-bundle",
        "remotePath": "/var/www/ai-ssh-server-bundle",
        "files": [
          "index.js",
          "prisma"
        ]
      }
    },
    {
      "name": "Upload .env File",
      "type": "upload",
      "upload": {
        "sshConnectionId": "cmgqd52q60001xo32ethtbv8y",
        "localPath": "D:/git-projects/ai-ssh-assistant/packages/server",
        "remotePath": "/var/www/ai-ssh-server-bundle",
        "files": [
          ".env.production"
        ]
      }
    },
    {
      "name": "Install & Start PM2",
      "type": "script",
      "script": {
        "file": ".deploy/project-1761548457808-j84vng06j/remote-setup-bundle.sh",
        "location": "remote",
        "sshConnectionId": "cmgqd52q60001xo32ethtbv8y"
      }
    }
  ]
}
```

**然后**：
1. 在本地创建 `packages/server/.env.production`
2. 配置好所有必需的环境变量
3. 重新部署

---

## 📋 必需的环境变量清单

| 变量 | 必需? | 长度要求 | 说明 |
|------|------|----------|------|
| `DATABASE_URL` | ✅ | N/A | PostgreSQL 连接字符串 |
| `JWT_SECRET` | ✅ | ≥32 字符 | JWT 令牌签名密钥 |
| `ENCRYPTION_KEY` | ✅ | =32 字符 | 数据加密密钥 |
| `SESSION_SECRET` | ✅ | ≥32 字符 | Session 签名密钥 |
| `OPENAI_API_KEY` | ⚠️ | N/A | OpenAI API 密钥（二选一）|
| `ANTHROPIC_API_KEY` | ⚠️ | N/A | Anthropic API 密钥（二选一）|

⚠️ = 至少配置一个 AI 服务

---

## 🔧 密钥生成脚本

创建 `generate-secrets.sh`：
```bash
#!/bin/bash

echo "🔐 生成生产环境密钥..."
echo ""

echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
echo "ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")"
echo "SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"

echo ""
echo "✅ 复制上面的密钥到 .env 文件中"
```

**使用**：
```bash
bash generate-secrets.sh
```

---

## 🎯 快速修复（立即解决）

**在服务器上执行**：
```bash
ssh root@192.168.3.5 << 'ENDSSH'
cd /var/www/ai-ssh-server-bundle

# 快速生成 .env
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_ssh_assistant
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
OPENAI_API_KEY=sk-your-openai-key-here
EOF

# 重启
pm2 restart @ai-ssh/server
pm2 logs @ai-ssh/server --lines 20
ENDSSH
```

**记得修改**：
- `DATABASE_URL` - 你的数据库连接
- `OPENAI_API_KEY` 或 `ANTHROPIC_API_KEY` - 你的 AI API 密钥

---

## ✅ 验证配置

```bash
# 查看环境变量是否加载
pm2 logs @ai-ssh/server | grep "Configuration loaded"

# 应该看到：
# ��� Configuration loaded:
#    Environment: production
#    Server: 0.0.0.0:3000
#    Database: postgresql://***:***@localhost:5432/ai_ssh_assistant
#    AI Services: OpenAI ✓
```

---

## 📝 最佳实践

1. ✅ **本地不提交 `.env`** - 添加到 `.gitignore`
2. ✅ **生产用 `.env.production`** - 单独管理
3. ✅ **定期轮换密钥** - 每 90 天更新
4. ✅ **使用密钥管理服务** - AWS Secrets Manager / HashiCorp Vault

---

**现在去服务器上创建 `.env` 文件吧！** 🚀


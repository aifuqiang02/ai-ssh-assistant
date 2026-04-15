# MinIO 配置说明

## 当前配置信息

```
服务器: 110.42.111.221:45345
用户名: admin
密码: minioadmin123
Bucket: aissh
SSL: false
```

## 配置方式

### 1. 环境变量文件

在 `packages/server/.env` 文件中配置：

```bash
# MinIO 配置
MINIO_ENDPOINT=110.42.111.221
MINIO_PORT=45345
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=aissh
```

### 2. 环境变量加载顺序

服务端按以下优先级加载环境变量：
1. `packages/server/.env` (最高优先级)
2. 项目根目录 `/.env`
3. `packages/.env`
4. 系统环境变量

### 3. 配置验证

启动时会验证以下配置项是否存在：
- `MINIO_ENDPOINT` ✅ 必需
- `MINIO_PORT` ✅ 必需
- `MINIO_ACCESS_KEY` ✅ 必需
- `MINIO_SECRET_KEY` ✅ 必需
- `MINIO_BUCKET` (可选，默认: documents)
- `MINIO_USE_SSL` (可选，默认: false)

### 4. 不同环境配置

可以为不同环境创建对应的 .env 文件：
- `.env.development` - 开发环境
- `.env.production` - 生产环境
- `.env.test` - 测试环境

## 注意事项

- `.env` 文件已被 .gitignore 忽略，不会提交到版本控制
- 生产环境请妥善保管 .env 文件，不要泄露 MinIO 认证信息
- MinIO bucket 会在首次上传时自动创建
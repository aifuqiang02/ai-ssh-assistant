# 启动服务器并连接到 PostgreSQL
$env:NODE_ENV="development"
$env:PORT="3000"
$env:HOST="0.0.0.0"
$env:DATABASE_URL="postgresql://ai_ssh_user:ai_ssh_password@localhost:5432/ai_ssh_assistant"
$env:REDIS_HOST="localhost"
$env:REDIS_PORT="6379"
$env:JWT_SECRET="development-jwt-secret-key-32-chars-min"
$env:ENCRYPTION_KEY="12345678901234567890123456789012"
$env:SESSION_SECRET="development-session-secret-key-32-chars-min"
$env:CORS_ORIGIN="http://localhost:5173,http://localhost:3000,http://127.0.0.1:3000"
$env:OPENAI_API_KEY="test-key"
$env:ANTHROPIC_API_KEY="test-key"

Write-Host "🚀 启动服务器，连接到 PostgreSQL..." -ForegroundColor Green
Write-Host "📊 数据库: postgresql://ai_ssh_user:***@localhost:5432/ai_ssh_assistant" -ForegroundColor Yellow

cd packages/server
pnpm dev

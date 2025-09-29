# AI SSH Assistant 开发环境启动脚本

Write-Host "🚀 启动 AI SSH Assistant 开发环境..." -ForegroundColor Cyan

# 设置环境变量
$env:NODE_ENV = "development"
$env:PORT = "3000"
$env:HOST = "0.0.0.0"
$env:DATABASE_URL = "postgresql://ai_ssh_user:ai_ssh_password@localhost:5432/ai_ssh_assistant"
$env:REDIS_HOST = "localhost"
$env:REDIS_PORT = "6379"
$env:JWT_SECRET = "development-jwt-secret-key-32-chars-min"
$env:ENCRYPTION_KEY = "12345678901234567890123456789012"
$env:SESSION_SECRET = "development-session-secret-key-32-chars-min"
$env:CORS_ORIGIN = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:3000"
$env:OPENAI_API_KEY = "test-key"
$env:ANTHROPIC_API_KEY = "test-key"
$env:LOG_LEVEL = "info"

Write-Host "✅ 环境变量已设置" -ForegroundColor Green
Write-Host ""
Write-Host "📊 数据库配置:" -ForegroundColor Yellow
Write-Host "  DATABASE_URL: $env:DATABASE_URL" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 启动选项:" -ForegroundColor Yellow
Write-Host "  [1] 启动 Server (后端)" -ForegroundColor White
Write-Host "  [2] 启动 Desktop (前端)" -ForegroundColor White
Write-Host "  [3] 启动全部" -ForegroundColor White
Write-Host "  [4] 退出" -ForegroundColor White
Write-Host ""

$choice = Read-Host "请选择 (1-4)"

switch ($choice) {
  "1" {
    Write-Host "🚀 启动 Server..." -ForegroundColor Cyan
    Set-Location packages/server
    pnpm dev
  }
  "2" {
    Write-Host "🚀 启动 Desktop..." -ForegroundColor Cyan
    Set-Location apps/desktop
    pnpm dev
  }
  "3" {
    Write-Host "🚀 启动全部服务..." -ForegroundColor Cyan
        
    # 启动 Server
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\packages\server'; `$env:DATABASE_URL='postgresql://ai_ssh_user:ai_ssh_password@localhost:5432/ai_ssh_assistant'; `$env:JWT_SECRET='development-jwt-secret-key-32-chars-min'; `$env:ENCRYPTION_KEY='12345678901234567890123456789012'; `$env:SESSION_SECRET='development-session-secret-key-32-chars-min'; `$env:CORS_ORIGIN='http://localhost:5173,http://localhost:3000,http://127.0.0.1:3000'; pnpm dev"
        
    Start-Sleep -Seconds 2
        
    # 启动 Desktop
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\apps\desktop'; pnpm dev"
        
    Write-Host "✅ 所有服务已启动" -ForegroundColor Green
  }
  "4" {
    Write-Host "👋 退出" -ForegroundColor Yellow
    exit
  }
  default {
    Write-Host "❌ 无效选择" -ForegroundColor Red
  }
}

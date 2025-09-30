# 修复 .env 文件配置

Write-Host "🔧 修复环境变量配置..." -ForegroundColor Cyan

# 备份现有 .env（如果存在）
if (Test-Path .env) {
  Copy-Item .env .env.backup -Force
  Write-Host "✅ 已备份现有 .env 文件到 .env.backup" -ForegroundColor Green
}

# 从 env.example 复制
Copy-Item env.example .env -Force

# 更新关键配置
$envContent = Get-Content .env

# 修复数据库 URL
$envContent = $envContent -replace 'DATABASE_URL="postgresql://username:password@localhost:5432/ai_ssh_assistant"', 'DATABASE_URL="postgresql://ai_ssh_user:ai_ssh_password@localhost:5432/ai_ssh_assistant"'

# 修复 JWT_SECRET（至少32字符）
$envContent = $envContent -replace 'JWT_SECRET=your-super-secret-jwt-key-here', 'JWT_SECRET=dev-jwt-secret-key-1234567890123456'

# 修复 ENCRYPTION_KEY（正好32字符）
$envContent = $envContent -replace 'ENCRYPTION_KEY=your-32-char-secret-encryption-key', 'ENCRYPTION_KEY=12345678901234567890123456789012'

# 修复 SESSION_SECRET（至少32字符）
$envContent = $envContent -replace 'SESSION_SECRET=your-session-secret-key', 'SESSION_SECRET=dev-session-secret-1234567890123456'

# 保存修改
$envContent | Set-Content .env -Encoding UTF8

Write-Host ""
Write-Host "✅ .env 文件已修复！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 关键配置:" -ForegroundColor Yellow
Write-Host "  DATABASE_URL: postgresql://ai_ssh_user:ai_ssh_password@localhost:5432/ai_ssh_assistant" -ForegroundColor Gray
Write-Host "  JWT_SECRET: dev-jwt-secret-key-1234567890123456 (35 chars)" -ForegroundColor Gray
Write-Host "  ENCRYPTION_KEY: 12345678901234567890123456789012 (32 chars)" -ForegroundColor Gray
Write-Host "  SESSION_SECRET: dev-session-secret-1234567890123456 (35 chars)" -ForegroundColor Gray
Write-Host ""

# 验证配置
Write-Host "🔍 验证配置..." -ForegroundColor Cyan
$jwtSecret = (Select-String -Path .env -Pattern "^JWT_SECRET=" | Select-Object -First 1).Line -replace 'JWT_SECRET=', ''
$encryptionKey = (Select-String -Path .env -Pattern "^ENCRYPTION_KEY=" | Select-Object -First 1).Line -replace 'ENCRYPTION_KEY=', ''
$sessionSecret = (Select-String -Path .env -Pattern "^SESSION_SECRET=" | Select-Object -First 1).Line -replace 'SESSION_SECRET=', ''

Write-Host "JWT_SECRET 长度: $($jwtSecret.Length) $(if ($jwtSecret.Length -ge 32) { '✅' } else { '❌ 需要至少32字符' })" -ForegroundColor $(if ($jwtSecret.Length -ge 32) { 'Green' } else { 'Red' })
Write-Host "ENCRYPTION_KEY 长度: $($encryptionKey.Length) $(if ($encryptionKey.Length -eq 32) { '✅' } else { '❌ 需要正好32字符' })" -ForegroundColor $(if ($encryptionKey.Length -eq 32) { 'Green' } else { 'Red' })
Write-Host "SESSION_SECRET 长度: $($sessionSecret.Length) $(if ($sessionSecret.Length -ge 32) { '✅' } else { '❌ 需要至少32字符' })" -ForegroundColor $(if ($sessionSecret.Length -ge 32) { 'Green' } else { 'Red' })
Write-Host ""
Write-Host "🎉 配置完成！现在可以运行 pnpm dev 启动项目" -ForegroundColor Green

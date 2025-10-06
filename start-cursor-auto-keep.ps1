# Auto Keep All - Cursor 自动启动脚本（PowerShell 版本）
# 完全自动化启动 Cursor 并注入 Auto Keep All 脚本

param(
    [string]$CursorPath = "$env:LOCALAPPDATA\Programs\cursor\Cursor.exe"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cursor Auto Keep All 启动器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Cursor 是否存在
if (-not (Test-Path $CursorPath)) {
    Write-Host "[错误] 未找到 Cursor: $CursorPath" -ForegroundColor Red
    Write-Host "[提示] 请手动指定 Cursor 路径，例如：" -ForegroundColor Yellow
    Write-Host "  .\start-cursor-auto-keep.ps1 -CursorPath 'C:\Your\Path\Cursor.exe'" -ForegroundColor Cyan
    exit 1
}

# 获取项目路径
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "[信息] Cursor 路径: $CursorPath" -ForegroundColor Green
Write-Host "[信息] 项目路径: $projectPath" -ForegroundColor Green
Write-Host ""

# 方法 1: 启动 Cursor 并等待加载
Write-Host "[步骤 1/3] 启动 Cursor..." -ForegroundColor Yellow
$process = Start-Process -FilePath $CursorPath -ArgumentList $projectPath -PassThru

Write-Host "[步骤 2/3] 等待 Cursor 启动..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host "[步骤 3/3] 准备注入脚本..." -ForegroundColor Yellow
Write-Host ""

# 方法 2: 提示用户使用快捷方式
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Auto Keep All 激活指南" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "请在 Cursor 中执行以下操作：" -ForegroundColor White
Write-Host ""
Write-Host "1. 按 F12 键打开开发者工具" -ForegroundColor Green
Write-Host "2. 切换到 Console 标签" -ForegroundColor Green
Write-Host "3. 按 Ctrl+V 粘贴脚本（已复制到剪贴板）" -ForegroundColor Green
Write-Host "4. 按 Enter 执行" -ForegroundColor Green
Write-Host ""

# 读取脚本并复制到剪贴板
$scriptPath = Join-Path $projectPath ".vscode\auto-keep-all-script.js"
if (Test-Path $scriptPath) {
    $scriptContent = Get-Content $scriptPath -Raw
    Set-Clipboard -Value $scriptContent
    Write-Host "[成功] 脚本已复制到剪贴板！" -ForegroundColor Green
    Write-Host "[提示] 直接在控制台按 Ctrl+V 即可粘贴" -ForegroundColor Yellow
} else {
    Write-Host "[错误] 脚本文件不存在: $scriptPath" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  或使用完全自动化方案" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "运行以下命令以完全自动化：" -ForegroundColor Yellow
Write-Host ""
Write-Host "# 1. 重启 Cursor（调试模式）" -ForegroundColor Cyan
Write-Host "taskkill /F /IM Cursor.exe" -ForegroundColor Gray
Write-Host "'$CursorPath' --remote-debugging-port=9222 '$projectPath'" -ForegroundColor Gray
Write-Host ""
Write-Host "# 2. 运行注入脚本" -ForegroundColor Cyan
Write-Host ".\\.vscode\\inject-script.ps1" -ForegroundColor Gray
Write-Host ""

# 选项菜单
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "选择操作：" -ForegroundColor White
Write-Host "1. 我已手动执行脚本（关闭此窗口）" -ForegroundColor Green
Write-Host "2. 以调试模式重启 Cursor（完全自动化）" -ForegroundColor Yellow
Write-Host "3. 退出" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "请输入选择 (1-3)"

switch ($choice) {
    "1" {
        Write-Host "[完成] Auto Keep All 已激活！" -ForegroundColor Green
        exit 0
    }
    "2" {
        Write-Host "[信息] 正在关闭 Cursor..." -ForegroundColor Yellow
        Stop-Process -Name "Cursor" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        
        Write-Host "[信息] 以调试模式启动 Cursor..." -ForegroundColor Yellow
        Start-Process -FilePath $CursorPath -ArgumentList "--remote-debugging-port=9222", $projectPath
        Start-Sleep -Seconds 8
        
        Write-Host "[信息] 注入脚本..." -ForegroundColor Yellow
        & "$projectPath\.vscode\inject-script.ps1"
    }
    default {
        Write-Host "[取消] 已退出" -ForegroundColor Gray
        exit 0
    }
}


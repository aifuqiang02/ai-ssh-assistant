# 创建 Cursor Auto Keep All 桌面快捷方式
# 运行此脚本后，双击桌面快捷方式即可完全自动启动

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "Cursor Auto Keep All.lnk"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  创建 Auto Keep All 快捷方式" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 创建快捷方式
$WScriptShell = New-Object -ComObject WScript.Shell
$shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "powershell.exe"
$shortcut.Arguments = "-ExecutionPolicy Bypass -File `"$projectPath\start-cursor-auto-keep.ps1`""
$shortcut.WorkingDirectory = $projectPath
$shortcut.Description = "启动 Cursor 并自动激活 Auto Keep All"
$shortcut.IconLocation = "$env:LOCALAPPDATA\Programs\cursor\Cursor.exe,0"
$shortcut.Save()

Write-Host "[成功] 快捷方式已创建！" -ForegroundColor Green
Write-Host "[位置] $shortcutPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "[使用方法] 双击桌面上的 'Cursor Auto Keep All' 图标即可启动" -ForegroundColor Cyan
Write-Host ""

# 提示创建自动启动
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  可选：开机自动启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
$autoStart = Read-Host "是否添加到开机启动？(Y/N)"

if ($autoStart -eq "Y" -or $autoStart -eq "y") {
    $startupPath = [Environment]::GetFolderPath("Startup")
    $startupShortcut = Join-Path $startupPath "Cursor Auto Keep All.lnk"
    
    Copy-Item $shortcutPath $startupShortcut
    
    Write-Host "[成功] 已添加到开机启动！" -ForegroundColor Green
    Write-Host "[位置] $startupShortcut" -ForegroundColor Yellow
} else {
    Write-Host "[跳过] 未添加到开机启动" -ForegroundColor Gray
}

Write-Host ""
Write-Host "完成！" -ForegroundColor Green


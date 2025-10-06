@echo off
REM ========================================
REM  Cursor Auto Keep All 启动器
REM  完全自动化版本
REM ========================================

title Cursor Auto Keep All

echo.
echo ========================================
echo   Cursor Auto Keep All 启动器
echo ========================================
echo.

REM 关闭现有 Cursor 进程
echo [1/4] 关闭现有 Cursor 进程...
taskkill /F /IM Cursor.exe 2>nul
timeout /t 2 /nobreak >nul

REM 以调试模式启动 Cursor
echo [2/4] 以调试模式启动 Cursor...
start "" "%LOCALAPPDATA%\Programs\cursor\Cursor.exe" --remote-debugging-port=9222 "%~dp0"

REM 等待 Cursor 完全启动
echo [3/4] 等待 Cursor 启动...
timeout /t 8 /nobreak

REM 注入脚本
echo [4/4] 注入 Auto Keep All 脚本...
powershell -ExecutionPolicy Bypass -File "%~dp0.vscode\inject-script.ps1"

echo.
echo ========================================
echo   启动完成！
echo ========================================
echo.
echo Auto Keep All 已自动激活！
echo.
echo 如果脚本注入失败，请手动执行：
echo 1. 按 F12 打开开发者工具
echo 2. 按 Ctrl+V 粘贴脚本（已复制到剪贴板）
echo 3. 按 Enter 执行
echo.

pause


@echo off
REM Auto Keep All - Cursor 启动脚本（Windows）
REM 使用此脚本启动 Cursor，自动加载 Auto Keep All 功能

echo ========================================
echo   Cursor Auto Keep All 启动器
echo ========================================
echo.

REM Cursor 可执行文件路径（根据实际安装位置修改）
set CURSOR_PATH=C:\Users\%USERNAME%\AppData\Local\Programs\cursor\Cursor.exe

REM 检查 Cursor 是否存在
if not exist "%CURSOR_PATH%" (
    echo [错误] 未找到 Cursor，请修改脚本中的 CURSOR_PATH 路径
    echo 当前路径: %CURSOR_PATH%
    echo.
    pause
    exit /b 1
)

REM 项目路径
set PROJECT_PATH=%~dp0

echo [信息] 正在启动 Cursor...
echo [信息] 项目路径: %PROJECT_PATH%
echo.

REM 启动 Cursor 并加载项目
start "" "%CURSOR_PATH%" "%PROJECT_PATH%"

REM 等待 Cursor 启动
timeout /t 5 /nobreak > nul

REM 使用 PowerShell 注入脚本到 Cursor
echo [信息] 正在注入 Auto Keep All 脚本...
powershell -ExecutionPolicy Bypass -File "%PROJECT_PATH%.vscode\inject-script.ps1"

echo.
echo [完成] Cursor 已启动，Auto Keep All 已激活！
echo.
pause


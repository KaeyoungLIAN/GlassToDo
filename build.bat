@echo off
chcp 65001 >nul
title GlassTodo 构建工具

echo ============================================
echo   GlassTodo v2.0 (Tauri)
echo   构建单文件 exe，双击即用，无需任何运行库
echo ============================================
echo.

:: 检查 Rust
rustc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [❌] 未检测到 Rust
    echo     下载安装：https://www.rust-lang.org/tools/install
    pause
    exit /b 1
)

:: 检查 Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [❌] 未检测到 Node.js
    echo     下载安装：https://nodejs.org/
    pause
    exit /b 1
)

echo [1/3] 安装前端依赖...
cd /d "%~dp0"
call npm install
if %errorlevel% neq 0 ( echo [❌] npm install 失败 & pause & exit /b 1 )
echo [✓] 前端依赖就绪

echo.
echo [2/3] 编译 Rust 后端（首次需要下载 crate，约 3-10 分钟）...
cd src-tauri
cargo tauri build
if %errorlevel% neq 0 ( echo [❌] 构建失败 & pause & exit /b 1 )

echo.
echo ============================================
echo   构建完成！
echo ============================================
echo.
echo 绿色 exe（双击即用）：
echo   src-tauri\target\release\GlassTodo.exe
echo.
echo MSI 安装包：
echo   src-tauri\target\release\bundle\msi\GlassTodo_2.0.0_x64.msi
echo.
echo   ⚡ 文件大小约 5MB，无需任何运行库
echo.
pause

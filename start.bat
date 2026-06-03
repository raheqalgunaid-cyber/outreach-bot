@echo off
title SuperLive Outreach Bot - Launcher
color 0A

echo ============================================
echo   SuperLive Outreach Bot - Local Runner
echo ============================================
echo.

:: ── Load .env file if it exists ───────────────────────────────
if exist ".env" (
    echo Loading .env file...
    for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
        if not "%%A"=="" if not "%%A:~0,1%"=="#" (
            set "%%A=%%B"
        )
    )
)

:: ── Check pnpm ─────────────────────────────────────────────────
where pnpm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] pnpm not found. Install it with:
    echo   npm install -g pnpm
    echo.
    pause
    exit /b 1
)

:: ── Check DATABASE_URL ─────────────────────────────────────────
if "%DATABASE_URL%"=="" (
    echo [ERROR] DATABASE_URL not set.
    echo.
    echo Create a file called .env in this folder with:
    echo   DATABASE_URL=postgresql://postgres:PASSWORD@db.xxxx.supabase.co:5432/postgres
    echo.
    echo See .env.example for a template.
    pause
    exit /b 1
)

echo DATABASE_URL loaded OK.
echo.

:: ── Install dependencies ───────────────────────────────────────
if not exist "node_modules" (
    echo [1/3] Installing dependencies ^(first run only^)...
    call pnpm install
    if errorlevel 1 (
        echo [ERROR] pnpm install failed.
        pause
        exit /b 1
    )
) else (
    echo [1/3] Dependencies already installed.
)

:: ── Push DB schema ─────────────────────────────────────────────
echo [2/3] Pushing database schema...
call pnpm --filter @workspace/db run push
if errorlevel 1 (
    echo [WARNING] DB push had issues - tables may already exist, continuing...
)

:: ── Start servers ──────────────────────────────────────────────
echo [3/3] Starting servers...
echo.

start "API Server (port 5000)" cmd /k "set DATABASE_URL=%DATABASE_URL% && pnpm --filter @workspace/api-server run dev"
timeout /t 2 /nobreak >nul
start "Frontend (port 3000)" cmd /k "pnpm --filter @workspace/app run dev"

echo.
echo ============================================
echo   Open in browser: http://localhost:3000
echo ============================================
echo.
pause

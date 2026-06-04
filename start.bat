@echo off
title SuperLive Outreach Bot - Launcher
color 0A

echo ============================================
echo   SuperLive Outreach Bot - Local Runner
echo ============================================
echo.

:: Load DATABASE_URL from .env file
if exist ".env" (
    echo Loading .env file...
    for /f "tokens=1,* delims==" %%A in (.env) do (
        if /i "%%A"=="DATABASE_URL" set "DATABASE_URL=%%B"
    )
)

:: Check DATABASE_URL
if not defined DATABASE_URL (
    echo [ERROR] DATABASE_URL not found.
    echo.
    echo Make sure your .env file is in the same folder as start.bat
    echo and contains a line like:
    echo   DATABASE_URL=postgresql://postgres:PASSWORD@host:5432/postgres
    echo.
    pause
    exit /b 1
)

echo DATABASE_URL loaded OK.
echo.

:: Check pnpm
where pnpm >/dev/null 2>&1
if errorlevel 1 (
    echo [ERROR] pnpm not found. Install it with:
    echo   npm install -g pnpm
    echo.
    pause
    exit /b 1
)

:: Install dependencies
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

:: Push DB schema
echo [2/3] Pushing database schema...
call pnpm --filter @workspace/db run push
if errorlevel 1 (
    echo [WARNING] DB push had issues - tables may already exist, continuing...
)

:: Start servers
echo [3/3] Starting servers...
echo.

start "API Server (port 5000)" cmd /k "set DATABASE_URL=%DATABASE_URL% && pnpm --filter @workspace/api-server run dev"
timeout /t 2 /nobreak >/dev/null
start "Frontend (port 3000)" cmd /k "pnpm --filter @workspace/app run dev"

echo.
echo ============================================
echo   Open in browser: http://localhost:3000
echo ============================================
echo.
pause

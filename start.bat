@echo off
title SuperLive Outreach Bot - Launcher
color 0A

echo ============================================
echo   SuperLive Outreach Bot - Local Runner
echo ============================================
echo.

:: ── Step 1: Ensure pnpm is available ──────────────────────────
where pnpm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] pnpm not found. Install it first:
    echo   npm install -g pnpm
    echo.
    pause
    exit /b 1
)

:: ── Step 2: Ask for DATABASE_URL if not already set ───────────
if "%DATABASE_URL%"=="" (
    echo No DATABASE_URL found in environment.
    echo.
    set /p DATABASE_URL="Enter your PostgreSQL connection string: "
    echo.
)

if "%DATABASE_URL%"=="" (
    echo [ERROR] DATABASE_URL is required to run the app.
    pause
    exit /b 1
)

:: ── Step 3: Install dependencies ──────────────────────────────
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

:: ── Step 4: Push DB schema ─────────────────────────────────────
echo [2/3] Pushing database schema...
call pnpm --filter @workspace/db run push
if errorlevel 1 (
    echo [WARNING] DB schema push failed - check your DATABASE_URL.
    echo           The app may still work if tables already exist.
)

:: ── Step 5: Start both servers ─────────────────────────────────
echo [3/3] Starting servers...
echo.

start "API Server ^(port 5000^)" cmd /k "set DATABASE_URL=%DATABASE_URL% && echo Starting API server... && pnpm --filter @workspace/api-server run dev"

timeout /t 2 /nobreak >nul

start "Frontend ^(port 3000^)" cmd /k "echo Starting frontend... && pnpm --filter @workspace/app run dev"

echo.
echo ============================================
echo   App is starting up!
echo.
echo   Frontend : http://localhost:3000
echo   API      : http://localhost:5000/api/healthz
echo ============================================
echo.
echo Two terminal windows have opened.
echo Close them to stop the servers.
echo.
pause

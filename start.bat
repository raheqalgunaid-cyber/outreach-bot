@echo off
title SuperLive Outreach Bot

:: Check for DATABASE_URL
if "%DATABASE_URL%"=="" (
    echo ERROR: DATABASE_URL environment variable is not set.
    echo Set it before running this script:
    echo   set DATABASE_URL=postgres://user:password@localhost:5432/outreach_bot
    pause
    exit /b 1
)

:: Install dependencies if node_modules is missing
if not exist "node_modules" (
    echo Installing dependencies...
    call pnpm install
    if errorlevel 1 (
        echo ERROR: pnpm install failed. Make sure pnpm is installed: npm i -g pnpm
        pause
        exit /b 1
    )
)

:: Push DB schema
echo Pushing database schema...
call pnpm --filter @workspace/db run push
if errorlevel 1 (
    echo WARNING: DB schema push failed. Check your DATABASE_URL.
)

:: Start backend in a new window
echo Starting API server on port 5000...
start "API Server" cmd /k "pnpm --filter @workspace/api-server run dev"

:: Wait a moment for the backend to initialize
timeout /t 2 /nobreak >nul

:: Start frontend in a new window
echo Starting frontend on port 3000...
start "Frontend" cmd /k "pnpm --filter @workspace/app run dev"

echo.
echo Both servers are starting:
echo   Frontend : http://localhost:3000
echo   API      : http://localhost:5000
echo.
echo Close the two terminal windows to stop the servers.
pause

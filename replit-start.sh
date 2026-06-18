#!/usr/bin/env bash
set -e

pnpm install

if [ -z "$DATABASE_URL" ]; then
  echo "[ERROR] DATABASE_URL secret is not set. Add it in the Secrets tool."
  exit 1
fi

pnpm --filter @workspace/db run push || echo "[WARNING] DB push had issues - tables may already exist, continuing..."

pnpm --filter @workspace/api-server run dev &
API_PID=$!

trap "kill $API_PID" EXIT

pnpm --filter @workspace/app run dev -- --host 0.0.0.0 --port 3000

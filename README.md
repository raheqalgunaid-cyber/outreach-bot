# outreach-bot

## Running locally (Windows)

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (and `CREDENTIALS_ENCRYPTION_KEY` if you'll store bot account credentials).
2. Double-click `start.bat`. It installs dependencies, pushes the DB schema, and starts the API server (port 5000) and dashboard (port 3000).
3. Open http://localhost:3000 in your browser.

Requires [Node.js](https://nodejs.org) and `pnpm` (`npm install -g pnpm`) installed first.
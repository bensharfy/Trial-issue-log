#!/bin/sh
ROOT="$(dirname "$0")"

echo "Installing dependencies..."
npm install --prefix "$ROOT/frontend" && npm install --prefix "$ROOT/server"

echo "Building frontend and starting server..."
npm run dev --prefix "$ROOT/server"

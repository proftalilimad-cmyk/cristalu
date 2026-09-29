#!/usr/bin/env bash
# Démarre l'aperçu local : réinstalle les dépendances si besoin, puis lance Vite.
# Usage : bash scripts/dev.sh [port]
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${1:-5173}"
if [ ! -x node_modules/.bin/vite ]; then
  echo "→ Installation des dépendances…"
  npm install --no-audit --no-fund
fi
exec npx vite --host 0.0.0.0 --port "$PORT"

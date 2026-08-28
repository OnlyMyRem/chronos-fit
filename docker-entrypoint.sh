#!/bin/sh
set -e

CONFIG_FILE="${CHRONOSFIT_CONFIG:-/app/data/config.yaml}"
TEMPLATE="$(cd "$(dirname "$0")" && pwd)/config.example.yaml"

# A first run against an empty volume gets an editable template; later runs keep
# whatever the operator put there. Never overwrite an existing config.
if [ ! -f "$CONFIG_FILE" ]; then
    if mkdir -p "$(dirname "$CONFIG_FILE")" 2>/dev/null; then
        cp "$TEMPLATE" "$CONFIG_FILE"
        echo "[ChronosFit] wrote default config to $CONFIG_FILE"
    else
        echo "[ChronosFit] $CONFIG_FILE not writable; falling back to built-in defaults"
    fi
fi

exec "$@"

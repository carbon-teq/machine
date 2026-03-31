#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <notebook.py> [--with package ...]"
  exit 2
fi

NOTEBOOK_PATH="$1"
shift

WITH_ARGS=()
EXTRA_ARGS=("$@")

if [ "${#EXTRA_ARGS[@]}" -eq 0 ]; then
  WITH_ARGS=(--with marimo --with numpy --with plotly)
else
  WITH_ARGS=(--with marimo "${EXTRA_ARGS[@]}")
fi

echo "1) Static validation: ${NOTEBOOK_PATH}"
uv run "${WITH_ARGS[@]}" marimo check "${NOTEBOOK_PATH}"

echo "2) Runtime smoke test (headless, 12s timeout)"
set +e
timeout 12s uv run "${WITH_ARGS[@]}" marimo run "${NOTEBOOK_PATH}" --headless --no-token --host 127.0.0.1 --port 27199
STATUS=$?
set -e

# timeout exits with 124 after healthy startup; treat that as success.
if [ "${STATUS}" -eq 0 ] || [ "${STATUS}" -eq 124 ]; then
  echo "Validation passed: no immediate runtime errors detected."
  exit 0
fi

echo "Validation failed: runtime error detected before startup stabilized."
exit "${STATUS}"

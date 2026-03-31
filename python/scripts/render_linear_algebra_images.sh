#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PY_DIR="$ROOT_DIR/python"
SCENE_FILE="$PY_DIR/scenes/linear_algebra_images.py"
MEDIA_DIR="$PY_DIR/media/images/linear_algebra_images"
WEB_IMG_DIR="$ROOT_DIR/web/public/images/linear-algebra"

echo "Rendering deterministic lesson images..."
cd "$PY_DIR"

uv run manim -s "$SCENE_FILE" VectorImage -o vectors-intuition.png
uv run manim -s "$SCENE_FILE" LinearCombinationImage -o linear-combinations-span.png

mkdir -p "$WEB_IMG_DIR"
cp "$MEDIA_DIR/vectors-intuition.png" "$WEB_IMG_DIR/vectors-intuition.png"
cp "$MEDIA_DIR/linear-combinations-span.png" "$WEB_IMG_DIR/linear-combinations-span.png"

echo "Done."
echo "Generated:"
echo " - $WEB_IMG_DIR/vectors-intuition.png"
echo " - $WEB_IMG_DIR/linear-combinations-span.png"

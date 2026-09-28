#!/usr/bin/env bash
# Génère les variantes responsives (WebP 480/800/1408, JPG de repli, LQIP)
# à partir des PNG sources de /assets vers /public/media.
#
# Prérequis : ImageMagick (`convert`).
# Usage : bash scripts/optimize-images.sh
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p public/media

shopt -s nullglob
for f in assets/img/*.png assets/img/*.jpg assets/hero/*.png; do
  b=$(basename "${f%.*}")
  b=${b#cristalu-}
  for w in 1408 800 480; do
    convert "$f" -resize "${w}x" -strip -quality 78 "public/media/${b}-${w}.webp"
  done
  convert "$f" -resize 1408x -strip -quality 80 "public/media/${b}-1408.jpg"
  convert "$f" -resize 24x -strip -quality 40 "public/media/${b}-lqip.jpg"
  echo "✓ ${b}"
done

#!/usr/bin/env bash
# Downloads the Open Font License fonts used by the print designs (TTF, all glyphs).
set -euo pipefail
cd "$(dirname "$0")"
FAMILIES=(
  "Anton" "Graduate" "Press Start 2P" "Monoton" "Permanent Marker" "Bowlby One" "Racing Sans One"
  "Unbounded:wght@400;700;900" "Archivo:wdth,wght@62,900;100,500;100,800;100,900;125,900;125,500"
  "Bagel Fat One" "Rubik Mono One" "Climate Crisis" "Sixtyfour" "Instrument Serif:ital@0;1"
  "Dela Gothic One" "Rampart One" "Big Shoulders Display:wght@700;900" "Silkscreen:wght@400;700"
  "Space Mono:wght@400;700" "Sedgwick Ave Display" "Shrikhand" "Syne:wght@500;800" "Tilt Warp"
  "Yellowtail" "Caveat Brush" "Bungee" "Bungee Shade" "Righteous" "Rubik:wght@500;900"
  "Baloo 2:wght@800" "Yatra One" "Rozha One" "Teko:wght@600"
)
: > fonts.css
for fam in "${FAMILIES[@]}"; do
  q=$(echo "$fam" | sed 's/ /+/g')
  css=$(curl -sS "https://fonts.googleapis.com/css2?family=$q")
  # Save each referenced TTF locally and rewrite its URL.
  for url in $(echo "$css" | grep -o 'https://[^)]*\.ttf' | sort -u); do
    file=$(basename "$url")
    [ -f "$file" ] || curl -sS -o "$file" "$url"
    css=${css//$url/$file}
  done
  echo "$css" >> fonts.css
done
echo "Fetched $(ls *.ttf | wc -l) font files"

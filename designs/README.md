# Bigben print design proposals

Builds design sheets in the in-house "CORE" format: a garment flat in each colourway with the print placed on it, plus the print artwork and its inks.

```
node build.mjs sheets/core-rn-hs-front-print-p01.json
```

Output goes to `output/<sheet-id>/`:
- `<sheet-id>.png` / `.pdf` — the sheet for review and sharing
- `prints/*.svg` — vector print artwork (fonts embedded)
- `prints/*-preview.png` — each print on its garment colour

## Files
- `sheets/*.json` — colourways, print and placement for each sheet
- `src/garment.mjs` — garment flats (round-neck half sleeve so far) and placement presets
- `src/prints.mjs` — original print artwork and the inks it uses
- `fonts/` — SIL Open Font License fonts from Google Fonts (Anton, Graduate, Press Start 2P, Bungee, Monoton, Permanent Marker, Bowlby One, Racing Sans One), which can be used commercially, including on garments

## Status
Every sheet is a **design proposal for approval, not a production file**:
- Design refs such as `P01-A` are proposal numbers, not style numbers.
- Garment colours on screen are approximate and must be matched to fabric swatches.
- Before screen making, text must be converted to outlines and each print sized for each size range.

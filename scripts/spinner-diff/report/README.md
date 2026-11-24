# Spinner: GIF vs. drawing

`Spinner` used to ship four animated GIFs. It is now SVG drawn from keyframes
traced out of those GIFs (`scripts/spinner-diff/trace.py` → `src/Spinner/spinnerFrames.js`,
drawing/animation in `src/Spinner/spinnerArt.js` and `Spinner.jsx`). The GIF files stay in the repo.

## What the GIFs contain

| | normal (`spinner-*.gif`) | large (`spinner-large-*.gif`) |
|---|---|---|
| canvas | 52×52 | 260×83 |
| frames / delay | 86 × 30 ms = 2.58 s loop | 132 × 30 ms = 3.96 s loop |
| motion | one shape, centred (centroid drifts ≤ ~1px): red circle → squashes to a blue square → folds to a yellow triangle (shrinks to ~1/3 size, spins) → rounds back to the red circle; colours cross-fade through mauve/teal/olive/orange | a ball bouncing across the strip, stretching, pinching in two (dumbbell) and throwing droplets (up to 4 pieces) as it changes colour red → blue → yellow → red. It is a different animation from the normal one, not a scaled copy |
| light vs dark | same silhouettes in every frame (checked); only the baked-in edge differs | same |

Colours (the GIF palette, sampled): red `#ff4a4a`, blue `#69cdff`, yellow `#ffb80d`
(`--mochi-selected`); the in-between frames use the GIF's own blended colours
(`FILLS` in `spinnerFrames.js`). Shapes and colours are unchanged.

The edge is a ~0.5px outline antialiased against a matte: white (light) / black (dark) for the
normal GIFs; grey `#5e5e5e` (light) / black (dark) for the large ones. In code that is a stroke drawn
under the fill, coloured from `--mochi-spinner-outline` (fallbacks above), so it follows the theme.

Per-frame centroid, area, fill and piece count: [`report/motion.csv`](report/motion.csv).

## How it is drawn

Each frame's silhouette is traced to sub-pixel precision (fill-colour coverage, marching squares) and stored as
a Fourier series per piece (≤ 18 harmonics, fit within 0.12px of the contour; 0.5px for droplets).
`Spinner` steps through the frames every 30 ms with `requestAnimationFrame`, rewriting a pool
of `<path>`s in place. `prefers-reduced-motion: reduce` holds the circle and fades it 100% ↔ 45%
(no morphing). `role="img"` + `aria-label={alt}`; `active`, `styleType`, `size`, `alt` and the rest props work as before
(the rest props now land on the `<svg>`). Data is ~90 KB of source (large) + ~45 KB (normal) before gzip.

## Frame-by-frame diff

`npm run build` is not involved; run `node scripts/spinner-diff/build.mjs && node scripts/spinner-diff/serve.mjs`
and open the printed URL (…/out/diff.html) in a Chromium (it decodes the GIFs with WebCodecs `ImageDecoder`).
Every frame of every GIF is composited over the theme background (`#f5f5f5` light, `#333` dark),
the drawing is rendered by the browser at the same frame at 1× and 2× and the two are compared.
Percentages are of *ink* pixels (where either image differs from the background; the canvas is mostly empty):
**mismatch** = ink pixels differing by more than 24/255; **shape** = the same but ignoring pixels whose
1px neighbourhood matches (softer/sub-pixel-shifted edges, which a 1× GIF blown up to 2× always has).

| size | theme | scale | mean mismatch | mean shape | worst mismatch (frame) | worst shape |
|---|---|---|---|---|---|---|
| normal | light | 1x | 5.9% | 0.6% | 27.5% (f72) | 5.5% |
| normal | light | 2x | 15.0% | 0.5% | 43.0% (f72) | 3.3% |
| normal | dark | 1x | 10.3% | 1.9% | 35.7% (f72) | 8.3% |
| normal | dark | 2x | 20.1% | 3.4% | 51.6% (f72) | 9.4% |
| large | light | 1x | 11.9% | 6.3% | 17.3% (f80) | 9.1% |
| large | light | 2x | 14.0% | 6.1% | 19.7% (f102) | 8.9% |
| large | dark | 1x | 10.3% | 5.7% | 15.6% (f102) | 10.2% |
| large | dark | 2x | 13.2% | 2.1% | 18.1% (f14) | 3.8% |

All 8×86/132 per-frame numbers: [`report/diff.csv`](report/diff.csv). Contact sheets of every frame
(red = mismatched pixel over the GIF's shape): `report/sheets/*.png`. GIF | drawing | difference crops of the
worst frames and a quarter-spaced sample: `report/crops/*.png`.

Reading it: the large mismatch in "mismatch" is the edge ring: the GIF has no partial alpha, so its edge pixels are
baked mixes of fill and matte, and a crisp vector edge never reproduces those exactly, at 1× or (more so) at
2×, where the GIF is a blurred upscale. The "shape" column is the one that says whether the geometry agrees:
≤ 1% for the normal light GIF, a few % elsewhere. The worst normal frames (70–74) are the tiny spinning
triangle, where a 1px edge is a large share of ~100 ink pixels. The large frames' remaining shape error
is mostly droplets and necks a pixel or two wide, which the GIF draws a little differently than a smooth outline.

## Where the GIF itself is off

- Its edges are aliased (binary alpha) with the matte baked in; the light and dark GIFs bake *different* edges, so the
  dark one has a black fringe that is wrong on any other background. The drawing doesn't copy that: it draws an
  outline in the theme's colour.
- The large light outline is grey, the normal light one white. Kept as is, per GIF.
- Corners are hand-rounded and wobble by up to a pixel between frames; the traced Fourier outline smooths this
  rather than reproducing the jitter (most visible on the square's edges, frames 22–37).

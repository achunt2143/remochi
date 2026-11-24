/**
 * The Mochi spinner, drawn in code.
 *
 * Internal module (not exported from the package). The old spinner shipped
 * four animated GIFs; this redraws them as SVG from keyframes traced out of
 * those GIFs (scripts/spinner-diff/trace.py → spinnerFrames.js):
 *
 *   normal  52×52, 86 frames at 30ms: a red circle squashes into a blue
 *           square, which folds into a yellow triangle, which rounds back
 *           into the circle, colours cross-fading in between.
 *   large   260×83, 132 frames at 30ms: the same three colours as a ball
 *           that bounces across the strip, stretching, pinching and
 *           spitting droplets as it changes colour.
 *
 * Each frame is a handful of closed outlines (the ball and any droplets),
 * each stored as a Fourier series. The fill is the traced colour; the 1px
 * outline the GIFs baked in (white for light, black for dark) is a stroke
 * whose colour is a theme token, so the same drawing serves both styles.
 */
import { FILLS, SPINNERS } from './spinnerFrames';

export { SPINNERS };

// Outline each GIF baked into its edge, per style.
// The normal GIFs' is white/black; the large light GIF's is the popup border's grey.
export const OUTLINE = {
  normal: { light: '#ffffff', dark: '#000000' },
  large: { light: '#5e5e5e', dark: '#000000' },
};
export const OUTLINE_VAR = '--mochi-spinner-outline';
export const OUTLINE_WIDTH = 1; // drawn under the fill (paint-order), so ~0.5px shows outside it

export const MAX_PIECES = Math.max(
  ...Object.values(SPINNERS).flatMap((s) => s.frames.map((f) => f.length)),
);

const cache = new Map();

// Closed polygon for one piece: z(t) = Σ c_k e^(ikt), coefficients stored as
// re,im pairs (hundredths of a px) for k = 0, 1, -1, 2, -2, …
function outline(flat) {
  const K = (flat.length / 2 - 1) / 2;
  const n = Math.max(32, Math.round(K * 12));
  let d = '';
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n;
    let x = flat[0] / 100;
    let y = flat[1] / 100;
    for (let k = 1; k <= K; k++) {
      const c = Math.cos(k * t);
      const s = Math.sin(k * t);
      const j = 2 + (k - 1) * 4;
      // c_k e^(ikt) + c_-k e^(-ikt)
      x += (flat[j] + flat[j + 2]) / 100 * c - (flat[j + 1] - flat[j + 3]) / 100 * s;
      y += (flat[j + 1] + flat[j + 3]) / 100 * c + (flat[j] - flat[j + 2]) / 100 * s;
    }
    d += `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d}Z`;
}

/** The pieces to draw for frame `index` of `size`: [{ fill, d }, …]. */
export function framePieces(size, index) {
  const key = `${size}:${index}`;
  let pieces = cache.get(key);
  if (!pieces) {
    pieces = SPINNERS[size].frames[index].map(([fill, flat]) => ({ fill: FILLS[fill], d: outline(flat) }));
    cache.set(key, pieces);
  }
  return pieces;
}

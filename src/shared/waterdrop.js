/**
 * The waterdrop corner, scaled to the size of the thing wearing it.
 *
 * Internal helper (the SCSS twin is `waterdrop()` in _waterdrop.scss, and
 * both use the same scale, so keep them in step). The design guide's
 * waterdrop is `16 4 16 16` (top-right nearly sharp) on a floating surface,
 * but "corners follow size": a 40px thing gets `12 3 12 12`, a 20px thing
 * `7 2 7 7`, and the full drop starts at about 56px. In between the radii
 * are interpolated; below 20px they stay proportional to the size, and no
 * corner is ever bigger than half the short side.
 */

// [short side, big corner, small corner] at each point the guide gives.
const SCALE = [
  [0, 0, 0],
  [20, 7, 2],
  [40, 12, 3],
  [56, 16, 4],
];

const round = (n) => +n.toFixed(2);

/**
 * waterdropRadius(size)
 *
 * Returns a CSS `border-radius` string in px for a surface whose short side
 * is `size` px: three big corners and the nearly sharp top-right one.
 */
export function waterdropRadius(size) {
  const s = Math.max(0, Number(size) || 0);
  let big = SCALE[SCALE.length - 1][1];
  let small = SCALE[SCALE.length - 1][2];
  for (let i = 1; i < SCALE.length; i++) {
    const [s1, b1, c1] = SCALE[i];
    if (s <= s1) {
      const [s0, b0, c0] = SCALE[i - 1];
      const t = (s - s0) / (s1 - s0);
      big = b0 + (b1 - b0) * t;
      small = c0 + (c1 - c0) * t;
      break;
    }
  }
  const cap = s / 2;
  big = round(Math.min(big, cap));
  small = round(Math.min(small, cap));
  return `${big}px ${small}px ${big}px ${big}px`;
}

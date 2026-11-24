/**
 * Mochi nubbins, drawn in code.
 *
 * Internal module (not exported from the package). Replaces the PNG sprites
 * that PopupPanel, NubbinDivider, Divider and Repanel used to ship, traced
 * from those sprites so the shapes match them, but coloured from theme
 * tokens so light and dark need no separate assets, and crisp at any pixel
 * density.
 *
 * Every sprite turned out to be one of three shapes, rotated or mirrored:
 *
 *   bump    PopupPanel's pointer, NubbinDivider's bump, Repanel's grabber
 *           (the grabber is just a bump pointing left, cut off by the
 *           panel's bottom edge 7px past its peak).
 *   corner  The 8 corner caps PopupPanel and NubbinDivider share: a pointed
 *           tip that runs on into the box's side on one end and ramps down
 *           into the line on the other.
 *   taper   Divider's grooved end caps.
 *
 * Shapes are drawn in an "up" frame (u along the line, v across it, the
 * line's own stroke at the bottom of the box) and then mapped onto the box
 * for each direction; see `toBox`.
 */
import React, { useId } from 'react';

// Stroke weight of every traced sprite, and of the borders they join.
export const NUBBIN_STROKE = 2;

// Bump profile, fitted to the sprites' measured stroke edges (RMS error
// 0.1px over all 12 popup bumps, both NubbinDivider bumps and the grabber):
// a Gaussian 13.1px tall from the line's stroke centre to the bump's
// stroke centre, sigma 9.7px. Every sprite puts the peak 36px along the box.
export const BUMP = { height: 13.1, sigma: 9.7, peak: 36, length: 71, depth: 20 };

// Corner-cap ramp, fitted the same way: one cubic Bézier for the stroke's
// centre line, from the tip (where it meets the box's side, 1px in) down
// into the line 13px below. Box: 32 along, 14 deep. The sprites' ramp was still settling at the box's end, which left a slight
// kink where the line carries on beyond it; this one is pinned to land on
// the line 2px before the end (refitted with that end fixed).
export const CORNER = {
  length: 32,
  depth: 14,
  ramp: [[1, 1.45], [10, 6.2], [26, 13], [30, 13]],
};

// Divider taper, measured from div-left.png. Each of the groove's 4 rows is
// the stroke colour at this opacity (top row darkest)...
const TAPER_ROWS = [0.45, 0.296, 0.18, 0.103];
// ...faded from the outer end of a cap (0%) to the middle of the divider
// (100%) by this ramp, sampled every 10%.
const TAPER_RAMP = [0.106, 0.167, 0.232, 0.318, 0.409, 0.516, 0.612, 0.735, 0.826, 0.928, 1];

// Soft shadow the sprites drew around the raised part of the stroke: a
// blurred, translucent black copy of it, `spread` px wider and nudged
// `offset` px away from the line.
export const SHADOW = { blur: 1.2, opacity: 0.18, spread: 2, offset: -0.5 };

// The colour every nubbin's stroke defaults to: the popup border, which is
// #646464 in both themes (the sprites' own stroke, sampled: #646464/#666666).
export const NUBBIN_STROKE_COLOR = 'var(--mochi-popup-border, #646464)';

const fmt = (n) => +n.toFixed(2);

// How far a bump stands off its line at `u` px along it: the traced profile
// itself, for drawings that build their own outline around a bump.
export const bumpRise = (u, peak = BUMP.peak) =>
  BUMP.height * Math.exp(-((u - peak) ** 2) / (2 * BUMP.sigma * BUMP.sigma));

// Smooth path through `points` (Catmull-Rom, written out as cubic Béziers).
function smoothPath(points) {
  let d = `M${fmt(points[0][0])},${fmt(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${fmt(c1[0])},${fmt(c1[1])} ${fmt(c2[0])},${fmt(c2[1])} ${fmt(p2[0])},${fmt(p2[1])}`;
  }
  return d;
}

const pt = ([x, y]) => `${fmt(x)},${fmt(y)}`;

// Maps a point from the "up" frame onto the box. `up` and `down` mirror
// rather than rotate, and `left`/`right` transpose, so `side: 'start'`
// always means the left (horizontal) or top (vertical) end of the box.
function toBox([u, v], { direction, side, length, depth }) {
  if (side === 'end') u = length - u;
  switch (direction) {
    case 'down':  return [u, depth - v];
    case 'left':  return [v, u];
    case 'right': return [depth - v, u];
    default:      return [u, v];
  }
}

// Centre line of a bump's stroke in the up frame: flat along the line,
// rising to the peak. Sampled every 1.5px and smoothed.
function bumpPoints({ length, depth, peak, height, sigma, strokeWidth }, from = 0, to = length) {
  const base = depth - strokeWidth / 2;
  const points = [];
  const steps = Math.max(2, Math.ceil((to - from) / 1.5));
  for (let i = 0; i <= steps; i++) {
    const u = from + ((to - from) * i) / steps;
    points.push([u, base - height * Math.exp(-((u - peak) ** 2) / (2 * sigma * sigma))]);
  }
  return points;
}

// The three paths each shape draws: the stroke itself, the fill (which also
// covers the line's own stroke under the shape, so a border that runs on
// into it shows no seam), and the stretch of stroke that gets a shadow.
function bumpPaths(geo) {
  const { length, depth, peak, sigma } = geo;
  const map = (p) => toBox(p, geo);
  const points = bumpPoints(geo).map(map);
  const stroke = smoothPath(points);
  const fill = `${stroke}L${pt(map([length, depth]))}L${pt(map([0, depth]))}Z`;
  // Only the raised part casts a shadow; the flat tails are the border the
  // bump sits on, which has its own.
  const reach = 3 * sigma;
  const shadow = smoothPath(
    bumpPoints(geo, Math.max(0, peak - reach), Math.min(length, peak + reach))
      .map(([u, v]) => map([u, v + SHADOW.offset]))
  );
  // ...fading in and out over its outer sigma, so it doesn't stop short.
  const fade = {
    from: map([peak - reach, 0]),
    to: map([peak + reach, 0]),
    stops: [[0, 0], [1 / 6, 1], [5 / 6, 1], [1, 0]],
  };
  return { stroke, fill, shadow, fade };
}

function cornerPaths(geo) {
  const { length, depth, strokeWidth } = geo;
  const map = (p) => toBox(p, geo);
  const [p0, p1, p2, p3] = CORNER.ramp;
  const base = depth - strokeWidth / 2;
  const side = strokeWidth / 2;
  const curve = `${pt(map(p1))} ${pt(map(p2))} ${pt(map(p3))}`;
  // The box's side runs past the bottom of the box and the line past its
  // end, so both join whatever border continues beyond it.
  const stroke = `M${pt(map([side, depth + 1]))}L${pt(map(p0))}C${curve}L${pt(map([length + 1, base]))}`;
  const fill = `M${pt(map([side, depth]))}L${pt(map(p0))}C${curve}L${pt(map([length + 1, depth]))}Z`;
  const drop = ([u, v]) => pt(map([u, v + SHADOW.offset]));
  const shadow = `M${drop(p0)}C${drop(p1)} ${drop(p2)} ${drop(p3)}`;
  // Faded out as the ramp flattens into the line, so it doesn't stop short
  // at the end of the box.
  const fade = { from: map([p0[0], 0]), to: map([p3[0], 0]), stops: [[0, 1], [0.55, 1], [0.95, 0]] };
  return { stroke, fill, shadow, fade };
}

/**
 * Nubbin
 *
 * Draws one bump or corner cap as an inline SVG sized to its box.
 *
 *   shape        'bump' | 'corner'
 *   direction    Which way it points: 'up' | 'down' | 'left' | 'right'
 *   side         Corner caps only: which end of the box the tip sits at,
 *                'start' (left/top) or 'end' (right/bottom)
 *   length       Box size along the line (defaults: 71 bump, 32 corner)
 *   depth        Box size across the line (defaults: 20 bump, 14 corner)
 *   peak         Bumps only: where the peak sits along the box (default 36)
 *   strokeWidth  Stroke weight (default 2)
 *   stroke       Stroke colour (default: --mochi-popup-border)
 *   fill         Fill colour, or 'none' for an outline (default 'none')
 *   shadow       Soft halo around the raised part, as the popup sprites had
 */
export function Nubbin({
  shape       = 'bump',
  direction   = 'up',
  side        = 'start',
  length,
  depth,
  peak        = BUMP.peak,
  strokeWidth = NUBBIN_STROKE,
  stroke      = NUBBIN_STROKE_COLOR,
  fill        = 'none',
  shadow      = false,
  className,
  style,
  ...rest
}) {
  const id = `mochi-nubbin-${useId().replace(/:/g, '')}`;
  const isCorner = shape === 'corner';
  const geo = {
    direction,
    side,
    length: length ?? (isCorner ? CORNER.length : BUMP.length),
    depth: depth ?? (isCorner ? CORNER.depth : BUMP.depth),
    peak,
    height: BUMP.height,
    sigma: BUMP.sigma,
    strokeWidth,
  };
  const paths = isCorner ? cornerPaths(geo) : bumpPaths(geo);
  const vertical = direction === 'left' || direction === 'right';
  const width = vertical ? geo.depth : geo.length;
  const height = vertical ? geo.length : geo.depth;

  return (
    <svg
      {...rest}
      className={className}
      style={{ display: 'block', overflow: 'hidden', ...style }}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      focusable="false"
    >
      {shadow && (
        <>
          <defs>
            <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={SHADOW.blur} />
            </filter>
            <linearGradient
              id={`${id}-fade`}
              gradientUnits="userSpaceOnUse"
              x1={paths.fade.from[0]} y1={paths.fade.from[1]}
              x2={paths.fade.to[0]} y2={paths.fade.to[1]}
            >
              {paths.fade.stops.map(([offset, opacity]) => (
                <stop key={offset} offset={offset} stopColor="#fff" stopOpacity={opacity} />
              ))}
            </linearGradient>
            <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
              <rect width={width} height={height} fill={`url(#${id}-fade)`} />
            </mask>
          </defs>
          <path
            d={paths.shadow}
            filter={`url(#${id}-blur)`}
            mask={`url(#${id}-mask)`}
            style={{ fill: 'none', stroke: `rgba(0, 0, 0, ${SHADOW.opacity})`, strokeWidth: strokeWidth + SHADOW.spread }}
          />
        </>
      )}
      {fill !== 'none' && <path d={paths.fill} style={{ fill, stroke: 'none' }} />}
      <path
        d={paths.stroke}
        style={{ fill: 'none', stroke, strokeWidth, strokeLinejoin: 'miter', strokeMiterlimit: 10 }}
      />
    </svg>
  );
}

/**
 * Inline style for one of Divider's tapered end caps: a 4-row groove in
 * `color` (top row darkest), faded out toward the cap's outer end. `end` is
 * 'start' for the left/top cap (fading toward the left/top) or 'end' for the
 * right/bottom one. The groove scales smoothly to any thickness.
 */
export function taperStyle({ orientation = 'horizontal', end = 'start', color = NUBBIN_STROKE_COLOR }) {
  const horizontal = orientation === 'horizontal';
  const rows = TAPER_ROWS.map(
    (opacity, i) =>
      `color-mix(in srgb, ${color} ${fmt(opacity * 100)}%, transparent) ${fmt(((i + 0.5) / TAPER_ROWS.length) * 100)}%`
  ).join(', ');
  const fadeDir = horizontal ? (end === 'start' ? 'to right' : 'to left') : (end === 'start' ? 'to bottom' : 'to top');
  const fade = TAPER_RAMP.map((a, i) => `rgba(0, 0, 0, ${a}) ${i * 10}%`).join(', ');
  const mask = `linear-gradient(${fadeDir}, ${fade})`;
  return {
    backgroundImage: `linear-gradient(${horizontal ? 'to bottom' : 'to right'}, ${rows})`,
    WebkitMaskImage: mask,
    maskImage: mask,
  };
}

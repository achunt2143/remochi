// stackedPanelsLayout.js
//
// Pure layout math for the Repanel webOS/Mochi stacked panel system.
// No React, no DOM — just functions that turn (activeIndex, reveal, config)
// into per-panel geometry descriptors. This keeps the wrapper component
// focused on state/gestures and makes the stacking maths independently
// testable.
//
// Mental model
// ------------
// The active panel is the front/top of the stack. Panels with a lower index
// than the active one ("parents") fan out to the LEFT as overlapping spines,
// like the breadcrumb panels behind a webOS card. Panels with a higher index
// ("ahead") sit tucked directly behind the active panel, ready to slide
// forward. `reveal` is a snapped level (default snap points 1, 2, 3) that
// controls how many parent spines are exposed and how far the active panel is
// pushed to the right to make room for them.

export const DEFAULT_SNAP_POINTS = [1, 2, 3];
export const DEFAULT_MAX_VISIBLE_PANELS = 3;
export const DEFAULT_PEEK = 56; // px: visible strip width of each stacked parent spine
export const DEFAULT_OVERLAP = 0.5; // 0..1: how strongly deeper panels recede (scale + dim)

// Depth styling steps, scaled by the `overlap` factor.
const DEPTH_SCALE_STEP = 0.04; // scale reduction per depth unit at overlap = 1
const DEPTH_DIM_STEP = 0.16; // scrim opacity added per depth unit at overlap = 1
const DEPTH_DIM_MAX = 0.6;

// ---------------------------------------------------------------------------
// Snap points + reveal
// ---------------------------------------------------------------------------

/** Sort, de-dupe and validate a snap-point list, falling back to the default. */
export function normalizeSnapPoints(snapPoints) {
  const list = Array.isArray(snapPoints) ? snapPoints : DEFAULT_SNAP_POINTS;
  const cleaned = Array.from(
    new Set(list.filter((n) => typeof n === 'number' && Number.isFinite(n)))
  ).sort((a, b) => a - b);
  return cleaned.length ? cleaned : [...DEFAULT_SNAP_POINTS];
}

/** Lowest/highest allowed reveal value for a snap-point list. */
export function revealBounds(snapPoints) {
  const pts = normalizeSnapPoints(snapPoints);
  return { min: pts[0], max: pts[pts.length - 1] };
}

/** Clamp a (possibly fractional) reveal value to the snap-point range. */
export function clampReveal(value, snapPoints) {
  const { min, max } = revealBounds(snapPoints);
  if (typeof value !== 'number' || Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Snap a reveal value to the nearest allowed snap point. */
export function snapReveal(value, snapPoints) {
  const pts = normalizeSnapPoints(snapPoints);
  const v = clampReveal(value, pts);
  let best = pts[0];
  let bestDist = Math.abs(v - best);
  for (const p of pts) {
    const dist = Math.abs(v - p);
    if (dist < bestDist) {
      best = p;
      bestDist = dist;
    }
  }
  return best;
}

/** Step to the adjacent snap point (dir = -1 collapse, +1 expand). */
export function stepSnap(value, snapPoints, dir) {
  const pts = normalizeSnapPoints(snapPoints);
  const current = snapReveal(value, pts);
  const idx = pts.indexOf(current);
  const nextIdx = Math.min(pts.length - 1, Math.max(0, idx + Math.sign(dir)));
  return pts[nextIdx];
}

// ---------------------------------------------------------------------------
// Index
// ---------------------------------------------------------------------------

/** Clamp or wrap an index into [0, count). */
export function clampIndex(index, count, wrap = false) {
  if (!count || count <= 0) return 0;
  const i = Math.round(index) || 0;
  if (wrap) return ((i % count) + count) % count;
  return Math.min(count - 1, Math.max(0, i));
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** Resolve/normalize the layout-affecting props into a stable config object. */
export function resolveLayoutConfig({
  snapPoints,
  maxVisiblePanels = DEFAULT_MAX_VISIBLE_PANELS,
  peek = DEFAULT_PEEK,
  overlap = DEFAULT_OVERLAP,
} = {}) {
  const maxVisible = Math.floor(maxVisiblePanels);
  return {
    snapPoints: normalizeSnapPoints(snapPoints),
    maxVisiblePanels: Math.max(1, Number.isFinite(maxVisible) ? maxVisible : DEFAULT_MAX_VISIBLE_PANELS),
    peek: Math.max(0, typeof peek === 'number' && Number.isFinite(peek) ? peek : DEFAULT_PEEK),
    overlap: Math.min(1, Math.max(0, typeof overlap === 'number' ? overlap : DEFAULT_OVERLAP)),
  };
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

/**
 * How many parent panels are exposed as spines behind the active panel.
 * Returned as a (possibly fractional) count so grabber drags interpolate
 * smoothly. Capped by `maxVisiblePanels` and by how many parents actually
 * exist to the left of the active panel.
 */
export function getVisibleParentCount({ reveal, activeIndex, config }) {
  const maxParents = Math.min(config.maxVisiblePanels - 1, Math.max(0, activeIndex));
  const fromReveal = clampReveal(reveal, config.snapPoints) - config.snapPoints[0];
  return Math.min(maxParents, Math.max(0, fromReveal));
}

/** The left inset (px) applied to the active panel to expose the parent spines. */
export function getActiveInset({ reveal, activeIndex, config }) {
  return getVisibleParentCount({ reveal, activeIndex, config }) * config.peek;
}

/**
 * Compute the visual descriptor for a single panel.
 *
 * Returns:
 *   role        'active' | 'parent' | 'ahead' | 'hidden'
 *   depth       0 for active, distance from active otherwise
 *   left        left offset in px (active inset)
 *   width       CSS width string
 *   translateX  px horizontal transform (negative = further left / deeper)
 *   scale       transform scale
 *   opacity     0..1
 *   dim         0..1 scrim strength for the depth overlay
 *   zIndex      stacking order
 *   interactive whether the panel should receive pointer events
 *   visible     whether the panel is meaningfully on-screen
 */
export function getPanelDescriptor({
  index,
  activeIndex,
  panelCount,
  reveal,
  config,
  isNarrow = false,
  narrowBehavior = 'single',
}) {
  const isActive = index === activeIndex;

  // Narrow single / overlay: only the active panel is visible, full width.
  if (isNarrow && narrowBehavior !== 'stack') {
    return {
      role: isActive ? 'active' : 'hidden',
      depth: isActive ? 0 : Math.abs(activeIndex - index),
      left: 0,
      width: '100%',
      translateX: 0,
      scale: 1,
      opacity: isActive ? 1 : 0,
      dim: 0,
      zIndex: isActive ? panelCount + 10 : 0,
      interactive: isActive,
      visible: isActive,
    };
  }

  const parents = getVisibleParentCount({ reveal, activeIndex, config });
  const inset = parents * config.peek;
  const width = inset > 0 ? `calc(100% - ${inset}px)` : '100%';
  const depth = activeIndex - index; // >0 parent, 0 active, <0 ahead

  // Active panel — front of the stack.
  if (depth === 0) {
    return {
      role: 'active',
      depth: 0,
      left: inset,
      width,
      translateX: 0,
      scale: 1,
      opacity: 1,
      dim: 0,
      zIndex: panelCount + 10,
      interactive: true,
      visible: true,
    };
  }

  // Parent panels — fan out to the left as overlapping spines.
  if (depth > 0) {
    // The last exposed spine fades in/out during a fractional (drag) reveal.
    const edge = Math.max(0, Math.min(1, parents - (depth - 1)));
    const shown = parents > 0 && depth <= Math.ceil(parents);
    const depthClamped = Math.min(depth, config.maxVisiblePanels - 1);
    return {
      role: 'parent',
      depth,
      left: inset,
      width,
      translateX: -depth * config.peek,
      scale: 1 - config.overlap * DEPTH_SCALE_STEP * depthClamped,
      opacity: shown ? edge : 0,
      dim: Math.min(DEPTH_DIM_MAX, config.overlap * DEPTH_DIM_STEP * depthClamped),
      zIndex: panelCount - depth,
      interactive: shown && edge > 0.5,
      visible: shown && edge > 0,
    };
  }

  // Ahead panels — tucked directly behind the active panel (not yet revealed).
  const ahead = -depth;
  return {
    role: 'ahead',
    depth: ahead,
    left: inset,
    width,
    translateX: 0,
    scale: 1 - Math.min(0.06, 0.02 * ahead),
    opacity: 0,
    dim: 0,
    zIndex: Math.max(0, panelCount - 20 - ahead),
    interactive: false,
    visible: false,
  };
}

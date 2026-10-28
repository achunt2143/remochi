// stackedPanelsLayout.js
//
// Pure layout math for the RepanelStack webOS/Mochi stacked panel system.
// No React, no DOM — just functions that turn (activeIndex, reveal, config)
// into per-panel geometry descriptors. This keeps the wrapper component
// focused on state/gestures and makes the stacking maths independently
// testable.
//
// Mental model — multi-column master-detail
// -------------------------------------------
// The active panel is the front/rightmost column, given the remaining
// width once its revealed parents are accounted for. Panels with a lower
// index than the active one ("parents") sit to its LEFT as real, fully
// interactive columns — not thin peeking slivers. `reveal` controls how
// many parent columns are shown, and can grow all the way back to panel 0
// — `snapPoints`/`maxVisiblePanels` only shape the *default* reveal depth
// and where discrete actions (Expand/Collapse, keyboard) land, not a hard
// ceiling on how far a grabber drag can go (see resolveReveal). Panels
// with a higher index ("ahead") wait off-screen to the right, ready to
// slide in when the user navigates forward.
//
// Every visible panel (active or parent) is opaque and interactive — this
// is the "diff panels are both active and navigable" webOS/Mochi email-app
// look, not a single dominant panel with dimmed, non-interactive spines.
//
// Parent columns show a fixed `peek` width, and each one also runs an
// `overlap` distance further right, tucked beneath the next column — as in
// Mochi's Panels.less (320px panes plus a 45px overlap), so the next
// column's 45px rounded top-left corner reveals the parent's own surface
// rather than a gap. The active column takes whatever width remains.
// Coverage is computed continuously (no integer-boundary jumps) so a live
// grabber drag grows/shrinks a column smoothly instead of snapping.

export const DEFAULT_SNAP_POINTS = [1, 2, 3];
export const DEFAULT_MAX_VISIBLE_PANELS = 3;
// px: visible width of each revealed (non-active) parent column — the
// webOS HIG's 320px pane ("Layouts: Sliding Panes"), as in Mochi.
export const DEFAULT_PEEK = 320;
// 0..1: fraction of Mochi's 45px overlap each parent tucks beneath the
// next column.
export const DEFAULT_OVERLAP = 1;

// Overlap (px) between adjacent columns at overlap = 1 — Mochi's 45px.
const OVERLAP_MAX_PX = 45;

/** How far (px) each parent column extends beneath the next one. */
export function getOverlapPx(config) {
  return config.overlap * OVERLAP_MAX_PX;
}

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

/**
 * Clamp a reveal value to the *extended* range — the configured
 * `snapPoints` bounds, widened up to however many parents structurally
 * exist behind the active panel if that's larger. Unlike `resolveReveal`,
 * this does NOT snap — it's for the continuous live-drag preview, where a
 * fractional value is exactly what makes a parent column grow/shrink
 * smoothly under the cursor instead of jumping between discrete stops.
 */
export function clampRevealExtended(value, snapPoints, maxParents) {
  const { min, max } = revealBounds(snapPoints);
  const structuralMax = min + Math.max(0, maxParents);
  const ceiling = Math.max(max, structuralMax);
  return Math.min(ceiling, Math.max(min, typeof value === 'number' && !Number.isNaN(value) ? value : min));
}

/**
 * Resolve a reveal value for commit (on release, not during the drag).
 * Values within the configured `snapPoints` range snap to the nearest
 * configured point, same as before — this is what keeps
 * Expand/Collapse/keyboard stepping landing on predictable stops. Values
 * beyond that range — only reachable by dragging a parent panel's grabber
 * further than the configured points allow — snap to the nearest whole
 * parent count instead, up to however many parents structurally exist
 * behind the active panel. This lets a drag reveal the entire stack even
 * when `snapPoints`/`maxVisiblePanels` are left at their (smaller)
 * defaults, without changing what the discrete controls snap to.
 */
export function resolveReveal(value, snapPoints, maxParents) {
  const { max } = revealBounds(snapPoints);
  const v = clampRevealExtended(value, snapPoints, maxParents);
  return v <= max ? snapReveal(v, snapPoints) : Math.round(v);
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
 * How many parent panels physically exist to the left of the active one.
 * Not capped by `maxVisiblePanels` — that config only shapes the *default*
 * reveal depth (see RepanelStack's initial state) and where Expand/Collapse
 * land; a grabber drag can reveal every parent all the way back to panel 0.
 */
export function getMaxParents(activeIndex) {
  return Math.max(0, activeIndex);
}

/**
 * How many parent panels are revealed behind the active panel, as a
 * (possibly fractional) count so grabber drags interpolate smoothly.
 * Capped by how many parents actually exist; `reveal` itself may exceed
 * `snapPoints`' configured range when a drag has pulled in more of the
 * stack than the default snap points cover (see resolveReveal).
 */
export function getVisibleParentCount({ reveal, activeIndex, config }) {
  const maxParents = getMaxParents(activeIndex);
  const fromReveal = Math.max(reveal, config.snapPoints[0]) - config.snapPoints[0];
  return Math.min(maxParents, Math.max(0, fromReveal));
}

/** 0..1 how "shown" the parent at `distance` (1 = nearest to active) currently is. */
function parentCoverage(distance, parentsFloat, maxParents) {
  if (distance < 1 || distance > maxParents) return 0;
  return Math.max(0, Math.min(1, parentsFloat - (distance - 1)));
}

/** Horizontal distance (px) between adjacent fully-shown columns: the visible `peek`. */
function columnStep(config) {
  return Math.max(1, config.peek);
}

/** The left inset (px) applied to the active panel to expose the parent columns. */
export function getActiveInset({ reveal, activeIndex, config }) {
  const maxParents = getMaxParents(activeIndex);
  const parentsFloat = getVisibleParentCount({ reveal, activeIndex, config });
  const step = columnStep(config);
  let total = 0;
  for (let d = 1; d <= maxParents; d++) total += parentCoverage(d, parentsFloat, maxParents) * step;
  return total;
}

/** Narrow 'single'/'overlay' layouts show only the active panel, full width. */
function isSingleColumn(isNarrow, narrowBehavior) {
  return isNarrow && narrowBehavior !== 'stack';
}

/**
 * Compute the visual descriptor for a single panel.
 *
 * Returns:
 *   role        'active' | 'parent' | 'ahead' | 'hidden'
 *   left        number (px) or CSS string — left offset from the viewport
 *   width       number (px) or CSS string (e.g. 'calc(100% - Npx)')
 *   opacity     0..1
 *   zIndex      stacking order (nearer-to-active columns render on top)
 *   interactive whether the panel should receive pointer events
 *   visible     whether the panel is meaningfully on-screen
 *
 * Every visible panel (role 'active' or 'parent' with opacity 1) is fully
 * interactive — there is no dimming/scrim. Only 'ahead' (not yet revealed)
 * and not-yet-revealed 'parent' panels (beyond the current `reveal` depth)
 * are hidden.
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
  // Panels ahead of it wait just past the right edge (like the wide
  // layout's 'ahead' role) and stack above it, so moving forward slides the
  // next panel in over the current one and closing slides the closing panel
  // back out to the right, instead of either crossfading in place.
  if (isSingleColumn(isNarrow, narrowBehavior)) {
    const ahead = index - activeIndex;
    return {
      role: isActive ? 'active' : ahead > 0 ? 'ahead' : 'hidden',
      left: ahead > 0 ? '100%' : 0,
      width: '100%',
      opacity: isActive ? 1 : 0,
      zIndex: ahead >= 0 ? panelCount + 10 + ahead : 0,
      interactive: isActive,
      visible: isActive,
    };
  }

  const maxParents = getMaxParents(activeIndex);
  const parentsFloat = getVisibleParentCount({ reveal, activeIndex, config });
  const step = columnStep(config);

  // Cumulative width (px) of every shown parent strictly farther than `distance`
  // (i.e. positioned further left of it). Continuous in `reveal` — no jumps.
  const cumStep = (distance) => {
    let total = 0;
    for (let d = distance + 1; d <= maxParents; d++) total += parentCoverage(d, parentsFloat, maxParents) * step;
    return total;
  };

  const distance = activeIndex - index; // >0 parent, 0 active, <0 ahead

  // Active panel — front of the stack, takes the remaining width.
  if (distance === 0) {
    const left = cumStep(0);
    return {
      role: 'active',
      left,
      width: `calc(100% - ${left}px)`,
      opacity: 1,
      zIndex: panelCount + 10,
      interactive: true,
      visible: true,
    };
  }

  // Parent columns — real, fully interactive columns to the left of active.
  // Each is `peek` wide where it shows, plus the overlap tucked beneath the
  // next column (see the stylesheet's padding-right on parent panels).
  if (distance > 0) {
    const coverage = parentCoverage(distance, parentsFloat, maxParents);
    const shown = coverage > 0;
    return {
      role: 'parent',
      left: cumStep(distance),
      width: (config.peek + getOverlapPx(config)) * coverage,
      opacity: shown ? 1 : 0,
      zIndex: panelCount - distance,
      interactive: shown && coverage > 0.5,
      visible: shown,
    };
  }

  // Ahead panels — waiting just past the active panel's right edge.
  const ahead = -distance;
  return {
    role: 'ahead',
    left: '100%',
    width: '100%',
    opacity: 0,
    zIndex: Math.max(0, panelCount - 20 - ahead),
    interactive: false,
    visible: false,
  };
}

// ---------------------------------------------------------------------------
// Close-gesture blending
// ---------------------------------------------------------------------------

/** Resolve a descriptor's left/width (which may be '100%' / 'calc(...)' strings) to concrete px. */
function resolvePanelPx(d, containerWidth) {
  const left = typeof d.left === 'number' ? d.left : containerWidth;
  if (typeof d.width === 'number') return { left, width: d.width };
  if (d.width === '100%') return { left, width: containerWidth };
  const match = /calc\(100% - ([\d.]+)px\)/.exec(d.width);
  return { left, width: match ? containerWidth - parseFloat(match[1]) : containerWidth - left };
}

/**
 * Blend two panel descriptors (the same panel evaluated at `fromIndex` and
 * at `toIndex = fromIndex - 1` active) by `t` (0 = fromIndex, 1 = toIndex).
 * Used to live-preview the "swipe the active panel closed" gesture: rather
 * than activeIndex snapping in one step, every panel's position/width/
 * opacity is continuously interpolated between the two whole-stack layouts
 * so the closing panel visibly shrinks while the one behind it grows to
 * fill the space, instead of an abrupt cut.
 */
export function blendPanelDescriptors(dFrom, dTo, t, containerWidth) {
  const pxFrom = resolvePanelPx(dFrom, containerWidth);
  const pxTo = resolvePanelPx(dTo, containerWidth);
  const lerp = (a, b) => a + (b - a) * t;
  return {
    left: lerp(pxFrom.left, pxTo.left),
    width: lerp(pxFrom.width, pxTo.width),
    opacity: lerp(dFrom.opacity, dTo.opacity),
    zIndex: t < 0.5 ? dFrom.zIndex : dTo.zIndex,
    interactive: t < 0.5 ? dFrom.interactive : dTo.interactive,
    visible: dFrom.visible || dTo.visible,
  };
}

/**
 * Live-preview descriptor for one panel during the active panel's "swipe
 * to close" gesture: the panel's descriptor with `fromIndex` active and
 * with `toIndex` (= fromIndex - 1) active, blended by `progress`.
 *
 * The narrow single-column layout has no parent columns to blend between,
 * so there the closing panel's blend runs from left 0 to its 'ahead' slot
 * at left 100% — it slides out to the right under the finger — and opacity
 * is held at whichever endpoint shows the panel rather than interpolated.
 * The closing panel stays solid while it slides, and the panel it closes
 * into sits fully shown underneath it, like a webOS card swipe-back.
 */
export function getClosePreviewDescriptor({
  index,
  fromIndex,
  toIndex,
  progress,
  containerWidth,
  panelCount,
  reveal,
  config,
  isNarrow = false,
  narrowBehavior = 'single',
}) {
  const layout = { index, panelCount, reveal, config, isNarrow, narrowBehavior };
  const dFrom = getPanelDescriptor({ ...layout, activeIndex: fromIndex });
  const dTo = getPanelDescriptor({ ...layout, activeIndex: toIndex });
  const d = blendPanelDescriptors(dFrom, dTo, progress, containerWidth);
  if (isSingleColumn(isNarrow, narrowBehavior)) d.opacity = Math.max(dFrom.opacity, dTo.opacity);
  return d;
}

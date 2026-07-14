/** Sort, de-dupe and validate a snap-point list, falling back to the default. */
export function normalizeSnapPoints(snapPoints: any): any[];
/** Lowest/highest allowed reveal value for a snap-point list. */
export function revealBounds(snapPoints: any): {
    min: any;
    max: any;
};
/** Clamp a (possibly fractional) reveal value to the snap-point range. */
export function clampReveal(value: any, snapPoints: any): any;
/** Snap a reveal value to the nearest allowed snap point. */
export function snapReveal(value: any, snapPoints: any): any;
/** Step to the adjacent snap point (dir = -1 collapse, +1 expand). */
export function stepSnap(value: any, snapPoints: any, dir: any): any;
/**
 * Clamp a reveal value to the *extended* range — the configured
 * `snapPoints` bounds, widened up to however many parents structurally
 * exist behind the active panel if that's larger. Unlike `resolveReveal`,
 * this does NOT snap — it's for the continuous live-drag preview, where a
 * fractional value is exactly what makes a parent column grow/shrink
 * smoothly under the cursor instead of jumping between discrete stops.
 */
export function clampRevealExtended(value: any, snapPoints: any, maxParents: any): number;
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
export function resolveReveal(value: any, snapPoints: any, maxParents: any): any;
/** Clamp or wrap an index into [0, count). */
export function clampIndex(index: any, count: any, wrap?: boolean): number;
/** Resolve/normalize the layout-affecting props into a stable config object. */
export function resolveLayoutConfig({ snapPoints, maxVisiblePanels, peek, overlap, }?: {
    maxVisiblePanels?: number | undefined;
    peek?: number | undefined;
    overlap?: number | undefined;
}): {
    snapPoints: any[];
    maxVisiblePanels: number;
    peek: number;
    overlap: number;
};
/**
 * How many parent panels physically exist to the left of the active one.
 * Not capped by `maxVisiblePanels` — that config only shapes the *default*
 * reveal depth (see RepanelStack's initial state) and where Expand/Collapse
 * land; a grabber drag can reveal every parent all the way back to panel 0.
 */
export function getMaxParents(activeIndex: any): number;
/**
 * How many parent panels are revealed behind the active panel, as a
 * (possibly fractional) count so grabber drags interpolate smoothly.
 * Capped by how many parents actually exist; `reveal` itself may exceed
 * `snapPoints`' configured range when a drag has pulled in more of the
 * stack than the default snap points cover (see resolveReveal).
 */
export function getVisibleParentCount({ reveal, activeIndex, config }: {
    reveal: any;
    activeIndex: any;
    config: any;
}): number;
/** The left inset (px) applied to the active panel to expose the parent columns. */
export function getActiveInset({ reveal, activeIndex, config }: {
    reveal: any;
    activeIndex: any;
    config: any;
}): number;
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
export function getPanelDescriptor({ index, activeIndex, panelCount, reveal, config, isNarrow, narrowBehavior, }: {
    index: any;
    activeIndex: any;
    panelCount: any;
    reveal: any;
    config: any;
    isNarrow?: boolean | undefined;
    narrowBehavior?: string | undefined;
}): {
    role: string;
    left: number;
    width: string;
    opacity: number;
    zIndex: any;
    interactive: boolean;
    visible: boolean;
} | {
    role: string;
    left: number;
    width: number;
    opacity: number;
    zIndex: number;
    interactive: boolean;
    visible: boolean;
} | {
    role: string;
    left: string;
    width: string;
    opacity: number;
    zIndex: number;
    interactive: boolean;
    visible: boolean;
};
/**
 * Blend two panel descriptors (the same panel evaluated at `fromIndex` and
 * at `toIndex = fromIndex - 1` active) by `t` (0 = fromIndex, 1 = toIndex).
 * Used to live-preview the "swipe the active panel closed" gesture: rather
 * than activeIndex snapping in one step, every panel's position/width/
 * opacity is continuously interpolated between the two whole-stack layouts
 * so the closing panel visibly shrinks while the one behind it grows to
 * fill the space, instead of an abrupt cut.
 */
export function blendPanelDescriptors(dFrom: any, dTo: any, t: any, containerWidth: any): {
    left: any;
    width: any;
    opacity: any;
    zIndex: any;
    interactive: any;
    visible: any;
};
export const DEFAULT_SNAP_POINTS: number[];
export const DEFAULT_MAX_VISIBLE_PANELS: 3;
export const DEFAULT_PEEK: 240;
export const DEFAULT_OVERLAP: 0.5;

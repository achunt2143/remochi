export function shadowFor(strokeWidth: any): {
    blur: number;
    opacity: number;
    width: any;
    offset: number;
};
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
 *   radius       Corner caps only: radius in px of the border's corner the cap
 *                sits on (default 0, a square one). The cap then reaches that
 *                far into the box's neighbour, so the drawing overflows its
 *                box; PopupPanel reads the radius from the panel's own corner.
 *   strokeWidth  Stroke weight (default 2)
 *   stroke       Stroke colour (default: --mochi-popup-border)
 *   fill         Fill colour, or 'none' for an outline (default 'none')
 *   shadow       Soft halo outside the raised part, as the popup sprites had
 *                (scaled down for strokes thinner than 2px; see shadowFor)
 */
export function Nubbin({ shape, direction, side, length, depth, peak, radius, strokeWidth, stroke, fill, shadow, className, style, ...rest }: {
    [x: string]: any;
    shape?: string | undefined;
    direction?: string | undefined;
    side?: string | undefined;
    length: any;
    depth: any;
    peak?: number | undefined;
    radius?: number | undefined;
    strokeWidth?: number | undefined;
    stroke?: string | undefined;
    fill?: string | undefined;
    shadow?: boolean | undefined;
    className: any;
    style: any;
}): any;
/**
 * Inline style for one of Divider's tapered end caps: a 4-row groove in
 * `color` (top row darkest), faded out toward the cap's outer end. `end` is
 * 'start' for the left/top cap (fading toward the left/top) or 'end' for the
 * right/bottom one. The groove's rows scale with the thickness (whole pixels
 * stay crisp: a multiple of 4 puts every row on whole pixels).
 */
export function taperStyle({ orientation, end, color }: {
    orientation?: string | undefined;
    end?: string | undefined;
    color?: string | undefined;
}): {
    backgroundImage: string;
    WebkitMaskImage: string;
    maskImage: string;
};
export const NUBBIN_STROKE: 2;
export namespace BUMP {
    let height: number;
    let sigma: number;
    let peak: number;
    let length: number;
    let depth: number;
}
export namespace CORNER {
    let length_1: number;
    export { length_1 as length };
    let depth_1: number;
    export { depth_1 as depth };
    export let ramp: number[][];
}
export namespace SHADOW {
    let blur: number;
    let opacity: number;
    let spread: number;
    let offset: number;
}
export const NUBBIN_STROKE_COLOR: "var(--mochi-popup-border, #646464)";
export function bumpRise(u: any, peak?: number): number;

/**
 * Repanel
 *
 * A full-height panel with a rounded left edge and flush right edge — the
 * basic "stackable card" surface. Used standalone as a percentage-width
 * layout column inside a flex/grid row, or as the child surface rendered by
 * `RepanelStack`.
 *
 * Props:
 *   width    {number|string}  Width as a percentage number (e.g. 30) or any
 *                             valid CSS width string (e.g. '30%', '320px').
 *                             Default: 100 (100%)
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   handle   {boolean}        Marks the bottom-left edge as a grabber with a
 *                              wavy nubbin accent (transparent background,
 *                              laid directly over the panel's own edge).
 *                              Uses the shadow-variant nubbin asset when
 *                              `style="shadow"` OR the active theme (see
 *                              ThemeWrapper) is 'dark', the default one
 *                              otherwise. `RepanelStack` sets this on every
 *                              child but the first (the base of the stack,
 *                              which has nothing behind it to reveal).
 *                              Default: false
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
export function Repanel({ width, style: variant, handle, className, children, ...rest }: {
    [x: string]: any;
    width?: number | undefined;
    style?: string | undefined;
    handle?: boolean | undefined;
    className?: string | undefined;
    children: any;
}): any;

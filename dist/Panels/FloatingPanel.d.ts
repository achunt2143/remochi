/**
 * FloatingPanel
 *
 * Fills 100% width and height of its container.
 * Same default/shadow style variants as Panel, but a waterdrop
 * (--mochi-floating-radius, 16px 4px 16px 16px) instead of the scallop.
 *
 * Props:
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   fullBleed {boolean}       Square corners, no edge and no shadow, for a
 *                             panel that is the whole surface rather than
 *                             sitting on something. Default: false
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
export function FloatingPanel({ style: variant, fullBleed, className, children, ...rest }: {
    [x: string]: any;
    style?: string | undefined;
    fullBleed?: boolean | undefined;
    className?: string | undefined;
    children: any;
}): any;
export { FloatingPanel as MochiFloatingPanel };

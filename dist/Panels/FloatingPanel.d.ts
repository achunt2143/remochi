/**
 * FloatingPanel
 *
 * Fills 100% width and height of its container.
 * Same default/shadow style variants as Panel, but rounded on all four
 * corners (--mochi-floating-radius, else --mochi-corner, 16px) instead of the
 * scallop.
 *
 * Props:
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   shape    {'round'|'drop'}  'drop' takes the waterdrop accent
 *                             (--mochi-drop-radius, 16px 4px 16px 16px).
 *                             Default: 'round'
 *   fullBleed {boolean}       Square corners, no edge and no shadow, for a
 *                             panel that is the whole surface rather than
 *                             sitting on something; wins over shape.
 *                             Default: false
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
export function FloatingPanel({ style: variant, shape, fullBleed, className, children, ...rest }: {
    [x: string]: any;
    style?: string | undefined;
    shape?: string | undefined;
    fullBleed?: boolean | undefined;
    className?: string | undefined;
    children: any;
}): any;
export { FloatingPanel as MochiFloatingPanel };

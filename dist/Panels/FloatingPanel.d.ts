/**
 * FloatingPanel
 *
 * Fills 100% width and height of its container.
 * Same default/shadow style variants as Panel, but with
 * border-radius: 16px on all four corners instead of only top-left.
 *
 * Props:
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
export function FloatingPanel({ style: variant, className, children, ...rest }: {
    [x: string]: any;
    style?: string | undefined;
    className?: string | undefined;
    children: any;
}): any;
export { FloatingPanel as MochiFloatingPanel };

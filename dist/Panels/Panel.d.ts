/**
 * Panel
 *
 * A full-height panel that takes up a percentage of its parent's width.
 * Intended to be used inside a flex/grid row as a layout column.
 *
 * Props:
 *   width    {number|string}  Width as a percentage number (e.g. 30) or any
 *                             valid CSS width string (e.g. '30%', '320px').
 *                             Default: 100 (100%)
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
export function Panel({ width, style: variant, className, children, ...rest }: {
    [x: string]: any;
    width?: number | undefined;
    style?: string | undefined;
    className?: string | undefined;
    children: any;
}): any;
export { Panel as MochiPanel };

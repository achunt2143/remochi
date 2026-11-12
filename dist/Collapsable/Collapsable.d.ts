export function CollapsableHeader({ children, onClick, className, onKeyDown: userOnKeyDown, ...rest }: {
    [x: string]: any;
    children: any;
    onClick: any;
    className?: string | undefined;
    onKeyDown: any;
}): any;
export function CollapsableItem({ children, className, ...rest }: {
    [x: string]: any;
    children: any;
    className?: string | undefined;
}): any;
export function CollapsableFooter({ className, ...rest }: {
    [x: string]: any;
    className?: string | undefined;
}): any;
export default Collapsable;
/**
 * Collapsable
 *
 * Supports both controlled and uncontrolled usage:
 *
 *   Controlled:    <Collapsable title="…" isOpen={open} onToggle={setOpen}>
 *   Uncontrolled:  <Collapsable title="…" defaultExpanded>
 *
 * Children are rendered as-is — no automatic CollapsableItem wrapping.
 */
declare function Collapsable({ title, children, isOpen, onToggle, defaultExpanded, className, ...rest }: {
    [x: string]: any;
    title: any;
    children: any;
    isOpen: any;
    onToggle: any;
    defaultExpanded?: boolean | undefined;
    className?: string | undefined;
}): any;

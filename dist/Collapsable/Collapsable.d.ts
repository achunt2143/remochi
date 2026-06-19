export function CollapsableHeader({ children, onClick }: {
    children: any;
    onClick: any;
}): any;
export function CollapsableItem({ children }: {
    children: any;
}): any;
export function CollapsableFooter(): any;
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
declare function Collapsable({ title, children, isOpen, onToggle, defaultExpanded, }: {
    title: any;
    children: any;
    isOpen: any;
    onToggle: any;
    defaultExpanded?: boolean | undefined;
}): any;

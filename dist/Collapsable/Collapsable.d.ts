export default Collapsable;
/**
 * Mochi Collapsable React Component
 *
 * A container for collapsable sections with header, content items, and footer.
 * Manages expand/collapse state and animations.
 *
 * Props:
 *   - title: String for the header title
 *   - children: Content items to display when expanded
 *   - defaultExpanded: Boolean for initial expanded state (default: false)
 *   - onToggle: Callback fired when toggle state changes
 */
declare function Collapsable({ title, children, defaultExpanded, onToggle }: {
    title: any;
    children: any;
    defaultExpanded?: boolean | undefined;
    onToggle?: (() => void) | undefined;
}): any;
/**
 * Mochi CollapsableHeader Component
 *
 * Header/title for collapsable sections
 */
export function CollapsableHeader({ children, onClick }: {
    children: any;
    onClick: any;
}): any;
/**
 * Mochi CollapsableItem Component
 *
 * Content item within collapsable section
 */
export function CollapsableItem({ children }: {
    children: any;
}): any;
/**
 * Mochi CollapsableFooter Component
 *
 * Footer/divider for collapsable sections
 */
export function CollapsableFooter(): any;

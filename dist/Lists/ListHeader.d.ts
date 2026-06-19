export default ListHeader;
/**
 * Mochi ListHeader React Component
 *
 * A simple mochi-styled list header that displays text above list content.
 * Lightweight wrapper with minimal styling.
 *
 * Props:
 *   - content: String for list header text (default: '')
 *   - children: Optional content to render below header
 */
declare function ListHeader({ content, children }: {
    content?: string | undefined;
    children: any;
}): any;

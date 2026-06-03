export default ListItem;
/**
 * Mochi ListItem React Component
 *
 * A control designed to display a group of stacked items, typically used in lists.
 * Items are displayed with styling between them and highlight on tap/click.
 *
 * Props:
 *   - children: Content to display in the list item
 *   - tapHighlight: Enable/disable tap highlight effect (default: true)
 *   - onSelect: Callback fired when item is selected/highlighted
 */
declare function ListItem({ children, tapHighlight, onSelect }: {
    children: any;
    tapHighlight?: boolean | undefined;
    onSelect?: (() => void) | undefined;
}): any;

export default GridList;
/**
 * Mochi GridList React Component
 *
 * A grid layout container for displaying image items.
 * Supports selection and responsive grid sizing.
 *
 * Props:
 *   - children: GridListImageItem components
 *   - columns: Number of columns (default: 3)
 *   - gap: Gap between items in px (default: 12)
 */
declare function GridList({ children, columns, gap, className, style, ...rest }: {
    [x: string]: any;
    children: any;
    columns?: number | undefined;
    gap?: number | undefined;
    className?: string | undefined;
    style: any;
}): any;
/**
 * Mochi GridList Image Item Component
 *
 * Displays an image with optional caption in a grid layout.
 * Supports selection with visual feedback.
 *
 * Props:
 *   - src: Image source URL
 *   - caption: Optional caption text
 *   - onSelect: Callback when item is selected
 *   - selected: Boolean for selected state
 */
export function GridListImageItem({ src, caption, onSelect, selected, className, onClick: userOnClick, onKeyDown: userOnKeyDown, ...rest }: {
    [x: string]: any;
    src: any;
    caption: any;
    onSelect?: (() => void) | undefined;
    selected?: boolean | undefined;
    className?: string | undefined;
    onClick: any;
    onKeyDown: any;
}): any;

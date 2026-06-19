export default List;
/**
 * Mochi List React Component
 *
 * A scrollable list container with gradient fade effects at top/bottom.
 * Detects scroll direction and shows appropriate fade effect.
 *
 * Props:
 *   - children: List items to display
 *   - onScrollStart: Callback when scrolling starts
 *   - onScrollStop: Callback when scrolling stops
 */
declare function List({ children, onScrollStart, onScrollStop }: {
    children: any;
    onScrollStart?: (() => void) | undefined;
    onScrollStop?: (() => void) | undefined;
}): any;
/**
 * Mochi ScrollFade Component
 * Shows gradient fade at top/bottom during scrolling
 */
export function ScrollFade({ show, position }: {
    show: any;
    position?: string | undefined;
}): any;

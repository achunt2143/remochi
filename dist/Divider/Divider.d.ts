export default Divider;
/**
 * Divider Component - Scalable divider with fade caps and repeating middle
 *
 * Supports both horizontal and vertical orientations with automatic
 * stretching and no size constraints. The middle section repeats as needed,
 * while the left/right or top/bottom caps remain fixed size.
 *
 * @component
 * @param {Object} props - Component props
 * @param {'horizontal' | 'vertical'} [props.orientation='horizontal'] - Orientation of the divider
 * @param {string | number} [props.width] - Width for horizontal dividers (any valid CSS dimension)
 * @param {string | number} [props.height] - Height for vertical dividers (any valid CSS dimension)
 * @param {string} [props.className] - Custom CSS class name
 * @param {Object} [props.style] - Custom inline styles
 */
declare function Divider({ orientation, width, height, thickness, className, style, }: {
    orientation?: "horizontal" | "vertical" | undefined;
    width?: string | number | undefined;
    height?: string | number | undefined;
    className?: string | undefined;
    style?: Object | undefined;
}): any;

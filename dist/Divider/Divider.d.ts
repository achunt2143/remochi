export default Divider;
/**
 * Divider
 *
 * Two-cap divider: the left cap fills the left half, the right cap fills the
 * right half, and they meet seamlessly in the centre. No repeating middle
 * section. Both caps stretch to cover their half via background-size: 100% 100%.
 *
 * Props:
 *   orientation  'horizontal' | 'vertical'  (default 'horizontal')
 *   thickness    px height (horiz) or px width (vert)  (default 4)
 *   className    extra class string
 *   style        inline style overrides
 */
declare function Divider({ orientation, thickness, className, style, }: {
    orientation?: string | undefined;
    thickness?: number | undefined;
    className?: string | undefined;
    style?: {} | undefined;
}): any;

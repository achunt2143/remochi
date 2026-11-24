export default Divider;
/**
 * Divider
 *
 * Two-cap divider: the left cap fills the left half, the right cap fills the
 * right half, and they meet seamlessly in the centre. No repeating middle
 * section. Each cap is a grooved line that tapers out toward its own end,
 * drawn with CSS gradients (see shared/nubbin.jsx's taperStyle) in the
 * popup border colour, so it follows the theme and scales to any thickness.
 *
 * Props:
 *   orientation  'horizontal' | 'vertical'  (default 'horizontal')
 *   thickness    px height (horiz) or px width (vert)  (default 4)
 *   className    extra class string
 *   style        inline style overrides
 */
declare function Divider({ orientation, thickness, className, style, ...rest }: {
    [x: string]: any;
    orientation?: string | undefined;
    thickness?: number | undefined;
    className?: string | undefined;
    style?: {} | undefined;
}): any;

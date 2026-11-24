export default Header;
/**
 * Mochi Header React Component
 *
 * A mochi-styled header control that displays a single line of text
 * with optional controls on the right side.
 *
 * Props:
 *   - content: String for header text (default: '')
 *   - children: React elements for controls (displayed right-aligned)
 *   - size: 'header' (default, 36/32) or 'display' (72/64, at most once per screen)
 *   - customClasses: Additional CSS classes to apply (default: '')
 */
declare function Header({ content, children, size, customClasses, className, ...rest }: {
    [x: string]: any;
    content?: string | undefined;
    children: any;
    size?: string | undefined;
    customClasses?: string | undefined;
    className?: string | undefined;
}): any;

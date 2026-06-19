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
 *   - customClasses: Additional CSS classes to apply (default: '')
 */
declare function Header({ content, children, customClasses }: {
    content?: string | undefined;
    children: any;
    customClasses?: string | undefined;
}): any;

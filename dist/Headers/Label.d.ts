export default Label;
/**
 * Mochi Label React Component
 *
 * The label rung of the type ladder: names a section inside a panel and
 * replaces a divider or card. Write the text in title case; it is uppercased
 * with CSS so screen readers read words.
 *
 * Props:
 *   - content: String for label text (default: '')
 *   - children: Label text, used when content is empty
 *   - as: Element to render (default: 'div')
 *   - level: aria-level when `as` is not an h1-h6 element (default: 3)
 *   - className: Additional CSS classes to apply (default: '')
 */
declare function Label({ content, children, as: Tag, level, className, ...rest }: {
    [x: string]: any;
    content?: string | undefined;
    children: any;
    as?: string | undefined;
    level?: number | undefined;
    className?: string | undefined;
}): any;

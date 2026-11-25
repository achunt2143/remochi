export default MochiSlidingMenuItem;
/**
 * MochiSlidingMenuItem
 *
 * A single interactive row inside a MochiSlidingMenu.
 * Renders as an <a> when `href` is provided, otherwise a <button>. The active
 * row carries aria-current="page" (the menu's accent bar slides to it).
 *
 * @param {React.ReactNode} children     - Label text
 * @param {React.ReactNode} icon         - Optional leading icon
 * @param {Function}        onClick      - Click handler
 * @param {string}          href         - If provided renders an anchor tag
 * @param {boolean}         isActive     - Highlights the item as selected
 * @param {string|number}   badge        - Optional badge value (a Badge, right-aligned)
 * @param {string}          className
 * @param {object}          style
 * @param {boolean}         disabled
 * @param {'default'|'danger'|'success'} variant
 */
export function MochiSlidingMenuItem({ children, icon, onClick, href, isActive, badge, className, style, disabled, variant, ...rest }: React.ReactNode): any;

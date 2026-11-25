export default MochiSlidingMenuItemGroup;
/**
 * MochiSlidingMenuItemGroup
 *
 * Groups related MochiSlidingMenuItems under an optional label heading.
 * Groups are separated by space (32px); a hairline is drawn below the group
 * only when `divider` is set.
 *
 * @param {React.ReactNode} children  - MochiSlidingMenuItem elements
 * @param {string}          label     - Section heading (the Label voice: Mochi Bold 12, uppercase)
 * @param {boolean}         divider   - Draw a hairline below the group (default: space only)
 * @param {string}          className
 * @param {object}          style
 */
export function MochiSlidingMenuItemGroup({ children, label, className, style, divider, ...rest }: React.ReactNode): any;

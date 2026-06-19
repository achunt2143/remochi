import React from 'react';
import './MochiSlidingMenuItemGroup.scss';

/**
 * MochiSlidingMenuItemGroup
 *
 * Groups related MochiSlidingMenuItems under an optional label heading.
 * Optionally renders a divider below the group.
 *
 * @param {React.ReactNode} children  - MochiSlidingMenuItem elements
 * @param {string}          label     - Section heading text (uppercase, muted)
 * @param {boolean}         divider   - Show a border after the group
 * @param {string}          className
 * @param {object}          style
 */
const MochiSlidingMenuItemGroup = ({
  children,
  label,
  className = '',
  style = {},
  divider = false,
}) => (
  <div
    className={[
      'mochi-sliding-menu-item-group',
      divider ? 'mochi-sliding-menu-item-group--divider' : '',
      className,
    ].filter(Boolean).join(' ')}
    style={style}
    data-testid="mochi-sliding-menu-item-group"
  >
    {label && (
      <div className="mochi-sliding-menu-item-group-label">{label}</div>
    )}
    <div className="mochi-sliding-menu-item-group-items">{children}</div>
  </div>
);

export { MochiSlidingMenuItemGroup };
export default MochiSlidingMenuItemGroup;

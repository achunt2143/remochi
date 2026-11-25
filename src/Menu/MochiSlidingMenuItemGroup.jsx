import React, { useId } from 'react';
import './MochiSlidingMenuItemGroup.scss';

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
const MochiSlidingMenuItemGroup = ({
  children,
  label,
  className = '',
  style = {},
  divider = false,
  ...rest
}) => {
  const labelId = useId();
  return (
    <div
      data-testid="mochi-sliding-menu-item-group"
      role="group"
      aria-labelledby={label ? labelId : undefined}
      {...rest}
      className={[
        'mochi-sliding-menu-item-group',
        label ? 'mochi-sliding-menu-item-group--labelled' : '',
        divider ? 'mochi-sliding-menu-item-group--divider' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      {label && (
        <div className="mochi-sliding-menu-item-group-label" id={labelId}>{label}</div>
      )}
      <div className="mochi-sliding-menu-item-group-items">{children}</div>
    </div>
  );
};

export { MochiSlidingMenuItemGroup };
export default MochiSlidingMenuItemGroup;

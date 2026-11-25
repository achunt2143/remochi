import React, { useCallback } from 'react';
import './MochiSlidingMenuItem.scss';
import { Badge } from '../Badge';

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
const MochiSlidingMenuItem = ({
  children,
  icon,
  onClick,
  href,
  isActive = false,
  badge,
  className = '',
  style = {},
  disabled = false,
  variant = 'default',
  ...rest
}) => {
  const handleClick = useCallback(
    (e) => {
      if (disabled) { e.preventDefault(); return; }
      onClick?.(e);
    },
    [onClick, disabled]
  );

  const itemClass = [
    'mochi-sliding-menu-item',
    `mochi-sliding-menu-item--${variant}`,
    isActive  ? 'mochi-sliding-menu-item--active'   : '',
    disabled  ? 'mochi-sliding-menu-item--disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {icon  && <span className="mochi-sliding-menu-item-icon" aria-hidden="true">{icon}</span>}
      <span className="mochi-sliding-menu-item-label">{children}</span>
      {badge != null && <Badge className="mochi-sliding-menu-item-badge" content={badge} />}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        data-testid="mochi-sliding-menu-item"
        {...rest}
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={itemClass}
        style={style}
        onClick={handleClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      data-testid="mochi-sliding-menu-item"
      {...rest}
      aria-current={isActive ? 'page' : undefined}
      className={itemClass}
      style={style}
      onClick={handleClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
};

export { MochiSlidingMenuItem };
export default MochiSlidingMenuItem;

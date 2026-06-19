import React, { useState, useCallback, useEffect } from 'react';
import './MochiSlidingMenu.scss';
import MochiThemeWrapper from '../ThemeWrapper/MochiThemeWrapper';

/**
 * MochiSlidingMenu
 *
 * A full-viewport sliding menu that lives at the root of your layout.
 * The menu panel slides in from any edge; a ContentShifter sibling
 * translates your main app content to reveal it.
 *
 * The component automatically wraps itself in a MochiThemeWrapper so it
 * respects the active remochi theme without any extra setup in the consumer.
 *
 * Usage:
 *   // 1. Place <MochiSlidingMenu> before your main content
 *   <MochiSlidingMenu position="left" isOpen={open} onOpenChange={setOpen}>
 *     <MochiSlidingMenuItemGroup label="Navigation" divider>
 *       <MochiSlidingMenuItem icon={<HomeIcon />} isActive>Home</MochiSlidingMenuItem>
 *       <MochiSlidingMenuItem icon={<SettingsIcon />}>Settings</MochiSlidingMenuItem>
 *     </MochiSlidingMenuItemGroup>
 *   </MochiSlidingMenu>
 *
 *   // 2. Wrap your app content with the static helper
 *   <MochiSlidingMenu.ContentShifter position="left" isMenuOpen={open}>
 *     <YourAppLayout />
 *   </MochiSlidingMenu.ContentShifter>
 */
const MochiSlidingMenuInner = ({
  children,
  position = 'left',
  isOpen = false,
  onOpenChange,
  className = '',
  style = {},
  duration = 300,
  closeOnEscape = true,
  closeOnBackdropClick = true,
  backdropColor,          // defaults handled in SCSS via CSS var
  showBackdrop = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(isOpen);
  // Controlled vs uncontrolled
  const open = onOpenChange !== undefined ? isOpen : internalOpen;

  const handleOpenChange = useCallback(
    (next) => {
      if (onOpenChange) onOpenChange(next);
      else setInternalOpen(next);
    },
    [onOpenChange]
  );

  // Escape key
  useEffect(() => {
    if (!closeOnEscape || !open) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') handleOpenChange(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeOnEscape, open, handleOpenChange]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const menuClass = [
    'mochi-sliding-menu',
    `mochi-sliding-menu--${position}`,
    open ? 'mochi-sliding-menu--open' : '',
    className,
  ].filter(Boolean).join(' ');

  const menuStyle = {
    ...style,
    '--animation-duration': `${duration}ms`,
    ...(backdropColor ? { '--backdrop-color': backdropColor } : {}),
  };

  return (
    <>
      {showBackdrop && open && (
        <div
          className="mochi-sliding-menu-backdrop"
          onClick={() => closeOnBackdropClick && handleOpenChange(false)}
          aria-hidden="true"
        />
      )}
      <nav
        className={menuClass}
        style={menuStyle}
        role="navigation"
        aria-hidden={!open}
      >
        <div className="mochi-sliding-menu-inner">{children}</div>
      </nav>
    </>
  );
};

/**
 * ContentShifter
 * Wraps your main app content and translates it when the menu opens.
 * This is a static sub-component — it does NOT need to be inside a ThemeWrapper.
 */
const ContentShifter = ({
  children,
  position = 'left',
  isMenuOpen = false,
  menuWidth = '280px',
  menuHeight = 'auto',
  duration = 300,
  className = '',
  style = {},
}) => {
  const isVertical = position === 'left' || position === 'right';
  const isLeft     = position === 'left';
  const isTop      = position === 'top';

  const transform = isMenuOpen
    ? isVertical
      ? isLeft
        ? `translateX(${menuWidth})`
        : `translateX(-${menuWidth})`
      : isTop
        ? `translateY(${menuHeight})`
        : `translateY(-${menuHeight})`
    : 'translate(0, 0)';

  return (
    <div
      className={[
        'mochi-sliding-menu-content-shifter',
        `mochi-sliding-menu-content-shifter--${position}`,
        className,
      ].filter(Boolean).join(' ')}
      style={{
        ...style,
        transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transform,
      }}
    >
      {children}
    </div>
  );
};

// Wrap the menu in a ThemeWrapper so it always picks up the mochi theme
const MochiSlidingMenu = (props) => (
  <MochiThemeWrapper>
    <MochiSlidingMenuInner {...props} />
  </MochiThemeWrapper>
);

MochiSlidingMenu.ContentShifter = ContentShifter;

export { MochiSlidingMenu, ContentShifter as MochiSlidingMenuContentShifter };
export default MochiSlidingMenu;

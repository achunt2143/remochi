import React, { useState, useCallback, useEffect, useLayoutEffect, useContext, useRef, useId } from 'react';
import './MochiSlidingMenu.scss';
import MochiThemeWrapper, { ThemeContext } from '../ThemeWrapper/MochiThemeWrapper';
import Header from '../Headers/Header';
import Subheader from '../Headers/Subheader';
import { useEscapeLayer } from '../shared/escapeStack';

// What Tab can land on inside the menu.
const FOCUSABLE = 'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])';

/**
 * MochiSlidingMenu
 *
 * A full-viewport sliding menu that lives at the root of your layout.
 * The menu panel slides in from any edge; a ContentShifter sibling
 * translates your main app content to reveal it. It is a panel in the list
 * voice: 54px rows, an optional `title` nameplate, and one accent bar that
 * slides to the active row. With a backdrop it is a modal dialog (focus moves
 * in, Tab stays inside, Escape closes, focus returns to the opener).
 *
 * The component automatically wraps itself in a MochiThemeWrapper so it
 * respects the active remochi theme without any extra setup in the consumer.
 *
 * Usage:
 *   // 1. Place <MochiSlidingMenu> before your main content
 *   <MochiSlidingMenu position="left" title="Pyxis" isOpen={open} onOpenChange={setOpen}>
 *     <MochiSlidingMenuItemGroup label="Navigation">
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
  duration,               // ms; defaults to the stack token (--mochi-duration-stack)
  closeOnEscape = true,
  closeOnBackdropClick = true,
  backdropColor,          // defaults handled in SCSS via CSS var
  showBackdrop = true,
  title,                  // optional nameplate (a Header: truncates, uppercases)
  subtitle,               // optional line under the title (Subheader voice)
  showCloseButton = false, // a 44px close button in the header, for touch
  ...rest
}) => {
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const titleId = useId();
  // The accent bar: one element that slides between rows. Not rendered until
  // the first measurement, so it never slides in from the top.
  const [mark, setMark] = useState(null);
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

  // Escape closes only the topmost layer (a Dialog opened from the menu
  // goes first).
  useEscapeLayer(open && closeOnEscape, () => handleOpenChange(false));

  // Focus moves into the menu on open (first enabled item, else the panel)
  // and returns to whatever opened it on close.
  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const panel = panelRef.current;
    const first = panel?.querySelector('.mochi-sliding-menu-item:not(:disabled)');
    (first || panel)?.focus({ preventScroll: true });
    return () => {
      if (opener && opener.isConnected && typeof opener.focus === 'function') {
        opener.focus({ preventScroll: true });
      }
    };
  }, [open]);

  // While modal, Tab wraps inside the menu.
  const handleKeyDown = (e) => {
    rest.onKeyDown?.(e);
    if (e.key !== 'Tab' || !showBackdrop || e.defaultPrevented) return;
    const stops = [...panelRef.current.querySelectorAll(FOCUSABLE)];
    if (!stops.length) { e.preventDefault(); return; }
    const first = stops[0];
    const last = stops[stops.length - 1];
    const at = document.activeElement;
    if (e.shiftKey && (at === first || at === panelRef.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  };

  // Put the accent bar on the active row (20px tall, centred on it). Runs
  // after every render, since the active item is a child's prop; it only sets
  // state when the position changed.
  const measure = useCallback(() => {
    const list = listRef.current;
    const row = list?.querySelector('[aria-current="page"]');
    if (!row) { setMark((m) => (m && m.visible ? { ...m, visible: false } : m)); return; }
    const l = list.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    const height = Math.min(20, r.height);
    const top = Math.round(r.top - l.top + list.scrollTop + (r.height - height) / 2);
    // The row's own accent: the focus ring, or the danger/success ink.
    const color = getComputedStyle(row).getPropertyValue('--item-accent').trim();
    setMark((m) => (m && m.visible && m.top === top && m.height === height && m.color === color
      ? m : { top, height, color, visible: true }));
  }, []);
  useLayoutEffect(measure);
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [measure]);

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
    ...(duration !== undefined ? { '--animation-duration': `${duration}ms` } : {}),
    ...(backdropColor ? { '--backdrop-color': backdropColor } : {}),
  };

  // Named by its title when it has one; the consumer's aria-label wins.
  const labelProps = rest['aria-label'] || rest['aria-labelledby']
    ? {}
    : title ? { 'aria-labelledby': titleId } : { 'aria-label': 'Menu' };

  return (
    <>
      {showBackdrop && (
        <div
          className={`mochi-sliding-menu-backdrop${open ? ' mochi-sliding-menu-backdrop--open' : ''}`}
          onClick={() => closeOnBackdropClick && handleOpenChange(false)}
          aria-hidden="true"
        />
      )}
      <div
        {...labelProps}
        {...rest}
        ref={panelRef}
        tabIndex={-1}
        className={menuClass}
        style={menuStyle}
        role={showBackdrop ? 'dialog' : 'navigation'}
        aria-modal={showBackdrop ? 'true' : undefined}
        aria-hidden={!open}
        onKeyDown={handleKeyDown}
      >
        <div className="mochi-sliding-menu-inner">
          {(title || showCloseButton) && (
            <Header id={titleId} className="mochi-sliding-menu-header" content={title}>
              {showCloseButton && (
                <button
                  type="button"
                  className="mochi-sliding-menu-close"
                  aria-label="Close menu"
                  onClick={() => handleOpenChange(false)}
                >
                  <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
                    <path d="M4 4l12 12M16 4L4 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </Header>
          )}
          {subtitle && <Subheader className="mochi-sliding-menu-subheader" content={subtitle} />}
          <div className="mochi-sliding-menu-list" ref={listRef}>
            {children}
            {mark && (
              <span
                className={`mochi-sliding-menu-active-bar${mark.visible ? ' mochi-sliding-menu-active-bar--visible' : ''}`}
                aria-hidden="true"
                style={{ top: mark.top, height: mark.height, '--bar-color': mark.color || undefined }}
              />
            )}
          </div>
        </div>
      </div>
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
  menuWidth = 'min(320px, 85vw)', // the panel's own width
  menuHeight = 'auto',
  duration,
  className = '',
  style = {},
  ...rest
}) => {
  const isVertical = position === 'left' || position === 'right';
  const isLeft     = position === 'left';
  const isTop      = position === 'top';

  const transform = isMenuOpen
    ? isVertical
      ? isLeft
        ? `translateX(${menuWidth})`
        : `translateX(calc(-1 * ${menuWidth}))`
      : isTop
        ? `translateY(${menuHeight})`
        : `translateY(calc(-1 * ${menuHeight}))`
    : 'translate(0, 0)';

  return (
    <div
      {...rest}
      className={[
        'mochi-sliding-menu-content-shifter',
        `mochi-sliding-menu-content-shifter--${position}`,
        className,
      ].filter(Boolean).join(' ')}
      style={{
        ...style,
        transition: `transform ${
          duration !== undefined ? `${duration}ms` : 'var(--mochi-duration-stack, 260ms)'
        } var(--mochi-ease-forward, cubic-bezier(0.16, 1, 0.3, 1))`,
        transform,
      }}
    >
      {children}
    </div>
  );
};

// Wrap the menu in a ThemeWrapper only if not already inside an active theme context
const MochiSlidingMenu = (props) => {
  const existingTheme = useContext(ThemeContext);
  if (existingTheme && existingTheme._isThemeContext) {
    return <MochiSlidingMenuInner {...props} />;
  }
  return (
    <MochiThemeWrapper>
      <MochiSlidingMenuInner {...props} />
    </MochiThemeWrapper>
  );
};

MochiSlidingMenu.ContentShifter = ContentShifter;

export { MochiSlidingMenu, ContentShifter as MochiSlidingMenuContentShifter };
export default MochiSlidingMenu;

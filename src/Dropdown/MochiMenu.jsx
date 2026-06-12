/**
 * MochiMenu — lightweight contextual popup for menus
 *
 * Mirrors mochi.Menu (extends mochi.ContextualPopup):
 * - Renders into a Portal (document.body) so z-index/overflow never clips it
 * - Uses .mochi-contextual-popup CSS classes for the pill-border style
 * - Positions below activator by default; flips above if viewport is tight
 * - maxHeight + overflow-y scroll (default 200px, mirrors mochi.Menu.maxHeight)
 * - Modal: click outside closes the menu
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MochiMenu.scss';

const MARGIN    = 4;   // gap between activator and menu
const MAX_H_DEFAULT = 200;

const MochiMenu = ({
  isOpen,
  anchorEl,          // ref or DOM element for the activator
  onClose,
  maxHeight = MAX_H_DEFAULT,
  children,
}) => {
  const menuRef  = useRef(null);
  const [style, setStyle]   = useState({});
  const [menuUp, setMenuUp] = useState(false);

  // mirrors adjustPosition / getPageOffset from mochi.Menu
  const adjustPosition = useCallback(() => {
    const anchor = anchorEl?.current ?? anchorEl;
    if (!anchor || !menuRef.current) return;

    const r         = anchor.getBoundingClientRect();
    const scrollY   = window.pageYOffset ?? document.documentElement.scrollTop;
    const scrollX   = window.pageXOffset ?? document.documentElement.scrollLeft;
    const innerH    = window.innerHeight ?? document.documentElement.clientHeight;
    const innerW    = window.innerWidth  ?? document.documentElement.clientWidth;
    const menuH     = menuRef.current.offsetHeight;
    const menuW     = menuRef.current.offsetWidth;

    // Decide: show above or below?
    const spaceBelow = innerH - (r.bottom);
    const spaceAbove = r.top;
    const up = (r.top + r.height + menuH > innerH) && (spaceAbove > spaceBelow);
    setMenuUp(up);

    let top  = up
      ? r.top  + scrollY - menuH - MARGIN
      : r.bottom + scrollY + MARGIN;

    // Horizontal: align left edge to activator, clamp to viewport
    let left = r.left + scrollX;
    if (left + menuW > innerW - MARGIN) left = innerW - menuW - MARGIN + scrollX;
    if (left < MARGIN) left = MARGIN;

    // Width: at least as wide as the activator
    const width = Math.max(r.width, 150);

    setStyle({ top, left, width, maxHeight });
  }, [anchorEl, maxHeight]);

  useEffect(() => {
    if (!isOpen) return;
    // Use rAF so the menu has rendered and has measurable dimensions
    const frame = requestAnimationFrame(() => adjustPosition());
    window.addEventListener('resize', adjustPosition);
    window.addEventListener('scroll', adjustPosition, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', adjustPosition);
      window.removeEventListener('scroll', adjustPosition, true);
    };
  }, [isOpen, adjustPosition]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Transparent modal overlay — click outside closes */}
      <div className="mochi-menu-overlay" onClick={onClose} />

      <div
        ref={menuRef}
        className={`mochi-contextual-popup mochi-menu vertical ${menuUp ? 'above' : 'below'}`}
        style={style}
        role="menu"
      >
        <div className="mochi-menu-scroller" style={{ maxHeight, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
};

export default MochiMenu;

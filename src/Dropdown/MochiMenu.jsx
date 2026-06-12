/**
 * MochiMenu — lightweight contextual popup for menus
 *
 * Mirrors mochi.Menu (extends mochi.ContextualPopup):
 * - Renders into a Portal (document.body), position: fixed
 * - Positions below activator by default; flips above if viewport is tight
 * - maxHeight + overflow-y scroll (default 200px)
 * - Modal: click outside closes the menu
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MochiMenu.scss';

const MARGIN = 4; // px gap between activator bottom and menu top

const MochiMenu = ({
  isOpen,
  anchorEl,   // React ref whose .current is the trigger DOM node
  onClose,
  maxHeight = 200,
  children,
}) => {
  const menuRef = useRef(null);
  // Start invisible so there's no flash at 0,0 before we measure
  const [style, setStyle] = useState({ visibility: 'hidden' });

  // position: fixed — coords come straight from getBoundingClientRect (viewport-relative)
  // NO scroll offsets needed
  const adjustPosition = useCallback(() => {
    const anchor = anchorEl?.current ?? anchorEl;
    if (!anchor || !menuRef.current) return;

    const r      = anchor.getBoundingClientRect();
    const innerH = window.innerHeight  || document.documentElement.clientHeight;
    const innerW = window.innerWidth   || document.documentElement.clientWidth;
    const menuH  = menuRef.current.offsetHeight;
    const menuW  = menuRef.current.offsetWidth;

    // Flip above when not enough room below and more room above
    const spaceBelow = innerH - r.bottom;
    const spaceAbove = r.top;
    const up = spaceBelow < menuH + MARGIN && spaceAbove > spaceBelow;

    const top  = up ? r.top - menuH - MARGIN : r.bottom + MARGIN;

    // Align left edge to activator, clamp to viewport
    let left = r.left;
    const minWidth = Math.max(r.width, 150);
    if (left + minWidth > innerW - MARGIN) left = Math.max(MARGIN, innerW - minWidth - MARGIN);
    if (left < MARGIN) left = MARGIN;

    setStyle({ top, left, width: minWidth, maxHeight, visibility: 'visible' });
  }, [anchorEl, maxHeight]);

  useEffect(() => {
    if (!isOpen) return;
    // Hide again when re-opening so stale position isn't briefly visible
    setStyle({ visibility: 'hidden' });
    const frame = requestAnimationFrame(() => adjustPosition());
    window.addEventListener('resize',  adjustPosition);
    window.addEventListener('scroll',  adjustPosition, true);
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
      {/* Transparent overlay — click outside to close */}
      <div className="mochi-menu-overlay" onClick={onClose} />

      <div
        ref={menuRef}
        className="mochi-contextual-popup mochi-menu"
        style={style}
        role="listbox"
      >
        {/* Scrollable item list */}
        <div
          className="mochi-menu-scroller"
          style={{ maxHeight, overflowY: 'auto' }}
        >
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
};

export default MochiMenu;

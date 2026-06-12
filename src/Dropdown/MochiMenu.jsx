/**
 * MochiMenu — contextual popup for MochiDropdown
 *
 * Reuses the Panel styled-component from MochiPopupPanel so the menu gets
 * the same background, border, border-radius, shadow, and fadeIn animation
 * as every other contextual popup in Remochi. No nubbin is rendered.
 *
 * Behaviour:
 *   - Portal into document.body (position: fixed)
 *   - Positions below activator; flips above when viewport is tight
 *   - Scrollable inner list (maxHeight, default 200px)
 *   - Click-outside overlay closes the menu
 *   - Escape key closes the menu
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Panel } from '../Popup/MochiPopupPanel.styles.jsx';
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
  const [style, setStyle] = useState({ visibility: 'hidden', position: 'fixed' });

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
    const minWidth = Math.max(r.width, 160);
    if (left + minWidth > innerW - MARGIN) left = Math.max(MARGIN, innerW - minWidth - MARGIN);
    if (left < MARGIN) left = MARGIN;

    setStyle({ position: 'fixed', top, left, width: minWidth, maxWidth: 'none', visibility: 'visible' });
  }, [anchorEl]);

  useEffect(() => {
    if (!isOpen) return;
    setStyle({ visibility: 'hidden', position: 'fixed' });
    const frame = requestAnimationFrame(() => adjustPosition());
    window.addEventListener('resize',  adjustPosition);
    window.addEventListener('scroll',  adjustPosition, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', adjustPosition);
      window.removeEventListener('scroll', adjustPosition, true);
    };
  }, [isOpen, adjustPosition]);

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
      {/* <div className="mochi-menu-overlay" onClick={onClose} /> */}

      {/* Panel reuses the same styled-component as MochiPopupPanel:
          bg, border, border-radius, box-shadow, fadeIn animation.
          The 'mochi-menu' class adds no-nubbin override from MochiMenu.scss. */}
      <Panel
        ref={menuRef}
        className="mochi-menu"
        style={style}
        role="listbox"
      >
        <div
          className="mochi-menu-scroller"
          style={{ maxHeight, overflowY: 'auto' }}
        >
          {children}
        </div>
      </Panel>
    </>,
    document.body,
  );
};

export default MochiMenu;

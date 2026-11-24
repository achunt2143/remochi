import React from 'react';
import './MochiPanel.scss';
import { Nubbin } from '../shared/nubbin';

// The grabber is a bump pointing left (see shared/nubbin.jsx), 43px tall
// with its peak 36px down, so the panel's bottom edge cuts it off just past
// the peak. It's drawn in the panel's own border colour and filled with the
// variant's own background, so it reads as part of the panel's edge in
// either theme.
const HANDLE_STROKE = 'var(--mochi-panel-border, #666666)';
const HANDLE_FILL = {
  default: 'var(--mochi-panel-bg, #f5f5f5)',
  shadow: 'var(--mochi-panel-shadow-bg, #f5f5f5)',
};

/**
 * Repanel
 *
 * A full-height panel with a rounded left edge and flush right edge — the
 * basic "stackable card" surface. Used standalone as a percentage-width
 * layout column inside a flex/grid row, or as the child surface rendered by
 * `RepanelStack`.
 *
 * Props:
 *   width    {number|string}  Width as a percentage number (e.g. 30) or any
 *                             valid CSS width string (e.g. '30%', '320px').
 *                             Default: 100 (100%)
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   handle   {boolean}        Marks the bottom-left edge as a grabber with a
 *                              wavy nubbin accent, laid directly over the
 *                              panel's own edge and coloured from the theme
 *                              tokens. `RepanelStack` sets this on every
 *                              child but the first (the base of the stack,
 *                              which has nothing behind it to reveal).
 *                              Default: false
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
const Repanel = ({
  width     = 100,
  style: variant = 'default',
  handle    = false,
  className = '',
  children,
  ...rest
}) => {
  // Accept plain number (treated as %) or any CSS string
  const resolvedWidth = typeof width === 'number' ? `${width}%` : width;
  const resolvedVariant = typeof variant === 'string' ? variant : 'default';
  const inlineStyle = variant && typeof variant === 'object' ? variant : undefined;

  return (
    <div
      {...rest}
      className={[
        'mochi-panel',
        `mochi-panel--${resolvedVariant}`,
        handle && 'mochi-panel--handle',
        className,
      ].filter(Boolean).join(' ')}
      style={inlineStyle ? { width: resolvedWidth, ...inlineStyle } : { width: resolvedWidth }}
    >
      <div className="mochi-panel-body">{children}</div>
      {handle && (
        <Nubbin
          className="mochi-panel-handle-nubbin"
          direction="left"
          length={43}
          stroke={HANDLE_STROKE}
          fill={HANDLE_FILL[resolvedVariant] ?? HANDLE_FILL.default}
          shadow
        />
      )}
    </div>
  );
};

export { Repanel };

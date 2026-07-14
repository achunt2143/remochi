import React from 'react';
import './MochiPanel.scss';
import { useTheme } from '../ThemeWrapper/MochiThemeWrapper';
import leftNubbin from './nubbins/left.png';
import leftShadowNubbin from './nubbins/left-shadow.png';

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
 *                              wavy nubbin accent (transparent background,
 *                              laid directly over the panel's own edge).
 *                              Uses the shadow-variant nubbin asset when
 *                              `style="shadow"` OR the active theme (see
 *                              ThemeWrapper) is 'dark', the default one
 *                              otherwise. `RepanelStack` sets this on every
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

  // The shadow variant gets its own nubbin asset — left-shadow.png — so its
  // accent matches that variant's own (darker) look instead of the default
  // variant's. Also picked in dark mode even for the 'default' panel
  // variant, since left.png's stroke color doesn't read against a dark
  // panel background the way left-shadow.png's does.
  const { theme } = useTheme();
  const nubbinImage = variant === 'shadow' || theme === 'dark' ? leftShadowNubbin : leftNubbin;

  return (
    <div
      className={`mochi-panel mochi-panel--${variant} ${handle ? 'mochi-panel--handle' : ''} ${className}`}
      style={{ width: resolvedWidth }}
      {...rest}
    >
      {children}
      {handle && (
        <div
          className="mochi-panel-handle-nubbin"
          style={{ backgroundImage: `url(${nubbinImage})` }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export { Repanel };

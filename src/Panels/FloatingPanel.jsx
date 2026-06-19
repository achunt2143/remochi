import React from 'react';
import './MochiPanel.scss';

/**
 * FloatingPanel
 *
 * Fills 100% width and height of its container.
 * Same default/shadow style variants as Panel, but with
 * border-radius: 16px on all four corners instead of only top-left.
 *
 * Props:
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
const FloatingPanel = ({
  style: variant = 'default',
  className = '',
  children,
  ...rest
}) => (
  <div
    className={`mochi-panel mochi-floating-panel mochi-panel--${variant} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export { FloatingPanel };
export { FloatingPanel as MochiFloatingPanel };

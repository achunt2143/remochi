import React from 'react';
import './MochiPanel.scss';

/**
 * Panel
 *
 * A full-height panel that takes up a percentage of its parent's width.
 * Intended to be used inside a flex/grid row as a layout column.
 *
 * Props:
 *   width    {number|string}  Width as a percentage number (e.g. 30) or any
 *                             valid CSS width string (e.g. '30%', '320px').
 *                             Default: 100 (100%)
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
const Panel = ({
  width     = 100,
  style: variant = 'default',
  className = '',
  children,
  ...rest
}) => {
  // Accept plain number (treated as %) or any CSS string
  const resolvedWidth = typeof width === 'number' ? `${width}%` : width;

  return (
    <div
      className={`mochi-panel mochi-panel--${variant} ${className}`}
      style={{ width: resolvedWidth }}
      {...rest}
    >
      {children}
    </div>
  );
};

export { Panel };
export { Panel as MochiPanel };

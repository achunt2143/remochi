import React from 'react';
import './MochiPanel.scss';

/**
 * Panel
 *
 * A full-height panel that takes up a percentage of its parent's width.
 * Intended to be used inside a flex/grid row as a layout column.
 *
 * Props:
 *   width      {number|string}                           Width as a percentage number (e.g. 30) or any
 *                                                        valid CSS width string (e.g. '30%', '320px').
 *                                                        Default: 100 (100%)
 *   style      {'default'|'shadow'|'dark'|'shadow-dark'} Visual variant. Default: 'default'
 *   direction  {'left'|'right'|'up'|'down'}              Optional. Flips the panel on the given axis.
 *                                                        'left'|'right' → scaleX(-1)
 *                                                        'up'|'down'    → scaleY(-1)
 *   overlay    {boolean}                                 When true, translates the panel -1rem on X.
 *   fullLength {'top'|'bottom'|'left'|'right'}           Optional. Rounds both corners on the given
 *                                                        edge, turning it into a full-length capped edge.
 *                                                        Overrides the variant's default border-radius.
 *   className  {string}                                  Extra CSS classes
 *   children   {ReactNode}
 */
const Panel = ({
  width      = 100,
  style: variant = 'default',
  direction,
  overlay    = false,
  fullLength,
  className  = '',
  children,
  ...rest
}) => {
  const resolvedWidth = typeof width === 'number' ? `${width}%` : width;

  const directionClass =
    direction === 'left'  || direction === 'right' ? 'mochi-panel--flip-x' :
    direction === 'up'    || direction === 'down'  ? 'mochi-panel--flip-y' :
    '';

  const overlayClass    = overlay    ? 'mochi-panel--overlay'          : '';
  const fullLengthClass = fullLength ? `mochi-panel--full-${fullLength}` : '';

  return (
    <div
      className={[
        'mochi-panel',
        `mochi-panel--${variant}`,
        directionClass,
        overlayClass,
        fullLengthClass,
        className,
      ].filter(Boolean).join(' ')}
      style={{ width: resolvedWidth }}
      {...rest}
    >
      {children}
    </div>
  );
};

export { Panel };
export { Panel as MochiPanel };

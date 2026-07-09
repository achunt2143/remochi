import React from 'react';
import './MochiPanel.scss';

/**
 * FloatingPanel
 *
 * Fills 100% width and height of its container.
 * Same style variants as Panel (default, shadow, dark, shadow-dark),
 * but with border-radius: 16px on all four corners by default.
 *
 * Props:
 *   style      {'default'|'shadow'|'dark'|'shadow-dark'} Visual variant. Default: 'default'
 *   direction  {'left'|'right'|'up'|'down'}              Optional. Flips the panel on the given axis.
 *   overlay    {boolean}                                 When true, translates -1rem on X.
 *   fullLength {'top'|'bottom'|'left'|'right'}           Optional. Rounds both corners on the given
 *                                                        edge. Overrides the variant's border-radius.
 *   className  {string}                                  Extra CSS classes
 *   children   {ReactNode}
 */
const FloatingPanel = ({
  style: variant = 'default',
  direction,
  overlay    = false,
  fullLength,
  className  = '',
  children,
  ...rest
}) => {
  const directionClass =
    direction === 'left'  || direction === 'right' ? 'mochi-panel--flip-x' :
    direction === 'up'    || direction === 'down'  ? 'mochi-panel--flip-y' :
    '';

  const overlayClass    = overlay    ? 'mochi-panel--overlay'           : '';
  const fullLengthClass = fullLength ? `mochi-panel--full-${fullLength}` : '';

  return (
    <div
      className={[
        'mochi-panel',
        'mochi-floating-panel',
        `mochi-panel--${variant}`,
        directionClass,
        overlayClass,
        fullLengthClass,
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
};

export { FloatingPanel };
export { FloatingPanel as MochiFloatingPanel };

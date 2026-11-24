import React from 'react';
import './MochiPanel.scss';

/**
 * FloatingPanel
 *
 * Fills 100% width and height of its container.
 * Same default/shadow style variants as Panel, but a waterdrop
 * (--mochi-floating-radius, 16px 4px 16px 16px) instead of the scallop.
 *
 * Props:
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   fullBleed {boolean}       Square corners, no edge and no shadow, for a
 *                             panel that is the whole surface rather than
 *                             sitting on something. Default: false
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
const FloatingPanel = ({
  style: variant = 'default',
  fullBleed = false,
  className = '',
  children,
  ...rest
}) => {
  const resolvedVariant = typeof variant === 'string' ? variant : 'default';
  const inlineStyle = variant && typeof variant === 'object' ? variant : undefined;

  return (
    <div
      {...rest}
      className={[
        'mochi-panel',
        'mochi-floating-panel',
        `mochi-panel--${resolvedVariant}`,
        fullBleed && 'mochi-floating-panel--full-bleed',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={inlineStyle}
    >
      {children}
    </div>
  );
};

export { FloatingPanel };
export { FloatingPanel as MochiFloatingPanel };

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
}) => {
  const resolvedVariant = typeof variant === 'string' ? variant : 'default';
  const inlineStyle = variant && typeof variant === 'object' ? variant : undefined;

  return (
    <div
      {...rest}
      className={['mochi-panel', 'mochi-floating-panel', `mochi-panel--${resolvedVariant}`, className]
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

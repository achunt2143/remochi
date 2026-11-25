import React from 'react';
import './MochiPanel.scss';

/**
 * FloatingPanel
 *
 * Fills 100% width and height of its container.
 * Same default/shadow style variants as Panel, but rounded on all four
 * corners (--mochi-floating-radius, else --mochi-corner, 16px) instead of the
 * scallop.
 *
 * Props:
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   shape    {'round'|'drop'}  'drop' takes the waterdrop accent
 *                             (--mochi-drop-radius, 16px 4px 16px 16px).
 *                             Default: 'round'
 *   fullBleed {boolean}       Square corners, no edge and no shadow, for a
 *                             panel that is the whole surface rather than
 *                             sitting on something; wins over shape.
 *                             Default: false
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
const FloatingPanel = ({
  style: variant = 'default',
  shape = 'round',
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
        shape === 'drop' && 'mochi-floating-panel--drop',
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

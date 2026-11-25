import React from 'react';
import './Divider.scss';
import { taperStyle } from '../shared/nubbin';

/**
 * Divider
 *
 * Two-cap divider: the left cap fills the left half, the right cap fills the
 * right half, and they meet seamlessly in the centre. No repeating middle
 * section. Each cap is a grooved line that tapers out toward its own end,
 * drawn with CSS gradients (see shared/nubbin.jsx's taperStyle) in the
 * popup border colour, so it follows the theme and scales to any thickness.
 *
 * Props:
 *   orientation  'horizontal' | 'vertical'  (default 'horizontal')
 *   thickness    px height (horiz) or px width (vert)  (default 4)
 *   className    extra class string
 *   style        inline style overrides
 */
const Divider = ({
  orientation = 'horizontal',
  thickness   = 4,
  className   = '',
  style       = {},
  ...rest
}) => {
  const isHorizontal = orientation === 'horizontal';

  const rootStyle = {
    ...style,
    ...(isHorizontal ? { height: thickness } : { width: thickness }),
  };

  return (
    <div
      {...rest}
      className={['remochi-divider', `remochi-divider--${orientation}`, className]
        .filter(Boolean)
        .join(' ')}
      style={rootStyle}
    >
      <div
        className="divider-cap divider-cap-left"
        style={taperStyle({ orientation, end: 'start' })}
      />
      <div
        className="divider-cap divider-cap-right"
        style={taperStyle({ orientation, end: 'end' })}
      />
    </div>
  );
};

export default Divider;

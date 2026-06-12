import React from 'react';
import './Divider.scss';
import capLeftImage  from './div-img/div-left.png';
import capRightImage from './div-img/div-right.png';

/**
 * Divider
 *
 * Two-cap divider: the left cap fills the left half, the right cap fills the
 * right half, and they meet seamlessly in the centre. No repeating middle
 * section. Both caps stretch to cover their half via background-size: 100% 100%.
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
}) => {
  const isHorizontal = orientation === 'horizontal';

  const rootStyle = {
    ...style,
    ...(isHorizontal ? { height: thickness } : { width: thickness }),
  };

  return (
    <div
      className={`remochi-divider remochi-divider--${orientation} ${className}`}
      style={rootStyle}
    >
      <div
        className="divider-cap divider-cap-left"
        style={{ backgroundImage: `url('${capLeftImage}')` }}
      />
      <div
        className="divider-cap divider-cap-right"
        style={{ backgroundImage: `url('${capRightImage}')` }}
      />
    </div>
  );
};

export default Divider;

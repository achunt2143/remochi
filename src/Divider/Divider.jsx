import React from 'react';
import './Divider.scss';
import capLeftImage from './div-img/div-left.png';
import middleImage from './div-img/div-mid.png';
import capRightImage from './div-img/div-right.png';

/**
 * Divider Component - Scalable divider with fade caps and repeating middle
 *
 * Supports both horizontal and vertical orientations with automatic
 * stretching and no size constraints. The middle section repeats as needed,
 * while the left/right or top/bottom caps remain fixed size.
 *
 * @component
 * @param {Object} props - Component props
 * @param {'horizontal' | 'vertical'} [props.orientation='horizontal'] - Orientation of the divider
 * @param {string | number} [props.width] - Width for horizontal dividers (any valid CSS dimension)
 * @param {string | number} [props.height] - Height for vertical dividers (any valid CSS dimension)
 * @param {string} [props.className] - Custom CSS class name
 * @param {Object} [props.style] - Custom inline styles
 */

const Divider = ({
  orientation = 'horizontal',
  width,
  height,
  thickness = 4,
  className = '',
  style = {},
}) => {
  const isHorizontal = orientation === 'horizontal';

  const componentStyle = {
    ...style,
    ...(isHorizontal && width != null ? { width } : {}),
    ...(!isHorizontal && height != null ? { height } : {}),
    // enforce thickness on the cross‑axis
    ...(isHorizontal ? { height: thickness } : { width: thickness }),
  };

  return (
    <div
      className={`remochi-divider remochi-divider--${orientation} ${className}`}
      style={componentStyle}
    >
      {/* Left / Top cap container */}
      <div
        className={`divider-cap divider-cap-left divider-cap--${isHorizontal ? 'horizontal' : 'vertical'}`}
      >
        <div
          className="divider-cap-layer divider-cap-layer--normal"
          style={{ backgroundImage: `url('${capLeftImage}')` }}
        />
        <div
          className="divider-cap-layer divider-cap-layer--flipped"
          style={{ backgroundImage: `url('${capLeftImage}')` }}
        />
      </div>

      {/* Middle repeating section */}
      <div
        className={`divider-middle divider-middle--${orientation}`}
      >
        <div
          className="divider-middle-layer divider-middle-layer--normal"
          style={{ backgroundImage: `url('${middleImage}')` }}
        />
        <div
          className="divider-middle-layer divider-middle-layer--flipped"
          style={{ backgroundImage: `url('${middleImage}')` }}
        />
      </div>

      {/* Right / Bottom cap container */}
      <div
        className={`divider-cap divider-cap-right divider-cap--${isHorizontal ? 'horizontal' : 'vertical'}`}
      >
        <div
          className="divider-cap-layer divider-cap-layer--normal"
          style={{ backgroundImage: `url('${capRightImage}')` }}
        />
        <div
          className="divider-cap-layer divider-cap-layer--flipped"
          style={{ backgroundImage: `url('${capRightImage}')` }}
        />
      </div>
    </div>
  );
};

export default Divider;

/**
 * NubbinDivider
 *
 * Three-part divider:  [left cap] [nubbin image] [right cap]
 *
 * The left and right caps each grow to fill their half of the available
 * width. The nubbin image sits fixed-size between them, centred on the
 * divider line.
 *
 * Props:
 *   nubbin        Which nubbin image to show.
 *                 Straight : 'up' | 'down' | 'left' | 'right'
 *                 Corner   : 'top-left-up' | 'top-right-up'
 *                            'top-left-left' | 'top-right-right'
 *                            'bottom-left-down' | 'bottom-right-down'
 *                            'bottom-left-left' | 'bottom-right-right'
 *                 Default  : 'up'
 *   nubbinOffset  CSS left value to shift the nubbin from centre.
 *                 e.g. '50%' (default) | '120px' | 'calc(...)'
 *                 When '50%' the nubbin lands exactly in the middle.
 *   orientation   'horizontal' (default) | 'vertical'
 *   thickness     Line thickness in px (default 4)
 *   className     Extra class string
 *   style         Inline style overrides on the root element
 */
import React from 'react';
import './NubbinDivider.scss';
import capLeftImage  from './div-img/div-left.png';
import capRightImage from './div-img/div-right.png';

import imgUp               from '../Popup/nubbinImages/up.png';
import imgDown             from '../Popup/nubbinImages/down.png';
import imgLeft             from '../Popup/nubbinImages/left.png';
import imgRight            from '../Popup/nubbinImages/right.png';
import imgTopLeftUp        from '../Popup/nubbinImages/top-left-corner-up.png';
import imgTopRightUp       from '../Popup/nubbinImages/top-right-corner-up.png';
import imgTopLeftLeft      from '../Popup/nubbinImages/top-left-corner-left.png';
import imgTopRightRight    from '../Popup/nubbinImages/top-right-corner-right.png';
import imgBottomLeftDown   from '../Popup/nubbinImages/bottom-left-corner-down.png';
import imgBottomRightDown  from '../Popup/nubbinImages/bottom-right-corner-down.png';
import imgBottomLeftLeft   from '../Popup/nubbinImages/bottom-left-corner-left.png';
import imgBottomRightRight from '../Popup/nubbinImages/bottom-right-corner-right.png';

const NUB_INFO = {
  'up'                 : { src: imgUp,               w: 71, h: 20 },
  'down'               : { src: imgDown,             w: 71, h: 20 },
  'left'               : { src: imgLeft,             w: 20, h: 71 },
  'right'              : { src: imgRight,            w: 20, h: 71 },
  'top-left-up'        : { src: imgTopLeftUp,        w: 71, h: 20 },
  'top-right-up'       : { src: imgTopRightUp,       w: 71, h: 20 },
  'top-left-left'      : { src: imgTopLeftLeft,      w: 20, h: 71 },
  'top-right-right'    : { src: imgTopRightRight,    w: 20, h: 71 },
  'bottom-left-down'   : { src: imgBottomLeftDown,   w: 71, h: 20 },
  'bottom-right-down'  : { src: imgBottomRightDown,  w: 71, h: 20 },
  'bottom-left-left'   : { src: imgBottomLeftLeft,   w: 20, h: 71 },
  'bottom-right-right' : { src: imgBottomRightRight, w: 20, h: 71 },
};

const NubbinDivider = ({
  nubbin       = 'up',
  nubbinOffset = '50%',
  orientation  = 'horizontal',
  thickness    = 4,
  className    = '',
  style        = {},
}) => {
  const info       = NUB_INFO[nubbin] ?? NUB_INFO['up'];
  const isHoriz    = orientation === 'horizontal';

  const rootStyle = {
    ...style,
    ...(isHoriz ? { height: info.h } : { width: info.w }),
  };

  return (
    <div
      className={`mochi-nubbin-divider mochi-nubbin-divider--${orientation} ${className}`}
      style={rootStyle}
    >
      {/* Left / Top cap — stretches to fill its side */}
      <div
        className="mochi-nubbin-divider__cap mochi-nubbin-divider__cap--left"
        style={{ backgroundImage: `url('${capLeftImage}')` }}
      />

      {/* Nubbin image — fixed size, centred on the line */}
      <img
        src={info.src}
        alt=""
        aria-hidden="true"
        width={info.w}
        height={info.h}
        className="mochi-nubbin-divider__nub"
        draggable={false}
      />

      {/* Right / Bottom cap — stretches to fill its side */}
      <div
        className="mochi-nubbin-divider__cap mochi-nubbin-divider__cap--right"
        style={{ backgroundImage: `url('${capRightImage}')` }}
      />
    </div>
  );
};

export default NubbinDivider;

/**
 * NubbinDivider
 *
 * A Divider line with one of the mochi contextual-popup nubbin images
 * rendered on top of it at a fully customisable position.
 *
 * ┌────────────────────────────────────────────────────────┐
 * │  Props                                                 │
 * ├─────────────────┬──────────────────────────────────────┤
 * │ nubbin          │ Which nubbin image to show.          │
 * │                 │ Straight: 'up' | 'down' |            │
 * │                 │           'left' | 'right'           │
 * │                 │ Corner:   'top-left-up'              │
 * │                 │           'top-right-up'             │
 * │                 │           'top-left-left'            │
 * │                 │           'top-right-right'          │
 * │                 │           'bottom-left-down'         │
 * │                 │           'bottom-right-down'        │
 * │                 │           'bottom-left-left'         │
 * │                 │           'bottom-right-right'       │
 * │                 │ Default: 'up'                        │
 * ├─────────────────┬──────────────────────────────────────┤
 * │ nubbinOffset    │ CSS value placing the nubbin center  │
 * │                 │ along the main axis of the line.     │
 * │                 │ e.g. '50%', '120px', 'calc(…)'      │
 * │                 │ Default: '50%'                       │
 * ├─────────────────┬──────────────────────────────────────┤
 * │ nubbinCross     │ How to position nubbin on cross-axis │
 * │                 │ (vertical nubbin on horizontal line):│
 * │                 │   'above' | 'center' | 'below'       │
 * │                 │ (horizontal nubbin on vertical line):│
 * │                 │   'before' | 'center' | 'after'      │
 * │                 │ Default: 'center'                    │
 * ├─────────────────┬──────────────────────────────────────┤
 * │ orientation     │ 'horizontal' (default) | 'vertical'  │
 * │ thickness       │ line thickness px (default 4)        │
 * │ width / height  │ passed through to Divider            │
 * │ className       │ extra class on wrapper               │
 * └─────────────────┴──────────────────────────────────────┘
 */
import React from 'react';
import Divider from './Divider';
import './NubbinDivider.scss';

// ── nubbin image catalogue ─────────────────────────────────────────────────
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

// Straight nubbins: width × height in px (matches popup CSS exactly)
// Horizontal nubbins (up/down): 71 × 20
// Vertical nubbins (left/right): 20 × 71
const NUB_INFO = {
  // name               : { src, w,  h,  axis }
  'up'                  : { src: imgUp,               w: 71, h: 20, axis: 'vertical'   },
  'down'                : { src: imgDown,             w: 71, h: 20, axis: 'vertical'   },
  'left'                : { src: imgLeft,             w: 20, h: 71, axis: 'horizontal' },
  'right'               : { src: imgRight,            w: 20, h: 71, axis: 'horizontal' },
  'top-left-up'         : { src: imgTopLeftUp,        w: 71, h: 20, axis: 'vertical',   corner: true },
  'top-right-up'        : { src: imgTopRightUp,       w: 71, h: 20, axis: 'vertical',   corner: true },
  'top-left-left'       : { src: imgTopLeftLeft,      w: 20, h: 71, axis: 'horizontal', corner: true },
  'top-right-right'     : { src: imgTopRightRight,    w: 20, h: 71, axis: 'horizontal', corner: true },
  'bottom-left-down'    : { src: imgBottomLeftDown,   w: 71, h: 20, axis: 'vertical',   corner: true },
  'bottom-right-down'   : { src: imgBottomRightDown,  w: 71, h: 20, axis: 'vertical',   corner: true },
  'bottom-left-left'    : { src: imgBottomLeftLeft,   w: 20, h: 71, axis: 'horizontal', corner: true },
  'bottom-right-right'  : { src: imgBottomRightRight, w: 20, h: 71, axis: 'horizontal', corner: true },
};

const NubbinDivider = ({
  // nubbin config
  nubbin        = 'up',
  nubbinOffset  = '50%',
  nubbinCross   = 'center',
  // pass-through to Divider
  orientation   = 'horizontal',
  thickness     = 4,
  width,
  height,
  className     = '',
  style         = {},
}) => {
  const info = NUB_INFO[nubbin] ?? NUB_INFO['up'];
  const isHorizLine = orientation === 'horizontal';

  // ── cross-axis positioning ─────────────────────────────────────────────
  // For a horizontal divider, the nubbin sits along the horizontal line.
  // Its cross-axis is vertical (up/down nubbins hang above/below the line).
  // For a vertical divider, the cross-axis is horizontal (left/right nubbin).
  let crossStyle = {};

  if (isHorizLine) {
    // nubbin.axis === 'vertical'  → image is 71×20, straddles the line top/bottom
    // nubbin.axis === 'horizontal' → image is 20×71, extends left/right of line
    if (nubbinCross === 'above') {
      crossStyle = { bottom: '50%' };
    } else if (nubbinCross === 'below') {
      crossStyle = { top: '50%' };
    } else {
      // center: translate so nubbin image midpoint aligns with line midpoint
      crossStyle = {
        top:  '50%',
        transform: `translateX(-50%) translateY(-${info.h / 2}px)`,
      };
    }
  } else {
    // vertical line — nubbin moves along Y, cross-axis is horizontal
    if (nubbinCross === 'before') {
      crossStyle = { right: '50%' };
    } else if (nubbinCross === 'after') {
      crossStyle = { left: '50%' };
    } else {
      crossStyle = {
        left: '50%',
        transform: `translateY(-50%) translateX(-${info.w / 2}px)`,
      };
    }
  }

  // ── main-axis positioning ─────────────────────────────────────────────
  const mainAxisStyle = isHorizLine
    ? { left: nubbinOffset, transform: undefined }  // left drives horizontal position
    : { top:  nubbinOffset };

  // merge; if crossStyle already has transform, use it; otherwise compose
  const nubStyle = {
    position: 'absolute',
    width:  info.w,
    height: info.h,
    ...(isHorizLine ? { left: nubbinOffset } : { top: nubbinOffset }),
    ...crossStyle,
    // if crossStyle set its own transform, keep it; otherwise reset
  };

  return (
    <div
      className={`mochi-nubbin-divider mochi-nubbin-divider--${orientation} ${className}`}
      style={style}
    >
      {/* The actual divider line */}
      <Divider
        orientation={orientation}
        thickness={thickness}
        width={width}
        height={height}
      />

      {/* The nubbin image, absolutely positioned over the line */}
      <img
        src={info.src}
        alt=""
        aria-hidden="true"
        width={info.w}
        height={info.h}
        className="mochi-nubbin-divider__nub"
        style={nubStyle}
      />
    </div>
  );
};

export default NubbinDivider;

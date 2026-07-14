/**
 * NubbinDivider
 *
 * Three-part divider:  [left cap] [nubbin image] [right cap]
 *
 * The left and right caps each grow to fill their half of the available
 * width. The nubbin image sits fixed-size between them, centred on the
 * divider line.
 *
 * The 8 corner variants are the exception: a corner nubbin (borrowed from
 * Popup) IS the end of the line rather than a bump in the middle of it —
 * it sits flush against a box corner on one side and only trails off into
 * a line on the other. Picking one of those automatically drops down to a
 * single cap (on whichever side it trails off toward) instead of two.
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
 *   thickness     Line thickness in px (default 2, matching the nubbin
 *                 image's own stroke weight)
 *   className     Extra class string
 *   style         Inline style overrides on the root element
 */
import React from 'react';
import './NubbinDivider.scss';

import imgUp               from './div-img/up.png';
import imgDown             from './div-img/down.png';
import imgLeft             from './div-img/left.png';
import imgRight            from './div-img/right.png';
import imgTopLeftUp        from './div-img/top-left-corner-up.png';
import imgTopRightUp       from './div-img/top-right-corner-up.png';
import imgTopLeftLeft      from './div-img/top-left-corner-left.png';
import imgTopRightRight    from './div-img/top-right-corner-right.png';
import imgBottomLeftDown   from './div-img/bottom-left-corner-down.png';
import imgBottomRightDown  from './div-img/bottom-right-corner-down.png';
import imgBottomLeftLeft   from './div-img/bottom-left-corner-left.png';
import imgBottomRightRight from './div-img/bottom-right-corner-right.png';

// `align` is the edge of the nubbin image where its baseline stroke sits —
// the flat caps need to sit flush against that same edge (verified against
// the actual PNGs: 'up'/'down' bump vertically from a 2px baseline at the
// bottom/top respectively; 'left'/'right' bump horizontally from a baseline
// at the right/left; the corner variants follow the same rule keyed off
// their own direction suffix).
//
// `cornerSide` is only set for the 8 corner variants (borrowed from Popup):
// unlike the straight nubbins, which sit in the middle of the line with
// stack behind them on both sides, a corner nubbin IS the end of the line
// — it's flush against a box corner on one side (solid, no fade needed)
// and only trails off into a cap on the other. 'start' means the corner
// sits at the line's own start (left for horizontal, top for vertical) so
// only the trailing/end cap is drawn; 'end' means the corner sits at the
// line's end, so only the leading/start cap is drawn.
// The 8 corner variants are a different, smaller asset than the straight
// ones (32×14 / 14×32, not 71×20 / 20×71) — they're solid corner wedges
// borrowed from Popup, not the same kind of drawing, so they don't share
// the straight nubbins' dimensions.
const NUB_INFO = {
  'up'                 : { src: imgUp,               w: 71, h: 20, align: 'bottom' },
  'down'               : { src: imgDown,             w: 71, h: 20, align: 'top' },
  'left'               : { src: imgLeft,             w: 20, h: 71, align: 'right' },
  'right'              : { src: imgRight,            w: 20, h: 71, align: 'left' },
  'top-left-up'        : { src: imgTopLeftUp,        w: 32, h: 14, align: 'bottom', cornerSide: 'start' },
  'top-right-up'       : { src: imgTopRightUp,       w: 32, h: 14, align: 'bottom', cornerSide: 'end' },
  'top-left-left'      : { src: imgTopLeftLeft,      w: 14, h: 32, align: 'right', cornerSide: 'start' },
  'top-right-right'    : { src: imgTopRightRight,    w: 14, h: 32, align: 'left',  cornerSide: 'start' },
  'bottom-left-down'   : { src: imgBottomLeftDown,   w: 32, h: 14, align: 'top',   cornerSide: 'start' },
  'bottom-right-down'  : { src: imgBottomRightDown,  w: 32, h: 14, align: 'top',   cornerSide: 'end' },
  'bottom-left-left'   : { src: imgBottomLeftLeft,   w: 14, h: 32, align: 'right', cornerSide: 'end' },
  'bottom-right-right' : { src: imgBottomRightRight, w: 14, h: 32, align: 'left',  cornerSide: 'end' },
};

// Maps a nubbin's baseline edge to the flexbox cross-axis alignment that
// flushes the caps against it (horizontal dividers cross on the vertical
// axis, vertical dividers cross on the horizontal axis).
const ALIGN_TO_FLEX = {
  bottom: 'flex-end',
  top: 'flex-start',
  right: 'flex-end',
  left: 'flex-start',
};

// Solid color matching the nubbin images' own stroke (sampled: #666666).
// The caps used to be the same div-left/right.png PNGs the plain Divider
// uses, stretched to fit — but those are a much lighter, softer gray, so
// even at the right thickness they read as washed out next to the
// nubbin's bold solid stroke. A flat-color, mask-faded bar matches the
// nubbin's color exactly (they're literally the same fill where they
// meet) and stays crisp at any thickness since there's no image to scale.
const CAP_COLOR = '#666666';

const NubbinDivider = ({
  nubbin       = 'up',
  nubbinOffset = '50%',
  orientation  = 'horizontal',
  thickness    = 2,
  className    = '',
  style        = {},
}) => {
  const info       = NUB_INFO[nubbin] ?? NUB_INFO['up'];
  const isHoriz    = orientation === 'horizontal';
  // A corner nubbin IS the end of the line, flush against a box corner on
  // one side — that side gets no cap at all (see NUB_INFO's `cornerSide`).
  const showStartCap = info.cornerSide !== 'start';
  const showEndCap   = info.cornerSide !== 'end';

  const rootStyle = {
    ...style,
    ...(isHoriz ? { height: info.h } : { width: info.w }),
  };

  // Flush the caps against whichever edge this nubbin's own baseline
  // stroke sits on, so the line exits the nubbin without a gap or a step
  // (see ALIGN_TO_FLEX / NUB_INFO's `align`), sized to the same thickness
  // as that stroke.
  const capStyle = {
    alignSelf: ALIGN_TO_FLEX[info.align],
    backgroundColor: CAP_COLOR,
    ...(isHoriz ? { height: thickness } : { width: thickness }),
  };

  // Each cap fades transparent → opaque via mask, from its own outer edge
  // (the far end of the divider) toward the nubbin. "Left"/"right" here
  // follow the existing cap naming, which doubles as "first"/"second" in
  // the vertical case (flex-direction: column stacks them top/bottom).
  const leftCapMask = isHoriz
    ? 'linear-gradient(to right, transparent 0%, black 100%)'
    : 'linear-gradient(to bottom, transparent 0%, black 100%)';
  const rightCapMask = isHoriz
    ? 'linear-gradient(to left, transparent 0%, black 100%)'
    : 'linear-gradient(to top, transparent 0%, black 100%)';

  return (
    <div
      className={`mochi-nubbin-divider mochi-nubbin-divider--${orientation} ${className}`}
      style={rootStyle}
    >
      {/* Left / Top cap — stretches to fill its side. Omitted for a
          corner nubbin anchored at this end (see showStartCap). */}
      {showStartCap && (
        <div
          className="mochi-nubbin-divider__cap mochi-nubbin-divider__cap--left"
          style={{ ...capStyle, WebkitMaskImage: leftCapMask, maskImage: leftCapMask }}
        />
      )}

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

      {/* Right / Bottom cap — stretches to fill its side. Omitted for a
          corner nubbin anchored at this end (see showEndCap). */}
      {showEndCap && (
        <div
          className="mochi-nubbin-divider__cap mochi-nubbin-divider__cap--right"
          style={{ ...capStyle, WebkitMaskImage: rightCapMask, maskImage: rightCapMask }}
        />
      )}
    </div>
  );
};

export default NubbinDivider;

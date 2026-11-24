/**
 * NubbinDivider
 *
 * Three-part divider:  [left cap] [nubbin] [right cap]
 *
 * The left and right caps each grow to fill their half of the available
 * width. The nubbin sits fixed-size between them, centred on the
 * divider line.
 *
 * The 8 corner variants are the exception: a corner nubbin (borrowed from
 * Popup) IS the end of the line rather than a bump in the middle of it —
 * it sits flush against a box corner on one side and only trails off into
 * a line on the other. Picking one of those automatically drops down to a
 * single cap (on whichever side it trails off toward) instead of two.
 *
 * Props:
 *   nubbin        Which nubbin to show.
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
 *   thickness     Line thickness in px (default 2, matching the nubbin's
 *                 own stroke weight)
 *   className     Extra class string
 *   style         Inline style overrides on the root element
 */
import React from 'react';
import './NubbinDivider.scss';

import { Nubbin, NUBBIN_STROKE_COLOR } from '../shared/nubbin';

// `align` is the edge of the nubbin where its baseline stroke sits — the
// flat caps need to sit flush against that same edge (as traced from the
// old PNGs: 'up'/'down' bump vertically from a 2px baseline at the
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
// The 8 corner variants are a different, smaller shape than the straight
// ones (32×14 / 14×32, not 71×20 / 20×71) — corner caps borrowed from
// Popup, not bumps, so they don't share the straight nubbins' dimensions.
// `shape`/`direction`/`side` pick the drawing (see shared/nubbin.jsx).
const NUB_INFO = {
  'up'                 : { shape: 'bump',   direction: 'up',    w: 71, h: 20, align: 'bottom' },
  'down'               : { shape: 'bump',   direction: 'down',  w: 71, h: 20, align: 'top' },
  'left'               : { shape: 'bump',   direction: 'left',  w: 20, h: 71, align: 'right' },
  'right'              : { shape: 'bump',   direction: 'right', w: 20, h: 71, align: 'left' },
  'top-left-up'        : { shape: 'corner', direction: 'up',    side: 'start', w: 32, h: 14, align: 'bottom', cornerSide: 'start' },
  'top-right-up'       : { shape: 'corner', direction: 'up',    side: 'end',   w: 32, h: 14, align: 'bottom', cornerSide: 'end' },
  'top-left-left'      : { shape: 'corner', direction: 'left',  side: 'start', w: 14, h: 32, align: 'right', cornerSide: 'start' },
  'top-right-right'    : { shape: 'corner', direction: 'right', side: 'start', w: 14, h: 32, align: 'left',  cornerSide: 'start' },
  'bottom-left-down'   : { shape: 'corner', direction: 'down',  side: 'start', w: 32, h: 14, align: 'top',   cornerSide: 'start' },
  'bottom-right-down'  : { shape: 'corner', direction: 'down',  side: 'end',   w: 32, h: 14, align: 'top',   cornerSide: 'end' },
  'bottom-left-left'   : { shape: 'corner', direction: 'left',  side: 'end',   w: 14, h: 32, align: 'right', cornerSide: 'end' },
  'bottom-right-right' : { shape: 'corner', direction: 'right', side: 'end',   w: 14, h: 32, align: 'left',  cornerSide: 'end' },
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

// The caps and the nubbin share one stroke colour (the popup border token,
// #646464 in both themes), so they're literally the same fill where they
// meet. Each cap is a flat-colour bar faded in with a mask, which stays
// crisp at any thickness.
const CAP_COLOR = NUBBIN_STROKE_COLOR;

const NubbinDivider = ({
  nubbin       = 'up',
  nubbinOffset = '50%',
  orientation  = 'horizontal',
  thickness    = 2,
  className    = '',
  style        = {},
  ...rest
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
      {...rest}
      className={['mochi-nubbin-divider', `mochi-nubbin-divider--${orientation}`, className]
        .filter(Boolean)
        .join(' ')}
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

      {/* Nubbin — fixed size, centred on the line */}
      <Nubbin
        shape={info.shape}
        direction={info.direction}
        side={info.side}
        length={Math.max(info.w, info.h)}
        depth={Math.min(info.w, info.h)}
        stroke={CAP_COLOR}
        shadow
        className="mochi-nubbin-divider__nub"
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

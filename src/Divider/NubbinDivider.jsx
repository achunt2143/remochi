/**
 * NubbinDivider
 *
 * Three-part divider:  [left cap] [nubbin] [right cap]
 *
 * The nubbin sits fixed-size on the divider line, centred on `nubbinOffset`
 * (the middle by default); the caps stretch from each end of the line to
 * meet it.
 *
 * The parts are laid out absolutely from whole-pixel positions rather than
 * as a flex row. With flexing caps the nubbin lands wherever the caps'
 * widths put it, often on a fraction of a pixel, and the browser snaps its
 * SVG stroke and the caps' background bars to device pixels independently,
 * so at some widths and pixel ratios the stroke steps sideways where the
 * line leaves the nubbin (the same seam PopupPanel's nubbin had; see
 * PopupPanel's rounding). Here the root's length is measured, the nubbin's
 * start is rounded to an integer, and each cap's inner edge is that same
 * integer, so the bar and the stroke meet on a pixel boundary at any width.
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
 *   nubbinOffset  Where along the line the nubbin's centre sits, measured
 *                 from the line's start (left, or top when vertical): any
 *                 CSS length, e.g. '50%' (default) | '120px' | 'calc(...)'.
 *                 It's rounded to a whole pixel and kept on the line.
 *                 Ignored by the corner variants, which sit at an end.
 *   orientation   'horizontal' (default) | 'vertical'
 *   thickness     Line thickness in px (default 2, matching the nubbin's
 *                 own stroke weight)
 *   className     Extra class string
 *   style         Inline style overrides on the root element
 */
import React, { useLayoutEffect, useRef, useState } from 'react';
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

  // `len` runs along the line, `depth` across it (the nubbin's own height
  // for a horizontal divider). Everything below is written in those terms
  // and mapped onto left/top/width/height by `box`.
  const len   = isHoriz ? info.w : info.h;
  const depth = isHoriz ? info.h : info.w;
  // The bar is a whole number of pixels thick too, so its far edge lands on
  // a pixel boundary as well as the near one (which is the root's edge).
  const bar   = Math.max(1, Math.round(thickness));

  // The line's measured length and where `nubbinOffset` falls along it, both
  // in CSS px. Measured in a layout effect (so it's applied before the first
  // paint) and again whenever the root resizes. `probe` is a zero-size
  // child placed at `nubbinOffset`, so the browser resolves any CSS length
  // (%, px, calc) for us instead of this parsing it.
  const rootRef = useRef(null);
  const probeRef = useRef(null);
  const [measured, setMeasured] = useState(null);
  useLayoutEffect(() => {
    const root = rootRef.current;
    const probe = probeRef.current;
    if (!root || !probe) return undefined;
    const measure = () => {
      const r = root.getBoundingClientRect();
      const p = probe.getBoundingClientRect();
      const length = isHoriz ? r.width : r.height;
      const at = isHoriz ? p.left - r.left : p.top - r.top;
      setMeasured((m) => (m && m.length === length && m.at === at ? m : { length, at }));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [isHoriz, nubbinOffset]);

  // Where the nubbin starts along the line, as a CSS value. A corner
  // nubbin is flush against its end (the right/bottom one uses the true end,
  // fractional or not: it's flush against the box's corner, and the cap's
  // inner edge is this same value, so they still share one edge). A bump
  // sits centred on the offset, rounded to a whole pixel and kept on the
  // line. Before the first measurement (server render) the same placement is
  // written as a calc() so the first paint is already close.
  let nubStart;
  if (info.cornerSide === 'start') nubStart = 0;
  else if (info.cornerSide === 'end') nubStart = measured ? measured.length - len : `calc(100% - ${len}px)`;
  else if (measured) nubStart = Math.min(Math.max(Math.round(measured.at - len / 2), 0), Math.max(0, Math.round(measured.length) - len));
  else nubStart = `calc(${nubbinOffset} - ${len / 2}px)`;
  const px = (v) => (typeof v === 'number' ? `${v}px` : v);
  const plus = (v, n) => (typeof v === 'number' ? `${v + n}px` : `calc(${v} + ${n}px)`);

  // The cap hugs the nubbin's baseline edge, which has to be on the cross
  // axis (top/bottom for a horizontal divider); a mismatched nubbin and
  // orientation falls back to the far edge rather than collapsing the cap.
  const edge = (isHoriz ? ['top', 'bottom'] : ['left', 'right']).includes(info.align)
    ? info.align
    : (isHoriz ? 'bottom' : 'right');

  // Positions a cap from `from` (its start along the line) for `size`
  // px, or out to the line's end when no size is given, hugging `edge` at
  // thickness `thick`. Maps line/depth onto left/top/width/height.
  const box = ({ from, size }, thick) => {
    const a = isHoriz
      ? { left: px(from), ...(size !== undefined ? { width: px(size) } : { right: 0 }) }
      : { top: px(from), ...(size !== undefined ? { height: px(size) } : { bottom: 0 }) };
    return { position: 'absolute', ...a, [edge]: 0, ...(isHoriz ? { height: thick } : { width: thick }) };
  };

  // The caps sit flush against the edge of this nubbin's own baseline
  // stroke (see NUB_INFO's `align`) so the line exits the nubbin without a
  // gap or a step, at the same thickness as that stroke.
  const capStyle = { backgroundColor: CAP_COLOR };

  const rootStyle = {
    ...style,
    ...(isHoriz ? { height: info.h } : { width: info.w }),
  };

  // Each cap fades transparent → opaque via mask, from its own outer edge
  // (the far end of the divider) toward the nubbin. "Left"/"right" here
  // follow the existing cap naming, which doubles as "first"/"second" in
  // the vertical case.
  const leftCapMask = isHoriz
    ? 'linear-gradient(to right, transparent 0%, black 100%)'
    : 'linear-gradient(to bottom, transparent 0%, black 100%)';
  const rightCapMask = isHoriz
    ? 'linear-gradient(to left, transparent 0%, black 100%)'
    : 'linear-gradient(to top, transparent 0%, black 100%)';

  return (
    <div
      {...rest}
      ref={rootRef}
      className={['mochi-nubbin-divider', `mochi-nubbin-divider--${orientation}`, className]
        .filter(Boolean)
        .join(' ')}
      style={rootStyle}
    >
      <span
        ref={probeRef}
        aria-hidden="true"
        className="mochi-nubbin-divider__probe"
        style={isHoriz ? { left: nubbinOffset } : { top: nubbinOffset }}
      />

      {/* Left / Top cap — runs from the line's start to the nubbin. Omitted
          for a corner nubbin anchored at this end (see showStartCap). */}
      {showStartCap && (
        <div
          className="mochi-nubbin-divider__cap mochi-nubbin-divider__cap--left"
          style={{
            ...capStyle,
            ...box({ from: 0, size: nubStart }, bar),
            WebkitMaskImage: leftCapMask,
            maskImage: leftCapMask,
          }}
        />
      )}

      {/* Nubbin — fixed size, whole-pixel start, full depth of the root */}
      <Nubbin
        shape={info.shape}
        direction={info.direction}
        side={info.side}
        length={Math.max(info.w, info.h)}
        depth={Math.min(info.w, info.h)}
        stroke={CAP_COLOR}
        shadow
        className="mochi-nubbin-divider__nub"
        style={isHoriz ? { left: px(nubStart), top: 0 } : { top: px(nubStart), left: 0 }}
      />

      {/* Right / Bottom cap — runs from the nubbin's far edge to the line's
          end. Omitted for a corner nubbin anchored at this end (see
          showEndCap). */}
      {showEndCap && (
        <div
          className="mochi-nubbin-divider__cap mochi-nubbin-divider__cap--right"
          style={{
            ...capStyle,
            ...box({ from: plus(nubStart, len) }, bar),
            WebkitMaskImage: rightCapMask,
            maskImage: rightCapMask,
          }}
        />
      )}
    </div>
  );
};

export default NubbinDivider;

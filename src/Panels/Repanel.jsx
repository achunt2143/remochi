import React, { useId, useLayoutEffect, useRef, useState } from 'react';
import './MochiPanel.scss';
import { Nubbin, bumpRise } from '../shared/nubbin';

// The grabber is a bump pointing left (see shared/nubbin.jsx), 43px tall
// with its peak 36px down, so the panel's bottom edge cuts it off just past
// the peak. It's drawn in the pane's own edge colour and filled with the
// variant's own background, so it reads as part of the panel's edge in
// either theme. Its stroke is as thick as that edge (the pane's left border,
// --mochi-pane-edge-width: 1px by default, measured from the panel), so the
// line runs straight out of the edge as one stroke; with the 0.5 look
// (2px, #666666) it joins just as cleanly.
const HANDLE_STROKE = 'var(--mochi-pane-edge, #cccccc)';
const EDGE_WIDTH = 1;
const HANDLE_FILL = {
  default: 'var(--mochi-panel-bg, #f5f5f5)',
  shadow: 'var(--mochi-panel-shadow-bg, #f5f5f5)',
};
const HANDLE_LENGTH = 43;

// The shadow variant's inset halo (MochiPanel.scss: `inset 0 4px 50px`
// tint) is painted by CSS on the panel's own box, so it stops at the
// straight edge and a plain grabber reads as a flat patch stuck on. Its
// grabber instead redraws the halo over the panel's bottom-left corner as
// the same inset shadow of the panel's outline *with* the bump: the
// outside, offset 4px down, blurred (sigma = blur / 2 = 25px, which is what
// Chrome draws, measured) and clipped to the outline. REACH x RISE px of
// the panel is covered, far enough past the bump (over 3 sigma) that the
// bump no longer changes the halo where the drawing ends. There the drawn
// halo matches Chrome's to within 2-3 levels (of 255), and another
// browser's blur may differ more, so rather than end on a hard edge it
// fades out over its last FADE px at the top and right, into the CSS halo
// underneath.
const HALO = { reach: 110, rise: 150, sigma: 25, dy: 4, fade: 30 };
const HALO_TINT = 'var(--mochi-panel-shadow-tint, rgba(0, 0, 0, 0.3))';

function ShadowHandle({ panelWidth, panelHeight, edgeWidth }) {
  const id = `mochi-halo-${useId().replace(/:/g, '')}`;
  const { reach, rise, sigma, dy, fade } = HALO;
  // Never past the panel's own edges.
  const width = 20 + Math.min(reach, panelWidth);
  const height = Math.min(rise, panelHeight);
  // The outline in this SVG's own px (the panel's padding edge at x = 20,
  // its bottom at y = height): the panel's inner edge, bulging out along
  // the bump's inner edge. Its right and top edges are the panel's own when
  // they're near enough to shade this corner, and otherwise carried well
  // past the SVG so they cast no halo inside it.
  const far = 4 * sigma;
  const right = panelWidth < reach + far ? 20 + panelWidth : width + far;
  const top = panelHeight < rise + far ? height - panelHeight : -far;
  const bump = height - HANDLE_LENGTH;
  const edge = [];
  for (let u = 0; u <= HANDLE_LENGTH; u++) edge.push(`${(20 - bumpRise(u)).toFixed(2)},${bump + u}`);
  const outline = `M20,${top}L${edge.join('L')}L${right},${height}L${right},${top}Z`;
  const fadeOut = [
    // Mask alpha only; the colour is never painted.
    `linear-gradient(to left, transparent, #000 ${fade}px)`, // check-tokens: allow
    `linear-gradient(to bottom, transparent, #000 ${fade}px)`, // check-tokens: allow
  ].join(', ');
  return (
    <svg
      className="mochi-panel-handle-nubbin mochi-panel-handle-nubbin--halo"
      width={width}
      height={height}
      style={{
        width,
        height,
        WebkitMaskImage: fadeOut,
        maskImage: fadeOut,
        WebkitMaskComposite: 'source-in',
        maskComposite: 'intersect',
      }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id={id}
          filterUnits="userSpaceOnUse"
          x={-far} y={top - far} width={right + 2 * far} height={height - top + 2 * far}
          colorInterpolationFilters="sRGB"
        >
          <feComponentTransfer in="SourceAlpha" result="outside">
            <feFuncA type="table" tableValues="1 0" />
          </feComponentTransfer>
          <feOffset in="outside" dy={dy} result="cast" />
          <feGaussianBlur in="cast" stdDeviation={sigma} result="soft" />
          <feFlood style={{ floodColor: HALO_TINT }} result="tint" />
          <feComposite in="tint" in2="soft" operator="in" result="halo" />
          <feComposite in="halo" in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
      <path d={outline} style={{ fill: HANDLE_FILL.shadow }} />
      <path d={outline} filter={`url(#${id})`} />
      <Nubbin x={0} y={bump} direction="left" length={HANDLE_LENGTH} strokeWidth={edgeWidth} stroke={HANDLE_STROKE} shadow />
    </svg>
  );
}

/**
 * Repanel
 *
 * A full-height panel with a rounded left edge and flush right edge — the
 * basic "stackable card" surface. Used standalone as a percentage-width
 * layout column inside a flex/grid row, or as the child surface rendered by
 * `RepanelStack`.
 *
 * Props:
 *   width    {number|string}  Width as a percentage number (e.g. 30) or any
 *                             valid CSS width string (e.g. '30%', '320px').
 *                             Default: 100 (100%)
 *   style    {'default'|'shadow'}  Visual variant. Default: 'default'
 *   handle   {boolean}        Marks the bottom-left edge as a grabber with a
 *                              wavy nubbin accent, laid directly over the
 *                              panel's own edge and coloured from the theme
 *                              tokens. On a 'shadow' panel the panel's inset
 *                              halo carries on into it. `RepanelStack` sets
 *                              this on every
 *                              child but the first (the base of the stack,
 *                              which has nothing behind it to reveal).
 *                              Default: false
 *   hint      {ReactNode}     The clue shown while this panel is the stack's
 *                              `upcoming` peek (RepanelStack's right sliver):
 *                              one short word or number in the label voice,
 *                              about 8 characters at most ("17", "3 NEW").
 *                              It must match what opens. Not shown otherwise.
 *   sequence  {{ index: number, label?: string }}
 *                              For panels in a sequence (steps, pages, items):
 *                              the peek shows `index` as Mochi Light numerals
 *                              (zero-padded to 2, "04") above a short label,
 *                              instead of `hint`. Not shown otherwise.
 *   peekLabel {string}        The panel's name for the peek's accessible name
 *                              ("Open <peekLabel>, <hint>"). Falls back to the
 *                              Header's `content`, else "Open next panel".
 *   peeking   {boolean}       Set by RepanelStack while this panel is the
 *                              right peek; shows the clue. Default: false
 *   className {string}        Extra CSS classes
 *   children  {ReactNode}
 */
const Repanel = ({
  width     = 100,
  style: variant = 'default',
  handle    = false,
  hint,
  sequence,
  peekLabel, // read by RepanelStack for the peek's name; never drawn or passed on
  peeking   = false,
  className = '',
  children,
  ...rest
}) => {
  // Accept plain number (treated as %) or any CSS string
  const resolvedWidth = typeof width === 'number' ? `${width}%` : width;
  const resolvedVariant = typeof variant === 'string' ? variant : 'default';
  const inlineStyle = variant && typeof variant === 'object' ? variant : undefined;

  // The shadow grabber redraws the halo from the panel's own size (its
  // padding box, which is what the CSS inset shadow is drawn in).
  const haloed = handle && resolvedVariant === 'shadow';
  const panelRef = useRef(null);
  const [panelSize, setPanelSize] = useState(null);
  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!haloed || !el) { setPanelSize(null); return undefined; }
    const measure = () => setPanelSize((prev) => (
      prev && prev.w === el.clientWidth && prev.h === el.clientHeight ? prev : { w: el.clientWidth, h: el.clientHeight }
    ));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [haloed]);

  // The grabber's line is as thick as the panel's left edge. Read from the
  // computed border, in the layout pass, so it is never painted at another
  // width (and follows --mochi-pane-edge-width however a host sets it).
  const [edgeWidth, setEdgeWidth] = useState(EDGE_WIDTH);
  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!handle || !el) return;
    const w = parseFloat(getComputedStyle(el).borderLeftWidth);
    setEdgeWidth((prev) => (w > 0 && prev !== w ? w : prev));
  }, [handle]);

  return (
    <div
      {...rest}
      ref={(el) => {
        panelRef.current = el;
        // React 19 passes a caller's ref through as a prop (in `rest`);
        // keep handing it the element as before.
        const outer = rest.ref;
        if (typeof outer === 'function') outer(el);
        else if (outer) outer.current = el;
      }}
      className={[
        'mochi-panel',
        `mochi-panel--${resolvedVariant}`,
        handle && 'mochi-panel--handle',
        className,
      ].filter(Boolean).join(' ')}
      style={inlineStyle ? { width: resolvedWidth, ...inlineStyle } : { width: resolvedWidth }}
    >
      {/* Under the body, like the CSS halo it continues: the body has no
          background and clips to the panel, so it never covers the bump. */}
      {haloed && panelSize && <ShadowHandle panelWidth={panelSize.w} panelHeight={panelSize.h} edgeWidth={edgeWidth} />}
      <div className="mochi-panel-body">{children}</div>
      {peeking && (sequence || hint != null) && (
        <div className="mochi-panel-clue" aria-hidden="true">
          {sequence ? (
            <>
              <span className="mochi-panel-clue-number">{String(sequence.index).padStart(2, '0')}</span>
              {sequence.label != null && <span className="mochi-panel-clue-text">{sequence.label}</span>}
            </>
          ) : (
            <span className="mochi-panel-clue-text">{hint}</span>
          )}
        </div>
      )}
      {handle && !haloed && (
        <Nubbin
          className="mochi-panel-handle-nubbin"
          direction="left"
          length={HANDLE_LENGTH}
          strokeWidth={edgeWidth}
          stroke={HANDLE_STROKE}
          fill={HANDLE_FILL[resolvedVariant] ?? HANDLE_FILL.default}
          shadow
        />
      )}
    </div>
  );
};

export { Repanel };

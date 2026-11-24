// The drawn nubbins in context: PopupPanel opened in all four directions
// (plus a corner placement), PopupPanel in all 8 corner placements over its
// waterdrop corners, NubbinDivider with a bump and corner caps, Divider, and
// Repanels inside a RepanelStack, the Repanel grabber at 1px and 2px edge
// widths, and NubbinDivider / Divider at fractional lengths.
//
//   /scripts/nubbin-diff/out/context.html?view=popups|corners|grabber|dividers|static|halo&theme=light|dark
//
// With &joints (popups, corners, grabber and dividers views), it checks that each
// nubbin's line runs on from the border without a step, from its own 1x
// snapshot; run.mjs does the same from real 1x and 2x screenshots (see
// measureScreenshot), with &probe, which swaps the border colour for one that
// contrasts with both sides in either theme (the dark theme's own #333 on
// #404040 is too faint to measure; the geometry doesn't care).
//
// With &capture, the page snapshots itself (an SVG foreignObject drawn into
// a canvas, at 1x and 2x) and POSTs the PNGs to serve.mjs, which writes
// them to ./report/context. The snapshot can't load web fonts, so text
// falls back to the system sans-serif; the shapes are what it's for.
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import MochiThemeWrapper from '../../src/ThemeWrapper/MochiThemeWrapper';
import { MochiPopupPanel as PopupPanel } from '../../src/Popup/MochiPopupPanel';
import Divider from '../../src/Divider/Divider';
import NubbinDivider from '../../src/Divider/NubbinDivider';
import { Repanel } from '../../src/Panels/Repanel';
import { RepanelStack } from '../../src/Panels/StackedMochiPanels';

const params = new URLSearchParams(location.search);
const view = params.get('view') || 'popups';
const theme = params.get('theme') || 'light';
const W = 1200, H = 860;

// Fractional positions and sizes on purpose: real popups are sized by
// their text, and the joint check has to cover borders snapped to pixels.
const rect = (left, top, width = 40.3, height = 24.35) => ({
  left, top, width, height, right: left + width, bottom: top + height, x: left, y: top,
});

// Anchors chosen so PopupPanel's own placement logic picks each direction:
// wide popups go above/below (by which half of the viewport the anchor is
// in), tall narrow ones go left/right, and an anchor in the top 100px near
// an edge gets a corner cap. (A popup wider than 200px always goes
// above/below, so the tall ones keep short titles.)
const POPUPS = [
  { label: 'below (nub up)',     anchor: rect(440.4, 130.3), wide: true },
  { label: 'above (nub down)',   anchor: rect(440.4, 680.6), wide: true },
  { label: 'nub left',           anchor: rect(560.3, 420.45), tall: true },
  { label: 'nub right',          anchor: rect(1110.35, 300.3), tall: true },
  { label: 'corner (top-left)',  anchor: rect(16.4, 24.3), wide: true },
  { label: 'corner (bottom-right)', anchor: rect(1140.3, 816.25), wide: true },
];

function Anchor({ anchor }) {
  return (
    <div
      style={{
        position: 'fixed', left: anchor.left, top: anchor.top, width: anchor.width, height: anchor.height,
        background: 'var(--mochi-primary, #4a8bc2)', borderRadius: 4,
      }}
    />
  );
}

// &only=<index> shows just that popup, moved &shift=<px> left, for looking
// at one joint in a narrow window at true size.
function Popups() {
  const only = params.get('only');
  const shift = Number(params.get('shift')) || 0;
  const list = only === null ? POPUPS : [POPUPS[Number(only)]].map((p) => ({
    ...p, anchor: rect(p.anchor.left - shift, p.anchor.top, p.anchor.width, p.anchor.height),
  }));
  return list.map((p) => (
    <React.Fragment key={p.label}>
      <Anchor anchor={p.anchor} />
      <PopupPanel isOpen anchorRect={p.anchor} title={p.label} onClose={() => {}}>
        <div style={{ width: p.wide ? 220.4 : 90.3, height: p.tall ? 240.35 : 40.4 }}>Content</div>
      </PopupPanel>
    </React.Fragment>
  ));
}

// All 8 corner placements, each over the waterdrop's own corners (its 4px
// one top right, 16px elsewhere): a wide popup gets a vertical placement
// when its anchor is near the left or right edge of the top or bottom 100px,
// a tall one a horizontal placement when the anchor is there but mid-width
// (PopupPanel's logic: the popup is pushed up or down against the viewport
// edge, and the cap sits on that corner).
const CORNERS = [
  { label: 'top-left, below',  anchor: rect(16.4, 24.3), wide: true },
  { label: 'top-right, below',  anchor: rect(1140.3, 24.3), wide: true },
  { label: 'bottom-left, above', anchor: rect(16.4, 816.25), wide: true },
  { label: 'bottom-right, above', anchor: rect(1140.3, 816.25), wide: true },
  { label: 'top-left, nub left',    anchor: rect(330.4, 10.3), tall: true },
  { label: 'top-right, nub right',  anchor: rect(920.4, 10.3), tall: true },
  { label: 'bottom-left, nub left',  anchor: rect(330.4, 826.25), tall: true },
  { label: 'bottom-right, nub right', anchor: rect(920.4, 826.25), tall: true },
];

function Corners() {
  return CORNERS.map((p) => (
    <React.Fragment key={p.label}>
      <Anchor anchor={p.anchor} />
      <PopupPanel isOpen anchorRect={p.anchor} title={p.label} onClose={() => {}}>
        <div style={{ width: p.wide ? 180.4 : 90.3, height: p.tall ? 240.35 : 40.4 }}>Content</div>
      </PopupPanel>
    </React.Fragment>
  ));
}

// Repanel's grabber at the default 1px edge (--mochi-pane-edge-width) and at
// the 0.5 look (2px, #666666): the grabber's line has to run on out of the
// pane's left edge in both. The edge colour is a dark probe so the stroke
// contrasts with both sides; the geometry doesn't depend on it.
const PROBE = theme === 'dark' ? '#dddddd' : '#444444';
const GRABBERS = [
  { id: 'edge-1px', vars: { '--mochi-pane-edge-width': '1px', '--mochi-pane-edge': PROBE }, left: 60 },
  { id: 'edge-2px', vars: { '--mochi-pane-edge-width': '2px', '--mochi-pane-edge': PROBE }, left: 460 },
  { id: 'edge-1px-shadow', vars: { '--mochi-pane-edge-width': '1px', '--mochi-pane-edge': PROBE }, left: 860, shadow: true },
];

function Grabbers() {
  return (
    <div style={{ position: 'relative', height: H }}>
      {GRABBERS.map((g) => (
        <div
          key={g.id}
          data-grabber={g.id}
          style={{ position: 'absolute', top: 40, left: g.left, width: 300, height: 360, ...g.vars }}
        >
          <Repanel handle style={g.shadow ? 'shadow' : 'default'}><div style={{ padding: 20 }}>{g.id}</div></Repanel>
        </div>
      ))}
    </div>
  );
}

// NubbinDivider in all four directions and a corner variant of each kind,
// and the plain Divider, at fractional lengths (a flex row of stretching caps
// used to put the nubbin on a fraction of a pixel there, and the caps' bars
// and its stroke snapped differently). `geo` is the nubbin's drawing (see
// NUB_INFO in NubbinDivider.jsx) for the joint check; `offset` is a
// nubbinOffset other than the middle. Containers sit at whole-pixel left/top
// so only the divider's own layout is under test.
const DIVIDER_LENGTHS = [301.5, 333.3];
const bump = (direction) => ({ shape: 'bump', direction, side: 'start' });
const ND_HORIZONTAL = [
  { nubbin: 'up', geo: bump('up') },
  { nubbin: 'down', geo: bump('down') },
  { nubbin: 'top-left-up', geo: { shape: 'corner', direction: 'up', side: 'start' } },
  { nubbin: 'top-right-up', geo: { shape: 'corner', direction: 'up', side: 'end' } },
  { nubbin: 'up', geo: bump('up'), offset: '37.3%' },
  { nubbin: 'down', geo: bump('down'), offset: '120.4px' },
];
const ND_VERTICAL = [
  { nubbin: 'left', geo: bump('left') },
  { nubbin: 'right', geo: bump('right') },
  { nubbin: 'top-left-left', geo: { shape: 'corner', direction: 'left', side: 'start' } },
  { nubbin: 'bottom-right-right', geo: { shape: 'corner', direction: 'right', side: 'end' } },
];

// The stroke is the popup border token; swap it for the probe colour (see
// PROBE) so it contrasts with the background in both themes.
function Dividers() {
  return (
    <div style={{ position: 'relative', height: H, '--mochi-popup-border': PROBE }}>
      {DIVIDER_LENGTHS.flatMap((len, col) => [
        ...ND_HORIZONTAL.map((c, row) => (
          <div
            key={`h${col}-${row}`}
            data-nd={JSON.stringify({ ...c.geo, name: `${c.nubbin}${c.offset ? ` @${c.offset}` : ''} ${len}px` })}
            style={{ position: 'absolute', left: 40 + col * 380, top: 40 + row * 60, width: len }}
          >
            <NubbinDivider nubbin={c.nubbin} {...(c.offset ? { nubbinOffset: c.offset } : {})} />
          </div>
        )),
        <div key={`dh${col}`} data-divider={JSON.stringify({ orientation: 'horizontal', thickness: 4 })}
          style={{ position: 'absolute', left: 40 + col * 380, top: 440, width: len }}>
          <Divider />
        </div>,
        ...ND_VERTICAL.map((c, row) => (
          <div
            key={`v${col}-${row}`}
            data-nd={JSON.stringify({ ...c.geo, name: `${c.nubbin} (vertical) ${len}px` })}
            style={{ position: 'absolute', left: 820 + row * 80, top: col ? 400 : 40, height: len }}
          >
            <NubbinDivider nubbin={c.nubbin} orientation="vertical" />
          </div>
        )),
        <div key={`dv${col}`} data-divider={JSON.stringify({ orientation: 'vertical', thickness: 4 })}
          style={{ position: 'absolute', left: 1160, top: col ? 400 : 40, height: len }}>
          <Divider orientation="vertical" />
        </div>,
      ])}
    </div>
  );
}

const Label = ({ children }) => <div style={{ font: '12px sans-serif', margin: '18px 0 8px', opacity: 0.7 }}>{children}</div>;

function Static() {
  return (
    <div style={{ display: 'flex', gap: 40, padding: 24, height: H, boxSizing: 'border-box' }}>
      <div style={{ width: 460 }}>
        <Label>NubbinDivider — up / down</Label>
        <NubbinDivider nubbin="up" />
        <div style={{ height: 16 }} />
        <NubbinDivider nubbin="down" nubbinOffset="30%" />
        <Label>NubbinDivider — corner caps (top-left-up, top-right-up, bottom-left-down)</Label>
        <NubbinDivider nubbin="top-left-up" />
        <div style={{ height: 12 }} />
        <NubbinDivider nubbin="top-right-up" />
        <div style={{ height: 12 }} />
        <NubbinDivider nubbin="bottom-left-down" />
        <Label>NubbinDivider — vertical (left, right, top-left-left)</Label>
        <div style={{ display: 'flex', gap: 40, height: 140 }}>
          <NubbinDivider nubbin="left" orientation="vertical" />
          <NubbinDivider nubbin="right" orientation="vertical" />
          <NubbinDivider nubbin="top-left-left" orientation="vertical" />
        </div>
        <Label>Divider — horizontal (thickness 4, 8)</Label>
        <Divider />
        <div style={{ height: 12 }} />
        <Divider thickness={8} />
        <Label>Divider — vertical</Label>
        <div style={{ height: 100 }}><Divider orientation="vertical" /></div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Label>RepanelStack — default panels</Label>
        <div style={{ height: 340 }}>
          <RepanelStack defaultActiveIndex={2} defaultReveal={2}>
            <Repanel><div style={{ padding: 20 }}>Library</div></Repanel>
            <Repanel><div style={{ padding: 20 }}>Albums</div></Repanel>
            <Repanel><div style={{ padding: 20 }}>Tracks</div></Repanel>
          </RepanelStack>
        </div>
        <Label>RepanelStack — shadow panels</Label>
        <div style={{ height: 300 }}>
          <RepanelStack defaultActiveIndex={2} defaultReveal={2}>
            <Repanel style="shadow"><div style={{ padding: 20 }}>Library</div></Repanel>
            <Repanel style="shadow"><div style={{ padding: 20 }}>Albums</div></Repanel>
            <Repanel style="shadow"><div style={{ padding: 20 }}>Tracks</div></Repanel>
          </RepanelStack>
        </div>
      </div>
    </div>
  );
}

// Repanel grabbers up close: standalone default and shadow panels with a
// handle, and both kinds inside a RepanelStack.
function Halo() {
  const box = { position: 'absolute', top: 40, width: 300, height: 360 };
  return (
    <div style={{ position: 'relative', height: H }}>
      <div style={{ ...box, left: 40 }} data-halo="standalone-default">
        <Repanel handle><div style={{ padding: 20 }}>Default</div></Repanel>
      </div>
      <div style={{ ...box, left: 380 }} data-halo="standalone-shadow">
        <Repanel handle style="shadow"><div style={{ padding: 20 }}>Shadow</div></Repanel>
      </div>
      <div style={{ position: 'absolute', left: 720, top: 40, width: 440, height: 360 }} data-halo="stack-shadow">
        <RepanelStack defaultActiveIndex={1} defaultReveal={2}>
          <Repanel style="shadow"><div style={{ padding: 20 }}>Back</div></Repanel>
          <Repanel style="shadow"><div style={{ padding: 20 }}>Front</div></Repanel>
        </RepanelStack>
      </div>
      <div style={{ position: 'absolute', left: 720, top: 440, width: 440, height: 360 }} data-halo="stack-default">
        <RepanelStack defaultActiveIndex={1} defaultReveal={2}>
          <Repanel><div style={{ padding: 20 }}>Back</div></Repanel>
          <Repanel><div style={{ padding: 20 }}>Front</div></Repanel>
        </RepanelStack>
      </div>
    </div>
  );
}

// Inlines every stylesheet (styled-components writes through the CSSOM, so
// read the rules, not the <style> text) and draws the page into a canvas.
async function snapshot(scale) {
  const css = [...document.styleSheets]
    .map((sheet) => { try { return [...sheet.cssRules].map((r) => r.cssText).join('\n'); } catch { return ''; } })
    .join('\n')
    // The snapshot is a fresh document, so PopupPanel's fade-in would
    // restart at opacity 0.
    .concat('\n*{animation:none!important}')
    // :root inside the snapshot is the <svg>, which carries the same theme
    // attribute as <html>.
    .replace(/</g, '\\3c ');
  const body = new XMLSerializer().serializeToString(document.body);
  const attr = `data-mochi-theme="${document.documentElement.getAttribute('data-mochi-theme') || theme}"`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" ${attr} width="${W * scale}" height="${H * scale}" viewBox="0 0 ${W} ${H}">` +
    `<foreignObject width="${W}" height="${H}"><html xmlns="http://www.w3.org/1999/xhtml" ${attr} style="${document.documentElement.getAttribute('style') || ''}">` +
    `<head><style>${css}</style></head>${body}</html></foreignObject></svg>`;
  const img = new Image();
  await new Promise((ok, fail) => { img.onload = ok; img.onerror = fail; img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`; });
  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  canvas.getContext('2d').drawImage(img, 0, 0);
  return canvas;
}

async function capture(scale) {
  const canvas = await snapshot(scale);
  await fetch(`/save?path=context/${view}-${theme}-${scale}x.png`, { method: 'POST', body: canvas.toDataURL('image/png') });
}

// ── Joint check ────────────────────────────────────────────────────────
// The per-sprite diff compares a nubbin on its own, so it can't see whether
// the nubbin's line lines up with the border it continues. For each popup
// nubbin this samples the stroke a few px either side of each place its
// line meets the panel's straight border (both ends of a bump; the line end
// and the side of a corner cap) and measures where the stroke's edges are
// across the line. An edge stepping more than JOINT_TOLERANCE px fails. The
// seam this was written for was 0.25–0.4px; selfTestJoints shows a 0.3px
// offset measures 0.21px at 1x and 0.33px at 2x, and clean joints stay
// under 0.1px.
const JOINT_TOLERANCE = 0.2;

// Same frame as shared/nubbin.jsx: u along the line, v across it, the
// line's stroke centred at v = depth - 1.
function frameToBox(u, v, { direction, side, length, depth }) {
  if (side === 'end') u = length - u;
  switch (direction) {
    case 'down':  return [u, depth - v];
    case 'left':  return [v, u];
    case 'right': return [depth - v, u];
    default:      return [u, v];
  }
}

// `radiusProp` is the computed-style property of the panel corner a cap sits
// on (see MochiPopupPanel's cornerRadiusProp).
function placement(classes) {
  const has = (c) => classes.split(/\s+/).includes(c);
  if (has('vertical')) {
    const direction = has('below') ? 'up' : 'down';
    return has('corner')
      ? {
        shape: 'corner', direction, side: has('left') ? 'end' : 'start',
        radiusProp: `border${has('below') ? 'Top' : 'Bottom'}${has('left') ? 'Right' : 'Left'}Radius`,
      }
      : { shape: 'bump', direction, side: 'start' };
  }
  const direction = has('left') ? 'left' : 'right';
  return has('corner')
    ? {
      shape: 'corner', direction, side: has('high') ? 'start' : 'end',
      radiusProp: `border${has('high') ? 'Top' : 'Bottom'}${has('left') ? 'Left' : 'Right'}Radius`,
    }
    : { shape: 'bump', direction, side: 'start' };
}

// Edges (in CSS px, along the frame's `across` axis) of the stroke at one
// sample, each found where the profile across the line crosses halfway
// between the stroke and the background 3px out on that side, interpolated
// between pixels so sub-pixel shifts show. Taking the background per side
// matters under a bottom border, where the panel's drop shadow leaves it at
// ~180 rather than the panel's 245. The stroke is whichever sample is
// furthest from the two sides' mean, so it may be darker (#666 in light) or
// lighter (the dark probe) than both.
function strokeCentre(px, scale, geo, rect, along, acrossAxis, expected) {
  const ts = [], lums = [];
  for (let k = -3 * scale; k < 3 * scale; k++) {
    const t = expected + (k + 0.5) / scale;
    const [x, y] = acrossAxis === 'v' ? frameToBox(along, t, geo) : frameToBox(t, along, geo);
    const ix = Math.floor((rect.left + x) * scale), iy = Math.floor((rect.top + y) * scale);
    const i = (iy * px.width + ix) * 4;
    ts.push(t);
    lums.push((px.data[i] + px.data[i + 1] + px.data[i + 2]) / 3);
  }
  const ref = (lums[0] + lums[lums.length - 1]) / 2;
  const strokeLum = lums.reduce((best, l) => (Math.abs(l - ref) > Math.abs(best - ref) ? l : best), ref);
  const sign = strokeLum < ref ? -1 : 1;
  const halfLo = (lums[0] + strokeLum) / 2;
  const halfHi = (lums[lums.length - 1] + strokeLum) / 2;
  const inStroke = (l, half) => sign * (l - half) > 0;
  const first = lums.findIndex((l) => inStroke(l, halfLo));
  const last = lums.length - 1 - [...lums].reverse().findIndex((l) => inStroke(l, halfHi));
  if (first <= 0 || last >= lums.length - 1) return { lo: NaN, hi: NaN };
  const cross = (a, b, half) => ts[a] + ((ts[b] - ts[a]) * (lums[a] - half)) / (lums[a] - lums[b]);
  return { lo: cross(first - 1, first, halfLo), hi: cross(last + 1, last, halfHi) };
}

function stopAnimations() {
  // Stays on for the rest of the page's life: removing it again would
  // restart PopupPanel's scale-in, and the nubbin rects would be off.
  if (document.getElementById('no-animation')) return;
  const style = document.createElement('style');
  style.id = 'no-animation';
  style.textContent = '*{animation:none!important}';
  document.head.appendChild(style);
}

// Measures every popup joint in `px`, a picture of the page at `scale`
// device pixels per CSS pixel whose top-left is at CSS (originX, originY).
function measureJoints(px, scale, originX = 0, originY = 0, panels = document.querySelectorAll('.mochi-contextual-popup')) {
  const results = [];
  for (const panel of panels) {
    const nub = panel.querySelector('.mochi-popup-nubbin');
    const classes = panel.className.replace(/^.*mochi-contextual-popup\s*/, '');
    const p = placement(classes);
    const vertical = p.direction === 'left' || p.direction === 'right';
    const r = nub.getBoundingClientRect();
    const rect = { left: r.left - originX, top: r.top - originY };
    if (rect.left < 4 || rect.top < 4 || (rect.left + r.width + 4) * scale > px.width || (rect.top + r.height + 4) * scale > px.height) continue;
    const geo = { ...p, length: vertical ? r.height : r.width, depth: vertical ? r.width : r.height };
    const line = geo.depth - 1;
    // A cap over a round corner (the waterdrop's) reaches `radius - 2` px
    // below its box to meet the straight border (see cornerPaths in
    // shared/nubbin.jsx), and draws 1px past its box where it overflows, so
    // the border is sampled beyond both.
    const radius = p.shape === 'corner' ? parseFloat(getComputedStyle(panel)[p.radiusProp]) || 0 : 0;
    const below = Math.max(0, radius - 2);
    const over = radius > 2 ? 1 : 0;
    // Samples sit at pixel centres (half-integers along the line), so a
    // mirrored box is sampled at the same distances from its ends, and start
    // right at the joint, where a misplaced nubbin shows most.
    const near = [0.5, 1.5, 2.5];
    const before = (at) => near.map((d) => at - d);
    const after = (at) => near.map((d) => at + d);
    // [label, across axis, expected centre, border samples, nubbin samples]
    const joints = p.shape === 'bump'
      ? [['start', 'v', line, before(0), after(0)], ['end', 'v', line, after(geo.length), before(geo.length)]]
      : [
        ['line end', 'v', line, after(geo.length + over), before(geo.length)],
        ['side', 'u', 1, after(geo.depth + below + over), before(geo.depth + below)],
      ];
    for (const [label, axis, expected, outside, inside] of joints) {
      const edges = (samples) => samples.map((s) => strokeCentre(px, scale, geo, rect, s, axis, expected));
      const mean = (xs) => xs.reduce((a, x) => a + x, 0) / xs.length;
      const out = edges(outside), ins = edges(inside);
      const lo = mean(out.map((e) => e.lo)), hi = mean(out.map((e) => e.hi));
      // Where the panel's border runs on behind the nubbin, a nubbin off by d
      // widens the line rather than moving it, so its centre only moves d/2:
      // what shows as a seam is an edge stepping by d. Fail on the worst
      // nubbin sample's edge step; report the centres too.
      const step = Math.max(...ins.map((e) => Math.max(Math.abs(e.lo - lo), Math.abs(e.hi - hi))));
      const border = (lo + hi) / 2, nubbin = mean(ins.map((e) => (e.lo + e.hi) / 2));
      results.push({
        placement: `${classes}${p.shape === 'corner' ? ` (r ${radius}px)` : ''}`, joint: label, scale,
        border: +border.toFixed(3), nubbin: +nubbin.toFixed(3), centreShift: +Math.abs(nubbin - border).toFixed(3),
        step: +step.toFixed(3), ok: step <= JOINT_TOLERANCE,
      });
    }
  }
  return results;
}

// The Repanel grabber's joint: where its straight tail (the top of its box)
// meets the pane's left border above it, at each edge width. The stroke is
// as thick as the border (Repanel reads --mochi-pane-edge-width), so the two
// edges should line up whatever the width.
function measureGrabberJoints(px, scale, originX = 0, originY = 0) {
  const results = [];
  for (const holder of document.querySelectorAll('[data-grabber]')) {
    const panel = holder.querySelector('.mochi-panel');
    const outer = holder.querySelector('.mochi-panel-handle-nubbin');
    const nub = outer.querySelector('svg') || outer;
    const r = nub.getBoundingClientRect();
    const rect = { left: r.left - originX, top: r.top - originY };
    const width = parseFloat(getComputedStyle(panel).borderLeftWidth);
    const geo = { shape: 'bump', direction: 'left', side: 'start', length: r.height, depth: r.width };
    const near = [0.5, 1.5, 2.5];
    const edges = (samples) => samples.map((s) => strokeCentre(px, scale, geo, rect, s, 'v', geo.depth - width / 2));
    const mean = (xs) => xs.reduce((a, x) => a + x, 0) / xs.length;
    const out = edges(near.map((d) => -d)), ins = edges(near);
    const lo = mean(out.map((e) => e.lo)), hi = mean(out.map((e) => e.hi));
    const step = Math.max(...ins.map((e) => Math.max(Math.abs(e.lo - lo), Math.abs(e.hi - hi))));
    const border = (lo + hi) / 2, nubbin = mean(ins.map((e) => (e.lo + e.hi) / 2));
    results.push({
      placement: `grabber ${holder.dataset.grabber} (${width}px edge)`, joint: 'start', scale,
      border: +border.toFixed(3), nubbin: +nubbin.toFixed(3), centreShift: +Math.abs(nubbin - border).toFixed(3),
      step: +step.toFixed(3), ok: step <= JOINT_TOLERANCE,
    });
  }
  return results;
}

// NubbinDivider's joints: where its caps' bars meet the nubbin's baseline
// stroke (both ends of a bump; the line end of a corner cap, whose other
// side is a box corner). Two things can go wrong there. The bar and the
// stroke can sit on different rows (an edge step across the line), measured
// as the popups' joints are, on the SVG's own box. And, because the bar and
// the nubbin are separate boxes along the line, a fractional length can leave
// them snapped to different pixel columns, so a hairline gap (or a doubled
// pixel) shows in the stroke itself as it crosses the joint: the stroke's
// brightness along its own centre, within 2.5px of the joint, may not stray
// from its median by more than JOINT_TOLERANCE of the stroke's contrast.
// (Along the line the mask fades the cap by well under 1% a pixel, nothing
// next to that.) The step reported is the worse of the two.
// One NubbinDivider joint in `px`: `outside` and `inside` are sample
// distances along the line (outside the nubbin, in the cap; inside it) and
// `joint` is where the two meet. `rect` is the nubbin's top-left in px.
function dividerJoint(px, scale, rect, geo, joint, outside, inside, towards) {
  const mean = (xs) => xs.reduce((a, x) => a + x, 0) / xs.length;
  const line = geo.depth - 1;
  const lumAt = (u, v) => {
    const [x, y] = frameToBox(u, v, geo);
    const i = (Math.floor((rect.top + y) * scale) * px.width + Math.floor((rect.left + x) * scale)) * 4;
    return (px.data[i] + px.data[i + 1] + px.data[i + 2]) / 3;
  };
  const edges = (samples) => samples.map((s) => strokeCentre(px, scale, geo, rect, s, 'v', line));
  const out = edges(outside), ins = edges(inside);
  const lo = mean(out.map((e) => e.lo)), hi = mean(out.map((e) => e.hi));
  const step = Math.max(...ins.map((e) => Math.max(Math.abs(e.lo - lo), Math.abs(e.hi - hi))));
  const border = (lo + hi) / 2, nubbin = mean(ins.map((e) => (e.lo + e.hi) / 2));
  // The stroke's brightness along its centre across the joint, one sample
  // per device pixel, taken on whichever side of the line's centre (it falls
  // between two device rows at 1x) varies least.
  const bg = lumAt(joint + 3 * towards + 0.5 / scale, geo.depth - 3.5);
  const gap = Math.min(...[-0.5, 0.5].map((dv) => {
    const xs = [];
    for (let k = -2.5 * scale; k < 2.5 * scale; k++) xs.push(lumAt(joint + (k + 0.5) / scale, line + dv / scale));
    const med = [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
    return Math.max(...xs.map((x) => Math.abs(x - med))) / (Math.abs(med - bg) || 1);
  }));
  return { step, gap, border, nubbin };
}

function measureDividerJoints(px, scale, originX = 0, originY = 0) {
  const results = [];
  const near = [0.5, 1.5, 2.5];
  for (const holder of document.querySelectorAll('[data-nd]')) {
    const { name, ...p } = JSON.parse(holder.dataset.nd);
    const vertical = p.direction === 'left' || p.direction === 'right';
    const r = holder.querySelector('.mochi-nubbin-divider__nub').getBoundingClientRect();
    const rect = { left: r.left - originX, top: r.top - originY };
    const geo = { ...p, length: vertical ? r.height : r.width, depth: vertical ? r.width : r.height };
    // [label, where along the line, border samples, nubbin samples, which way the line runs on]
    const joints = p.shape === 'bump'
      ? [['start', 0, near.map((d) => -d), near, -1], ['end', geo.length, near.map((d) => geo.length + d), near.map((d) => geo.length - d), 1]]
      : [['line end', geo.length, near.map((d) => geo.length + d), near.map((d) => geo.length - d), 1]];
    for (const [label, at, outside, inside, towards] of joints) {
      const m = dividerJoint(px, scale, rect, geo, at, outside, inside, towards);
      const worst = Math.max(m.step, m.gap);
      results.push({
        placement: `nubbin-divider ${name}`, joint: label, scale,
        border: +m.border.toFixed(3), nubbin: +m.nubbin.toFixed(3), centreShift: +Math.abs(m.nubbin - m.border).toFixed(3),
        gap: +m.gap.toFixed(3), step: +worst.toFixed(3), ok: worst <= JOINT_TOLERANCE,
      });
    }
  }
  // Divider has no stroke to step, but its two caps meet in the middle of a
  // grooved line: a seam shows as a jump between the pixel columns (rows,
  // vertically) either side of the join that the line doesn't make anywhere
  // else. That jump, less the largest jump away from the join, as a share of
  // the groove's own contrast, reads like an edge step in px (a column that
  // is off by a fifth of a pixel is off by a fifth of the contrast).
  for (const holder of document.querySelectorAll('[data-divider]')) {
    const { orientation, thickness } = JSON.parse(holder.dataset.divider);
    const horizontal = orientation === 'horizontal';
    const r = holder.querySelector('.remochi-divider').getBoundingClientRect();
    const length = horizontal ? r.width : r.height;
    const origin = (horizontal ? r.left - originX : r.top - originY) * scale;
    const cross = (horizontal ? r.top - originY : r.left - originX) * scale;
    const lum = (a, c) => {
      const x = horizontal ? a : c, y = horizontal ? c : a;
      const i = (y * px.width + x) * 4;
      return (px.data[i] + px.data[i + 1] + px.data[i + 2]) / 3;
    };
    const centre = Math.round(origin + (length * scale) / 2);
    const rows = Array.from({ length: thickness * scale }, (_, k) => Math.round(cross) + k);
    const jump = (a) => Math.max(...rows.map((c) => Math.abs(lum(a + 1, c) - lum(a, c))));
    const at = (a) => jump(a);
    const seam = Math.max(...[-2, -1, 0, 1].map((k) => at(centre + k)));
    const away = Math.max(...[-8, -7, -6, -5, -4, 4, 5, 6, 7, 8].map((k) => at(centre + k)));
    const bg = lum(centre - 40 * scale, Math.round(cross) - 3 * scale);
    const contrast = Math.max(...rows.map((c) => Math.abs(lum(centre, c) - bg)));
    const step = Math.max(0, seam - away) / (contrast || 1);
    results.push({
      placement: `divider ${orientation} ${+length.toFixed(1)}px`, joint: 'middle', scale,
      border: 0, nubbin: 0, centreShift: 0, step: +step.toFixed(3), ok: step <= JOINT_TOLERANCE,
    });
  }
  return results;
}

function measureView(data, scale, originX = 0, originY = 0) {
  if (view === 'grabber') return measureGrabberJoints(data, scale, originX, originY);
  if (view === 'dividers') return measureDividerJoints(data, scale, originX, originY);
  return measureJoints(data, scale, originX, originY);
}

// For run.mjs (and checking by hand): measures a real screenshot of this
// page. The page's own snapshot is only good for 1x: Chrome's rasterizing of
// an SVG foreignObject at 2x isn't stable to a sub-pixel (the same border
// can land half a pixel apart in two runs), so 2x has to come from a real
// device-scale-2 screenshot.
async function measureScreenshot(src, scale, originX = 0, originY = 0) {
  stopAnimations();
  const img = new Image();
  await new Promise((ok, fail) => { img.onload = ok; img.onerror = fail; img.src = src; });
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return measureView(data, scale, originX, originY);
}

// Checks the checker: paints the right-pointing popup's border, with its
// nubbin's straight tail drawn `offset` px inward of it, into a canvas, and
// measures that. Returns the measured steps for each offset.
async function selfTestJoints(offsets = [0, 0.1, 0.2, 0.3, 0.4, 0.5], scale = 1) {
  stopAnimations();
  await new Promise((r) => setTimeout(r, 100));
  const panel = [...document.querySelectorAll('.mochi-contextual-popup')].find((p) => / right(\s|$)/.test(p.className) && /horizontal/.test(p.className));
  const r = panel.querySelector('.mochi-popup-nubbin').getBoundingClientRect();
  const out = {};
  for (const offset of offsets) {
    const canvas = document.createElement('canvas');
    canvas.width = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#666';
    ctx.fillRect(r.left, 0, 2, H);                        // the panel's border
    ctx.fillRect(r.left - offset, r.top, 2, r.height);    // the nubbin's tail
    out[offset] = measureJoints(ctx.getImageData(0, 0, canvas.width, canvas.height), scale, 0, 0, [panel])
      .map((j) => j.step);
  }
  return out;
}

// The same for NubbinDivider's joint check: paints a bar and a nubbin tail
// meeting on a horizontal line with the tail `across` px off the bar's row
// and `gap` px of clear space between them, and returns the measured step.
async function selfTestDividerJoints(cases = [[0, 0], [0.3, 0], [0, 1], [0, 0.5]], scale = 1) {
  const out = {};
  for (const [across, gap] of cases) {
    const canvas = document.createElement('canvas');
    canvas.width = 300 * scale;
    canvas.height = 80 * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, 300, 80);
    ctx.fillStyle = '#666';
    ctx.fillRect(10, 58, 100, 2);                          // the cap's bar
    ctx.fillRect(110 + gap, 58 + across, 100, 2);          // the nubbin's tail
    const geo = { shape: 'bump', direction: 'up', side: 'start', length: 71, depth: 20 };
    const near = [0.5, 1.5, 2.5];
    const px = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const m = dividerJoint(px, scale, { left: 110, top: 40 }, geo, 0, near.map((d) => -d), near, -1);
    out[`across ${across}, gap ${gap}`] = +Math.max(m.step, m.gap).toFixed(3);
  }
  return out;
}

// Fallback without a screenshot: the page's own 1x snapshot. With `save`,
// writes report/joints.json (run.mjs writes it from real screenshots
// instead).
async function checkJoints(save = false) {
  stopAnimations();
  // (A timeout, not requestAnimationFrame: rAF stalls in a hidden tab.)
  await new Promise((r) => setTimeout(r, 100));
  const canvas = await snapshot(1);
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  const results = measureView(data, 1);
  if (save) {
    const selfTest = { 1: await selfTestJoints(undefined, 1), 2: await selfTestJoints(undefined, 2) };
    const body = { source: 'in-page snapshot, 1x only', tolerance: JOINT_TOLERANCE, results, selfTest };
    await fetch('/save?path=joints.json', { method: 'POST', body: JSON.stringify(body, null, 2) });
  }
  return results;
}

function App() {
  useEffect(() => {
    window.__measureScreenshot = measureScreenshot;
    window.__stopAnimations = stopAnimations;
    window.__checkJoints = checkJoints;
    window.__capture = async () => { for (const s of [1, 2]) await capture(s); return true; };
    window.__jointTolerance = JOINT_TOLERANCE;
    window.__selfTestJoints = selfTestJoints;
    window.__selfTestDividerJoints = selfTestDividerJoints;
    window.__snapshot = snapshot;
    // &still: no entrance animation, for looking at the page in a screenshot.
    if (params.has('still')) stopAnimations();
    // The probe colour (see the header): set on <html>, which is where
    // PopupPanel, rendered in a portal, gets its tokens from.
    if (params.has('probe')) document.documentElement.style.setProperty('--mochi-panel-border', PROBE);
    if (!params.has('joints')) return;
    const t = setTimeout(() => {
      checkJoints(true).then((r) => { window.__joints = r; }, (err) => { window.__joints = { error: String(err) }; });
    }, 800);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!params.has('capture')) return;
    const t = setTimeout(async () => {
      try {
        for (const s of [1, 2]) await capture(s);
        window.__captured = true;
      } catch (err) {
        window.__captured = { error: String(err) };
      }
    }, 800);
    return () => clearTimeout(t);
  }, []);
  return (
    <MochiThemeWrapper theme={theme} style={{ width: W, height: H, overflow: 'hidden', background: 'var(--mochi-bg)' }}>
      {view === 'popups' ? <Popups /> : view === 'corners' ? <Corners /> : view === 'grabber' ? <Grabbers /> : view === 'dividers' ? <Dividers /> : view === 'halo' ? <Halo /> : <Static />}
    </MochiThemeWrapper>
  );
}

document.body.style.cssText = `margin:0;width:${W}px;height:${H}px;overflow:hidden`;
createRoot(document.getElementById('root')).render(<App />);

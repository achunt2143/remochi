// The drawn nubbins in context: PopupPanel opened in all four directions
// (plus a corner placement), NubbinDivider with a bump and corner caps,
// Divider, and Repanels inside a RepanelStack.
//
//   /scripts/nubbin-diff/out/context.html?view=popups|static&theme=light|dark
//
// With &joints (popups view), it checks that each popup nubbin's line runs
// on from the panel border without a step, from its own 1x snapshot; run.mjs
// does the same from real 1x and 2x screenshots (see measureScreenshot).
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

function placement(classes) {
  const has = (c) => classes.split(/\s+/).includes(c);
  if (has('vertical')) {
    const direction = has('below') ? 'up' : 'down';
    return has('corner')
      ? { shape: 'corner', direction, side: has('left') ? 'end' : 'start' }
      : { shape: 'bump', direction, side: 'start' };
  }
  const direction = has('left') ? 'left' : 'right';
  return has('corner')
    ? { shape: 'corner', direction, side: has('high') ? 'start' : 'end' }
    : { shape: 'bump', direction, side: 'start' };
}

// Edges (in CSS px, along the frame's `across` axis) of the stroke at one
// sample, each found where the profile across the line crosses halfway
// between the stroke (#666) and the background 3px out on that side,
// interpolated between pixels so sub-pixel shifts show. Taking the
// background per side matters under a bottom border, where the panel's drop
// shadow leaves it at ~180 rather than the panel's 245.
const STROKE_LUM = 102;
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
  const halfLo = (lums[0] + STROKE_LUM) / 2;
  const halfHi = (lums[lums.length - 1] + STROKE_LUM) / 2;
  const first = lums.findIndex((l) => l < halfLo);
  const last = lums.length - 1 - [...lums].reverse().findIndex((l) => l < halfHi);
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
    // Samples sit at pixel centres (half-integers along the line), so a
    // mirrored box is sampled at the same distances from its ends, and start
    // right at the joint, where a misplaced nubbin shows most.
    const near = [0.5, 1.5, 2.5];
    const before = (at) => near.map((d) => at - d);
    const after = (at) => near.map((d) => at + d);
    // [label, across axis, expected centre, border samples, nubbin samples]
    const joints = p.shape === 'bump'
      ? [['start', 'v', line, before(0), after(0)], ['end', 'v', line, after(geo.length), before(geo.length)]]
      : [['line end', 'v', line, after(geo.length), before(geo.length)], ['side', 'u', 1, after(geo.depth), before(geo.depth)]];
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
        placement: classes, joint: label, scale,
        border: +border.toFixed(3), nubbin: +nubbin.toFixed(3), centreShift: +Math.abs(nubbin - border).toFixed(3),
        step: +step.toFixed(3), ok: step <= JOINT_TOLERANCE,
      });
    }
  }
  return results;
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
  return measureJoints(ctx.getImageData(0, 0, canvas.width, canvas.height), scale, originX, originY);
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

// Fallback without a screenshot: the page's own 1x snapshot. With `save`,
// writes report/joints.json (run.mjs writes it from real screenshots
// instead).
async function checkJoints(save = false) {
  stopAnimations();
  // (A timeout, not requestAnimationFrame: rAF stalls in a hidden tab.)
  await new Promise((r) => setTimeout(r, 100));
  const canvas = await snapshot(1);
  const results = measureJoints(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height), 1);
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
    window.__jointTolerance = JOINT_TOLERANCE;
    window.__selfTestJoints = selfTestJoints;
    window.__snapshot = snapshot;
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
      {view === 'popups' ? <Popups /> : <Static />}
    </MochiThemeWrapper>
  );
}

document.body.style.cssText = `margin:0;width:${W}px;height:${H}px;overflow:hidden`;
createRoot(document.getElementById('root')).render(<App />);

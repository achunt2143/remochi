// The drawn nubbins in context: PopupPanel opened in all four directions
// (plus a corner placement), NubbinDivider with a bump and corner caps,
// Divider, and Repanels inside a RepanelStack.
//
//   /scripts/nubbin-diff/out/context.html?view=popups|static&theme=light|dark
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

const rect = (left, top, width = 40, height = 24) => ({
  left, top, width, height, right: left + width, bottom: top + height, x: left, y: top,
});

// Anchors chosen so PopupPanel's own placement logic picks each direction:
// wide popups go above/below (by which half of the viewport the anchor is
// in), tall narrow ones go left/right, and an anchor in the top 100px near
// an edge gets a corner cap. (A popup wider than 200px always goes
// above/below, so the tall ones keep short titles.)
const POPUPS = [
  { label: 'below (nub up)',     anchor: rect(440, 130), wide: true },
  { label: 'above (nub down)',   anchor: rect(440, 680), wide: true },
  { label: 'nub left',           anchor: rect(560, 420), tall: true },
  { label: 'nub right',          anchor: rect(1110, 300), tall: true },
  { label: 'corner (top-left)',  anchor: rect(16, 24), wide: true },
  { label: 'corner (bottom-right)', anchor: rect(1140, 816), wide: true },
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

function Popups() {
  return POPUPS.map((p) => (
    <React.Fragment key={p.label}>
      <Anchor anchor={p.anchor} />
      <PopupPanel isOpen anchorRect={p.anchor} title={p.label} onClose={() => {}}>
        <div style={{ width: p.wide ? 220 : 90, height: p.tall ? 240 : 40 }}>Content</div>
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
async function capture(scale) {
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
  await fetch(`/save?path=context/${view}-${theme}-${scale}x.png`, { method: 'POST', body: canvas.toDataURL('image/png') });
}

function App() {
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

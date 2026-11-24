// Sprite-vs-drawing pixel diff. Served by serve.mjs (which also serves the
// repo root, for the sprites); open /out/diff.html in any Chromium.
//
// Each case renders the old PNG and the new drawing through the browser's
// own SVG/CSS renderer at 1x and 2x, composited over the theme's background,
// then compares them pixel by pixel in a canvas. Results and magnified crops
// (sprite | drawing | difference) are POSTed back to serve.mjs, which writes
// them to ./report.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { Nubbin, taperStyle, BUMP, CORNER, SHADOW } from '../../src/shared/nubbin.jsx';
import { CASES } from './cases.js';

const SCALES = [1, 2];
// A pixel counts as mismatched when any channel differs by more than this
// (out of 255) — about 6%, well under what reads as a different colour.
const THRESHOLD = 16;
// Crops are magnified to this many screen pixels per CSS pixel.
const ZOOM = 8;

const toDataUrl = async (path) => {
  const blob = await (await fetch(`/${path}`)).blob();
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(blob);
  });
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// Rasterizes `inner` (SVG or, inside a foreignObject, XHTML markup) at
// `scale`, over `bg`, and returns its pixels.
async function rasterize(inner, w, h, scale, bg) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w * scale}" height="${h * scale}" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="${bg}"/>${inner}</svg>`;
  const img = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const html = (markup, w, h) =>
  `<foreignObject width="${w}" height="${h}"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${w}px;height:${h}px">${markup}</div></foreignObject>`;

function drawing(c, w, h) {
  if (c.nubbin) return renderToStaticMarkup(<Nubbin {...c.nubbin} />);
  // Divider caps are CSS (see Divider.jsx); render them the same way.
  const { end } = c.taper;
  const style = taperStyle({ orientation: 'horizontal', end: end === 'mid' ? 'end' : end, color: '#646464' });
  if (end === 'mid') { delete style.maskImage; delete style.WebkitMaskImage; }
  const css = Object.entries(style)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`).replace(/^webkit/, '-webkit')}:${v}`)
    .join(';');
  return html(`<div style="width:${w}px;height:${h}px;${css}"></div>`, w, h);
}

// `mismatch`: share of pixels where the two differ by more than THRESHOLD.
// `shifted`: the same, but a drawing pixel only counts if no sprite pixel
// within 1px of it matches either, so edges that are merely softer or
// sharper (a 1x sprite upscaled to 2x is blurred; the drawing isn't) or
// sub-pixel shifted don't count, and what's left is a difference in shape.
function compare(a, b) {
  const { width: w, height: h } = a;
  const n = w * h;
  const diff = (i, j) => Math.max(
    Math.abs(a.data[j * 4] - b.data[i * 4]),
    Math.abs(a.data[j * 4 + 1] - b.data[i * 4 + 1]),
    Math.abs(a.data[j * 4 + 2] - b.data[i * 4 + 2])
  );
  let bad = 0, shifted = 0, sum = 0;
  const heat = new Uint8ClampedArray(n);
  for (let i = 0; i < n; i++) {
    const d = diff(i, i);
    heat[i] = d;
    sum += d;
    if (d <= THRESHOLD) continue;
    bad++;
    const x = i % w, y = (i - x) / w;
    let near = false;
    for (let dy = -1; dy <= 1 && !near; dy++) {
      for (let dx = -1; dx <= 1 && !near; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < w && yy < h && diff(i, yy * w + xx) <= THRESHOLD) near = true;
      }
    }
    if (!near) shifted++;
  }
  return { mismatch: (100 * bad) / n, shifted: (100 * shifted) / n, mean: (100 * sum) / n / 255, heat };
}

// sprite | drawing | difference (red = mismatched, grey = below threshold),
// each magnified with nearest-neighbour so single pixels stay visible.
function crop(a, b, heat, scale) {
  const z = ZOOM / scale;
  const w = a.width * z, h = a.height * z, gap = 8;
  const canvas = document.createElement('canvas');
  canvas.width = w * 3 + gap * 2;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const put = (img, x) => {
    const c = document.createElement('canvas');
    c.width = a.width; c.height = a.height;
    c.getContext('2d').putImageData(img, 0, 0);
    ctx.drawImage(c, x, 0, w, h);
  };
  put(a, 0);
  put(b, w + gap);
  const d = new ImageData(a.width, a.height);
  heat.forEach((v, i) => {
    const over = v > THRESHOLD;
    d.data.set(over ? [255, 255 - Math.min(255, v * 2), 0, 255] : [v * 4, v * 4, v * 4, 255], i * 4);
  });
  put(d, (w + gap) * 2);
  return canvas.toDataURL('image/png');
}

const slug = (c, scale) => `${c.id.replace(/\//g, '_')}-${c.theme}-${scale}x`;

async function run() {
  const results = [];
  for (const c of CASES) {
    const src = await toDataUrl(c.sprite);
    const sprite = await loadImage(src);
    const w = sprite.naturalWidth, h = sprite.naturalHeight;
    for (const scale of SCALES) {
      const a = await rasterize(`<image href="${src}" width="${w}" height="${h}"/>`, w, h, scale, c.bg);
      const b = await rasterize(drawing(c, w, h), w, h, scale, c.bg);
      const { mismatch, shifted, mean, heat } = compare(a, b);
      const name = slug(c, scale);
      results.push({ id: c.id, theme: c.theme, scale, w, h, mismatch, shifted, mean, crop: `crops/${name}.png` });
      await fetch(`/save?path=crops/${name}.png`, { method: 'POST', body: crop(a, b, heat, scale) });
    }
  }
  await fetch('/save?path=results.json', { method: 'POST', body: JSON.stringify(results, null, 2) });
  return results;
}

function Report({ results }) {
  return (
    <table style={{ font: '12px monospace', borderCollapse: 'collapse' }}>
      <tbody>
        {results.map((r) => (
          <tr key={r.crop}>
            <td style={{ padding: 4 }}>{r.id}</td>
            <td>{r.theme}</td>
            <td>{r.scale}x</td>
            <td style={{ padding: '0 8px' }}>{r.mismatch.toFixed(2)}%</td>
            <td style={{ padding: '0 8px' }}>{r.shifted.toFixed(2)}%</td>
            <td>{r.mean.toFixed(2)}%</td>
            <td><img src={`/scripts/nubbin-diff/report/${r.crop}`} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// How the traced constants in src/shared/nubbin.jsx were tuned: open
// diff.html?tune and run `await __nubbinTune()` in the console. It nudges
// each constant (coordinate descent) while the summed mean difference over
// the given sprites at 1x and 2x keeps falling, and returns the result to
// copy back into nubbin.jsx.
async function tune(
  ids = ['popup/up', 'popup/dark/up', 'divider/up', 'repanel/left', 'popup/top-left-corner-up', 'popup/dark/top-left-corner-up'],
  keys = [[SHADOW, 'offset', 0.25], [SHADOW, 'blur', 0.15], [SHADOW, 'opacity', 0.03], [BUMP, 'height', 0.1], [BUMP, 'sigma', 0.1]]
) {
  const pre = [];
  for (const c of CASES.filter((c) => ids.includes(c.id) && (c.id.startsWith('divider/') ? c.theme === 'light' : true))) {
    const src = await toDataUrl(c.sprite);
    const im = await loadImage(src);
    const w = im.naturalWidth, h = im.naturalHeight;
    const img = `<image href="${src}" width="${w}" height="${h}"/>`;
    pre.push({ c, w, h, a: await Promise.all(SCALES.map((s) => rasterize(img, w, h, s, c.bg))) });
  }
  const score = async () => {
    let total = 0;
    for (const p of pre) {
      const m = drawing(p.c, p.w, p.h);
      for (const [i, s] of SCALES.entries()) total += compare(p.a[i], await rasterize(m, p.w, p.h, s, p.c.bg)).mean;
    }
    return total;
  };
  let best = await score();
  const start = best;
  for (let pass = 0; pass < 3; pass++) {
    for (const [o, k, step] of keys) {
      for (const dir of [1, -1]) {
        for (;;) {
          const old = o[k];
          o[k] = +(old + dir * step).toFixed(3);
          const s = await score();
          if (s < best - 1e-4) best = s;
          else { o[k] = old; break; }
        }
      }
    }
  }
  return { start, best, BUMP, CORNER, SHADOW };
}

window.__nubbinTune = tune;

const root = createRoot(document.getElementById('root'));
root.render(<p>Running…</p>);
(new URLSearchParams(location.search).has('tune') ? new Promise(() => {}) : run()).then(
  (results) => {
    root.render(<Report results={results} />);
    window.__nubbinDiff = results;
  },
  (err) => {
    root.render(<pre>{String(err.stack || err)}</pre>);
    window.__nubbinDiff = { error: String(err) };
  }
);

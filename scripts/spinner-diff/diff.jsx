// GIF-vs-drawing diff for the Spinner, frame by frame. Served by serve.mjs;
// open /out/diff.html in a Chromium (needs WebCodecs' ImageDecoder).
//
// For every frame of every GIF the page decodes the GIF's own frame
// (composited over the theme's background), renders the drawing at the same
// frame through the browser's SVG renderer at 1x and 2x, and compares them
// pixel by pixel. Metrics and magnified crops are POSTed to serve.mjs, which
// writes them to ./report.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { SpinnerArt } from '../../src/Spinner/Spinner.jsx';

const SCALES = [1, 2];
const THEMES = { light: '#f5f5f5', dark: '#333333' };
const SIZES = { normal: 'spinner', large: 'spinner-large' };
// A pixel is mismatched when any channel differs by more than this (of 255).
const THRESHOLD = 24;
const WORST = 4;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

async function decodeGif(url) {
  const data = await (await fetch(url)).arrayBuffer();
  const decoder = new ImageDecoder({ data, type: 'image/gif' });
  await decoder.tracks.ready;
  const n = decoder.tracks.selectedTrack.frameCount;
  const frames = [];
  for (let i = 0; i < n; i++) frames.push((await decoder.decode({ frameIndex: i })).image);
  return frames;
}

function canvasFor(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

// The GIF frame at `scale`, over bg (a 1x raster blown up, as a browser would).
function gifPixels(frame, w, h, scale, bg) {
  const c = canvasFor(w * scale, h * scale);
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.imageSmoothingEnabled = scale !== 1;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(frame, 0, 0, c.width, c.height);
  return ctx.getImageData(0, 0, c.width, c.height);
}

async function drawingPixels(size, styleType, frame, w, h, scale, bg) {
  const art = renderToStaticMarkup(<SpinnerArt size={size} styleType={styleType} frame={frame} />)
    .replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" `);
  const inner = art.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w * scale}" height="${h * scale}" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="${bg}"/>${inner}</svg>`;
  const img = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  const c = canvasFor(w * scale, h * scale);
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, c.width, c.height);
}

// `ink`: pixels where either image differs from the background (the shapes
// themselves; a 260x83 frame is mostly empty, so the canvas would dilute the
// numbers). `mismatch`: share of ink pixels where the two differ by more than
// THRESHOLD. `shifted`: the same, but a drawing pixel only counts if no GIF
// pixel within 1px matches it either, so softer or sub-pixel shifted edges
// (a 1x GIF blown up to 2x is blurred) don't count — what's left is shape.
function compare(a, b, bgRGB) {
  const { width: w, height: h } = a;
  const n = w * h;
  const d = (i, j) => Math.max(
    Math.abs(a.data[j * 4] - b.data[i * 4]),
    Math.abs(a.data[j * 4 + 1] - b.data[i * 4 + 1]),
    Math.abs(a.data[j * 4 + 2] - b.data[i * 4 + 2]));
  const isInk = (img, i) => Math.max(
    Math.abs(img.data[i * 4] - bgRGB[0]), Math.abs(img.data[i * 4 + 1] - bgRGB[1]), Math.abs(img.data[i * 4 + 2] - bgRGB[2])) > THRESHOLD;
  let ink = 0, bad = 0, shifted = 0, gifOnly = 0, drawOnly = 0;
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  const heat = new Uint8ClampedArray(n);
  for (let i = 0; i < n; i++) {
    const ia = isInk(a, i), ib = isInk(b, i);
    const x = i % w, y = (i - x) / w;
    if (ia || ib) {
      ink++;
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
    const v = d(i, i);
    heat[i] = v;
    if (v <= THRESHOLD) continue;
    bad++;
    if (ia && !ib) gifOnly++; else if (ib && !ia) drawOnly++;
    let near = false;
    for (let dy = -1; dy <= 1 && !near; dy++) {
      for (let dx = -1; dx <= 1 && !near; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < w && yy < h && d(i, yy * w + xx) <= THRESHOLD) near = true;
      }
    }
    if (!near) shifted++;
  }
  const pc = (v) => (ink ? (100 * v) / ink : 0);
  return {
    ink, mismatch: pc(bad), shifted: pc(shifted), gifOnly: pc(gifOnly), drawOnly: pc(drawOnly),
    canvasMismatch: (100 * bad) / n, bbox: ink ? [x0, y0, x1 + 1, y1 + 1] : [0, 0, w, h], heat,
  };
}

const put = (ctx, img, x, y, w, h) => {
  const c = canvasFor(img.width, img.height);
  c.getContext('2d').putImageData(img, 0, 0);
  ctx.drawImage(c, x, y, w, h);
};

const heatImage = (a, heat) => {
  const out = new ImageData(a.width, a.height);
  heat.forEach((v, i) => {
    out.data.set(v > THRESHOLD ? [255, 255 - Math.min(255, v), 0, 255] : [v * 3, v * 3, v * 3, 255], i * 4);
  });
  return out;
};

// GIF | drawing | difference, nearest-neighbour magnified, cropped to the
// shapes' bounding box (plus a margin) so the pixels stay visible.
function triplet(a, b, heat, bbox, scale, zoom) {
  const m = 3 * scale;
  const x0 = Math.max(0, bbox[0] - m), y0 = Math.max(0, bbox[1] - m);
  const x1 = Math.min(a.width, bbox[2] + m), y1 = Math.min(a.height, bbox[3] + m);
  const cw = x1 - x0, ch = y1 - y0, z = zoom / scale, gap = 6;
  const c = canvasFor(cw * z * 3 + gap * 2, ch * z);
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const sub = (img) => {
    const t = canvasFor(cw, ch);
    t.getContext('2d').putImageData(img, -x0, -y0);
    return t;
  };
  const tmp = (img) => { const t = canvasFor(img.width, img.height); t.getContext('2d').putImageData(img, 0, 0); return t; };
  [a, b, heatImage(a, heat)].forEach((img, k) => ctx.drawImage(tmp(img), x0, y0, cw, ch, k * (cw * z + gap), 0, cw * z, ch * z));
  return c.toDataURL('image/png');
}

// Contact sheet: every frame's difference map (red = mismatched) over a faint
// copy of the GIF frame, labelled with its index.
function sheet(cells, w, h, scale, zoom, cols) {
  const z = zoom / scale, cw = Math.round(w * z), ch = Math.round(h * z);
  const rows = Math.ceil(cells.length / cols);
  const c = canvasFor(cols * (cw + 4), rows * (ch + 4));
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.imageSmoothingEnabled = false;
  cells.forEach(({ a, heat, frame }, i) => {
    const x = (i % cols) * (cw + 4), y = Math.floor(i / cols) * (ch + 4);
    const img = new ImageData(a.width, a.height);
    heat.forEach((v, k) => {
      const g = 235 + (a.data[k * 4] - 235) * 0.0; // (background stays white)
      const ink = Math.abs(a.data[k * 4] - a.data[0]) + Math.abs(a.data[k * 4 + 1] - a.data[1]) + Math.abs(a.data[k * 4 + 2] - a.data[2]) > 48;
      img.data.set(v > THRESHOLD ? [230, 0, 40, 255] : ink ? [150, 150, 150, 255] : [255, 255, 255, 255], k * 4);
    });
    put(ctx, img, x, y, cw, ch);
    ctx.fillStyle = '#06f';
    ctx.font = '10px monospace';
    ctx.fillText(String(frame), x + 2, y + 10);
  });
  return c.toDataURL('image/png');
}

const post = (path, body) => fetch(`/save?path=${path}`, { method: 'POST', body });
const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));

async function run() {
  const results = [];
  for (const [size, file] of Object.entries(SIZES)) {
    for (const [theme, bg] of Object.entries(THEMES)) {
      const gif = await decodeGif(`/src/Spinner/spinners/${file}-${theme}.gif`);
      const w = gif[0].displayWidth, h = gif[0].displayHeight;
      for (const scale of SCALES) {
        const cells = [];
        for (let f = 0; f < gif.length; f++) {
          const a = gifPixels(gif[f], w, h, scale, bg);
          const b = await drawingPixels(size, theme, f, w, h, scale, bg);
          const r = compare(a, b, hex(bg));
          cells.push({ a, b, ...r, frame: f });
        }
        const tag = `${size}-${theme}-${scale}x`;
        const zoom = size === 'normal' ? 4 : 1.5;
        await post(`sheets/${tag}.png`, sheet(cells, w, h, scale, zoom, size === 'normal' ? 10 : 3));
        const worst = [...cells].sort((p, q) => q.mismatch - p.mismatch).slice(0, WORST).map((c) => c.frame);
        const picks = [...new Set([...worst, 0, Math.floor(gif.length / 4), Math.floor(gif.length / 2), Math.floor((3 * gif.length) / 4)])].sort((p, q) => p - q);
        for (const f of picks) {
          const c = cells[f];
          await post(`crops/${tag}-f${String(f).padStart(3, '0')}.png`, triplet(c.a, c.b, c.heat, c.bbox, scale, size === 'normal' ? 8 : 4));
        }
        const frames = cells.map(({ frame, ink, mismatch, shifted, gifOnly, drawOnly, canvasMismatch }) => ({
          frame, ink, mismatch: +mismatch.toFixed(2), shifted: +shifted.toFixed(2), gifOnly: +gifOnly.toFixed(2), drawOnly: +drawOnly.toFixed(2), canvasMismatch: +canvasMismatch.toFixed(3),
        }));
        const mean = (k) => frames.reduce((s, f) => s + f[k], 0) / frames.length;
        results.push({
          size, theme, scale, w, h, frames,
          mean: { mismatch: mean('mismatch'), shifted: mean('shifted') },
          max: { mismatch: Math.max(...frames.map((f) => f.mismatch)), shifted: Math.max(...frames.map((f) => f.shifted)) },
          worst, crops: picks.map((f) => `crops/${tag}-f${String(f).padStart(3, '0')}.png`), sheet: `sheets/${tag}.png`,
        });
      }
    }
  }
  await post('results.json', JSON.stringify(results));
  return results;
}

const root = createRoot(document.getElementById('root'));
root.render(<p>Running…</p>);
run().then(
  (results) => {
    root.render(<pre>{results.map((r) => `${r.size} ${r.theme} ${r.scale}x  mean ${r.mean.mismatch.toFixed(2)}% shape ${r.mean.shifted.toFixed(2)}%  max ${r.max.mismatch.toFixed(2)}% shape ${r.max.shifted.toFixed(2)}%`).join('\n')}</pre>);
    window.__spinnerDiff = results;
  },
  (err) => {
    root.render(<pre>{String(err.stack || err)}</pre>);
    window.__spinnerDiff = { error: String(err) };
  },
);

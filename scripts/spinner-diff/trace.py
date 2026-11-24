#!/usr/bin/env python3
"""Traces the Mochi spinner GIFs into vector keyframes.

  python3 -I scripts/spinner-diff/trace.py   (numpy + Pillow)

Reads scripts/spinner-diff/fixtures/*.gif, writes src/Spinner/spinnerFrames.js and
scripts/spinner-diff/report/frames.json (timing, colours, per-frame stats).

Per frame: the GIF's (binary) alpha is blurred a little and contoured with
marching squares to get a sub-pixel silhouette; each connected piece becomes
one smooth cubic path (Catmull-Rom through a Douglas-Peucker reduction of the
contour). The fill is the piece's own colour; the 1px outline the GIFs bake in
(white for light, black for dark) is redrawn as an SVG stroke.
"""
import json, sys, os, math
import numpy as np
from PIL import Image, ImageSequence

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
GIFS = os.path.join(ROOT, 'scripts/spinner-diff/fixtures')
SIGMA = 0.6       # blur before contouring
INSET_LEVEL = 0.73  # contour level whose line sits ~0.5px inside the silhouette at SIGMA
TINY = 14         # components smaller than this (px) are contoured at the silhouette itself
MAXERR = 0.12     # px: Fourier fit tolerance vs the dense contour
KMAX = 18         # most harmonics per piece

def frames(name):
    im = Image.open(os.path.join(GIFS, name))
    out, delays = [], []
    for f in ImageSequence.Iterator(im):
        out.append(np.array(f.convert('RGBA')))
        delays.append(f.info.get('duration', 0))
    return out, delays

def blur(a, s):
    r = int(math.ceil(3 * s)); x = np.arange(-r, r + 1)
    k = np.exp(-x * x / (2 * s * s)); k /= k.sum()
    a = np.pad(a, r, mode='constant')
    a = np.apply_along_axis(lambda v: np.convolve(v, k, 'same'), 0, a)
    a = np.apply_along_axis(lambda v: np.convolve(v, k, 'same'), 1, a)
    return a[r:-r, r:-r]

def label(mask):
    h, w = mask.shape; lab = np.zeros((h, w), int); n = 0
    for y in range(h):
        for x in range(w):
            if mask[y, x] and not lab[y, x]:
                n += 1; st = [(y, x)]; lab[y, x] = n
                while st:
                    cy, cx = st.pop()
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            ny, nx = cy + dy, cx + dx
                            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not lab[ny, nx]:
                                lab[ny, nx] = n; st.append((ny, nx))
    return lab, n

def contours(f, level):
    """Marching squares on pixel-centre samples (centre of pixel (x,y) is at x+.5,y+.5)."""
    h, w = f.shape; segs = {}
    def interp(p, q, vp, vq):
        t = (level - vp) / (vq - vp); return (p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1]))
    segments = []
    for y in range(h - 1):
        for x in range(w - 1):
            v = [f[y, x], f[y, x + 1], f[y + 1, x + 1], f[y + 1, x]]
            pts = [(x + .5, y + .5), (x + 1.5, y + .5), (x + 1.5, y + 1.5), (x + .5, y + 1.5)]
            idx = sum((v[i] >= level) << i for i in range(4))
            if idx in (0, 15): continue
            edges = []
            for i in range(4):
                j = (i + 1) % 4
                if (v[i] >= level) != (v[j] >= level):
                    edges.append(interp(pts[i], pts[j], v[i], v[j]))
            if len(edges) == 2: segments.append((edges[0], edges[1]))
            else:  # saddle: split by centre value
                c = sum(v) / 4
                e = edges
                if (c >= level) == (v[0] >= level): segments += [(e[0], e[3]), (e[1], e[2])]
                else: segments += [(e[0], e[1]), (e[2], e[3])]
    # stitch
    key = lambda p: (round(p[0], 4), round(p[1], 4))
    adj = {}
    for a, b in segments:
        adj.setdefault(key(a), []).append(b); adj.setdefault(key(b), []).append(a)
    used = set(); loops = []
    for a, b in segments:
        k = (key(a), key(b))
        if k in used: continue
        loop = [a]; cur, prev = b, a; used.add(k); used.add((key(b), key(a)))
        while key(cur) != key(a):
            loop.append(cur)
            nxt = None
            for c in adj.get(key(cur), []):
                if key(c) != key(prev) and (key(cur), key(c)) not in used:
                    nxt = c; break
            if nxt is None: break
            used.add((key(cur), key(nxt))); used.add((key(nxt), key(cur))); prev, cur = cur, nxt
        if len(loop) > 3: loops.append(loop)
    return loops

def fourier(loop):
    """Fits a closed contour with the fewest harmonics that stay within MAXERR.
    Returns (coefficients as [re, im] pairs for k = 0, 1, -1, 2, -2, ..., max error)."""
    P = np.array(loop + [loop[0]]); seg = np.hypot(*np.diff(P, axis=0).T)
    s = np.concatenate([[0], np.cumsum(seg)]); M = 512
    t = np.linspace(0, s[-1], M, endpoint=False)
    z = np.interp(t, s, P[:, 0]) + 1j * np.interp(t, s, P[:, 1])
    F = np.fft.fft(z) / M
    for K in range(1, KMAX + 1):
        G = np.zeros_like(F); G[:K + 1] = F[:K + 1]; G[-K:] = F[-K:]
        rec = np.fft.ifft(G) * M
        # distance from each dense contour point to the reconstructed curve
        err = max(np.abs(rec - z).max(), 0) if False else np.abs(np.min(np.abs(z[:, None] - rec[None, ::2]), axis=1)).max()
        if err <= MAXERR or K == KMAX: break
    order = [0] + [v for k in range(1, K + 1) for v in (k, -k)]
    return [[round(F[k].real, 2), round(F[k].imag, 2)] for k in order], K, float(err)

def fill_of(rgba, sel):
    px = rgba[sel][:, :3].astype(int)
    chroma = px.max(1) - px.min(1)
    good = px[chroma >= 40]
    if len(good) == 0: good = px[chroma >= chroma.max()]
    vals, counts = np.unique(good, axis=0, return_counts=True)
    r, g, b = vals[counts.argmax()]
    return '#%02x%02x%02x' % (r, g, b)

def complete_clipped(loop, width):
    """The large GIFs lose a few px off their right edge in the frames where the ball hits it (a contour runs
    flat along the last column). Rebuild such a loop from its own left part, mirrored about the vertical
    axis through the ball's top and bottom extremes. Returns (loop, True) when it did."""
    P = np.array(loop); flat = P[:, 0] >= width - 1.2
    if flat.sum() < 6: return loop, False
    # rotate so the flat run is at the ends and the open arc comes first
    i0 = int(np.where(flat)[0][-1]) + 1 if not flat[0] else int(np.where(~flat)[0][0])
    idx = [(i0 + k) % len(P) for k in range(len(P))]
    P = P[idx]; keep = P[:, 0] < width - 1.2
    arc = P[keep]
    top, bot = arc[np.argmin(arc[:, 1])], arc[np.argmax(arc[:, 1])]
    xc = (top[0] + bot[0]) / 2
    half = arc[arc[:, 0] <= xc]
    mirror = np.column_stack([2 * xc - half[::-1, 0], half[::-1, 1]])
    return [tuple(q) for q in np.vstack([half, mirror])], True

def trace_frame(rgba, oc, width=None):
    alpha = (rgba[..., 3] > 127).astype(float)
    pad = 4
    A = np.pad(alpha, pad); R = np.pad(rgba, ((pad, pad), (pad, pad), (0, 0)))
    lab, n = label(A > 0)
    pieces = []
    for c in range(1, n + 1):
        m = lab == c; area = int(m.sum())
        fill = fill_of(R, m)
        # coverage of the fill colour: 1 on the fill, 0 on the outline's white/black, along the edge's antialiasing
        fc = np.array([int(fill[i:i + 2], 16) for i in (1, 3, 5)], float)
        v = fc - oc
        cov = np.clip(((R[..., :3].astype(float) - oc) @ v) / (v @ v), 0, 1) * m
        f = blur(cov, SIGMA)
        def shoelace(l):
            P = np.array(l); x, y = P[:, 0], P[:, 1]
            return abs(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1))) / 2
        loops = contours(f, 0.5)
        # thin pieces (necks, droplets) fall below the coverage threshold: use the silhouette instead
        if sum(shoelace(l) for l in loops) < 0.85 * cov.sum():
            loops = contours(blur(m.astype(float), SIGMA), 0.5)
            # the silhouette includes the outline, which the stroke redraws: pull the contour in 0.5px (towards its centroid)
            shrunk = []
            for l in loops:
                P = np.array(l); c0 = P.mean(0); v = P - c0; r = np.maximum(np.hypot(v[:, 0], v[:, 1]), 1e-6)
                shrunk.append([tuple(q) for q in c0 + v * np.maximum(1 - 0.5 / r, 0.2)[:, None]])
            loops = shrunk
        for loop in loops:
            if shoelace(loop) < 0.15: continue
            loop = [(x - pad, y - pad) for x, y in loop]
            before = None
            if width:
                fixed, was = complete_clipped(loop, width)
                if was: before, (loop) = fourier(loop)[0], fixed
            coef, K, err = fourier(loop)
            pieces.append({'fill': fill, 'c': coef, 'area': area, 'n': K, 'err': err, 'before': before})
    pieces.sort(key=lambda p: -p['area'])
    return pieces

def main():
    out = {}; report = {}; clipped = {}
    for size, gif in (('normal', 'spinner-light.gif'), ('large', 'spinner-large-light.gif')):
        fl, delays = frames(gif)
        dk, _ = frames(gif.replace('light', 'dark'))
        same_alpha = all((a[..., 3] > 127).tolist() == (b[..., 3] > 127).tolist() for a, b in zip(fl, dk))
        h, w = fl[0].shape[:2]
        oc = np.array([255, 255, 255] if size == 'normal' else [100, 100, 100], float)  # the outline colour the light GIF baked in
        seq = [trace_frame(f, oc, w if size == 'large' else None) for f in fl]
        clipped[size] = {i: [p['before'] for p in sq if p['before']] for i, sq in enumerate(seq) if any(p['before'] for p in sq)}
        if clipped[size]: print(size, 'clipped frames completed:', sorted(clipped[size]))
        out[size] = {'width': w, 'height': h, 'delay': delays[0], 'frames': seq}
        report[size] = {'width': w, 'height': h, 'frames': len(fl), 'delays_ms': sorted(set(delays)),
                        'duration_ms': sum(delays), 'dark_silhouette_equals_light': same_alpha,
                        'per_frame': [[{'fill': p['fill'], 'area': p['area'], 'harmonics': p['n'], 'err': round(p['err'], 3)} for p in s] for s in seq]}
        print(size, w, h, len(fl), 'frames, delays', set(delays), 'dark==light silhouette', same_alpha,
              'bytes', sum(len(json.dumps(p['c'])) for s in seq for p in s))
    os.makedirs(os.path.join(ROOT, 'scripts/spinner-diff/report'), exist_ok=True)
    json.dump(report, open(os.path.join(ROOT, 'scripts/spinner-diff/report/frames.json'), 'w'), indent=1)
    json.dump({k: {str(i): v for i, v in d.items()} for k, d in clipped.items()}, open(os.path.join(ROOT, 'scripts/spinner-diff/report/clipped-before.json'), 'w'))
    fills = sorted({p['fill'] for s in out.values() for fr in s['frames'] for p in fr})
    js = ['// Generated by scripts/spinner-diff/trace.py from scripts/spinner-diff/fixtures/*.gif. Do not edit.',
          '// Each frame is a list of [fillIndex, coefficients] pieces (the ball and any debris): the outline as a Fourier series, z(t) = sum c_k e^(ikt), c_k listed as re,im pairs for k = 0, 1, -1, 2, -2, ... in hundredths of a px; FILLS lists the colours.',
          'export const FILLS = %s;' % json.dumps(fills),
          'export const SPINNERS = {']
    for size, s in out.items():
        js.append('  %s: { width: %d, height: %d, delay: %d, frames: [' % (size, s['width'], s['height'], s['delay']))
        for fr in s['frames']:
            js.append('    [%s],' % ','.join('[%d,%s]' % (fills.index(p['fill']), json.dumps([int(round(v * 100)) for c in p['c'] for v in c], separators=(',', ':'))) for p in fr))
        js.append('  ] },')
    js.append('};')
    open(os.path.join(ROOT, 'src/Spinner/spinnerFrames.js'), 'w').write('\n'.join(js) + '\n')
main()

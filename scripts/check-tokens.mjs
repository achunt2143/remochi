// Guard for the colour tokens (plan section 4 and 11). Four checks:
//   1. bare hex literals in src/** (allowed: var() fallbacks, comments,
//      allowlisted files, lines marked `check-tokens: allow`)
//   2. var(--token, #hex) fallbacks that differ from the light theme value
//   3. WCAG contrast of the design guide's pairs, from the theme file
//   4. spinner base colours: FILLS and the --mochi-spinner-* tokens
//   npm run check:tokens             exits 1 on a hex violation or a contrast/spinner failure
//   npm run check:tokens -- --report prints the same, always exits 0
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const THEME = 'src/ThemeWrapper/MochiThemeWrapper.scss';
const reportOnly = process.argv.includes('--report');

// Files where a bare hex is the point.
const HEX_ALLOWLIST = [
  THEME,
  // useTheme().colors: the JS mirror of the theme, exported for consumers
  'src/ThemeWrapper/MochiThemeWrapper.jsx',
  'src/Spinner/spinnerFrames.js',
  'src/Spinner/spinnerArt.js',
  'src/shared/nubbin.jsx',
];
const HEX_EXT = /\.(scss|jsx|js|ts)$/;
const OPT_OUT = 'check-tokens: allow';

// Contrast pairs. theme: 'light' | 'dark' | 'both'. known: true prints KNOWN
// instead of failing; a later phase flips it once the token is fixed.
const PAIRS = [
  { fg: '--color-text', bg: '--color-background', theme: 'both', min: 4.5, note: 'body text' },
  { fg: '--color-text', bg: '--color-surface', theme: 'both', min: 4.5, note: 'text on surface' },
  { fg: '--color-text', bg: '--mochi-panel-bg', theme: 'both', min: 4.5, note: 'text on panel' },
  { fg: '--color-text-secondary', bg: '--color-background', theme: 'both', min: 4.5, note: 'secondary text' },
  { fg: '--color-text-secondary', bg: '--color-surface', theme: 'both', min: 4.5, note: 'secondary text on surface' },
  { fg: '--mochi-button-text', bg: '--color-background', theme: 'both', min: 4.5, note: 'button label' },
  { fg: '--mochi-field-text', bg: '--mochi-field-bg', theme: 'both', min: 4.5, note: 'field text' },
  { fg: '--color-primary', bg: '--color-surface', theme: 'light', min: 4.5, note: 'primary text on surface' },
  { fg: '--color-primary', bg: '--color-surface', theme: 'dark', min: 4.5, note: 'primary text on surface' },
];
// added in phase B: live already, they SKIP (missing token) until the token exists.
PAIRS.push(
  { fg: '--mochi-panel-text-muted', bg: '--mochi-panel-bg', theme: 'both', min: 4.5, note: 'muted subheader in panel (phase B)' },
  { fg: '--mochi-focus-ring', bg: '--color-background', theme: 'both', min: 3.0, note: 'focus ring (phase B)' },
  { fg: '--mochi-text', bg: '--mochi-avatar-bg', theme: 'both', min: 4.5, note: 'avatar initials' },
  // SlidingMenu: danger/success rows and the active bar on the panel.
  { fg: '--mochi-panel-error', bg: '--mochi-panel-bg', theme: 'both', min: 4.5, note: 'SlidingMenu danger row on panel' },
  { fg: '--mochi-panel-success', bg: '--mochi-panel-bg', theme: 'both', min: 4.5, note: 'SlidingMenu success row on panel' },
  { fg: '--mochi-focus-ring', bg: '--mochi-panel-bg', theme: 'both', min: 3.0, note: 'SlidingMenu active bar on panel' },
);

const SPINNER_BASE = { circle: '#ff4a4a', square: '#69cdff', triangle: '#ffb80d' };

// ---------- helpers ----------
const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const rel = (p) => relative(root, p).split('\\').join('/');
const HEX = '#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![\\w-])';
// Blank out comments (keeping line count and columns) in one pass, so `/*`
// inside a `//` comment and `//` inside a block comment both behave. Strings
// and `://` are left alone.
function stripComments(text) {
  let res = '', i = 0, quote = null;
  const blank = (s) => s.replace(/[^\n]/g, ' ');
  while (i < text.length) {
    const c = text[i], n = text[i + 1];
    if (quote) {
      res += c;
      if (c === '\\') { res += n ?? ''; i += 2; continue; }
      if (c === quote || c === '\n') quote = null;
      i++;
    } else if (c === '/' && n === '*') {
      const end = text.indexOf('*/', i + 2);
      const stop = end < 0 ? text.length : end + 2;
      res += blank(text.slice(i, stop)); i = stop;
    } else if (c === '/' && n === '/' && text[i - 1] !== ':') {
      const end = text.indexOf('\n', i);
      const stop = end < 0 ? text.length : end;
      res += blank(text.slice(i, stop)); i = stop;
    } else {
      if (c === '"' || c === "'" || c === '`') quote = c;
      res += c; i++;
    }
  }
  return res;
}

const out = [];
const log = (s = '') => out.push(s);
const tally = { PASS: 0, FAIL: 0, KNOWN: 0, SKIP: 0, WARN: 0 };
const mark = (kind) => { tally[kind]++; return kind; };

// ---------- 1. bare hex ----------
const hexViolations = [];
let scanned = 0;
const fallbacks = [];
for (const file of walk(src).filter((f) => HEX_EXT.test(f))) {
  const r = rel(file);
  if (HEX_ALLOWLIST.includes(r)) continue;
  scanned++;
  const raw = readFileSync(file, 'utf8').split('\n');
  const clean = stripComments(readFileSync(file, 'utf8')).split('\n');
  clean.forEach((line, i) => {
    if (raw[i].includes(OPT_OUT)) return;
    const fb = new RegExp(`var\\(\\s*(--[\\w-]+)\\s*,\\s*(${HEX})\\s*\\)`, 'g');
    let rest = line;
    for (const m of line.matchAll(fb)) fallbacks.push({ file: r, line: i + 1, token: m[1], hex: m[2] });
    rest = line.replace(fb, (m) => ' '.repeat(m.length));
    for (const m of rest.matchAll(new RegExp(HEX, 'g'))) {
      hexViolations.push({ file: r, line: i + 1, literal: m[0] });
    }
  });
}

// ---------- theme parsing ----------
const themeText = stripComments(readFileSync(join(root, THEME), 'utf8'));
function topBlocks(text) {
  const blocks = [];
  let depth = 0, start = 0, selStart = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '{') { if (depth === 0) { start = i; } depth++; }
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        const selector = text.slice(selStart, start).trim();
        blocks.push({ selector, body: text.slice(start + 1, i) });
        selStart = i + 1;
      }
    } else if (c === ';' && depth === 0) selStart = i + 1;
  }
  return blocks;
}
function decls(body) {
  let flat = body, prev;
  do { prev = flat; flat = flat.replace(/\{[^{}]*\}/g, ''); } while (flat !== prev);
  const map = {};
  for (const m of flat.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) map[m[1]] = m[2].trim();
  return map;
}
const blocks = topBlocks(themeText);
const pick = (re) => Object.assign({}, ...blocks.filter((b) => re.test(b.selector)).map((b) => decls(b.body)));
const rootConsts = Object.assign({}, ...blocks.filter((b) => /^:root$/.test(b.selector)).map((b) => decls(b.body)));
const themes = {
  light: { ...rootConsts, ...pick(/data-mochi-theme=['"]light['"]/) },
  dark: { ...rootConsts, ...pick(/data-mochi-theme=['"]dark['"]/) },
};

// ---------- colour maths ----------
function parseColor(str) {
  str = str.trim();
  let m = str.match(new RegExp(`^${HEX}$`));
  if (m) {
    let h = str.slice(1);
    if (h.length <= 4) h = [...h].map((c) => c + c).join('');
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  m = str.match(/^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/i);
  if (m) {
    let a = 1;
    if (m[4] !== undefined) a = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return { r: +m[1], g: +m[2], b: +m[3], a };
  }
  return null;
}
// Follow var(--x) / var(--x, fallback) chains; null if it can't be reduced to a colour.
function resolve(theme, token, depth = 0) {
  if (depth > 10) return null;
  const raw = themes[theme][token];
  if (raw === undefined) return { missing: true };
  return resolveValue(theme, raw, depth);
}
function resolveValue(theme, raw, depth) {
  const v = raw.trim();
  const vm = v.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([\s\S]+))?\)$/);
  if (vm) {
    const r = resolve(theme, vm[1], depth + 1);
    if (r && r.missing && vm[2]) return resolveValue(theme, vm[2], depth + 1);
    return r;
  }
  return parseColor(v);
}
const over = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});
const lum = ({ r, g, b }) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const toHex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');

// ---------- 2. fallback consistency ----------
const fbWarnings = [];
let fbChecked = 0, fbUnresolved = 0;
for (const f of fallbacks) {
  const light = resolve('light', f.token);
  const fb = parseColor(f.hex);
  if (!light || light.missing || !fb) { fbUnresolved++; continue; }
  fbChecked++;
  if (toHex(light) !== toHex(fb) || Math.abs(light.a - fb.a) > 0.005) {
    fbWarnings.push({ ...f, light: light.a < 1 ? `rgba(${light.r},${light.g},${light.b},${light.a})` : toHex(light) });
  }
}

// ---------- 3. contrast ----------
const contrastRows = [];
for (const p of PAIRS) {
  for (const theme of p.theme === 'both' ? ['light', 'dark'] : [p.theme]) {
    const row = { ...p, theme };
    const fg = resolve(theme, p.fg), bg = resolve(theme, p.bg);
    if ((fg && fg.missing) || (bg && bg.missing)) {
      row.status = mark('SKIP'); row.detail = 'missing token';
    } else if (!fg || !bg) {
      row.status = mark('SKIP'); row.detail = 'unresolvable value';
    } else {
      const ground = resolve(theme, '--color-background');
      const base = ground && !ground.missing ? ground : { r: 255, g: 255, b: 255, a: 1 };
      const bgc = bg.a < 1 ? over(bg, base) : bg;
      const fgc = fg.a < 1 ? over(fg, bgc) : fg;
      row.ratio = ratio(fgc, bgc);
      row.status = mark(row.ratio >= p.min ? 'PASS' : p.known ? 'KNOWN' : 'FAIL');
    }
    contrastRows.push(row);
  }
}

// ---------- 4. spinner base colours ----------
const spinnerRows = [];
{
  const text = readFileSync(join(src, 'Spinner/spinnerFrames.js'), 'utf8');
  const m = text.match(/export const FILLS\s*=\s*\[([^\]]*)\]/);
  const fills = m ? [...m[1].matchAll(/["'](#[0-9a-fA-F]{6})["']/g)].map((x) => x[1].toLowerCase()) : [];
  for (const [name, hex] of Object.entries(SPINNER_BASE)) {
    spinnerRows.push({ label: `FILLS contains ${hex} (${name})`, status: mark(fills.includes(hex) ? 'PASS' : 'FAIL'), detail: m ? '' : 'FILLS not found' });
    const decl = themes.light[`--mochi-spinner-${name}`];
    if (decl === undefined) {
      spinnerRows.push({ label: `--mochi-spinner-${name} equals ${hex}`, status: mark('SKIP'), detail: 'not declared yet' });
    } else {
      const c = resolve('light', `--mochi-spinner-${name}`);
      const ok = c && !c.missing && toHex(c) === hex;
      spinnerRows.push({ label: `--mochi-spinner-${name} equals ${hex}`, status: mark(ok ? 'PASS' : 'FAIL'), detail: ok ? '' : `declared ${decl}` });
    }
  }
}

// ---------- report ----------
log('check-tokens');
log('');
log(`1. Bare hex (${scanned} files scanned, ${HEX_ALLOWLIST.length} allowlisted)`);
const perFile = {};
for (const v of hexViolations) {
  (perFile[v.file] ||= []).push(v);
}
for (const [file, list] of Object.entries(perFile)) {
  for (const v of list) log(`  FAIL ${v.file}:${v.line}  ${v.literal}`);
}
if (hexViolations.length) {
  log('  per file:');
  for (const [file, list] of Object.entries(perFile).sort((a, b) => b[1].length - a[1].length)) {
    log(`    ${String(list.length).padStart(4)}  ${file}`);
  }
}
log(`  ${hexViolations.length ? 'FAIL' : 'PASS'}: ${hexViolations.length} violation(s) in ${Object.keys(perFile).length} file(s)`);

log('');
log(`2. Fallback consistency (${fallbacks.length} fallbacks, ${fbChecked} compared, ${fbUnresolved} with no light default to compare)`);
for (const w of fbWarnings) {
  tally.WARN++;
  log(`  WARN ${w.file}:${w.line}  var(${w.token}, ${w.hex}) but light is ${w.light}`);
}
log(`  ${fbWarnings.length ? 'WARN' : 'PASS'}: ${fbWarnings.length} mismatch(es)`);

log('');
log('3. Contrast (WCAG 2.x, from ' + THEME + ')');
for (const r of contrastRows) {
  const val = r.ratio !== undefined ? r.ratio.toFixed(2).padStart(6) : '     -';
  const detail = r.detail ? ` (${r.detail})` : '';
  log(`  ${r.status.padEnd(5)} ${r.theme.padEnd(5)} ${r.fg} on ${r.bg}  ${val} / ${r.min}  ${r.note}${detail}`);
}

log('');
log('4. Spinner base colours');
for (const r of spinnerRows) log(`  ${r.status.padEnd(5)} ${r.label}${r.detail ? ` (${r.detail})` : ''}`);

log('');
log(`Summary: PASS ${tally.PASS}  FAIL ${tally.FAIL + hexViolations.length}  KNOWN ${tally.KNOWN}  SKIP ${tally.SKIP}  WARN ${tally.WARN}`);
const failed = hexViolations.length > 0 || tally.FAIL > 0;
log(failed ? (reportOnly ? 'Result: failures present (report only, exit 0)' : 'Result: FAILED') : 'Result: OK');
console.log(out.join('\n'));
process.exit(failed && !reportOnly ? 1 : 0);

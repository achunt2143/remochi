// Runs the whole comparison headlessly: builds the pages, serves them,
// opens the diff page and the context snapshots in Chromium, checks the
// popup nubbins' joints from real 1x and 2x screenshots, and writes
// ./report. Exits non-zero if a joint steps.
//   npm run nubbin-diff
// Needs a Chromium for Playwright (`npx playwright install chromium`), or
// set CHROMIUM_PATH to one. Without either, run serve.mjs and open the
// printed URL in any Chromium-based browser: the pages do the work.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serve } from './serve.mjs';
import { writeReport } from './report.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const port = 4179;
const base = `http://localhost:${port}/scripts/nubbin-diff/out`;

execFileSync(process.execPath, [join(here, 'build.mjs')], { stdio: 'inherit' });
const server = await serve(port);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 860 } });
  await page.goto(`${base}/diff.html`);
  await page.waitForFunction(() => window.__nubbinDiff, null, { timeout: 120000 });
  const results = await page.evaluate(() => window.__nubbinDiff);
  if (results.error) throw new Error(results.error);
  for (const view of ['popups', 'corners', 'grabber', 'static', 'halo']) {
    for (const theme of ['light', 'dark']) {
      await page.goto(`${base}/context.html?view=${view}&theme=${theme}&capture`);
      await page.waitForFunction(() => window.__captured, null, { timeout: 30000 });
    }
  }

  // Joint check from real screenshots at device scale 1 and 2 (the page's
  // own snapshot isn't stable to a sub-pixel at 2x): the popups (all four
  // directions), the waterdrop popups in all 8 corner placements, and the
  // Repanel grabber at 1px and 2px edges, light and dark. `probe` swaps the
  // border colour for one that contrasts in either theme (see context.jsx).
  const joints = { source: 'Chromium screenshots, device scale 1 and 2', results: [], selfTest: {} };
  const VIEWS = [['popups', 6], ['corners', 8], ['grabber', 0]];
  for (const scale of [1, 2]) {
    const context = await browser.newContext({ viewport: { width: 1200, height: 860 }, deviceScaleFactor: scale });
    for (const theme of ['light', 'dark']) {
      for (const [view, nubbins] of VIEWS) {
        const shotPage = await context.newPage();
        await shotPage.goto(`${base}/context.html?view=${view}&theme=${theme}&probe`);
        await shotPage.waitForFunction(
          (n) => window.__measureScreenshot && (n === 0 ? document.querySelectorAll('[data-grabber]').length > 0 : document.querySelectorAll('.mochi-popup-nubbin').length === n),
          nubbins
        );
        await shotPage.evaluate(() => window.__stopAnimations());
        await shotPage.waitForTimeout(300);
        const shot = `data:image/png;base64,${(await shotPage.screenshot()).toString('base64')}`;
        const found = await shotPage.evaluate(([src, s]) => window.__measureScreenshot(src, s), [shot, scale]);
        joints.results.push(...found.map((j) => ({ ...j, placement: `${theme}: ${j.placement}` })));
        if (view === 'popups' && theme === 'light') {
          joints.selfTest[scale] = await shotPage.evaluate((s) => window.__selfTestJoints(undefined, s), scale);
          joints.tolerance = await shotPage.evaluate(() => window.__jointTolerance);
        }
        await shotPage.close();
      }
    }
    await context.close();
  }
  writeFileSync(join(here, 'report/joints.json'), JSON.stringify(joints, null, 2));
  const badJoints = joints.results.filter((j) => !j.ok);
  for (const j of joints.results) {
    console.log(`joint ${j.placement.padEnd(28)} ${j.joint.padEnd(8)} ${j.scale}x  step ${j.step.toFixed(3)}px ${j.ok ? 'ok' : 'FAIL'}`);
  }
  if (badJoints.length) process.exitCode = 1;

  writeReport();
  for (const r of results) {
    console.log(`${r.id.padEnd(36)} ${r.theme.padEnd(5)} ${r.scale}x  mismatch ${r.mismatch.toFixed(2)}%  shape ${r.shifted.toFixed(2)}%`);
  }
} finally {
  await browser.close();
  server.close();
}
